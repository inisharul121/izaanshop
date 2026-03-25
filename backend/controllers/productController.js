const prisma = require('../utils/prisma');

const formatProduct = (product) => {
  if (!product) return null;
  const p = { ...product };

  // Handle images
  if (p.images) {
    try {
      // If images is already an object, use it. Otherwise, try to parse.
      p.images = typeof p.images === 'object' ? p.images : JSON.parse(p.images);
    } catch (e) {
      console.error('CRITICAL: Failed to parse product images JSON for product ID:', p.id, 'Images data:', product.images, 'Error:', e.message);
      p.images = { main: '/placeholder.png', gallery: [] }; // Fallback to default
    }
  } else {
    p.images = { main: '/placeholder.png', gallery: [] }; // Default if no images field
  }

  // Handle attributes
  if (p.attributes) {
    p.attributes = p.attributes.map(attr => ({
      ...attr,
      options: typeof attr.options === 'string' ? JSON.parse(attr.options) : attr.options
    }));
  }
  if (p.variants) {
    p.variants = p.variants.map(variant => ({
      ...variant,
      options: typeof variant.options === 'string' ? JSON.parse(variant.options) : variant.options
    }));
  }
  return p;
};

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  const pageSize = Number(req.query.pageSize) || 12;
  const page = Number(req.query.pageNumber) || 1;

  const where = {};
  if (req.query.keyword) {
    where.name = { contains: req.query.keyword };
  }
  if (req.query.category) {
    where.category = { slug: req.query.category };
  }

  // Price range filtering
  if (req.query.minPrice || req.query.maxPrice) {
    where.price = {};
    if (req.query.minPrice) where.price.gte = Number(req.query.minPrice);
    if (req.query.maxPrice) where.price.lte = Number(req.query.maxPrice);
  }

  // Sorting
  let orderBy = { createdAt: 'desc' };
  if (req.query.sort) {
    switch (req.query.sort) {
      case 'price-low':
        orderBy = { price: 'asc' };
        break;
      case 'price-high':
        orderBy = { price: 'desc' };
        break;
      case 'popular':
        // For now, popularity can be based on createdAt or we can add a 'views' field later
        orderBy = { createdAt: 'desc' };
        break;
      case 'newest':
      default:
        orderBy = { createdAt: 'desc' };
        break;
    }
  }

  try {
    const [count, products, maxPriceData, storeMaxPriceData] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        take: pageSize,
        skip: pageSize * (page - 1),
        orderBy,
        include: { 
          category: true,
          attributes: true,
          variants: true
        }
      }),
      prisma.product.aggregate({
        where: {
          category: where.category,
          name: where.name
        },
        _max: { price: true }
      }),
      prisma.product.aggregate({
        _max: { price: true }
      })
    ]);

    const formattedProducts = products.map(formatProduct);
    res.json({ 
      products: formattedProducts, 
      page, 
      pages: Math.ceil(count / pageSize),
      maxPrice: maxPriceData._max.price || 5000,
      storeMaxPrice: storeMaxPriceData._max.price || 5000
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const isNumber = !isNaN(id);
    const product = await prisma.product.findFirst({
      where: isNumber ? { id: Number(id) } : { slug: id },
      include: { 
        category: true,
        attributes: true,
        variants: true
      }
    });

    if (product) {
      // Fetch related products from same category
      const related = await prisma.product.findMany({
        where: {
          categoryId: product.categoryId,
          id: { not: product.id }
        },
        take: 4,
        include: { 
          category: true,
          attributes: true,
          variants: true
        }
      });
      const formattedProduct = formatProduct(product);
      res.json({ ...formattedProduct, relatedProducts: related.map(formatProduct) });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  const { name, price, description, category, mainImage, gallery, stock, slug, salePrice, type, attributes, variants } = req.body;

  try {
    const images = {
      main: mainImage || '/placeholder.png',
      gallery: Array.isArray(gallery) ? gallery : []
    };

    const productData = {
      name,
      description: description || '',
      price: (price !== undefined && price !== '') ? Number(price) : 0,
      categoryId: (category || req.body.categoryId) ? Number(category || req.body.categoryId) : undefined,
      stock: (stock !== undefined && stock !== '') ? Number(stock) : 0,
      images: JSON.stringify(images),
      slug: slug || name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
      salePrice: (salePrice !== undefined && salePrice !== '') ? Number(salePrice) : null,
      type: type || 'SIMPLE'
    };

    // Final safety check against NaN which Prisma hates
    if (isNaN(productData.categoryId) && productData.categoryId !== undefined) {
      delete productData.categoryId;
    }

    if (type === 'VARIABLE' && attributes && variants) {
      productData.attributes = {
        create: attributes.map(attr => ({
          name: attr.name,
          options: typeof attr.options === 'object' ? JSON.stringify(attr.options) : attr.options
        }))
      };
      productData.variants = {
        create: variants.map(variant => ({
          sku: variant.sku || null,
          price: parseFloat(variant.price) || 0,
          salePrice: (variant.salePrice && parseFloat(variant.salePrice) > 0) ? parseFloat(variant.salePrice) : null,
          stock: parseInt(variant.stock) || 0,
          options: typeof variant.options === 'object' ? JSON.stringify(variant.options) : variant.options,
          image: variant.image || '',
          isDefault: !!variant.isDefault
        }))
      };
    }

    const product = await prisma.product.create({
      data: productData,
      include: {
        attributes: true,
        variants: true
      }
    });

    res.status(201).json(formatProduct(product));
  } catch (error) {
    console.error('Create Product Error Details:', error);
    res.status(500).json({ 
      message: error.message || 'Internal Server Error',
      details: error.meta || error.code || null
    });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  const { 
    name, price, description, category, mainImage, gallery, 
    stock, slug, salePrice, type, attributes, variants 
  } = req.body;

  try {
    // Start by updating basic product info
    const data = {
      name,
      price: (price !== undefined && price !== '') ? Number(price) : undefined,
      description,
      categoryId: (category || req.body.categoryId) ? Number(category || req.body.categoryId) : undefined,
      stock: (stock !== undefined && stock !== '') ? Number(stock) : undefined,
      slug: slug || undefined,
      salePrice: (salePrice !== undefined && salePrice !== '') ? Number(salePrice) : null,
      type: type || undefined,
    };

    if (isNaN(data.categoryId) && data.categoryId !== undefined) {
      delete data.categoryId;
    }

    // Fetch existing product to preserve images if not provided
    const existingProduct = await prisma.product.findUnique({ where: { id: Number(req.params.id) } });
    if (!existingProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const currentImages = existingProduct.images ? JSON.parse(existingProduct.images) : { main: '', gallery: [] };
    
    // Merge new images with current ones
    const newMainImage = mainImage !== undefined ? mainImage : currentImages.main;
    const parsedGallery = typeof gallery === 'string' ? JSON.parse(gallery) : (gallery || currentImages.gallery);
    
    const finalImages = {
      main: newMainImage || '/placeholder.png',
      gallery: Array.isArray(parsedGallery) ? parsedGallery : []
    };

    console.log('Final Images being saved to DB:', finalImages);

    data.images = JSON.stringify(finalImages);

    if (type === 'VARIABLE') {
      await prisma.productAttribute.deleteMany({ where: { productId: Number(req.params.id) } });
      await prisma.productVariant.deleteMany({ where: { productId: Number(req.params.id) } });

      if (attributes && variants) {
        data.attributes = {
          create: attributes.map(attr => ({
            name: attr.name,
            options: typeof attr.options === 'object' ? JSON.stringify(attr.options) : attr.options
          }))
        };
        data.variants = {
          create: variants.map(variant => ({
            sku: variant.sku || null,
            price: parseFloat(variant.price) || 0,
            salePrice: (variant.salePrice && parseFloat(variant.salePrice) > 0) ? parseFloat(variant.salePrice) : null,
            stock: parseInt(variant.stock) || 0,
            options: typeof variant.options === 'object' ? JSON.stringify(variant.options) : variant.options,
            image: variant.image || '',
            isDefault: !!variant.isDefault
          }))
        };
      }
    }
 else if (type === 'SIMPLE') {
      // In case product type was changed from VARIABLE to SIMPLE
      await prisma.productAttribute.deleteMany({ where: { productId: Number(req.params.id) } });
      await prisma.productVariant.deleteMany({ where: { productId: Number(req.params.id) } });
    }

    const updatedProduct = await prisma.product.update({
      where: { id: Number(req.params.id) },
      data,
      include: {
        attributes: true,
        variants: true
      }
    });
    res.json(formatProduct(updatedProduct));
  } catch (error) {
    console.error('Update Product Error Details:', error);
    res.status(500).json({ 
      message: error.message || 'Internal Server Error',
      details: error.meta || error.code || null
    });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    await prisma.product.delete({
      where: { id: Number(req.params.id) }
    });
    res.json({ message: 'Product removed' });
  } catch (error) {
    res.status(404).json({ message: 'Product not found' });
  }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };

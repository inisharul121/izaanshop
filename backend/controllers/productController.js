const prisma = require('../utils/prisma');

const formatProduct = (product) => {
  if (!product) return null;
  const p = { ...product };
  if (p.images && typeof p.images === 'string') {
    try { p.images = JSON.parse(p.images); } catch (e) { p.images = { main: '', gallery: [] }; }
  }
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
  const { 
    name, price, description, category, mainImage, gallery, 
    stock, slug, salePrice, type, attributes, variants 
  } = req.body;

  try {
    const productData = {
      name,
      price: Number(price),
      description,
      categoryId: Number(category),
      images: JSON.stringify({
        main: mainImage,
        gallery: gallery || []
      }),
      stock: stock ? Number(stock) : 0,
      slug,
      salePrice: salePrice ? Number(salePrice) : null,
      type: type || 'SIMPLE'
    };

    if (type === 'VARIABLE' && attributes && variants) {
      productData.attributes = {
        create: attributes.map(attr => ({
          name: attr.name,
          options: JSON.stringify(attr.options)
        }))
      };
      productData.variants = {
        create: variants.map(variant => ({
          sku: variant.sku,
          price: Number(variant.price),
          salePrice: variant.salePrice ? Number(variant.salePrice) : null,
          stock: Number(variant.stock),
          options: JSON.stringify(variant.options),
          image: variant.image
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
    res.status(500).json({ message: error.message });
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
      price: price ? Number(price) : undefined,
      description,
      categoryId: category ? Number(category) : undefined,
      stock: stock !== undefined ? Number(stock) : undefined,
      slug,
      salePrice: salePrice !== undefined ? Number(salePrice) : undefined,
      type: type || undefined,
    };

    if (mainImage || gallery) {
      data.images = JSON.stringify({
        main: mainImage,
        gallery: gallery || []
      });
    }

    // Handle variable product logic (Attributes and Variants)
    // Simple approach: Delete existing and re-create if provided
    if (type === 'VARIABLE') {
      await prisma.productAttribute.deleteMany({ where: { productId: Number(req.params.id) } });
      await prisma.productVariant.deleteMany({ where: { productId: Number(req.params.id) } });

      if (attributes && variants) {
        data.attributes = {
          create: attributes.map(attr => ({
            name: attr.name,
            options: JSON.stringify(attr.options)
          }))
        };
        data.variants = {
          create: variants.map(variant => ({
            sku: variant.sku,
            price: Number(variant.price),
            salePrice: variant.salePrice ? Number(variant.salePrice) : null,
            stock: Number(variant.stock),
            options: JSON.stringify(variant.options),
            image: variant.image
          }))
        };
      }
    } else if (type === 'SIMPLE') {
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
    console.error('Update Product Error:', error);
    res.status(500).json({ message: error.message });
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

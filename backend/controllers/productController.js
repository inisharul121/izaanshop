const prisma = require('../utils/prisma');

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

  try {
    const count = await prisma.product.count({ where });
    const products = await prisma.product.findMany({
      where,
      take: pageSize,
      skip: pageSize * (page - 1),
      orderBy: { createdAt: 'desc' },
      include: { category: true }
    });

    res.json({ products, page, pages: Math.ceil(count / pageSize) });
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
      include: { category: true }
    });

    if (product) {
      // Fetch related products from same category
      const related = await prisma.product.findMany({
        where: {
          categoryId: product.categoryId,
          id: { not: product.id }
        },
        take: 4,
        include: { category: true }
      });
      res.json({ ...product, relatedProducts: related });
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
  const { name, price, description, category, mainImage, gallery, stock, slug, salePrice } = req.body;

  try {
    const product = await prisma.product.create({
      data: {
        name,
        price: Number(price),
        description,
        categoryId: Number(category),
        images: {
          main: mainImage,
          gallery: gallery || []
        },
        stock: stock ? Number(stock) : 0,
        slug,
        salePrice: salePrice ? Number(salePrice) : null,
      }
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  const { name, price, description, category, mainImage, gallery, stock, slug, salePrice } = req.body;

  try {
    const data = {
      name,
      price: price ? Number(price) : undefined,
      description,
      categoryId: category ? Number(category) : undefined,
      stock: stock !== undefined ? Number(stock) : undefined,
      slug,
      salePrice: salePrice !== undefined ? Number(salePrice) : undefined,
    };

    if (mainImage || gallery) {
      data.images = {
        main: mainImage,
        gallery: gallery || []
      };
    }

    const updatedProduct = await prisma.product.update({
      where: { id: Number(req.params.id) },
      data
    });
    res.json(updatedProduct);
  } catch (error) {
    res.status(404).json({ message: 'Product not found' });
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

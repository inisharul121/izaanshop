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
  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(req.params.id) },
      include: { category: true }
    });

    if (product) {
      res.json(product);
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
  const { name, price, description, category, images, stock, slug, salePrice } = req.body;

  try {
    const product = await prisma.product.create({
      data: {
        name,
        price: Number(price),
        description,
        categoryId: Number(category),
        images: images || [],
        stock: Number(stock),
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
  const { name, price, description, category, images, stock, slug, salePrice } = req.body;

  try {
    const updatedProduct = await prisma.product.update({
      where: { id: Number(req.params.id) },
      data: {
        name,
        price: price ? Number(price) : undefined,
        description,
        categoryId: category ? Number(category) : undefined,
        images,
        stock: stock ? Number(stock) : undefined,
        slug,
        salePrice: salePrice ? Number(salePrice) : undefined,
      }
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

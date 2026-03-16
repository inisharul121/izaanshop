const prisma = require('../utils/prisma');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = async (req, res) => {
  const { name, slug, image, description } = req.body;

  try {
    const categoryExists = await prisma.category.findUnique({ where: { slug } });

    if (categoryExists) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const category = await prisma.category.create({
      data: { name, slug, image, description }
    });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = async (req, res) => {
  const { name, slug, image, description } = req.body;

  try {
    const updatedCategory = await prisma.category.update({
      where: { id: Number(req.params.id) },
      data: { name, slug, image, description }
    });
    res.json(updatedCategory);
  } catch (error) {
    res.status(404).json({ message: 'Category not found' });
  }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = async (req, res) => {
  try {
    await prisma.category.delete({
      where: { id: Number(req.params.id) }
    });
    res.json({ message: 'Category removed' });
  } catch (error) {
    res.status(404).json({ message: 'Category not found' });
  }
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };

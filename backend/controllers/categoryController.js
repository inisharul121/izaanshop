const { db } = require('../db');
const { categories, products } = require('../db/schema');
const { eq, ne, and, sql } = require('drizzle-orm');
const { revalidateCache } = require('../utils/revalidateCache');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res, next) => {
  try {
    const allCategories = await db.select().from(categories);
    res.json(allCategories);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = async (req, res, next) => {
  const { name, slug, image, description } = req.body;

  try {
    const existing = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);

    if (existing.length > 0) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const [result] = await db.insert(categories).values({ name, slug, image, description });
    const categoryResult = await db.select().from(categories).where(eq(categories.id, result.insertId)).limit(1);
    
    revalidateCache('shop-init'); // Trigger homepage cache invalidation
    res.status(201).json(categoryResult[0]);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = async (req, res, next) => {
  const { name, slug, image, description } = req.body;
  const categoryId = Number(req.params.id);

  try {
    if (slug) {
      const existing = await db.select().from(categories).where(and(eq(categories.slug, slug), ne(categories.id, categoryId))).limit(1);
      if (existing.length > 0) {
        return res.status(400).json({ message: 'Category with this slug already exists' });
      }
    }

    await db.update(categories)
      .set({ name, slug, image, description })
      .where(eq(categories.id, categoryId));
      
    const updatedResult = await db.select().from(categories).where(eq(categories.id, categoryId)).limit(1);
    revalidateCache('shop-init'); // Trigger homepage cache invalidation
    res.json(updatedResult[0]);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = async (req, res, next) => {
  const categoryId = Number(req.params.id);
  
  try {
    // Check if category has products
    const countResult = await db.select({ count: sql`count(*)` })
      .from(products)
      .where(eq(products.categoryId, categoryId));
    
    const productCount = Number(countResult[0]?.count || 0);

    if (productCount > 0) {
      return res.status(400).json({ 
        message: `Cannot delete category. It currently has ${productCount} products assigned to it. Please reassign or delete the products first.` 
      });
    }

    await db.delete(categories).where(eq(categories.id, categoryId));
    revalidateCache('shop-init'); // Trigger homepage cache invalidation
    res.json({ message: 'Category removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };

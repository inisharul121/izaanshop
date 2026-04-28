const { db } = require('../db');
const { shippingMethods } = require('../db/schema');
const { eq, and, asc, desc } = require('drizzle-orm');

// @desc    Get all active shipping methods
// @route   GET /api/shipping
// @access  Public
const getShippingMethods = async (req, res, next) => {
  try {
    const methods = await db.select()
      .from(shippingMethods)
      .where(eq(shippingMethods.isActive, true))
      .orderBy(asc(shippingMethods.price));
    res.json(methods);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all shipping methods (Admin)
// @route   GET /api/shipping/admin
// @access  Private/Admin
const getAllShippingMethods = async (req, res, next) => {
  try {
    const allMethods = await db.select()
      .from(shippingMethods)
      .orderBy(desc(shippingMethods.createdAt));
    res.json(allMethods);
  } catch (error) {
    next(error);
  }
};

// @desc    Create shipping method
// @route   POST /api/shipping
// @access  Private/Admin
const createShippingMethod = async (req, res, next) => {
  const { name, price, isActive } = req.body;
  
  if (!name || isNaN(parseFloat(price))) {
    return res.status(400).json({ message: 'Valid Name and Price are required' });
  }

  try {
    const [result] = await db.insert(shippingMethods).values({ 
      name, 
      price: parseFloat(price), 
      isActive: isActive !== undefined ? isActive : true 
    });
    const methodResult = await db.select().from(shippingMethods).where(eq(shippingMethods.id, result.insertId)).limit(1);
    res.status(201).json(methodResult[0]);
  } catch (error) {
    next(error);
  }
};

// @desc    Update shipping method
// @route   PUT /api/shipping/:id
// @access  Private/Admin
const updateShippingMethod = async (req, res, next) => {
  const { id } = req.params;
  const { name, price, isActive } = req.body;
  try {
    await db.update(shippingMethods)
      .set({
        name,
        price: price !== undefined ? parseFloat(price) : undefined,
        isActive
      })
      .where(eq(shippingMethods.id, parseInt(id)));
      
    const updatedResult = await db.select().from(shippingMethods).where(eq(shippingMethods.id, parseInt(id))).limit(1);
    res.json(updatedResult[0]);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete shipping method
// @route   DELETE /api/shipping/:id
// @access  Private/Admin
const deleteShippingMethod = async (req, res, next) => {
  const { id } = req.params;
  try {
    await db.delete(shippingMethods).where(eq(shippingMethods.id, parseInt(id)));
    res.json({ message: 'Shipping method removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getShippingMethods,
  getAllShippingMethods,
  createShippingMethod,
  updateShippingMethod,
  deleteShippingMethod
};

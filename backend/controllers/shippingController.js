const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// @desc    Get all active shipping methods
// @route   GET /api/shipping
// @access  Public
const getShippingMethods = async (req, res) => {
  try {
    const methods = await prisma.shippingMethod.findMany({
      where: { isActive: true },
      orderBy: { price: 'asc' }
    });
    res.json(methods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all shipping methods (Admin)
// @route   GET /api/shipping/admin
// @access  Private/Admin
const getAllShippingMethods = async (req, res) => {
  try {
    const methods = await prisma.shippingMethod.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(methods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create shipping method
// @route   POST /api/shipping
// @access  Private/Admin
const createShippingMethod = async (req, res) => {
  const { name, price, isActive } = req.body;
  try {
    const method = await prisma.shippingMethod.create({
      data: { 
        name, 
        price: parseFloat(price), 
        isActive: isActive !== undefined ? isActive : true 
      }
    });
    res.status(201).json(method);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update shipping method
// @route   PUT /api/shipping/:id
// @access  Private/Admin
const updateShippingMethod = async (req, res) => {
  const { id } = req.params;
  const { name, price, isActive } = req.body;
  try {
    const method = await prisma.shippingMethod.update({
      where: { id: parseInt(id) },
      data: {
        name,
        price: price !== undefined ? parseFloat(price) : undefined,
        isActive
      }
    });
    res.json(method);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete shipping method
// @route   DELETE /api/shipping/:id
// @access  Private/Admin
const deleteShippingMethod = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.shippingMethod.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: 'Shipping method removed' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getShippingMethods,
  getAllShippingMethods,
  createShippingMethod,
  updateShippingMethod,
  deleteShippingMethod
};

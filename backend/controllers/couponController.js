const prisma = require('../utils/prisma');

// @desc    Get all coupons
// @route   GET /api/coupons
// @access  Private/Admin
const getCoupons = async (req, res) => {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get coupon by ID
// @route   GET /api/coupons/:id
// @access  Private/Admin
const getCouponById = async (req, res) => {
  try {
    const coupon = await prisma.coupon.findUnique({
      where: { id: Number(req.params.id) }
    });
    if (coupon) {
      res.json(coupon);
    } else {
      res.status(404).json({ message: 'Coupon not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a coupon
// @route   POST /api/coupons
// @access  Private/Admin
const createCoupon = async (req, res) => {
  const { code, discountType, discountValue, expiryDate, isActive, maxUses } = req.body;

  try {
    const couponExists = await prisma.coupon.findUnique({ where: { code } });

    if (couponExists) {
      return res.status(400).json({ message: 'Coupon code already exists' });
    }

    const coupon = await prisma.coupon.create({
      data: {
        code,
        discountType,
        discountValue: Number(discountValue),
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        isActive: isActive !== undefined ? isActive : true,
        maxUses: maxUses ? Number(maxUses) : null,
      }
    });
    res.status(201).json(coupon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a coupon
// @route   PUT /api/coupons/:id
// @access  Private/Admin
const updateCoupon = async (req, res) => {
  const { code, discountType, discountValue, expiryDate, isActive, maxUses } = req.body;

  try {
    const updatedCoupon = await prisma.coupon.update({
      where: { id: Number(req.params.id) },
      data: {
        code,
        discountType,
        discountValue: discountValue ? Number(discountValue) : undefined,
        expiryDate: expiryDate ? new Date(expiryDate) : undefined,
        isActive: isActive !== undefined ? isActive : undefined,
        maxUses: maxUses ? Number(maxUses) : undefined,
      }
    });
    res.json(updatedCoupon);
  } catch (error) {
    res.status(404).json({ message: 'Coupon not found' });
  }
};

// @desc    Delete a coupon
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
const deleteCoupon = async (req, res) => {
  try {
    await prisma.coupon.delete({
      where: { id: Number(req.params.id) }
    });
    res.json({ message: 'Coupon removed' });
  } catch (error) {
    res.status(404).json({ message: 'Coupon not found' });
  }
};

module.exports = {
  getCoupons,
  getCouponById,
  createCoupon,
  updateCoupon,
  deleteCoupon
};

const { db } = require('../db');
const { coupons } = require('../db/schema');
const { eq, and, desc, sql } = require('drizzle-orm');

// @desc    Get all coupons
// @route   GET /api/coupons
// @access  Private/Admin
const getCoupons = async (req, res, next) => {
  try {
    const allCoupons = await db.select().from(coupons).orderBy(desc(coupons.createdAt));
    res.json(allCoupons);
  } catch (error) {
    next(error);
  }
};

// @desc    Get coupon by ID
// @route   GET /api/coupons/:id
// @access  Private/Admin
const getCouponById = async (req, res, next) => {
  try {
    const couponData = await db.select().from(coupons).where(eq(coupons.id, Number(req.params.id))).limit(1);
    
    if (couponData.length > 0) {
      res.json(couponData[0]);
    } else {
      res.status(404).json({ message: 'Coupon not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create a coupon
// @route   POST /api/coupons
// @access  Private/Admin
const createCoupon = async (req, res, next) => {
  const { code, discountType, discountValue, expiryDate, isActive, maxUses } = req.body;

  try {
    const existing = await db.select().from(coupons).where(eq(coupons.code, code)).limit(1);

    if (existing.length > 0) {
      return res.status(400).json({ message: 'Coupon code already exists' });
    }

    const [result] = await db.insert(coupons).values({
      code,
      discountType,
      discountValue: Number(discountValue),
      expiryDate: expiryDate ? new Date(expiryDate) : null,
      isActive: isActive !== undefined ? isActive : true,
      maxUses: maxUses ? Number(maxUses) : null,
    });
    
    const couponResult = await db.select().from(coupons).where(eq(coupons.id, result.insertId)).limit(1);
    res.status(201).json(couponResult[0]);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a coupon
// @route   PUT /api/coupons/:id
// @access  Private/Admin
const updateCoupon = async (req, res, next) => {
  const { code, discountType, discountValue, expiryDate, isActive, maxUses } = req.body;
  const id = Number(req.params.id);

  try {
    await db.update(coupons)
      .set({
        code,
        discountType,
        discountValue: discountValue ? Number(discountValue) : undefined,
        expiryDate: expiryDate ? new Date(expiryDate) : undefined,
        isActive: isActive !== undefined ? isActive : undefined,
        maxUses: maxUses ? Number(maxUses) : undefined,
      })
      .where(eq(coupons.id, id));
      
    const updatedResult = await db.select().from(coupons).where(eq(coupons.id, id)).limit(1);
    res.json(updatedResult[0]);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a coupon
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
const deleteCoupon = async (req, res, next) => {
  try {
    await db.delete(coupons).where(eq(coupons.id, Number(req.params.id)));
    res.json({ message: 'Coupon removed' });
  } catch (error) {
    next(error);
  }
};

// @desc    Validate a coupon code
// @route   POST /api/coupons/validate
// @access  Public
const validateCoupon = async (req, res, next) => {
  const { code } = req.body;

  try {
    const result = await db.select().from(coupons).where(eq(coupons.code, code.toUpperCase())).limit(1);
    const coupon = result[0];

    if (!coupon) {
      return res.status(404).json({ message: 'Invalid coupon code' });
    }

    if (!coupon.isActive) {
      return res.status(400).json({ message: 'Coupon is inactive' });
    }

    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
      return res.status(400).json({ message: 'Coupon has expired' });
    }

    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return res.status(400).json({ message: 'Coupon limit reached' });
    }

    res.json({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCoupons,
  getCouponById,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  validateCoupon
};

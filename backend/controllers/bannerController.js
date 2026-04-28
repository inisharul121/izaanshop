const { db } = require('../db');
const { banners } = require('../db/schema');
const { eq, and, asc } = require('drizzle-orm');
const { revalidateCache } = require('../utils/revalidateCache');

// @desc    Get active banners (public)
// @route   GET /api/banners
const getBanners = async (req, res, next) => {
  try {
    const activeBanners = await db.select().from(banners).where(eq(banners.isActive, true)).orderBy(asc(banners.order));
    res.json(activeBanners);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all banners (admin)
// @route   GET /api/banners/all
const getAllBanners = async (req, res, next) => {
  try {
    const allBanners = await db.select().from(banners).orderBy(asc(banners.order));
    res.json(allBanners);
  } catch (error) {
    next(error);
  }
};

// @desc    Create banner
// @route   POST /api/banners
const createBanner = async (req, res, next) => {
  const { title, subtitle, image, link, isActive, order } = req.body;
  try {
    const [result] = await db.insert(banners).values({
      title: title || '',
      subtitle: subtitle || '',
      image: image || '',
      link: link || '',
      isActive: isActive !== undefined ? isActive : true,
      order: order !== undefined ? Number(order) : 0
    });
    const bannerResult = await db.select().from(banners).where(eq(banners.id, result.insertId)).limit(1);
    revalidateCache('shop-init'); // Trigger homepage cache invalidation
    res.status(201).json(bannerResult[0]);
  } catch (error) {
    next(error);
  }
};

// @desc    Update banner
// @route   PUT /api/banners/:id
const updateBanner = async (req, res, next) => {
  const { title, subtitle, image, link, isActive, order } = req.body;
  const id = Number(req.params.id);
  try {
    await db.update(banners)
      .set({
        title, subtitle, image, link,
        isActive: isActive !== undefined ? isActive : undefined,
        order: order !== undefined ? Number(order) : undefined
      })
      .where(eq(banners.id, id));
      
    const bannerResult = await db.select().from(banners).where(eq(banners.id, id)).limit(1);
    revalidateCache('shop-init'); // Trigger homepage cache invalidation
    res.json(bannerResult[0]);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete banner
// @route   DELETE /api/banners/:id
const deleteBanner = async (req, res, next) => {
  try {
    await db.delete(banners).where(eq(banners.id, Number(req.params.id)));
    revalidateCache('shop-init'); // Trigger homepage cache invalidation
    res.json({ message: 'Banner removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getBanners, getAllBanners, createBanner, updateBanner, deleteBanner };

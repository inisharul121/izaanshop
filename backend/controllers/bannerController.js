const prisma = require('../utils/prisma');

// @desc    Get active banners (public)
// @route   GET /api/banners
const getBanners = async (req, res) => {
  try {
    const banners = await prisma.banner.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    });
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all banners (admin)
// @route   GET /api/banners/all
const getAllBanners = async (req, res) => {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: { order: 'asc' }
    });
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create banner
// @route   POST /api/banners
const createBanner = async (req, res) => {
  const { title, subtitle, image, link, isActive, order } = req.body;
  try {
    const banner = await prisma.banner.create({
      data: {
        title: title || '',
        subtitle: subtitle || '',
        image: image || '',
        link: link || '',
        isActive: isActive !== undefined ? isActive : true,
        order: order !== undefined ? Number(order) : 0
      }
    });
    res.status(201).json(banner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update banner
// @route   PUT /api/banners/:id
const updateBanner = async (req, res) => {
  const { title, subtitle, image, link, isActive, order } = req.body;
  try {
    const banner = await prisma.banner.update({
      where: { id: Number(req.params.id) },
      data: {
        title, subtitle, image, link,
        isActive: isActive !== undefined ? isActive : undefined,
        order: order !== undefined ? Number(order) : undefined
      }
    });
    res.json(banner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete banner
// @route   DELETE /api/banners/:id
const deleteBanner = async (req, res) => {
  try {
    await prisma.banner.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: 'Banner removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getBanners, getAllBanners, createBanner, updateBanner, deleteBanner };

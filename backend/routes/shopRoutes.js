const express = require('express');
const router = express.Router();
const { getShopData } = require('../controllers/shopController');

// @desc    Fetch consolidated shop data (Banners, Categories, Products)
// @route   GET /api/shop/init
// @access  Public
router.get('/init', getShopData);

module.exports = router;

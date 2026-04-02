const express = require('express');
const router = express.Router();
const { 
  getShippingMethods,
  getAllShippingMethods,
  createShippingMethod,
  updateShippingMethod,
  deleteShippingMethod
} = require('../controllers/shippingController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public route to fetch active shipping methods (for checkout)
router.get('/', getShippingMethods);

// Admin-only routes
router.get('/admin', protect, admin, getAllShippingMethods);
router.post('/', protect, admin, createShippingMethod);
router.put('/:id', protect, admin, updateShippingMethod);
router.delete('/:id', protect, admin, deleteShippingMethod);

module.exports = router;

const express = require('express');
const router = express.Router();
const { registerUser, authUser, getUserProfile, updateUserProfile, registerAdmin, getPendingAdmins, approveAdmin, getAllUsers } = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', authUser);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

// Admin Approval Routes
router.post('/admin/register', registerAdmin);
router.get('/admin/pending', protect, admin, getPendingAdmins);
router.put('/admin/:id/approve', protect, admin, approveAdmin);
router.get('/users', protect, admin, getAllUsers);

module.exports = router;

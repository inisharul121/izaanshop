const { registerUser, authUser, getUserProfile, registerAdmin, getPendingAdmins, approveAdmin } = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', authUser);
router.get('/profile', protect, getUserProfile);

// Admin Approval Routes
router.post('/admin/register', registerAdmin);
router.get('/admin/pending', protect, admin, getPendingAdmins);
router.put('/admin/:id/approve', protect, admin, approveAdmin);

module.exports = router;

const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');

// @desc    Upload images
// @route   POST /api/upload
// @access  Public (for testing, usually Private/Admin)
router.post('/', upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'gallery', maxCount: 10 }
]), (req, res) => {
  try {
    const mainImage = req.files['image'] ? req.files['image'][0].path : null;
    const gallery = req.files['gallery'] ? req.files['gallery'].map(file => file.path) : [];

    res.json({
      mainImage,
      gallery
    });
  } catch (error) {
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
});

module.exports = router;

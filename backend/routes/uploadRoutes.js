const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');

// @desc    Upload images
// @route   POST /api/upload
// @access  Public (for testing, usually Private/Admin)
router.post('/', (req, res) => {
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'gallery', maxCount: 10 }
  ])(req, res, (err) => {
    if (err) {
      console.error('CRITICAL UPLOAD ERROR:', err);
      return res.status(500).json({ 
        message: 'Upload failed: Cloudinary configuration might be invalid.', 
        error: err.message,
        hint: 'Check your .env file for valid CLOUDINARY credentials.'
      });
    }

    try {
      if (!req.files) {
        throw new Error('No files were uploaded or processed.');
      }

      const mainImage = req.files['image'] ? `/uploads/products/${req.files['image'][0].filename}` : null;
      const gallery = req.files['gallery'] ? req.files['gallery'].map(file => `/uploads/products/${file.filename}`) : [];

      res.json({
        mainImage,
        gallery
      });
    } catch (error) {
      console.error('SERVER PROCESSING ERROR:', error);
      res.status(500).json({ 
        message: 'Internal Server Error during file processing.', 
        error: error.message 
      });
    }
  });
});

module.exports = router;

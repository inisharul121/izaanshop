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
      const getFileUrl = (file) => {
        // Cloudinary storage provides 'path' as the full URL
        if (file.path && file.path.startsWith('http')) {
          return file.path;
        }
        // Disk storage provides 'filename'
        return `/uploads/products/${file.filename}`;
      };

      const mainImage = req.files['image'] ? getFileUrl(req.files['image'][0]) : null;
      const gallery = req.files['gallery'] ? req.files['gallery'].map(file => getFileUrl(file)) : [];

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

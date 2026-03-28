const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const upload = require('../middleware/uploadMiddleware');

// @desc    Get all uploaded images
// @route   GET /api/media
// @access  Private/Admin
router.get('/', (req, res) => {
  const directoryPath = path.join(__dirname, '../uploads/products');

  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      return res.status(500).json({ message: 'Unable to scan directory', error: err.message });
    }

    const fileList = files
      .filter(file => !file.startsWith('.')) // Filter out hidden files
      .map(file => ({
        name: file,
        url: `/uploads/products/${file}`
      }));

    res.json(fileList);
  });
});

// @desc    Upload image to media library
// @route   POST /api/media/upload
// @access  Private/Admin
router.post('/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image' });
    }

    const getFileUrl = (file) => {
      // 1. Cloudinary storage provides 'path' as the full URL
      if (file.path && file.path.startsWith('http')) {
        return file.path;
      }
      // 2. Memory storage (Vercel Base64 fallback) provides 'buffer'
      if (file.buffer) {
        const b64 = file.buffer.toString('base64');
        return `data:${file.mimetype};base64,${b64}`;
      }
      // 3. Disk storage provides 'filename'
      return `/uploads/products/${file.filename}`;
    };

    const imageUrl = getFileUrl(req.file);

    res.json({
      name: req.file.filename || req.file.originalname,
      url: imageUrl
    });
  } catch (error) {
    console.error('MEDIA UPLOAD ERROR:', error);
    res.status(500).json({ message: 'Server error during upload', error: error.message });
  }
});

module.exports = router;

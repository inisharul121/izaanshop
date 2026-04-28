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

  // Check if directory exists, create if not
  if (!fs.existsSync(directoryPath)) {
    console.log('📁 Creating uploads/products directory...');
    try {
      fs.mkdirSync(directoryPath, { recursive: true });
    } catch (mkdirErr) {
      console.error('❌ Failed to create directory:', mkdirErr);
      return res.status(500).json({ 
        message: 'Failed to create uploads directory', 
        error: mkdirErr.message 
      });
    }
  }

  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error('❌ Failed to read media directory:', err);
      return res.status(500).json({ 
        message: 'Unable to scan directory', 
        error: err.message,
        path: directoryPath 
      });
    }

    const fileList = files
      .filter(file => !file.startsWith('.')) // Filter out hidden files
      .map(file => ({
        name: file,
        url: `/uploads/products/${file}`
      }));

    console.log(`✅ Found ${fileList.length} media files`);
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

// @desc    Delete image from media library
// @route   DELETE /api/media/:filename
// @access  Private/Admin
router.delete('/:filename', (req, res) => {
  const fileName = req.params.filename;
  
  // Security check: prevent directory traversal
  if (fileName.includes('..') || fileName.includes('/') || fileName.includes('\\')) {
    return res.status(400).json({ message: 'Invalid file name' });
  }

  const filePath = path.join(__dirname, '../uploads/products', fileName);

  fs.unlink(filePath, (err) => {
    if (err) {
      if (err.code === 'ENOENT') {
        return res.status(404).json({ message: 'File not found' });
      }
      return res.status(500).json({ message: 'Error deleting file', error: err.message });
    }
    
    res.json({ message: 'File deleted successfully' });
  });
});

module.exports = router;

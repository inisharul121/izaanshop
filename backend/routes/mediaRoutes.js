const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

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

module.exports = router;

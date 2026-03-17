const prisma = require('../utils/prisma');

// @desc    Get all settings
// @route   GET /api/settings
// @access  Public (some settings might be public like payment numbers)
const getSettings = async (req, res) => {
  try {
    const settings = await prisma.settings.findMany();
    const settingsMap = settings.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});
    res.json(settingsMap);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update settings
// @route   PUT /api/settings
// @access  Private/Admin
const updateSettings = async (req, res) => {
  const settingsData = req.body; // { bkash_number: '...', nagad_number: '...' }

  try {
    const promises = Object.entries(settingsData).map(([key, value]) => {
      return prisma.settings.upsert({
        where: { key },
        update: { value },
        create: { key, value }
      });
    });

    await Promise.all(promises);
    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSettings,
  updateSettings
};

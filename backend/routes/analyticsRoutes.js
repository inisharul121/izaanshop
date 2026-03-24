const express = require('express');
const router = express.Router();
const prisma = require('../utils/prisma');

// @desc    Get Admin KPIs
// @route   GET /api/analytics/admin/kpis
// @access  Private/Admin
router.get('/admin/kpis', async (req, res) => {
  try {
    const [totalOrders, totalProducts, totalCustomers, orders] = await Promise.all([
      prisma.order.count(),
      prisma.product.count(),
      prisma.user.count({ where: { role: 'customer' } }),
      prisma.order.findMany({
        where: { status: 'delivered' },
        select: { totalPrice: true, createdAt: true }
      })
    ]);

    const totalRevenue = orders.reduce((acc, order) => acc + Number(order.totalPrice), 0);

    // Calculate revenue trend (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    // Simple group by day (mock logic for now to get it working)
    const revenueByDay = [];
    for (let i = 0; i < 30; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        revenueByDay.push({ date: d.toISOString().split('T')[0], revenue: Math.floor(Math.random() * 5000) });
    }

    res.json({
      kpis: {
        totalRevenue,
        totalOrders,
        totalCustomers,
        totalProducts
      },
      revenueByDay: revenueByDay.reverse()
    });
  } catch (error) {
    console.error('Analytics Error:', error);
    res.status(500).json({ message: 'Error fetching analytics', error: error.message });
  }
});

module.exports = router;

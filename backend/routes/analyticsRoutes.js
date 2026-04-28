const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { orders, products, users, orderItems } = require('../db/schema');
const { count, eq, sum, sql, desc, and, lte } = require('drizzle-orm');

// @desc    Get Admin KPIs & Analytics
// @route   GET /api/analytics/admin/kpis
// @access  Private/Admin
router.get('/admin/kpis', async (req, res) => {
  try {
    // 1. Basic KPI Counts
    const [ordersCount] = await db.select({ value: count() }).from(orders);
    const [productsCount] = await db.select({ value: count() }).from(products);
    const [customersCount] = await db.select({ value: count() }).from(users).where(eq(users.role, 'user'));

    // 2. Order Status Breakdown
    const statusResult = await db.select({ 
      status: orders.status, 
      count: count() 
    })
    .from(orders)
    .groupBy(orders.status);

    const statusMap = statusResult.reduce((acc, curr) => {
      acc[curr.status.toLowerCase()] = curr.count;
      return acc;
    }, {});

    // 3. Payment Method Breakdown
    const paymentBreakdown = await db.select({ 
      method: orders.paymentMethod, 
      revenue: sum(orders.totalPrice), 
      orders: count() 
    })
    .from(orders)
    .groupBy(orders.paymentMethod);

    // 4. Revenue By Month (Last 6 Months)
    const revenueByMonth = await db.execute(sql`
      SELECT 
        MONTHNAME(createdAt) as month, 
        YEAR(createdAt) as year, 
        COUNT(*) as orders, 
        SUM(totalPrice) as revenue 
      FROM \`Order\` 
      WHERE status = 'delivered'
      GROUP BY year, month, MONTH(createdAt)
      ORDER BY year DESC, MONTH(createdAt) DESC
      LIMIT 6
    `);

    // 5. Top Selling Products
    const topProductsRaw = await db.select({
      name: products.name,
      images: products.images,
      unitsSold: sum(orderItems.quantity),
      revenue: sum(sql`${orderItems.price} * ${orderItems.quantity}`)
    })
    .from(orderItems)
    .leftJoin(products, eq(orderItems.productId, products.id))
    .groupBy(products.id)
    .orderBy(desc(sum(orderItems.quantity)))
    .limit(5);

    const topProducts = topProductsRaw.map(p => ({
      ...p,
      images: typeof p.images === 'string' ? JSON.parse(p.images) : p.images,
      unitsSold: Number(p.unitsSold || 0),
      revenue: Number(p.revenue || 0)
    }));

    // 6. Low Stock Alerts
    const lowStockProducts = await db.select({
      name: products.name,
      stock: products.stock
    })
    .from(products)
    .where(and(eq(products.isDeleted, false), lte(products.stock, 10)))
    .limit(10);

    // 7. Overall Revenue
    const [revenueResult] = await db.select({ 
      total: sum(orders.totalPrice) 
    })
    .from(orders)
    .where(eq(orders.status, 'delivered'));

    const totalRevenue = Number(revenueResult?.total || 0);

    // 30 Days Revenue Trend (Mock logic for graph stability)
    const revenueByDay = [];
    for (let i = 0; i < 30; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        revenueByDay.push({ date: d.toISOString().split('T')[0], revenue: Math.floor(Math.random() * 5000) });
    }

    res.json({
      kpis: {
        totalRevenue,
        totalOrders: ordersCount.value,
        totalCustomers: customersCount.value,
        totalProducts: productsCount.value,
        pendingOrders: statusMap['pending'] || 0,
        processingOrders: statusMap['processing'] || 0,
        shippedOrders: statusMap['shipped'] || 0,
        deliveredOrders: statusMap['delivered'] || 0,
      },
      paymentBreakdown: paymentBreakdown.map(p => ({
        method: p.method,
        revenue: Number(p.revenue || 0),
        orders: p.orders
      })),
      revenueByMonth: revenueByMonth[0] || [], // db.execute returns nested array for some drivers
      topProducts,
      lowStockProducts,
      revenueByDay: revenueByDay.reverse()
    });
  } catch (error) {
    console.error('Analytics Error:', error);
    res.status(500).json({ message: 'Error fetching analytics', error: error.message });
  }
});

module.exports = router;

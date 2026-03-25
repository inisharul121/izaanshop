const prisma = require('../utils/prisma');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    guestName,
    guestEmail,
    guestPhone,
    transactionId,
  } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ message: 'No order items' });
  }

  // Require either a logged-in user or guest name
  if (!req.user && !guestName) {
    return res.status(400).json({ message: 'Name is required for guest orders' });
  }

  try {
    const order = await prisma.order.create({
      data: {
        ...(req.user ? { userId: req.user.id } : {}),
        ...(req.user ? {} : {
          guestName,
          guestEmail: guestEmail || null,
          guestPhone: guestPhone || shippingAddress?.phone || null,
        }),
        phone: req.user ? (shippingAddress?.phone || null) : (guestPhone || shippingAddress?.phone || null),
        totalPrice,
        paymentMethod,
        transactionId,
        itemsPrice,
        taxPrice: taxPrice || 0,
        shippingPrice: shippingPrice || 0,
        street: shippingAddress.street,
        city: shippingAddress.city || null,
        state: shippingAddress.state || null,
        zipCode: shippingAddress.zipCode || null,
        country: shippingAddress.country || 'Bangladesh',
        orderItems: {
          create: orderItems.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            image: item.image || item.images?.main || '',
            price: item.salePrice || item.price,
            productId: item.id || item.productId,
          })),
        },
      },
    });

    res.status(201).json(order);
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ message: error.message });
  }
};


// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        user: { select: { name: true, email: true } },
        orderItems: true,
      },
    });

    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = async (req, res) => {
  try {
    const order = await prisma.order.update({
      where: { id: Number(req.params.id) },
      data: {
        isPaid: true,
        paidAt: new Date(),
        paymentId: req.body.id,
        paymentStatus: req.body.status,
        paymentEmail: req.body.email_address,
      },
    });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to update payment status' });
  }
};

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = async (req, res) => {
  try {
    const order = await prisma.order.update({
      where: { id: Number(req.params.id) },
      data: {
        isDelivered: true,
        deliveredAt: new Date(),
        status: 'Delivered',
      },
    });
    res.json(order);
  } catch (error) {
    res.status(404).json({ message: 'Order not found' });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: { orderItems: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: { 
        user: { select: { id: true, name: true } },
        orderItems: true
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get analytics data for admin dashboard
// @route   GET /api/orders/analytics
// @access  Private/Admin
const getAnalytics = async (req, res) => {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(now.getDate() - 30);
    const sixMonthsAgo = new Date(now);
    sixMonthsAgo.setMonth(now.getMonth() - 6);

    // Run all queries in parallel for speed
    const [
      totalOrders,
      totalRevenue,
      totalCustomers,
      totalProducts,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      recentOrders,
      allOrders,
      topProductItems,
      lowStockProducts,
      categoryRevenue,
      topProductRevenues,
    ] = await Promise.all([
      // KPIs
      prisma.order.count(),
      prisma.order.aggregate({ _sum: { totalPrice: true } }),
      prisma.user.count({ where: { role: 'user' } }),
      prisma.product.count(),
      prisma.order.count({ where: { status: 'Pending' } }),
      prisma.order.count({ where: { status: 'Processing' } }),
      prisma.order.count({ where: { status: 'Shipped' } }),
      prisma.order.count({ where: { status: 'Delivered' } }),

      // Orders in last 30 days for daily chart
      prisma.order.findMany({
        where: { createdAt: { gte: thirtyDaysAgo } },
        select: { createdAt: true, totalPrice: true },
        orderBy: { createdAt: 'asc' },
      }),

      // All orders for monthly grouping + payment method
      prisma.order.findMany({
        where: { createdAt: { gte: sixMonthsAgo } },
        select: { createdAt: true, totalPrice: true, paymentMethod: true, status: true },
        orderBy: { createdAt: 'asc' },
      }),

      // Top products aggregated by quantity sold
      prisma.orderItem.groupBy({
        by: ['productId'],
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 10,
      }),

      // Low stock products (stock <= 10)
      prisma.product.findMany({
        where: { stock: { lte: 10 } },
        select: { id: true, name: true, stock: true, slug: true, images: true },
        orderBy: { stock: 'asc' },
        take: 10,
      }),

      // Category performance
      prisma.category.findMany({
        select: {
          id: true,
          name: true,
          products: {
            select: {
              id: true,
              orderItems: {
                select: { quantity: true, price: true }
              }
            }
          }
        }
      }),
      // Fetch revenues for top products separately to calculate SUM(price * quantity)
      prisma.orderItem.findMany({
        where: { productId: { in: (await prisma.orderItem.groupBy({ by: ['productId'], _sum: { quantity: true }, orderBy: { _sum: { quantity: 'desc' } }, take: 10 })).map(i => i.productId) } },
        select: { productId: true, price: true, quantity: true }
      }),
    ]);

    // --- Daily revenue (last 30 days) ---
    const dailyMap = {};
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      dailyMap[key] = { date: key, revenue: 0, orders: 0 };
    }
    recentOrders.forEach(o => {
      const key = o.createdAt.toISOString().slice(0, 10);
      if (dailyMap[key]) {
        dailyMap[key].revenue += o.totalPrice;
        dailyMap[key].orders += 1;
      }
    });
    const revenueByDay = Object.values(dailyMap);

    // --- Monthly revenue (last 6 months) ---
    const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const monthlyMap = {};
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now);
      d.setMonth(now.getMonth() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      monthlyMap[key] = { month: monthNames[d.getMonth()], year: d.getFullYear(), revenue: 0, orders: 0 };
    }
    allOrders.forEach(o => {
      const d = o.createdAt;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (monthlyMap[key]) {
        monthlyMap[key].revenue += o.totalPrice;
        monthlyMap[key].orders += 1;
      }
    });
    const revenueByMonth = Object.values(monthlyMap);

    // --- Payment method breakdown ---
    const paymentMap = {};
    allOrders.forEach(o => {
      const method = o.paymentMethod || 'Unknown';
      if (!paymentMap[method]) paymentMap[method] = { method, revenue: 0, orders: 0 };
      paymentMap[method].revenue += o.totalPrice;
      paymentMap[method].orders += 1;
    });
    const paymentBreakdown = Object.values(paymentMap);

    // --- Top selling products (with accurate revenue) ---
    const productIds = topProductItems.map(i => i.productId);
    const productsInfo = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true, slug: true, images: true, price: true }
    });
    const productInfoMap = Object.fromEntries(productsInfo.map(p => [p.id, p]));
    
    // Map to aggregate revenue correctly
    const productRevenueMap = {};
    topProductRevenues.forEach(oi => {
      productRevenueMap[oi.productId] = (productRevenueMap[oi.productId] || 0) + (oi.price * oi.quantity);
    });

    const topProducts = topProductItems.map(item => {
      const pInfo = productInfoMap[item.productId];
      let images = pInfo?.images;
      if (typeof images === 'string') {
        try { images = JSON.parse(images); } catch (e) { images = { main: '', gallery: [] }; }
      }
      return {
        productId: item.productId,
        name: pInfo?.name || 'Unknown',
        slug: pInfo?.slug || '',
        images: images || null,
        unitsSold: item._sum.quantity || 0,
        revenue: productRevenueMap[item.productId] || 0,
      };
    });

    // --- Category performance ---
    const categoryStats = categoryRevenue.map(cat => {
      let units = 0, revenue = 0;
      cat.products.forEach(p => {
        p.orderItems.forEach(oi => {
          units += oi.quantity;
          revenue += oi.price * oi.quantity;
        });
      });
      return { id: cat.id, name: cat.name, units, revenue, productCount: cat.products.length };
    }).sort((a, b) => b.revenue - a.revenue);

    res.json({
      kpis: {
        totalOrders,
        totalRevenue: totalRevenue._sum.totalPrice || 0,
        totalCustomers,
        totalProducts,
        pendingOrders,
        processingOrders,
        shippedOrders,
        deliveredOrders,
      },
      revenueByDay,
      revenueByMonth,
      paymentBreakdown,
      topProducts,
      lowStockProducts: lowStockProducts.map(p => {
        let images = p.images;
        if (typeof images === 'string') {
          try { images = JSON.parse(images); } catch (e) { images = { main: '', gallery: [] }; }
        }
        return { ...p, images };
      }),
      categoryStats,
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
  getAnalytics,
};


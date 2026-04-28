const { db } = require('../db');
const { orders, orderItems, users, products, categories, productVariants } = require('../db/schema');
const { eq, and, gte, sql, desc, sum, count, inArray, lte } = require('drizzle-orm');

// @desc    Create new order
// @route   POST /api/orders
// @access  Public (Guest or Auth)
const addOrderItems = async (req, res, next) => {
  const {
    orderItems: items,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    shippingMethod: method,
    shippingEmail,
    totalPrice,
    guestName,
    guestEmail,
    guestPhone,
    transactionId,
  } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'No order items' });
  }

  if (!req.user && !guestName) {
    return res.status(400).json({ message: 'Name is required for guest orders' });
  }

  // Final safety check for shippingAddress
  if (!shippingAddress || !shippingAddress.street) {
    return res.status(400).json({ message: 'Shipping address (street) is required' });
  }

  try {
    const result = await db.transaction(async (tx) => {
      const [orderInsert] = await tx.insert(orders).values({
        userId: req.user ? req.user.id : null,
        guestName: req.user ? null : guestName,
        guestEmail: req.user ? null : (guestEmail || null),
        guestPhone: req.user ? null : (guestPhone || shippingAddress?.phone || null),
        phone: req.user ? (shippingAddress?.phone || null) : (guestPhone || shippingAddress?.phone || null),
        totalPrice: Number(totalPrice),
        paymentMethod: paymentMethod || 'Cash on Delivery',
        transactionId: transactionId || null,
        itemsPrice: Number(itemsPrice),
        taxPrice: Number(taxPrice || 0),
        shippingPrice: Number(shippingPrice || 0),
        shippingMethod: method || null,
        shippingEmail: shippingEmail || null,
        street: shippingAddress.street,
        city: shippingAddress.city || null,
        state: shippingAddress.state || null,
        zipCode: shippingAddress.zipCode || null,
        country: shippingAddress.country || 'Bangladesh',
      });

      const orderId = orderInsert.insertId;

      for (const item of items) {
        // Coerce types to ensure no database mismatch
        const price = Number(item.salePrice || item.price || 0);
        const productId = Number(item.id || item.productId);
        const variantId = item.selectedVariant?.id ? Number(item.selectedVariant.id) : null;

        await tx.insert(orderItems).values({
          name: item.name || 'Unknown Product',
          quantity: Number(item.quantity) || 1,
          image: item.image || item.images?.main || (Array.isArray(item.images) ? item.images[0] : '') || '',
          price: price,
          productId: productId,
          variantId: variantId,
          orderId
        });
      }

      return orderId;
    });

    const finalOrder = await getOrderByIdInternal(result);
    res.status(201).json(finalOrder);
  } catch (error) {
    console.error('❌ Checkout Error [addOrderItems]:', error);
    next(error);
  }
};

// Internal helper for MariaDB compatible order fetching
// Simplified to avoid potential issues with nested select objects in some Drizzle versions
async function getOrderByIdInternal(id) {
  const result = await db.select()
  .from(orders)
  .where(eq(orders.id, id))
  .limit(1);

  if (result.length === 0) return null;

  const order = result[0];

  // Fetch items separately for robustness
  const items = await db.select({
    item: orderItems,
    variant: productVariants
  })
  .from(orderItems)
  .leftJoin(productVariants, eq(orderItems.variantId, productVariants.id))
  .where(eq(orderItems.orderId, id));

  // Fetch user separately if exists
  let user = null;
  if (order.userId) {
    const userRes = await db.select({ id: users.id, name: users.name, email: users.email }).from(users).where(eq(users.id, order.userId)).limit(1);
    user = userRes[0] || null;
  }

  return {
    ...order,
    user,
    orderItems: items.map(i => ({ ...i.item, variant: i.variant }))
  };
}

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res, next) => {
  try {
    const order = await getOrderByIdInternal(Number(req.params.id));
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    await db.update(orders)
      .set({
        isPaid: true,
        paidAt: new Date(),
        paymentId: req.body.id,
        paymentStatus: req.body.status,
        paymentEmail: req.body.email_address,
      })
      .where(eq(orders.id, id));
      
    const order = await getOrderByIdInternal(id);
    res.json(order);
  } catch (error) {
    next(error);
  }
};

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    await db.update(orders)
      .set({
        isDelivered: true,
        deliveredAt: new Date(),
        status: 'Delivered',
      })
      .where(eq(orders.id, id));
      
    const order = await getOrderByIdInternal(id);
    res.json(order);
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res, next) => {
  try {
    const rawOrders = await db.select().from(orders).where(eq(orders.userId, req.user.id)).orderBy(desc(orders.createdAt));
    const orderIds = rawOrders.map(o => o.id);
    
    let allItems = [];
    if (orderIds.length > 0) {
      const rawitems = await db.select({
        item: orderItems,
        variant: productVariants
      })
      .from(orderItems)
      .leftJoin(productVariants, eq(orderItems.variantId, productVariants.id))
      .where(inArray(orderItems.orderId, orderIds));
      allItems = rawitems;
    }

    const result = rawOrders.map(o => ({
      ...o,
      orderItems: allItems.filter(i => i.item.orderId === o.id).map(i => ({ ...i.item, variant: i.variant }))
    }));

    res.json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res, next) => {
  try {
    const rawOrders = await db.select({
      order: orders,
      user: { id: users.id, name: users.name }
    })
    .from(orders)
    .leftJoin(users, eq(orders.userId, users.id))
    .orderBy(desc(orders.createdAt));

    const orderIds = rawOrders.map(ro => ro.order.id);
    let allItems = [];
    if (orderIds.length > 0) {
      const rawitems = await db.select({
        item: orderItems,
        variant: productVariants
      })
      .from(orderItems)
      .leftJoin(productVariants, eq(orderItems.variantId, productVariants.id))
      .where(inArray(orderItems.orderId, orderIds));
      allItems = rawitems;
    }

    const result = rawOrders.map(ro => ({
      ...ro.order,
      user: ro.user,
      orderItems: allItems.filter(i => i.item.orderId === ro.order.id).map(i => ({ ...i.item, variant: i.variant }))
    }));

    res.json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Get analytics data for admin dashboard
// @route   GET /api/orders/analytics
// @access  Private/Admin
const getAnalytics = async (req, res, next) => {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(now.getDate() - 30);
    const sixMonthsAgo = new Date(now);
    sixMonthsAgo.setMonth(now.getMonth() - 6);

    const [
      totalOrdersResult,
      totalRevenueResult,
      totalCustomersResult,
      totalProductsResult,
      pendingCount,
      processingCount,
      shippedCount,
      deliveredCount,
      recentOrders,
      allOrders,
      topProductItems,
    ] = await Promise.all([
      db.select({ count: count() }).from(orders),
      db.select({ sum: sum(orders.totalPrice) }).from(orders),
      db.select({ count: count() }).from(users).where(eq(users.role, 'user')),
      db.select({ count: count() }).from(products),
      db.select({ count: count() }).from(orders).where(eq(orders.status, 'Pending')),
      db.select({ count: count() }).from(orders).where(eq(orders.status, 'Processing')),
      db.select({ count: count() }).from(orders).where(eq(orders.status, 'Shipped')),
      db.select({ count: count() }).from(orders).where(eq(orders.status, 'Delivered')),

      db.select({ createdAt: orders.createdAt, totalPrice: orders.totalPrice }).from(orders).where(gte(orders.createdAt, thirtyDaysAgo)).orderBy(orders.createdAt),
      db.select({ createdAt: orders.createdAt, totalPrice: orders.totalPrice, paymentMethod: orders.paymentMethod, status: orders.status }).from(orders).where(gte(orders.createdAt, sixMonthsAgo)).orderBy(orders.createdAt),
      
      db.select({ productId: orderItems.productId, quantity: sql`SUM(${orderItems.quantity})` }).from(orderItems).groupBy(orderItems.productId).limit(10).orderBy(desc(sql`SUM(${orderItems.quantity})`)),
    ]);

    // Top product details
    const topIds = topProductItems.map(i => i.productId);
    let topProductInfo = [];
    if (topIds.length > 0) {
      topProductInfo = await db.select({ id: products.id, name: products.name, slug: products.slug, images: products.images }).from(products).where(inArray(products.id, topIds));
    }

    // Low stock products
    const lowStockProducts = await db.select({ id: products.id, name: products.name, stock: products.stock, slug: products.slug, images: products.images }).from(products).where(lte(products.stock, 10)).limit(10).orderBy(products.stock);

    // Category Analytics (Avoid LATERAL JOIN)
    const allCategories = await db.select().from(categories);
    const categoryStats = [];
    for (const cat of allCategories) {
      // Small optimization: get products and their order items separately
      const catProducts = await db.select({ id: products.id }).from(products).where(eq(products.categoryId, cat.id));
      const catProductIds = catProducts.map(p => p.id);
      
      let units = 0, revenue = 0;
      if (catProductIds.length > 0) {
        const stats = await db.select({ 
          units: sql`SUM(${orderItems.quantity})`, 
          revenue: sql`SUM(${orderItems.quantity} * ${orderItems.price})` 
        }).from(orderItems).where(inArray(orderItems.productId, catProductIds));
        
        units = Number(stats[0].units || 0);
        revenue = Number(stats[0].revenue || 0);
      }
      categoryStats.push({ id: cat.id, name: cat.name, units, revenue, productCount: catProductIds.length });
    }
    categoryStats.sort((a,b) => b.revenue - a.revenue);

    // Daily & Monthly Processing
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

    const paymentMap = {};
    allOrders.forEach(o => {
      const method = o.paymentMethod || 'Unknown';
      if (!paymentMap[method]) paymentMap[method] = { method, revenue: 0, orders: 0 };
      paymentMap[method].revenue += o.totalPrice;
      paymentMap[method].orders += 1;
    });

    const productsInfoMap = Object.fromEntries(topProductInfo.map(p => [p.id, p]));
    const topProducts = topProductItems.map(item => {
      const pInfo = productsInfoMap[item.productId];
      let img = pInfo?.images;
      if (typeof img === 'string') { try { img = JSON.parse(img); } catch (e) { img = null; } }
      return {
        productId: item.productId,
        name: pInfo?.name || 'Unknown',
        slug: pInfo?.slug || '',
        images: img,
        unitsSold: Number(item.quantity || 0),
        revenue: 0
      };
    });

    res.json({
      kpis: {
        totalOrders: totalOrdersResult[0].count,
        totalRevenue: Number(totalRevenueResult[0].sum || 0),
        totalCustomers: totalCustomersResult[0].count,
        totalProducts: totalProductsResult[0].count,
        pendingOrders: pendingCount[0].count,
        processingOrders: processingCount[0].count,
        shippedOrders: shippedCount[0].count,
        deliveredOrders: deliveredCount[0].count,
      },
      revenueByDay: Object.values(dailyMap),
      revenueByMonth: Object.values(monthlyMap),
      paymentBreakdown: Object.values(paymentMap),
      topProducts,
      lowStockProducts: lowStockProducts.map(p => ({ ...p, images: typeof p.images === 'string' ? JSON.parse(p.images) : p.images })),
      categoryStats
    });
  } catch (error) {
    next(error);
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

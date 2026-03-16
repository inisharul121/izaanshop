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
    res.status(404).json({ message: 'Order not found' });
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
      include: { user: { select: { id: true, name: true } } },
    });
    res.json(orders);
  } catch (error) {
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
};

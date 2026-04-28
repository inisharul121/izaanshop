const { db } = require('../db');
const { users } = require('../db/schema');
const { eq, and } = require('drizzle-orm');
const bcrypt = require('bcryptjs');
const { generateAccessToken } = require('../utils/tokens');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (userExists.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
    });

    const user = (await db.select().from(users).where(eq(users.id, result.insertId)).limit(1))[0];

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone || '',
      address: {
        street: user.street || '',
        city: user.city || '',
        state: user.state || '',
        zipCode: user.zipCode || '',
        country: user.country || 'Bangladesh'
      },
      token: generateAccessToken(user),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const userResult = await db.select().from(users).where(eq(users.email, email)).limit(1);
    const user = userResult[0];

    if (user && (await bcrypt.compare(password, user.password))) {
      // Check if admin is approved
      if (user.role === 'admin' && !user.isApproved) {
        return res.status(401).json({ message: 'Your admin account is pending approval.' });
      }

      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved,
        phone: user.phone || '',
        address: {
          street: user.street || '',
          city: user.city || '',
          state: user.state || '',
          zipCode: user.zipCode || '',
          country: user.country || 'Bangladesh'
        },
        token: generateAccessToken(user),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Register a new admin
// @route   POST /api/auth/admin/register
// @access  Public
const registerAdmin = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (userExists.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
      role: 'admin',
      isApproved: false,
    });

    const user = (await db.select().from(users).where(eq(users.id, result.insertId)).limit(1))[0];

    res.status(201).json({
      message: 'Registration successful. Waiting for admin approval.',
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get pending admins
// @route   GET /api/auth/admin/pending
// @access  Private/Admin
const getPendingAdmins = async (req, res, next) => {
  try {
    const pendingAdmins = await db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      createdAt: users.createdAt
    })
    .from(users)
    .where(and(eq(users.role, 'admin'), eq(users.isApproved, false)));
    
    res.json(pendingAdmins);
  } catch (error) {
    next(error);
  }
};

// @desc    Approve an admin
// @route   PUT /api/auth/admin/:id/approve
// @access  Private/Admin
const approveAdmin = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    await db.update(users)
      .set({ isApproved: true })
      .where(eq(users.id, id));
      
    const userResult = await db.select().from(users).where(eq(users.id, id)).limit(1);
    const user = userResult[0];
    res.json({ message: `Admin ${user.name} approved successfully.` });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/auth/users
// @access  Private/Admin
const getAllUsers = async (req, res, next) => {
  try {
    const allUsers = await db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      createdAt: users.createdAt
    })
    .from(users);
    res.json(allUsers);
  } catch (error) {
    next(error);
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res, next) => {
  try {
    const userResult = await db.select().from(users).where(eq(users.id, req.user.id)).limit(1);
    const user = userResult[0];

    if (user) {
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        address: {
          street: user.street,
          city: user.city,
          state: user.state,
          zipCode: user.zipCode,
          country: user.country
        },
        phone: user.phone,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res, next) => {
  try {
    const { name, phone, street, city, state, zipCode, country } = req.body;

    await db.update(users)
      .set({
        name,
        phone,
        street,
        city,
        state,
        zipCode,
        country
      })
      .where(eq(users.id, req.user.id));

    const userResult = await db.select().from(users).where(eq(users.id, req.user.id)).limit(1);
    const user = userResult[0];

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      address: {
        street: user.street,
        city: user.city,
        state: user.state,
        zipCode: user.zipCode,
        country: user.country
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { registerUser, authUser, getUserProfile, updateUserProfile, registerAdmin, getPendingAdmins, approveAdmin, getAllUsers };

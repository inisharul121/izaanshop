const jwt = require('jsonwebtoken');
const { db } = require('../db');
const { users } = require('../db/schema');
const { eq } = require('drizzle-orm');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const user = await db.query.users.findFirst({
        where: eq(users.id, decoded.id),
        columns: { id: true, name: true, email: true, role: true, isApproved: true }
      });
      
      req.user = user;
      return next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin' && req.user.isApproved) {
    return next();
  } else if (req.user && req.user.role === 'admin' && !req.user.isApproved) {
    return res.status(401).json({ message: 'Not authorized, admin account pending approval' });
  } else {
    return res.status(401).json({ message: 'Not authorized as an admin' });
  }
};

// optionalAuth: sets req.user if token present, but never blocks the request
const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer')) {
    try {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const user = await db.query.users.findFirst({
        where: eq(users.id, decoded.id),
        columns: { id: true, name: true, email: true, role: true, isApproved: true }
      });
      
      req.user = user;
    } catch (error) {
      req.user = null; // Invalid token — treat as guest
    }
  }
  next();
};

module.exports = { protect, admin, optionalAuth };

const jwt  = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer '))
      return res.status(401).json({ success: false, message: 'Not authorised. Please login.' });

    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user || !user.isActive)
      return res.status(401).json({ success: false, message: 'User not found.' });

    if (user.role === 'admin' && user.adminStatus !== 'approved')
      return res.status(403).json({ success: false, message: 'Admin account pending approval.' });

    req.user = user;
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Invalid token. Please login again.' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin')
    return res.status(403).json({ success: false, message: 'Admins only.' });
  next();
};

const studentOnly = (req, res, next) => {
  if (req.user.role !== 'student')
    return res.status(403).json({ success: false, message: 'Students only.' });
  next();
};

module.exports = { protect, adminOnly, studentOnly };

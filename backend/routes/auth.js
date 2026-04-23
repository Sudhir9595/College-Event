const express = require('express');
const jwt     = require('jsonwebtoken');
const User    = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, mobile, password, role } = req.body;

    if (!name || !email || !mobile || !password)
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    if (!/^\d{10}$/.test(mobile))
      return res.status(400).json({ success: false, message: 'Mobile must be 10 digits.' });
    if (password.length < 6)
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists)
      return res.status(400).json({ success: false, message: 'Email already registered.' });

    const isAdmin    = role === 'admin';
    const adminStatus = isAdmin ? 'pending' : null;

    const user = await User.create({
      name, email, mobile, password,
      role: isAdmin ? 'admin' : 'student',
      adminStatus
    });

    if (isAdmin) {
      return res.status(201).json({
        success: true,
        requiresApproval: true,
        message: 'Admin account created! Waiting for approval from an existing admin.'
      });
    }

    res.status(201).json({
      success: true,
      message: 'Account created!',
      token: signToken(user._id),
      user: user.toPublic()
    });
  } catch (err) {
    console.error('Signup error:', err.message);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password required.' });

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user)
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });

    const ok = await user.matchPassword(password);
    if (!ok)
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });

    if (user.role === 'admin' && user.adminStatus === 'pending')
      return res.status(403).json({ success: false, isPending: true, message: 'Your admin account is pending approval.' });

    if (user.role === 'admin' && user.adminStatus === 'rejected')
      return res.status(403).json({ success: false, isRejected: true, message: 'Your admin account was rejected.' });

    res.json({
      success: true,
      token: signToken(user._id),
      user: user.toPublic()
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// GET /api/auth/me
router.get('/me', protect, (req, res) =>
  res.json({ success: true, user: req.user.toPublic() })
);

// GET /api/auth/pending-admins  (admin only)
router.get('/pending-admins', protect, adminOnly, async (req, res) => {
  try {
    const list = await User.find({ role: 'admin', adminStatus: 'pending' })
      .select('-password').sort({ createdAt: -1 });
    res.json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// PUT /api/auth/approve-admin/:id  (admin only)
router.put('/approve-admin/:id', protect, adminOnly, async (req, res) => {
  try {
    const { action } = req.body;                          // "approve" | "reject"
    const status     = action === 'approve' ? 'approved' : 'rejected';

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { adminStatus: status, approvedBy: req.user._id },
      { new: true }
    );
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    res.json({ success: true, message: `Admin ${status}.`, user: user.toPublic() });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// GET /api/auth/students  (admin only)
router.get('/students', protect, adminOnly, async (req, res) => {
  try {
    const students = await User.find({ role: 'student' })
      .select('-password').sort({ createdAt: -1 });
    res.json({ success: true, data: students });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;

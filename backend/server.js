require('dotenv').config();
const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');

// ── Validate env vars ─────────────────────────────────────────────────────────
if (!process.env.MONGODB_URI || process.env.MONGODB_URI.includes('YOUR_USERNAME')) {
  console.error('\n❌  MONGODB_URI not set in .env file!');
  console.error('    Open backend/.env and fill in your MongoDB Atlas connection string.\n');
  process.exit(1);
}
if (!process.env.JWT_SECRET) {
  console.error('\n❌  JWT_SECRET not set in .env file!\n');
  process.exit(1);
}

const app = express();

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth',   require('./routes/auth'));
app.use('/api/events', require('./routes/events'));

app.get('/api/health', (_req, res) =>
  res.json({ success: true, message: 'Server running ✅', node: process.version })
);

app.use((_req, res) =>
  res.status(404).json({ success: false, message: 'Route not found' })
);

app.use((err, _req, res, _next) => {
  console.error('Server error:', err.message);
  res.status(500).json({ success: false, message: err.message || 'Server error' });
});

// ── Start ─────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000
})
.then(() => {
  console.log('\n✅  MongoDB connected');
  app.listen(PORT, () => {
    console.log(`🚀  Backend running → http://localhost:${PORT}/api`);
    console.log(`🏥  Health check   → http://localhost:${PORT}/api/health\n`);
  });
})
.catch(err => {
  console.error('\n❌  MongoDB connection failed:', err.message);
  console.error('    Fix: Go to MongoDB Atlas → Network Access → Add 0.0.0.0/0\n');
  process.exit(1);
});

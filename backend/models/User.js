const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
  mobile:   { type: String, required: true, match: /^\d{10}$/ },
  password: { type: String, required: true, minlength: 6, select: false },
  role:     { type: String, enum: ['student', 'admin'], default: 'student' },
  // admin approval fields
  adminStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected', null],
    default: null
  },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  isActive:   { type: Boolean, default: true }
}, { timestamps: true });

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password
userSchema.methods.matchPassword = async function (entered) {
  return bcrypt.compare(entered, this.password);
};

// Safe public object
userSchema.methods.toPublic = function () {
  return {
    _id:         this._id,
    name:        this.name,
    email:       this.email,
    mobile:      this.mobile,
    role:        this.role,
    adminStatus: this.adminStatus,
    createdAt:   this.createdAt
  };
};

module.exports = mongoose.model('User', userSchema);

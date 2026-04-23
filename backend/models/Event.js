const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  user:           { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  registeredAt:   { type: Date, default: Date.now }
});

const feedbackSchema = new mongoose.Schema({
  user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName:    { type: String },
  rating:      { type: Number, required: true, min: 1, max: 5 },
  comment:     { type: String, required: true, trim: true, maxlength: 500 },
  submittedAt: { type: Date, default: Date.now }
});

const eventSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  category:    { type: String, enum: ['tech','cultural','sports','academic','workshop'], required: true },
  date:        { type: String, required: true },
  time:        { type: String, required: true },
  venue:       { type: String, required: true, trim: true },
  organizer:   { type: String, required: true, trim: true },
  capacity:    { type: Number, required: true, min: 1 },
  description: { type: String, required: true, trim: true },
  published:   { type: Boolean, default: false },
  createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  registrations: [registrationSchema],
  feedback:      [feedbackSchema]
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);

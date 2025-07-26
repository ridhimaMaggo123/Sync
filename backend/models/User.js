const mongoose = require('mongoose');

const cycleInfoSchema = new mongoose.Schema({
  lastPeriodDate: { type: Date },
  avgCycleLength: { type: Number },
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  cycleInfo: cycleInfoSchema,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema); 
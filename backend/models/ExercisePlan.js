const mongoose = require('mongoose');

const exercisePlanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  plan: { type: Array, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ExercisePlan', exercisePlanSchema); 
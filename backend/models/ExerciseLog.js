const mongoose = require('mongoose');

const exerciseLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  exerciseName: { type: String, required: true },
  duration: { type: Number, required: true }, // in minutes
  date: { type: Date, required: true },
});

module.exports = mongoose.model('ExerciseLog', exerciseLogSchema); 
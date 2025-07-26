const express = require('express');
const { generateExercisePlan } = require('../utils/ai');
const ExercisePlan = require('../models/ExercisePlan');
const ExerciseLog = require('../models/ExerciseLog');

const router = express.Router();

function requireAuth(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  next();
}

// POST /api/exercise/plan
router.post('/plan', requireAuth, async (req, res) => {
  try {
    const { goals, preferences, cycleData } = req.body;
    const plan = await generateExercisePlan({ goals, preferences, cycleData });
    const saved = await ExercisePlan.findOneAndUpdate(
      { userId: req.session.userId },
      { plan },
      { upsert: true, new: true }
    );
    res.json({ plan: saved.plan });
  } catch (err) {
    res.status(500).json({ message: 'Failed to generate plan', error: err.message });
  }
});

// GET /api/exercise/plan
router.get('/plan', requireAuth, async (req, res) => {
  try {
    const plan = await ExercisePlan.findOne({ userId: req.session.userId });
    if (!plan) return res.status(404).json({ message: 'No plan found' });
    res.json({ plan: plan.plan });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch plan', error: err.message });
  }
});

// POST /api/exercise/log
router.post('/log', requireAuth, async (req, res) => {
  try {
    const { exerciseName, duration, date } = req.body;
    if (!exerciseName || !duration || !date) {
      return res.status(400).json({ message: 'exerciseName, duration, and date are required' });
    }
    const log = await ExerciseLog.create({
      userId: req.session.userId,
      exerciseName,
      duration,
      date,
    });
    res.status(201).json({ message: 'Exercise logged', log });
  } catch (err) {
    res.status(500).json({ message: 'Failed to log exercise', error: err.message });
  }
});

// GET /api/exercise/progress
router.get('/progress', requireAuth, async (req, res) => {
  try {
    const logs = await ExerciseLog.find({ userId: req.session.userId }).sort({ date: -1 });
    res.json({ history: logs });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch progress', error: err.message });
  }
});

module.exports = router; 
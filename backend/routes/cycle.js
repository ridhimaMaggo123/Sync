const express = require('express');
const User = require('../models/User');
const Notification = require('../models/Notification');
const router = express.Router();

function requireAuth(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  next();
}

// POST /api/cycle/update
router.post('/update', requireAuth, async (req, res) => {
  try {
    const { lastPeriodDate, avgCycleLength } = req.body;
    if (!lastPeriodDate || !avgCycleLength) {
      return res.status(400).json({ message: 'lastPeriodDate and avgCycleLength are required' });
    }
    const user = await User.findByIdAndUpdate(
      req.session.userId,
      { 'cycleInfo.lastPeriodDate': lastPeriodDate, 'cycleInfo.avgCycleLength': avgCycleLength },
      { new: true }
    );
    // Schedule notification 3 days before next period
    const nextPeriod = new Date(new Date(lastPeriodDate).getTime() + avgCycleLength * 24 * 60 * 60 * 1000);
    const reminderDate = new Date(nextPeriod.getTime() - 3 * 24 * 60 * 60 * 1000);
    await Notification.create({
      userId: req.session.userId,
      message: 'Your next period is predicted in 3 days.',
      dueDate: reminderDate,
      sent: false,
    });
    res.json({ message: 'Cycle info updated', nextPeriod });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update cycle info', error: err.message });
  }
});

// GET /api/cycle/next
router.get('/next', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    if (!user || !user.cycleInfo.lastPeriodDate || !user.cycleInfo.avgCycleLength) {
      return res.status(400).json({ message: 'Cycle info incomplete' });
    }
    const nextPeriod = new Date(new Date(user.cycleInfo.lastPeriodDate).getTime() + user.cycleInfo.avgCycleLength * 24 * 60 * 60 * 1000);
    res.json({ nextPeriod });
  } catch (err) {
    res.status(500).json({ message: 'Failed to predict next period', error: err.message });
  }
});

module.exports = router; 
const express = require('express');
const SymptomAnalysis = require('../models/SymptomAnalysis');
const { analyzeSymptoms } = require('../utils/ai');

const router = express.Router();

// Middleware to check session
function requireAuth(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  next();
}

// POST /api/analyze
router.post('/', requireAuth, async (req, res) => {
  try {
    const { symptoms, lifestyle, cycleData } = req.body;
    if (!symptoms || !lifestyle) {
      return res.status(400).json({ message: 'symptoms and lifestyle are required' });
    }
    const aiInsights = await analyzeSymptoms({ symptoms, lifestyle, cycleData });
    const analysis = await SymptomAnalysis.create({
      userId: req.session.userId,
      inputData: { symptoms, lifestyle, cycleData },
      aiInsights,
    });
    res.json({ aiInsights, analysisId: analysis._id });
  } catch (err) {
    res.status(500).json({ message: 'AI analysis failed', error: err.message });
  }
});

module.exports = router; 
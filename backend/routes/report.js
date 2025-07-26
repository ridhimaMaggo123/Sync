const express = require('express');
const PDFDocument = require('pdfkit');
const User = require('../models/User');
const SymptomAnalysis = require('../models/SymptomAnalysis');
const ExercisePlan = require('../models/ExercisePlan');

const router = express.Router();

function requireAuth(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  next();
}

router.get('/download', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    const latestAnalysis = await SymptomAnalysis.findOne({ userId: user._id }).sort({ createdAt: -1 });
    const exercisePlan = await ExercisePlan.findOne({ userId: user._id });
    let nextPeriod = null;
    if (user.cycleInfo?.lastPeriodDate && user.cycleInfo?.avgCycleLength) {
      nextPeriod = new Date(new Date(user.cycleInfo.lastPeriodDate).getTime() + user.cycleInfo.avgCycleLength * 24 * 60 * 60 * 1000);
    }

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="health_report.pdf"');
    doc.pipe(res);

    doc.fontSize(22).text('Sync Hormonal Health Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(16).text(`Name: ${user.name}`);
    doc.text(`Email: ${user.email}`);
    doc.text(`Cycle Stats: Last Period - ${user.cycleInfo?.lastPeriodDate ? new Date(user.cycleInfo.lastPeriodDate).toLocaleDateString() : 'N/A'}, Avg Length - ${user.cycleInfo?.avgCycleLength || 'N/A'} days`);
    doc.text(`Predicted Next Period: ${nextPeriod ? nextPeriod.toLocaleDateString() : 'N/A'}`);
    doc.moveDown();

    doc.fontSize(18).text('Latest Symptom Analysis:', { underline: true });
    if (latestAnalysis) {
      doc.fontSize(12).text(`Date: ${latestAnalysis.createdAt.toLocaleDateString()}`);
      doc.text(`Input: ${JSON.stringify(latestAnalysis.inputData)}`);
      doc.text(`AI Insights: ${typeof latestAnalysis.aiInsights === 'string' ? latestAnalysis.aiInsights : JSON.stringify(latestAnalysis.aiInsights)}`);
    } else {
      doc.fontSize(12).text('No analysis found.');
    }
    doc.moveDown();

    doc.fontSize(18).text('Exercise Plan:', { underline: true });
    if (exercisePlan && Array.isArray(exercisePlan.plan)) {
      exercisePlan.plan.forEach((day, idx) => {
        doc.fontSize(12).text(`Day ${idx + 1}: ${JSON.stringify(day)}`);
      });
    } else {
      doc.fontSize(12).text('No exercise plan found.');
    }

    doc.end();
  } catch (err) {
    res.status(500).json({ message: 'Failed to generate PDF', error: err.message });
  }
});

module.exports = router; 
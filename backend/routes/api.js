const express = require('express');
const PdfService = require('../services/PdfService');

// Validate environment variables
if (!process.env.BACKEND_URL) {
  console.error('BACKEND_URL environment variable is not set');
  process.exit(1);
}

const router = express.Router();

router.post('/api/pdf', async (req, res) => {
  try {
    const pdfBuffer = await PdfService.generateProgressReport(req.body);
    if (pdfBuffer?.error) {
      throw new Error(pdfBuffer.error);
    }
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=sync-progress-report.pdf');
    res.send(pdfBuffer);
  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({
      error: 'Failed to generate PDF',
      details: error.message || error
    });
  }
});

router.get('/api/notifications', async (req, res) => {
  try {
    // Mock notifications data - replace with actual implementation
    const notifications = [
      { id: 1, message: 'New health report available', read: false },
      { id: 2, message: 'Weekly analysis complete', read: true }
    ];
    res.json(notifications);
  } catch (error) {
    console.error('Notifications error:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

module.exports = router;
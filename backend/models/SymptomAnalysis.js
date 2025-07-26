const mongoose = require('mongoose');

const symptomAnalysisSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  inputData: { type: Object, required: true },
  aiInsights: { type: Object, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('SymptomAnalysis', symptomAnalysisSchema); 
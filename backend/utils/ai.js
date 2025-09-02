const axios = require('axios');

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function analyzeSymptoms({ symptoms, lifestyle, cycleData }) {
  try {
    const prompt = `Analyze the following symptoms and lifestyle data for hormonal imbalances.\nSymptoms: ${JSON.stringify(symptoms)}\nLifestyle: ${JSON.stringify(lifestyle)}\nCycle Data: ${JSON.stringify(cycleData || {})}\nProvide in JSON format: { "analysis": "", "riskLevel": "", "remedies": [], "exercises": [] }`;

    const body = {
      contents: [{ parts: [{ text: prompt }] }],
    };

    const { data } = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      body,
      { headers: { 'Content-Type': 'application/json' } }
    );

    const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    try {
      return JSON.parse(aiText);
    } catch {
      return {
        analysis: aiText,
        riskLevel: 'unknown',
        remedies: [],
        exercises: []
      };
    }
  } catch (error) {
    console.error('Analysis error:', error);
    throw new Error('Failed to analyze symptoms');
  }
}

async function generateExercisePlan({ goals, preferences, cycleData }) {
  const prompt = `Create a personalized 7-day hormone-friendly exercise plan for a woman. Include a mix of yoga, HIIT, cardio, and rest days. Consider these goals: ${JSON.stringify(goals || {})}, preferences: ${JSON.stringify(preferences || {})}, and cycle data: ${JSON.stringify(cycleData || {})}. Format as a JSON array with each day as an object: { day, type, description, duration }.`;

  const body = {
    contents: [{ parts: [{ text: prompt }] }],
  };

  const { data } = await axios.post(
    `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
    body,
    { headers: { 'Content-Type': 'application/json' } }
  );

  const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
  // Try to parse JSON from AI response
  try {
    const plan = JSON.parse(aiText);
    return plan;
  } catch {
    return aiText; // fallback to raw text
  }
}

async function analyzeWithGemini(prompt) {
  try {
    if (!GEMINI_API_KEY) {
      console.warn('GEMINI_API_KEY not configured, returning fallback response');
      return 'Great progress on your health journey! Keep up the consistent exercise routine and remember to listen to your body. Consider adding more variety to your workouts and maintaining a balanced diet to support your hormonal health.';
    }

    const body = {
      contents: [{ parts: [{ text: prompt }] }],
    };

    const { data } = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      body,
      { headers: { 'Content-Type': 'application/json' } }
    );

    const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return aiText || 'Keep up the great work on your health journey!';
  } catch (error) {
    console.error('Error calling Gemini API:', error.message);
    return 'Great progress on your health journey! Keep up the consistent exercise routine and remember to listen to your body. Consider adding more variety to your workouts and maintaining a balanced diet to support your hormonal health.';
  }
}

module.exports = { 
  analyzeSymptoms, 
  generateExercisePlan,
  analyzeWithGemini 
};
const axios = require('axios');

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function analyzeSymptoms({ symptoms, lifestyle, cycleData }) {
  // Compose prompt for Gemini
  const prompt = `Analyze the following symptoms and lifestyle data for hormonal imbalances.\nSymptoms: ${JSON.stringify(symptoms)}\nLifestyle: ${JSON.stringify(lifestyle)}\nCycle Data: ${JSON.stringify(cycleData || {})}\nProvide: 1) Suspected hormonal imbalance (estrogen, cortisol, thyroid, etc.), 2) Risk level (low, medium, high), 3) Suggested natural remedies (foods, teas, supplements), 4) Hormone-friendly exercises.`;

  const body = {
    contents: [{ parts: [{ text: prompt }] }],
  };

  const { data } = await axios.post(
    `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
    body,
    { headers: { 'Content-Type': 'application/json' } }
  );

  // Parse and return AI response
  const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
  return aiText;
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

module.exports = { analyzeSymptoms, analyzeWithGemini };
module.exports.generateExercisePlan = generateExercisePlan; 
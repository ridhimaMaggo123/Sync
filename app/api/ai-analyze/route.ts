import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const API_KEY = process.env.GEMINI_API_KEY || ''
const MODEL_NAME = process.env.GEMINI_MODEL || 'gemini-2.0-flash'

function fallbackAnalysis(symptoms: string, lifestyle: string) {
  const s = (symptoms || '').toLowerCase()
  const l = (lifestyle || '').toLowerCase()
  const hasStress = s.includes('stress') || l.includes('stress')
  const hasSleep = s.includes('sleep') || s.includes('insomnia') || s.includes('tired')
  const hasEnergy = s.includes('energy') || s.includes('fatigue')
  const analysis = hasStress
    ? 'Your inputs suggest stress-related hormonal fluctuations. Focus on stress management and sleep hygiene.'
    : 'Your inputs suggest mild hormonal fluctuations influenced by lifestyle. Focus on routine, nutrition, and rest.'
  const recommendations = [
    'Maintain consistent sleep and wake times',
    'Add protein and fiber to breakfast for blood sugar balance',
    'Practice 10 minutes of daily breathing or mindfulness',
    'Include light strength training 2-3x/week',
  ]
  const riskLevel = hasSleep && hasEnergy ? 'medium' : 'low'
  const nextSteps = [
    'Track symptoms daily for 2 weeks',
    'Consider basic hormone panel with a provider',
    'Reassess stress and sleep routines weekly',
  ]
  return { analysis, recommendations, riskLevel, nextSteps }
}

export async function POST(request: NextRequest) {
  try {
    const { symptoms, lifestyle, cycleData } = await request.json()

    let ai: any
    if (!API_KEY || API_KEY.length < 10) {
      ai = fallbackAnalysis(symptoms, lifestyle)
    } else {
      try {
        const genAI = new GoogleGenerativeAI(API_KEY)
        const model = genAI.getGenerativeModel({ model: MODEL_NAME })
        const prompt = `As a hormone wellness expert, analyze these symptoms and lifestyle factors and provide personalized insights in strict JSON:\n{\n  \"analysis\": \"...\",\n  \"recommendations\": [\"...\"],\n  \"riskLevel\": \"low|medium|high\",\n  \"nextSteps\": [\"...\"]\n}\n\nSymptoms: ${symptoms}\nLifestyle: ${lifestyle}`
        const result = await model.generateContent(prompt)
        const text = result.response.text().trim()
        let json = text
        if (json.startsWith('```')) {
          json = json.replace(/```json\n?/, '').replace(/```$/, '')
          json = json.replace(/```\n?/, '').replace(/```$/, '')
        }
        try { ai = JSON.parse(json) } catch { ai = { analysis: text } }
      } catch {
        ai = fallbackAnalysis(symptoms, lifestyle)
      }
    }

    // Persist to backend (best-effort, non-blocking)
    try {
      const backend = process.env.BACKEND_URL || 'http://127.0.0.1:5000'
      await fetch(`${backend}/api/analyze/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: request.headers.get('cookie') || '',
        },
        credentials: 'include',
        body: JSON.stringify({ symptoms, lifestyle, cycleData, aiInsights: ai }),
      })
    } catch {}

    return NextResponse.json(ai)
  } catch {
    return NextResponse.json(fallbackAnalysis('general', 'general'))
  }
}

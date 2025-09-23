import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")
const MODEL_NAME = process.env.GEMINI_MODEL || "gemini-2.0-flash"

// Enhanced fallback responses based on symptom patterns
const generateDynamicFallback = (symptoms: string, lifestyle: string) => {
  const symptomsLower = symptoms.toLowerCase()
  const lifestyleLower = lifestyle.toLowerCase()
  
  // Analyze patterns in symptoms
  const hasStressSymptoms = symptomsLower.includes('stress') || symptomsLower.includes('anxiety') || symptomsLower.includes('overwhelm')
  const hasSleepIssues = symptomsLower.includes('sleep') || symptomsLower.includes('insomnia') || symptomsLower.includes('tired') || symptomsLower.includes('fatigue')
  const hasMoodChanges = symptomsLower.includes('mood') || symptomsLower.includes('irritable') || symptomsLower.includes('depression') || symptomsLower.includes('emotional')
  const hasWeightChanges = symptomsLower.includes('weight') || symptomsLower.includes('appetite') || symptomsLower.includes('eating')
  const hasPeriodIssues = symptomsLower.includes('period') || symptomsLower.includes('menstrual') || symptomsLower.includes('cycle') || symptomsLower.includes('pms')
  const hasSkinIssues = symptomsLower.includes('skin') || symptomsLower.includes('acne') || symptomsLower.includes('hair')
  const hasEnergyIssues = symptomsLower.includes('energy') || symptomsLower.includes('exhausted') || symptomsLower.includes('weak')
  
  // Analyze lifestyle factors
  const highStress = lifestyleLower.includes('high') && lifestyleLower.includes('stress')
  const poorSleep = lifestyleLower.includes('poor') && lifestyleLower.includes('sleep')
  const sedentary = lifestyleLower.includes('sedentary') || lifestyleLower.includes('no exercise')
  
  // Generate targeted response
  let analysis = ""
  let recommendations = []
  let riskLevel = "low"
  let nextSteps = []
  
  if (hasStressSymptoms && hasMoodChanges) {
    analysis = "Your symptoms indicate potential cortisol dysregulation, commonly associated with chronic stress. The combination of mood changes and stress-related symptoms suggests your adrenal system may be overworked, affecting your overall hormonal balance."
    recommendations = [
      "Implement daily stress-reduction techniques like deep breathing or meditation",
      "Consider adaptogenic herbs such as ashwagandha or rhodiola",
      "Prioritize protein-rich breakfasts to stabilize blood sugar",
      "Create boundaries around work and personal time",
      "Practice progressive muscle relaxation before bed"
    ]
    riskLevel = highStress ? "medium" : "low"
    nextSteps = [
      "Track stress levels and symptoms daily for 2 weeks",
      "Consider cortisol testing (saliva test preferred)",
      "Explore stress management counseling or therapy"
    ]
  } else if (hasSleepIssues && hasEnergyIssues) {
    analysis = "Your sleep and energy patterns suggest possible disruption in your circadian rhythm and potentially thyroid function. Poor sleep quality can significantly impact hormone production, particularly growth hormone and cortisol regulation."
    recommendations = [
      "Establish a consistent sleep schedule, even on weekends",
      "Create a technology-free bedroom environment",
      "Consider magnesium supplementation 1-2 hours before bed",
      "Expose yourself to natural sunlight within 30 minutes of waking",
      "Avoid caffeine after 2 PM"
    ]
    riskLevel = poorSleep ? "medium" : "low"
    nextSteps = [
      "Keep a sleep diary tracking quality and duration",
      "Request thyroid panel including TSH, T3, T4, and reverse T3",
      "Consider sleep study if symptoms persist"
    ]
  } else if (hasPeriodIssues || hasWeightChanges) {
    analysis = "Your symptoms suggest potential reproductive hormone imbalances, possibly involving estrogen, progesterone, or insulin resistance. These hormones work together to regulate menstrual cycles and metabolism."
    recommendations = [
      "Focus on anti-inflammatory foods like fatty fish and leafy greens",
      "Balance meals with protein, healthy fats, and complex carbs",
      "Consider seed cycling to support hormone production",
      "Reduce refined sugar and processed food intake",
      "Include regular strength training exercises"
    ]
    riskLevel = "medium"
    nextSteps = [
      "Track menstrual cycle and symptoms for 3 months",
      "Request comprehensive hormone panel including estrogen, progesterone, and insulin",
      "Consider consultation with reproductive endocrinologist"
    ]
  } else if (hasSkinIssues) {
    analysis = "Skin changes often reflect internal hormonal shifts, particularly involving androgens, insulin, or inflammatory responses. Your symptoms may indicate hormonal acne or other hormone-related skin conditions."
    recommendations = [
      "Adopt an anti-inflammatory diet rich in omega-3 fatty acids",
      "Consider zinc supplementation for skin health",
      "Use gentle, non-comedogenic skincare products",
      "Manage stress through regular exercise or mindfulness",
      "Ensure adequate hydration throughout the day"
    ]
    riskLevel = "low"
    nextSteps = [
      "Monitor skin changes in relation to menstrual cycle",
      "Consider androgen testing if symptoms are severe",
      "Consult with dermatologist familiar with hormonal causes"
    ]
  } else {
    // General hormonal imbalance response
    analysis = "Based on your symptoms, you may be experiencing mild hormonal fluctuations that could be influenced by various lifestyle factors. Hormones are interconnected, and small imbalances can create cascading effects throughout your system."
    recommendations = [
      "Maintain consistent meal timing to support hormone regulation",
      "Include hormone-supporting foods like cruciferous vegetables",
      "Practice stress management techniques daily",
      "Ensure adequate sleep quality and duration",
      "Consider gentle detox support through proper hydration"
    ]
    riskLevel = "low"
    nextSteps = [
      "Keep a comprehensive symptom and lifestyle diary",
      "Schedule wellness check-up with healthcare provider",
      "Consider basic hormone screening if symptoms persist"
    ]
  }
  
  return { analysis, recommendations, riskLevel, nextSteps }
}

export async function POST(request: NextRequest) {
  try {
    const { symptoms, lifestyle } = await request.json()

    // Try Gemini API if key is available, otherwise use static response
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.length > 10) {
      try {
        console.log("Using Gemini API for dynamic analysis")
        const model = genAI.getGenerativeModel({ model: MODEL_NAME })
        
        const prompt = `As a hormone wellness expert, analyze these symptoms and lifestyle factors and provide personalized insights:
        
Symptoms: ${symptoms}
Lifestyle: ${lifestyle}

Please provide a JSON response with the following exact structure (no additional text or formatting):
{
  "analysis": "Brief analysis of the symptoms and potential hormonal connections based on the specific symptoms provided",
  "recommendations": ["4-5 specific, actionable recommendations tailored to these symptoms"],
  "riskLevel": "low|medium|high",
  "nextSteps": ["3-4 next steps for the user based on their specific situation"]
}

Make the analysis specific to the symptoms provided. Focus on hormone wellness, stress management, nutrition, and lifestyle factors. Keep recommendations practical and evidence-based.`

        const result = await model.generateContent(prompt)
        const response = await result.response
        const text = response.text()
        
        console.log("Gemini raw response:", text)
        
        // Clean the response to extract JSON
        let cleanedText = text.trim()
        if (cleanedText.startsWith('```json')) {
          cleanedText = cleanedText.replace(/```json\n?/, '').replace(/\n?```$/, '')
        }
        if (cleanedText.startsWith('```')) {
          cleanedText = cleanedText.replace(/```\n?/, '').replace(/\n?```$/, '')
        }
        
        // Try to parse JSON response from Gemini
        try {
          const geminiAnalysis = JSON.parse(cleanedText)
          console.log("Successfully parsed Gemini response")
          return NextResponse.json(geminiAnalysis)
        } catch (parseError) {
          console.warn("Failed to parse Gemini response:", parseError)
          console.warn("Raw response was:", text)
          return NextResponse.json(generateDynamicFallback(symptoms, lifestyle))
        }
      } catch (geminiError) {
        console.warn("Gemini API error:", geminiError)
        return NextResponse.json(generateDynamicFallback(symptoms, lifestyle))
      }
    } else {
      console.log("No valid Gemini API key found, using dynamic fallback analysis")
      // Simulate AI delay for demo purposes
      await new Promise((resolve) => setTimeout(resolve, 1500))
      return NextResponse.json(generateDynamicFallback(symptoms, lifestyle))
    }
  } catch (error) {
    console.error("Analysis error:", error)
    // Return dynamic fallback instead of error to prevent frontend failures
    return NextResponse.json(generateDynamicFallback("general symptoms", "general lifestyle"))
  }
}

import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { symptoms, lifestyle } = await request.json()

    // Simulate AI analysis delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock analysis results based on input
    const mockResults = [
      {
        condition: "Hormonal Imbalance - Estrogen Dominance",
        severity: symptoms.toLowerCase().includes("mood") ? "medium" : "low",
        confidence: Math.floor(Math.random() * 20) + 70,
        recommendations: [
          "Consider reducing stress through meditation",
          "Increase fiber intake to support hormone metabolism",
          "Regular exercise 3-4 times per week",
          "Limit exposure to xenoestrogens in plastics",
        ],
      },
      {
        condition: "Adrenal Fatigue",
        severity: lifestyle.toLowerCase().includes("stress") ? "high" : "medium",
        confidence: Math.floor(Math.random() * 15) + 60,
        recommendations: [
          "Prioritize 7-9 hours of quality sleep",
          "Reduce caffeine intake, especially after 2 PM",
          "Consider adaptogenic herbs like ashwagandha",
          "Practice stress management techniques",
        ],
      },
    ]

    // Add thyroid-related condition if fatigue is mentioned
    if (symptoms.toLowerCase().includes("fatigue") || symptoms.toLowerCase().includes("tired")) {
      mockResults.push({
        condition: "Thyroid Dysfunction",
        severity: "low",
        confidence: Math.floor(Math.random() * 10) + 55,
        recommendations: [
          "Get comprehensive thyroid panel testing",
          "Ensure adequate iodine and selenium intake",
          "Avoid goitrogenic foods in excess",
          "Consider morning sunlight exposure",
        ],
      })
    }

    return NextResponse.json({ results: mockResults })
  } catch (error) {
    console.error("Analysis error:", error)
    return NextResponse.json({ error: "Failed to analyze symptoms" }, { status: 500 })
  }
}

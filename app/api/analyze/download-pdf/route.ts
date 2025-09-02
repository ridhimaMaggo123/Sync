import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { analysisData, userName = "User" } = await request.json()

    // Return the analysis data as JSON for client-side PDF generation
    const reportData = {
      userName,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      analysis: analysisData.analysis || 'No analysis available',
      riskLevel: analysisData.riskLevel || 'low',
      recommendations: analysisData.recommendations || [],
      nextSteps: analysisData.nextSteps || []
    }

    return NextResponse.json(reportData)
  } catch (error) {
    console.error("PDF generation error:", error)
    return NextResponse.json({ error: "Failed to generate PDF report" }, { status: 500 })
  }
}

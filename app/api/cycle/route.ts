import { NextRequest, NextResponse } from "next/server"

interface CycleRequest {
  lastPeriodStart: string // YYYY-MM-DD
  averageCycleLength?: number // default 28
  periodDuration?: number // default 5
}

interface CycleResponse {
  nextPeriodStart: string
  fertileWindow: [string, string]
  upcomingCycles: [string, string, string]
  recommendations: string[]
  notifications: Array<{
    message: string
    triggerDate: string
  }>
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0]
}

function generateRecommendations(cycleLength: number, periodDuration: number): string[] {
  const recommendations = [
    "Track your cycle regularly to identify patterns and improve predictions",
    "Stay hydrated and maintain a balanced diet rich in iron during your period",
    "Consider light exercise like yoga or walking to help with period symptoms",
    "Get adequate sleep (7-9 hours) to support hormonal balance throughout your cycle"
  ]

  // Add cycle-specific recommendations
  if (cycleLength < 25) {
    recommendations.push("Your cycle is shorter than average - consider consulting a healthcare provider if this is a new pattern")
  } else if (cycleLength > 35) {
    recommendations.push("Your cycle is longer than average - stress management and regular exercise may help regulate it")
  }

  if (periodDuration > 7) {
    recommendations.push("Heavy or long periods may benefit from iron-rich foods and medical consultation")
  }

  return recommendations.slice(0, 4)
}

export async function POST(request: NextRequest) {
  try {
    const body: CycleRequest = await request.json()
    
    if (!body.lastPeriodStart) {
      return NextResponse.json(
        { error: "Last period start date is required" },
        { status: 400 }
      )
    }

    const cycleLength = body.averageCycleLength || 28
    const periodDuration = body.periodDuration || 5

    // Validate cycle length
    if (cycleLength < 21 || cycleLength > 45) {
      return NextResponse.json(
        { error: "Cycle length must be between 21 and 45 days" },
        { status: 400 }
      )
    }

    const lastPeriodDate = new Date(body.lastPeriodStart)
    
    // Validate date
    if (isNaN(lastPeriodDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format. Use YYYY-MM-DD" },
        { status: 400 }
      )
    }

    // Calculate next period start
    const nextPeriodStart = addDays(lastPeriodDate, cycleLength)
    
    // Calculate fertile window (typically days 10-16 of cycle, but adjusted for cycle length)
    const ovulationDay = cycleLength - 14 // Luteal phase is typically 14 days
    const fertileStart = addDays(lastPeriodDate, Math.max(8, ovulationDay - 5))
    const fertileEnd = addDays(lastPeriodDate, Math.min(cycleLength - 3, ovulationDay + 1))
    
    // Calculate next 3 cycles
    const cycle2 = addDays(nextPeriodStart, cycleLength)
    const cycle3 = addDays(cycle2, cycleLength)
    
    // Generate recommendations
    const recommendations = generateRecommendations(cycleLength, periodDuration)
    
    // Create notifications with enhanced details
    const notifications = [
      {
        type: "period_reminder",
        title: "Period Starting Soon",
        message: "Your period is expected to start in 3 days. Consider preparing supplies and tracking symptoms.",
        triggerDate: formatDate(addDays(nextPeriodStart, -3))
      },
      {
        type: "period_reminder", 
        title: "Period Day",
        message: "Your period is expected to start today. Take care of yourself and stay hydrated.",
        triggerDate: formatDate(nextPeriodStart)
      },
      {
        type: "fertile_window",
        title: "Fertile Window Begins",
        message: "Your fertile window begins today. This is your most fertile time if you're trying to conceive.",
        triggerDate: formatDate(fertileStart)
      },
      {
        type: "fertile_window",
        title: "Ovulation Peak",
        message: "Your fertile window ends today. Ovulation likely occurred in the past 24-48 hours.",
        triggerDate: formatDate(fertileEnd)
      },
      {
        type: "cycle_prediction",
        title: "Mid-Cycle Check",
        message: "You're halfway through your cycle. Great time to focus on nutrition and exercise.",
        triggerDate: formatDate(addDays(lastPeriodDate, Math.floor(cycleLength / 2)))
      },
      {
        type: "wellness_tip",
        title: "PMS Preparation",
        message: "PMS symptoms may start soon. Consider reducing caffeine and increasing magnesium intake.",
        triggerDate: formatDate(addDays(nextPeriodStart, -7))
      }
    ]

    // Store notifications in the notification system
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cycleNotifications: notifications,
          userId: 'demo-user' // In production, get from auth
        })
      })
    } catch (error) {
      console.warn('Failed to store notifications:', error)
      // Continue without failing the main request
    }

    const response: CycleResponse = {
      nextPeriodStart: formatDate(nextPeriodStart),
      fertileWindow: [formatDate(fertileStart), formatDate(fertileEnd)],
      upcomingCycles: [
        formatDate(nextPeriodStart),
        formatDate(cycle2),
        formatDate(cycle3)
      ],
      recommendations,
      notifications
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error("Cycle prediction error:", error)
    return NextResponse.json(
      { error: "Failed to calculate cycle predictions" },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from "next/server"

interface SymptomEntry {
  id: string
  date: string
  tags: string[]
  severity: number
  notes?: string
  userId?: string
  created: string
}

// In-memory store for demo purposes. Replace with DB in production.
let entries: SymptomEntry[] = []

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const userId = url.searchParams.get("userId") || "demo-user"
  const userEntries = entries.filter(e => e.userId === userId)
  return NextResponse.json({ entries: userEntries })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { date, tags, severity, notes, userId = "demo-user" } = body

    if (!date || !Array.isArray(tags) || typeof severity !== "number") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
    }

    const newEntry: SymptomEntry = {
      id: `sym-${userId}-${Date.now()}`,
      date,
      tags,
      severity,
      notes,
      userId,
      created: new Date().toISOString(),
    }

    // Remove any duplicate entries for same day to keep last write wins
    entries = entries.filter(e => !(e.userId === userId && e.date === date))
    entries.push(newEntry)

    const userEntries = entries.filter(e => e.userId === userId)

    return NextResponse.json({ success: true, entries: userEntries })
  } catch (e) {
    console.error("Symptoms POST error", e)
    return NextResponse.json({ error: "Failed to save entry" }, { status: 500 })
  }
}

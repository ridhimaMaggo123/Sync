"use client"

import { useMemo, useState } from "react"
import WellnessNavbar from "@/components/wellness-navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { Flame, Droplets, Flower2, Waves } from "lucide-react"

function addDays(date: Date, days: number) {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

function daysBetween(a: Date, b: Date) {
  return Math.floor((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24))
}

type Phase = "menstrual" | "follicular" | "ovulatory" | "luteal"

const PHASE_INFO: Record<Phase, { title: string; color: string; tips: string[]; icon: any }> = {
  menstrual: {
    title: "Menstrual",
    color: "from-pink-400 via-rose-400 to-rose-500",
    tips: [
      "Prioritize rest and gentle movement like yoga or walks",
      "Increase iron-rich foods and hydration",
      "Magnesium and warmth can ease cramps"
    ],
    icon: Droplets,
  },
  follicular: {
    title: "Follicular",
    color: "from-purple-400 via-pink-400 to-indigo-400",
    tips: [
      "Energy rises—schedule focused work and strength training",
      "Lean protein and complex carbs support recovery",
      "Try new skills; cognition often feels sharper"
    ],
    icon: Waves,
  },
  ovulatory: {
    title: "Ovulatory",
    color: "from-indigo-400 via-purple-400 to-pink-400",
    tips: [
      "Peak social energy—great for presentations & collaboration",
      "Prioritize fiber and hydration to support estrogen metabolism",
      "High-intensity workouts can feel best here"
    ],
    icon: Flower2,
  },
  luteal: {
    title: "Luteal",
    color: "from-amber-400 via-pink-400 to-purple-400",
    tips: [
      "Support mood with steady meals and B-vitamins",
      "Reduce caffeine and added sugar to ease PMS",
      "Focus on sleep hygiene; aim for consistent bedtimes"
    ],
    icon: Flame,
  },
}

export default function PhasesPage() {
  const [lastPeriodStart, setLastPeriodStart] = useState<string>(new Date().toISOString().split("T")[0])
  const [cycleLength, setCycleLength] = useState<number>(28)
  const [periodDuration, setPeriodDuration] = useState<number>(5)

  const today = new Date()

  const phaseData = useMemo(() => {
    const start = new Date(lastPeriodStart)
    if (isNaN(start.getTime())) return null

    const dayOfCycle = ((daysBetween(start, today) % cycleLength) + cycleLength) % cycleLength
    // Rough model
    const ovulationDay = cycleLength - 14
    let phase: Phase = "follicular"

    if (dayOfCycle < periodDuration) phase = "menstrual"
    else if (dayOfCycle < Math.max(ovulationDay - 1, periodDuration)) phase = "follicular"
    else if (dayOfCycle <= ovulationDay + 1) phase = "ovulatory"
    else phase = "luteal"

    const current = PHASE_INFO[phase]

    const fertileStart = addDays(start, Math.max(8, ovulationDay - 5))
    const fertileEnd = addDays(start, Math.min(cycleLength - 3, ovulationDay + 1))

    const nextPeriod = addDays(start, cycleLength)

    return {
      phase,
      dayOfCycle: dayOfCycle + 1,
      fertileWindow: [fertileStart, fertileEnd] as [Date, Date],
      nextPeriod,
      current,
    }
  }, [lastPeriodStart, cycleLength, periodDuration, today])

  return (
    <>
      <WellnessNavbar />
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-pink-900/20 dark:via-purple-900/20 dark:to-indigo-900/20 pt-20 pb-8 relative overflow-hidden">
        <div className="floating-elements">
          <div className="floating-shape"></div>
          <div className="floating-shape"></div>
          <div className="floating-shape"></div>
          <div className="floating-shape"></div>
        </div>

        <div className="container mx-auto px-4 max-w-5xl relative z-10">
          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">Hormone Phase Insights</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">See your current phase and get lifestyle tips aligned to your cycle.</p>
          </div>

          <Card className="glass-card border-0 shadow-2xl mb-8">
            <CardHeader>
              <CardTitle className="text-pink-500">Cycle Inputs</CardTitle>
              <CardDescription>These values personalize your phase insights.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="last">Last period start</Label>
                <Input id="last" type="date" value={lastPeriodStart} onChange={e=>setLastPeriodStart(e.target.value)} className="pastel-input mt-2"/>
              </div>
              <div>
                <Label htmlFor="len">Cycle length</Label>
                <Input id="len" type="number" min={21} max={45} value={cycleLength}
                       onChange={e=>setCycleLength(parseInt(e.target.value)||28)} className="pastel-input mt-2"/>
              </div>
              <div>
                <Label htmlFor="dur">Period duration</Label>
                <Input id="dur" type="number" min={1} max={10} value={periodDuration}
                       onChange={e=>setPeriodDuration(parseInt(e.target.value)||5)} className="pastel-input mt-2"/>
              </div>
            </CardContent>
          </Card>

          {phaseData && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="glass-card border-0 shadow-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className={`inline-flex items-center justify-center w-10 h-10 rounded-xl text-white bg-gradient-to-r ${phaseData.current.color}`}>
                      {(() => { const I = phaseData.current.icon; return <I className="w-5 h-5"/> })()}
                    </span>
                    <span className="text-pink-500">Current Phase: {phaseData.current.title}</span>
                  </CardTitle>
                  <CardDescription>Day {phaseData.dayOfCycle} of {cycleLength}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {phaseData.current.tips.map((t, i)=> (
                      <div key={i} className="p-3 rounded-lg bg-white/70 dark:bg-gray-800/70 border border-pink-200 text-gray-700 dark:text-gray-300">{t}</div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-0 shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-purple-500">Timeline</CardTitle>
                  <CardDescription>Key dates this cycle</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                      <span className="text-purple-700 dark:text-purple-300">Fertile window</span>
                      <Badge className="bg-purple-100 text-purple-700">
                        {phaseData.fertileWindow[0].toLocaleDateString()} - {phaseData.fertileWindow[1].toLocaleDateString()}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-pink-50 dark:bg-pink-900/20">
                      <span className="text-pink-700 dark:text-pink-300">Next period</span>
                      <Badge className="bg-pink-100 text-pink-700">{phaseData.nextPeriod.toLocaleDateString()}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

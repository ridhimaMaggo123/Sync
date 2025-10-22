"use client"

import { useEffect, useMemo, useState } from "react"
import WellnessNavbar from "@/components/wellness-navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { Sparkles, BookOpen, Clock, Flame, Flower2, Waves, Droplets } from "lucide-react"

interface SymptomEntry { id: string; date: string; tags: string[]; severity: number; notes?: string }
interface AiResult { analysis: string; recommendations: string[]; riskLevel: string; nextSteps: string[] }

type Phase = "menstrual"|"follicular"|"ovulatory"|"luteal"

function phaseFrom(cycleLength: number, periodDuration: number, lastPeriodStart: string): { phase: Phase; day: number } | null {
  if (!lastPeriodStart) return null
  const start = new Date(lastPeriodStart)
  if (isNaN(start.getTime())) return null
  const today = new Date()
  const dayOfCycle = ((Math.floor((today.getTime() - start.getTime())/(1000*60*60*24)) % cycleLength) + cycleLength) % cycleLength
  const ovulationDay = cycleLength - 14
  let p: Phase = "follicular"
  if (dayOfCycle < periodDuration) p = "menstrual"
  else if (dayOfCycle < Math.max(ovulationDay - 1, periodDuration)) p = "follicular"
  else if (dayOfCycle <= ovulationDay + 1) p = "ovulatory"
  else p = "luteal"
  return { phase: p, day: dayOfCycle + 1 }
}

const PHASE_CARD: Record<Phase, { title: string; icon: any; color: string; blurb: string }> = {
  menstrual: { title: "Menstrual", icon: Droplets, color: "from-pink-400 via-rose-400 to-rose-500", blurb: "Prioritize rest, warmth, and mineral-rich foods." },
  follicular: { title: "Follicular", icon: Waves, color: "from-purple-400 via-pink-400 to-indigo-400", blurb: "Energy is rising—lean into learning and training." },
  ovulatory: { title: "Ovulatory", icon: Flower2, color: "from-indigo-400 via-purple-400 to-pink-400", blurb: "Peak social and physical capacity—hydrate and fuel well." },
  luteal: { title: "Luteal", icon: Flame, color: "from-amber-400 via-pink-400 to-purple-400", blurb: "Stabilize blood sugar, support sleep, and reduce stressors." },
}

export default function InsightsPage() {
  const [entries, setEntries] = useState<SymptomEntry[]>([])
  const [ai, setAi] = useState<AiResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [aiLoading, setAiLoading] = useState(false)

  // For phase estimation inputs (fallback defaults)
  const [lastPeriodStart, setLastPeriodStart] = useState<string>(new Date().toISOString().split('T')[0])
  const [cycleLength] = useState<number>(28)
  const [periodDuration] = useState<number>(5)

  // Load entries on mount
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/symptoms')
        if (res.ok) {
          const data = await res.json()
          setEntries(data.entries || [])
        }
      } finally { setLoading(false) }
    }
    load()
  }, [])

  // Listen for cross-page updates: BroadcastChannel and localStorage events
  useEffect(() => {
    let bc: any
    const reload = async () => {
      try {
        const res = await fetch('/api/symptoms')
        if (res.ok) {
          const data = await res.json()
          setEntries(data.entries || [])
        }
      } catch {}
    }

    // BroadcastChannel listener
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (typeof BroadcastChannel !== 'undefined') {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        bc = new BroadcastChannel('symptoms')
        bc.onmessage = (e: any) => {
          if (e?.data?.type === 'updated') reload()
        }
      }
    } catch {}

    // localStorage fallback
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'symptoms:lastUpdate') reload()
    }
    window.addEventListener('storage', onStorage)

    // Also refresh when tab becomes active again
    const onFocus = () => reload()
    const onVisibility = () => { if (document.visibilityState === 'visible') reload() }
    window.addEventListener('focus', onFocus)
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      try { bc && bc.close && bc.close() } catch {}
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('focus', onFocus)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  const latest = useMemo(() => entries.slice().sort((a,b)=>a.date.localeCompare(b.date)).pop(), [entries])
  const phase = useMemo(() => phaseFrom(cycleLength, periodDuration, lastPeriodStart), [cycleLength, periodDuration, lastPeriodStart])

  const analyze = async () => {
    setAiLoading(true)
    setAi(null)
    try {
      const symptoms = latest
        ? `Latest symptoms on ${latest.date}: ${latest.tags.join(', ')} (severity ${latest.severity}/10). Notes: ${latest.notes || 'none'}`
        : `No recent logs. Provide general wellness recommendations.`
      const lifestyle = phase ? `Current phase: ${phase.phase}, day ${phase.day}.` : 'Phase unknown.'
      const r = await fetch('/api/analyze', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ symptoms, lifestyle }) })
      if (r.ok) setAi(await r.json())
    } finally { setAiLoading(false) }
  }

  useEffect(() => { analyze() }, [latest?.id, phase?.phase])

  const articles = [
    { title: "Guide: Nutrition Across Your Cycle", tag: "Nutrition", href: "#" },
    { title: "Sleep Hygiene for Hormone Balance", tag: "Sleep", href: "#" },
    { title: "Managing PMS: Evidence-Based Tips", tag: "PMS", href: "#" },
  ]

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
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">Insights</h1>
            <Button onClick={analyze} disabled={aiLoading} className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white">
              <Sparkles className="w-4 h-4 mr-2"/>{aiLoading ? 'Refreshing...' : 'Refresh AI' }
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="glass-card border-0 shadow-2xl lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-pink-500 flex items-center gap-2"><BookOpen className="w-5 h-5"/>Daily Recommendations</CardTitle>
                <CardDescription>Personalized suggestions based on your logs and phase</CardDescription>
              </CardHeader>
              <CardContent>
                {ai ? (
                  <div className="space-y-4">
                    <div className="text-sm uppercase tracking-wide text-pink-600">Risk level: {ai.riskLevel}</div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{ai.analysis}</p>
                    <div>
                      <div className="font-medium text-gray-800 dark:text-gray-200 mb-2">Top Actions</div>
                      <ul className="list-disc ml-5 space-y-1 text-gray-700 dark:text-gray-300">
                        {ai.recommendations.map((r, i)=> (<li key={i}>{r}</li>))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-500">{loading ? 'Loading...' : 'No insights yet.'}</div>
                )}
              </CardContent>
            </Card>

            <Card className="glass-card border-0 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-purple-500 flex items-center gap-2"><Clock className="w-5 h-5"/>Phase Snapshot</CardTitle>
                <CardDescription>Quick view of where you are in your cycle</CardDescription>
              </CardHeader>
              <CardContent>
                {phase ? (
                  <div className="space-y-3">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-xl text-white bg-gradient-to-r ${PHASE_CARD[phase.phase].color}`}>
                      {(() => { const I = PHASE_CARD[phase.phase].icon; return <I className="w-4 h-4"/> })()} 
                      {PHASE_CARD[phase.phase].title} • Day {phase.day}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">{PHASE_CARD[phase.phase].blurb}</p>
                    <div className="text-xs text-gray-500">Edit inputs in Phases to refine accuracy.</div>
                  </div>
                ) : (
                  <div className="text-gray-500">Set your last period start to view phase.</div>
                )}
              </CardContent>
            </Card>
          </div>

          <motion.div className="mt-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="glass-card border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-indigo-500">Health Articles</CardTitle>
                <CardDescription>Curated reading aligned with your current needs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {articles.map((a, i)=> (
                    <a key={i} href={a.href} className="p-4 rounded-lg bg-white/70 dark:bg-gray-800/70 border border-indigo-200 hover:shadow-md transition">
                      <div className="text-xs uppercase tracking-wide text-indigo-600 mb-1">{a.tag}</div>
                      <div className="font-medium text-gray-800 dark:text-gray-200">{a.title}</div>
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  )
}

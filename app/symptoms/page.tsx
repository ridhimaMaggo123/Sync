"use client"

import { useEffect, useMemo, useState } from "react"
import WellnessNavbar from "@/components/wellness-navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { Calendar, Activity, Sparkles, MessageSquare } from "lucide-react"

interface SymptomEntry {
  id: string
  date: string
  tags: string[]
  severity: number
  notes?: string
}

const TAGS = [
  "PMS", "Mood swings", "Low mood", "Anxiety", "Energy low", "Energy high", "Sleep issues", "Cramps",
  "Headache", "Back pain", "Bloating", "Acne", "Breast tenderness", "Food cravings", "Nausea"
]

export default function SymptomsPage() {
  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0])
  const [selected, setSelected] = useState<string[]>([])
  const [severity, setSeverity] = useState<number>(5)
  const [notes, setNotes] = useState<string>("")
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [entries, setEntries] = useState<SymptomEntry[]>([])
  const [aiLoading, setAiLoading] = useState(false)
  const [aiResult, setAiResult] = useState<null | { analysis: string; recommendations: string[]; riskLevel: string; nextSteps: string[] }>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/symptoms")
        if (res.ok) {
          const data = await res.json()
          setEntries(data.entries || [])
        }
      } catch {}
      setLoading(false)
    }
    load()
  }, [])

  const toggleTag = (tag: string) => {
    setSelected(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch("/api/symptoms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, tags: selected, severity, notes })
      })
      if (res.ok) {
        const data = await res.json()
        setEntries(data.entries)
        setNotes("")
        setSelected([])
        setSeverity(5)

        // Notify other pages (e.g., Insights) to refresh
        try {
          // BroadcastChannel if supported
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          if (typeof BroadcastChannel !== 'undefined') {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const bc = new BroadcastChannel('symptoms')
            bc.postMessage({ type: 'updated', at: Date.now() })
            bc.close()
          }
        } catch {}
        try {
          localStorage.setItem('symptoms:lastUpdate', String(Date.now()))
        } catch {}
      }
    } finally {
      setSaving(false)
    }
  }

  const handleAnalyze = async () => {
    setAiLoading(true)
    setAiResult(null)
    try {
      const symptoms = `On ${date}, symptoms: ${selected.join(', ')}, severity ${severity}/10. Notes: ${notes || 'none'}.`
      const lifestyle = "Sleep, stress, activity and diet vary; seeking tailored wellness guidance."
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms, lifestyle })
      })
      if (res.ok) {
        const data = await res.json()
        setAiResult(data)
      }
    } finally {
      setAiLoading(false)
    }
  }

  const recentTags = useMemo(() => {
    const counts: Record<string, number> = {}
    entries.forEach(e => e.tags.forEach(t => counts[t] = (counts[t] || 0) + 1))
    return Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,6)
  }, [entries])

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
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">Symptom Logging</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">Track daily symptoms and get personalized AI insights</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="glass-card border-0 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-pink-500 flex items-center gap-2"><Calendar className="w-5 h-5"/>Log Today</CardTitle>
                <CardDescription>Capture your symptoms, severity, and notes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-1">
                    <Label htmlFor="date">Date</Label>
                    <Input id="date" type="date" value={date} onChange={e=>setDate(e.target.value)} className="pastel-input mt-2"/>
                  </div>
                  <div className="sm:col-span-2">
                    <Label>Symptoms</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {TAGS.map(tag => (
                        <button
                          key={tag}
                          type="button"
                          onClick={()=>toggleTag(tag)}
                          className={`px-3 py-1 rounded-full text-sm border transition-all ${selected.includes(tag) ? 'bg-pink-500 text-white border-pink-500' : 'bg-white/70 dark:bg-gray-800/70 border-pink-200 text-pink-700 hover:bg-pink-50'}`}
                        >{tag}</button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-1">
                    <Label htmlFor="severity">Severity: {severity}/10</Label>
                    <input id="severity" type="range" min={1} max={10} value={severity} onChange={e=>setSeverity(parseInt(e.target.value))} className="w-full"/>
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea id="notes" value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Anything else to note?" className="pastel-input mt-2 min-h-28"/>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button onClick={handleSave} disabled={saving} className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white">
                    {saving ? 'Saving...' : 'Save Entry'}
                  </Button>
                  <Button variant="outline" onClick={handleAnalyze} disabled={aiLoading || selected.length===0} className="border-pink-300 text-pink-600 hover:bg-pink-50">
                    <Sparkles className="w-4 h-4 mr-2"/> {aiLoading ? 'Analyzing...' : 'Get AI Insight'}
                  </Button>
                </div>

                {aiResult && (
                  <div className="mt-4 p-4 rounded-xl bg-white/70 dark:bg-gray-800/70 border border-pink-200">
                    <div className="text-sm uppercase tracking-wide text-pink-600 mb-2">AI Analysis ({aiResult.riskLevel})</div>
                    <p className="text-gray-700 dark:text-gray-300 mb-3">{aiResult.analysis}</p>
                    <div>
                      <div className="font-medium text-gray-800 dark:text-gray-200 mb-1">Recommendations</div>
                      <ul className="list-disc ml-5 text-gray-700 dark:text-gray-300 space-y-1">
                        {aiResult.recommendations.map((r, i)=>(<li key={i}>{r}</li>))}
                      </ul>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="glass-card border-0 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-purple-500 flex items-center gap-2"><Activity className="w-5 h-5"/>Recent Logs</CardTitle>
                <CardDescription>Your latest entries and common patterns</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-gray-500">Loading...</div>
                ) : entries.length === 0 ? (
                  <div className="text-gray-500">No entries yet. Log your first symptoms!</div>
                ) : (
                  <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                    {entries.slice().reverse().map((e) => (
                      <div key={e.id} className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                        <div className="flex items-center justify-between">
                          <div className="font-medium text-purple-700 dark:text-purple-300">{new Date(e.date).toLocaleDateString()}</div>
                          <div className="text-sm text-gray-500">Severity {e.severity}/10</div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {e.tags.map((t,i)=>(<Badge key={i} className="bg-pink-100 text-pink-700">{t}</Badge>))}
                        </div>
                        {e.notes && <p className="text-sm text-gray-700 dark:text-gray-300 mt-2 leading-relaxed">{e.notes}</p>}
                      </div>
                    ))}
                  </div>
                )}

                {recentTags.length > 0 && (
                  <div className="mt-6">
                    <div className="text-sm uppercase tracking-wide text-indigo-600 mb-2">Most Frequent</div>
                    <div className="flex flex-wrap gap-2">
                      {recentTags.map(([tag, count]) => (
                        <Badge key={tag} className="bg-indigo-100 text-indigo-700">{tag} • {count}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <motion.div className="mt-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="glass-card border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-indigo-500 flex items-center gap-2"><MessageSquare className="w-5 h-5"/>Daily Tip</CardTitle>
                <CardDescription>Gentle reminder aligned with hormonal balance</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300">Aim for a protein-rich breakfast and a 10-minute sunlight walk this morning to support circadian rhythm and stable energy.</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  )
}

"use client"

import WellnessNavbar from "@/components/wellness-navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Baby, HeartPulse, Sparkles } from "lucide-react"
import { useMemo, useState } from "react"

export default function ModesPage() {
  const [mode, setMode] = useState<"standard"|"pregnancy"|"postpartum"|"menopause">("standard")
  const [tipsOn, setTipsOn] = useState(true)

  const content = useMemo(() => {
    switch (mode) {
      case "pregnancy":
        return {
          title: "Pregnancy Mode",
          bullets: [
            "Replace cycle predictions with trimester tracking",
            "Focus on hydration, folate, and gentle movement",
            "Consult your provider before supplements"
          ]
        }
      case "postpartum":
        return {
          title: "Postpartum Mode",
          bullets: [
            "Prioritize recovery, sleep, and support",
            "Pelvic floor rehab and walking guidance",
            "Nutrient density for healing (protein, choline)"
          ]
        }
      case "menopause":
        return {
          title: "Menopause Mode",
          bullets: [
            "Symptoms tracking shifts to hot flashes, sleep, mood",
            "Resistance training for bone and metabolic health",
            "Fiber, protein, and omega-3 support"
          ]
        }
      default:
        return {
          title: "Standard Mode",
          bullets: [
            "Cycle tracking with fertile window and phases",
            "PMS-aware tips and lifestyle recommendations",
            "AI insights tailored to daily symptoms"
          ]
        }
    }
  }, [mode])

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

        <div className="container mx-auto px-4 max-w-4xl relative z-10">
          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">Modes</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">Switch app behavior for pregnancy, postpartum, or menopause.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="glass-card border-0 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-pink-500">Select a Mode</CardTitle>
                <CardDescription>Applies across tracking and insights</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  <Button variant={mode==='standard'? 'default':'outline'} onClick={()=>setMode('standard')} className={mode==='standard'? 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white' : 'border-pink-300 text-pink-600 hover:bg-pink-50'}>Standard</Button>
                  <Button variant={mode==='pregnancy'? 'default':'outline'} onClick={()=>setMode('pregnancy')} className={mode==='pregnancy'? 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white' : 'border-pink-300 text-pink-600 hover:bg-pink-50'}>
                    <Baby className="w-4 h-4 mr-2"/>Pregnancy
                  </Button>
                  <Button variant={mode==='postpartum'? 'default':'outline'} onClick={()=>setMode('postpartum')} className={mode==='postpartum'? 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white' : 'border-pink-300 text-pink-600 hover:bg-pink-50'}>
                    <HeartPulse className="w-4 h-4 mr-2"/>Postpartum
                  </Button>
                  <Button variant={mode==='menopause'? 'default':'outline'} onClick={()=>setMode('menopause')} className={mode==='menopause'? 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white' : 'border-pink-300 text-pink-600 hover:bg-pink-50'}>
                    Menopause
                  </Button>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <div>
                    <div className="font-medium text-gray-800 dark:text-gray-200">Phase-aligned tips</div>
                    <div className="text-sm text-gray-500">Show daily recommendations for your mode</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch id="tips" checked={tipsOn} onCheckedChange={setTipsOn} />
                    <Label htmlFor="tips">{tipsOn ? 'On' : 'Off'}</Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-0 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-purple-500 flex items-center gap-2"><Sparkles className="w-5 h-5"/>What Changes</CardTitle>
                <CardDescription>Preview of app behavior in this mode</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {content.bullets.map((b, i)=> (
                    <div key={i} className="p-3 rounded-lg bg-white/70 dark:bg-gray-800/70 border border-purple-200 text-gray-700 dark:text-gray-300">{b}</div>
                  ))}
                </div>
                <div className="mt-4">
                  <Badge className="bg-indigo-100 text-indigo-700">Mode: {content.title}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}

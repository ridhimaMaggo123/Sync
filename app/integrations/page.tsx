"use client"

import WellnessNavbar from "@/components/wellness-navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"
import { Watch, Activity, Smartphone } from "lucide-react"
import { useState } from "react"

export default function IntegrationsPage() {
  const [appleHealth, setAppleHealth] = useState(false)
  const [fitbit, setFitbit] = useState(false)
  const [googleFit, setGoogleFit] = useState(false)

  const connect = (name: string, on: boolean) => {
    if (!on) return
    alert(`${name} connected (demo). In production, OAuth will be initiated.`)
  }

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
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">Integrations</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">Connect wearable devices to enrich your insights.</p>
          </div>

          <div className="space-y-6">
            <Card className="glass-card border-0 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-pink-500 flex items-center gap-2"><Watch className="w-5 h-5"/>Apple Health</CardTitle>
                <CardDescription>Sync sleep, heart rate, steps (demo)</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Switch id="apple" checked={appleHealth} onCheckedChange={(v)=>{setAppleHealth(v); connect('Apple Health', v)}} />
                  <Label htmlFor="apple">{appleHealth ? 'Connected' : 'Disconnected'}</Label>
                </div>
                <Button variant="outline" className="border-pink-300 text-pink-600 hover:bg-pink-50">Manage</Button>
              </CardContent>
            </Card>

            <Card className="glass-card border-0 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-purple-500 flex items-center gap-2"><Activity className="w-5 h-5"/>Fitbit</CardTitle>
                <CardDescription>Sync activity, HRV, sleep stages (demo)</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Switch id="fitbit" checked={fitbit} onCheckedChange={(v)=>{setFitbit(v); connect('Fitbit', v)}} />
                  <Label htmlFor="fitbit">{fitbit ? 'Connected' : 'Disconnected'}</Label>
                </div>
                <Button variant="outline" className="border-purple-300 text-purple-600 hover:bg-purple-50">Manage</Button>
              </CardContent>
            </Card>

            <Card className="glass-card border-0 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-indigo-500 flex items-center gap-2"><Smartphone className="w-5 h-5"/>Google Fit</CardTitle>
                <CardDescription>Sync steps and workouts (demo)</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Switch id="gfit" checked={googleFit} onCheckedChange={(v)=>{setGoogleFit(v); connect('Google Fit', v)}} />
                  <Label htmlFor="gfit">{googleFit ? 'Connected' : 'Disconnected'}</Label>
                </div>
                <Button variant="outline" className="border-indigo-300 text-indigo-600 hover:bg-indigo-50">Manage</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}

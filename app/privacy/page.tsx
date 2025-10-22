"use client"

import WellnessNavbar from "@/components/wellness-navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Shield, Download, Trash2, Lock } from "lucide-react"
import { useState } from "react"

export default function PrivacyPage() {
  const [analytics, setAnalytics] = useState(false)
  const [tipsEmails, setTipsEmails] = useState(false)

  const exportData = () => alert("Data export started (demo). In production, you'll receive a secure download link.")
  const deleteData = () => {
    const ok = confirm("This will delete your data in this demo (no real deletion). Proceed?")
    if (ok) alert("Request submitted (demo)")
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
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">Privacy & Data Protection</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">Control your data and preferences. We follow a privacy-first approach.</p>
          </div>

          <div className="space-y-6">
            <Card className="glass-card border-0 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-pink-500 flex items-center gap-2"><Shield className="w-5 h-5"/>Privacy Controls</CardTitle>
                <CardDescription>Toggle optional data sharing (demo)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-800 dark:text-gray-200">Anonymous analytics</div>
                    <div className="text-sm text-gray-500">Helps improve the app (no personal data)</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch id="analytics" checked={analytics} onCheckedChange={setAnalytics} />
                    <Label htmlFor="analytics">{analytics ? 'On' : 'Off'}</Label>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-800 dark:text-gray-200">Educational emails</div>
                    <div className="text-sm text-gray-500">Receive tips aligned to your cycle</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch id="emails" checked={tipsEmails} onCheckedChange={setTipsEmails} />
                    <Label htmlFor="emails">{tipsEmails ? 'On' : 'Off'}</Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-0 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-purple-500 flex items-center gap-2"><Lock className="w-5 h-5"/>Your Data</CardTitle>
                <CardDescription>Export or delete your data (demo)</CardDescription>
              </CardHeader>
              <CardContent className="flex gap-3 flex-wrap">
                <Button onClick={exportData} className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white"><Download className="w-4 h-4 mr-2"/>Export Data</Button>
                <Button variant="outline" onClick={deleteData} className="border-pink-300 text-pink-600 hover:bg-pink-50"><Trash2 className="w-4 h-4 mr-2"/>Delete Data</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}

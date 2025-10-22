"use client"

import WellnessNavbar from "@/components/wellness-navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"
import { Users, MessageSquare, Shield } from "lucide-react"
import { useState } from "react"

export default function CommunityPage() {
  const [question, setQuestion] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const submit = async () => {
    if (!question.trim()) return
    setSubmitting(true)
    // Placeholder: no backend yet
    setTimeout(()=>{
      setSubmitting(false)
      setQuestion("")
      alert("Your question was posted anonymously (demo)")
    }, 800)
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

        <div className="container mx-auto px-4 max-w-5xl relative z-10">
          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">Community Q&A</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">Ask or share anonymously with others on a wellness journey.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="glass-card border-0 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-pink-500 flex items-center gap-2"><MessageSquare className="w-5 h-5"/>Ask Anonymously</CardTitle>
                <CardDescription>Post a question without revealing your identity (demo)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Label htmlFor="q">Your question</Label>
                <Textarea id="q" value={question} onChange={e=>setQuestion(e.target.value)} className="pastel-input min-h-32" placeholder="e.g., How do you reduce PMS-related insomnia?"/>
                <div className="flex gap-3">
                  <Button onClick={submit} disabled={submitting} className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white">{submitting? 'Posting...' : 'Post Question'}</Button>
                  <Button variant="outline" className="border-pink-300 text-pink-600 hover:bg-pink-50">Guidelines</Button>
                </div>
                <div className="text-xs text-gray-500">This is a demo. In production, moderation and reporting tools will be enabled.</div>
              </CardContent>
            </Card>

            <Card className="glass-card border-0 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-purple-500 flex items-center gap-2"><Users className="w-5 h-5"/>Trending Threads</CardTitle>
                <CardDescription>Sample topics to explore</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { t: "Best magnesium type for sleep?", c: 34 },
                  { t: "Follicular phase workout ideas", c: 21 },
                  { t: "Reducing acne around ovulation", c: 18 },
                ].map((x, i)=> (
                  <div key={i} className="p-3 rounded-lg bg-white/70 dark:bg-gray-800/70 border border-purple-200 flex items-center justify-between">
                    <div className="text-gray-700 dark:text-gray-300">{x.t}</div>
                    <div className="text-sm text-purple-600">{x.c} replies</div>
                  </div>
                ))}
                <div className="mt-4 p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
                  <Shield className="w-4 h-4"/> Anonymous by default. Be kind and follow community rules.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}

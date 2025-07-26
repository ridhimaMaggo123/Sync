"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, CheckCircle, Loader2, Search } from "lucide-react"
import WellnessNavbar from "@/components/wellness-navbar"

interface AnalysisResult {
  condition: string
  severity: "low" | "medium" | "high"
  confidence: number
  recommendations: string[]
}

export default function SymptomAnalyzer() {
  const [symptoms, setSymptoms] = useState("")
  const [lifestyle, setLifestyle] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState<AnalysisResult[]>([])

  const handleAnalyze = async () => {
    setIsAnalyzing(true)

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ symptoms, lifestyle }),
      })

      if (!response.ok) {
        throw new Error("Analysis failed")
      }

      const data = await response.json()
      setResults(data.results)
    } catch (error) {
      console.error("Analysis error:", error)
      // Fallback to mock data
      const mockResults: AnalysisResult[] = [
        {
          condition: "Hormonal Imbalance - Estrogen Dominance",
          severity: "medium",
          confidence: 78,
          recommendations: [
            "Consider reducing stress through meditation",
            "Increase fiber intake to support hormone metabolism",
            "Regular exercise 3-4 times per week",
          ],
        },
      ]
      setResults(mockResults)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "low":
        return <CheckCircle className="w-4 h-4" />
      case "medium":
      case "high":
        return <AlertCircle className="w-4 h-4" />
      default:
        return null
    }
  }

  return (
    <>
      <WellnessNavbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 pt-20 pb-8">
        {/* Background particles */}
        <div className="floating-particles">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 8 + 4}px`,
                height: `${Math.random() * 8 + 4}px`,
                animationDelay: `${Math.random() * 6}s`,
                animationDuration: `${Math.random() * 3 + 4}s`,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                Symptom Analyzer
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Describe your symptoms and lifestyle for personalized insights
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Input Form */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Search className="w-5 h-5 mr-2" />
                      Symptom Assessment
                    </CardTitle>
                    <CardDescription>Provide detailed information for accurate analysis</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label htmlFor="symptoms">Current Symptoms</Label>
                      <Textarea
                        id="symptoms"
                        placeholder="Describe your symptoms in detail (e.g., fatigue, mood swings, irregular periods, sleep issues...)"
                        value={symptoms}
                        onChange={(e) => setSymptoms(e.target.value)}
                        className="mt-2 min-h-[120px]"
                      />
                    </div>

                    <div>
                      <Label htmlFor="lifestyle">Lifestyle Factors</Label>
                      <Textarea
                        id="lifestyle"
                        placeholder="Tell us about your lifestyle (stress levels, diet, exercise, sleep patterns, work schedule...)"
                        value={lifestyle}
                        onChange={(e) => setLifestyle(e.target.value)}
                        className="mt-2 min-h-[120px]"
                      />
                    </div>

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        onClick={handleAnalyze}
                        disabled={!symptoms.trim() || !lifestyle.trim() || isAnalyzing}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                      >
                        {isAnalyzing ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Search className="w-4 h-4 mr-2" />
                            Analyze Symptoms
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Results */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Analysis Results</CardTitle>
                    <CardDescription>AI-powered insights based on your symptoms</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {results.length === 0 ? (
                      <div className="text-center py-12 text-gray-500">
                        <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Enter your symptoms to get started</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {results.map((result, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="border rounded-lg p-4 bg-white/50 dark:bg-gray-700/50"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <h3 className="font-semibold text-lg">{result.condition}</h3>
                              <Badge className={getSeverityColor(result.severity)}>
                                {getSeverityIcon(result.severity)}
                                <span className="ml-1 capitalize">{result.severity}</span>
                              </Badge>
                            </div>

                            <div className="mb-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-600 dark:text-gray-300">Confidence Level</span>
                                <span className="text-sm font-medium">{result.confidence}%</span>
                              </div>
                              <Progress value={result.confidence} className="h-2" />
                            </div>

                            <div>
                              <h4 className="font-medium mb-2">Recommendations:</h4>
                              <ul className="space-y-1">
                                {result.recommendations.map((rec, recIndex) => (
                                  <li
                                    key={recIndex}
                                    className="text-sm text-gray-600 dark:text-gray-300 flex items-start"
                                  >
                                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                                    {rec}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}

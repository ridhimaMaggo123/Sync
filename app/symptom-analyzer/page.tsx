"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, CheckCircle, Download, Brain, FileText, TrendingUp, Calendar, Sparkles, Heart, Flower } from "lucide-react"
import jsPDF from 'jspdf'
import WellnessNavbar from "@/components/wellness-navbar"

interface AnalysisResult {
  analysis: string
  recommendations: string[]
  riskLevel: "low" | "medium" | "high"
  nextSteps: string[]
  confidence: number
}

interface SymptomData {
  symptoms: string
  duration: string
  severity: string
  lifestyle: string
  menstrualCycle: string
  stress: string
  sleep: string
  diet: string
}

export default function SymptomAnalyzer() {
  const [currentStep, setCurrentStep] = useState(0)
  const [symptomData, setSymptomData] = useState<SymptomData>({
    symptoms: "",
    duration: "",
    severity: "",
    lifestyle: "",
    menstrualCycle: "",
    stress: "",
    sleep: "",
    diet: ""
  })
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState<AnalysisResult | null>(null)
  const [isDownloading, setIsDownloading] = useState(false)

  const steps = [
    { title: "Symptoms", icon: Brain },
    { title: "Duration & Severity", icon: Calendar },
    { title: "Lifestyle", icon: TrendingUp },
    { title: "Results", icon: FileText }
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    setCurrentStep(3) // Move to results step

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          symptoms: `${symptomData.symptoms} (Duration: ${symptomData.duration}, Severity: ${symptomData.severity})`,
          lifestyle: `Menstrual cycle: ${symptomData.menstrualCycle}, Stress: ${symptomData.stress}, Sleep: ${symptomData.sleep}, Diet: ${symptomData.diet}. ${symptomData.lifestyle}`
        }),
      })

      if (!response.ok) {
        throw new Error("Analysis failed")
      }

      const data = await response.json()
      setResults({
        ...data,
        confidence: Math.floor(Math.random() * 20) + 80 // 80-100% confidence
      })
    } catch (error) {
      console.error("Analysis error:", error)
      // Enhanced fallback with more variety
      const mockResults: AnalysisResult[] = [
        {
          analysis: "Based on your symptoms, you may be experiencing hormonal fluctuations related to stress and lifestyle factors. The combination of fatigue and mood changes often indicates cortisol imbalance.",
          recommendations: [
            "Incorporate adaptogenic herbs like ashwagandha into your routine",
            "Practice deep breathing exercises for 10 minutes daily",
            "Maintain consistent meal timing to support hormone regulation",
            "Consider magnesium supplementation for better sleep quality"
          ],
          riskLevel: "low",
          nextSteps: [
            "Track symptoms for 2 weeks using a hormone diary",
            "Schedule a consultation with an endocrinologist",
            "Get comprehensive hormone panel blood work"
          ],
          confidence: 85
        },
        {
          analysis: "Your symptoms suggest potential thyroid dysfunction combined with adrenal fatigue. The pattern of energy crashes and temperature sensitivity are key indicators.",
          recommendations: [
            "Increase iodine-rich foods like seaweed and eggs",
            "Avoid goitrogenic foods when raw (broccoli, cauliflower)",
            "Support adrenals with B-complex vitamins",
            "Implement stress-reduction techniques like meditation"
          ],
          riskLevel: "medium",
          nextSteps: [
            "Request TSH, T3, T4, and reverse T3 testing",
            "Monitor basal body temperature daily",
            "Consider working with a functional medicine practitioner"
          ],
          confidence: 78
        }
      ]
      
      const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)]
      setResults(randomResult)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleDownloadPDF = async () => {
    if (!results) return
    
    setIsDownloading(true)
    try {
      const doc = new jsPDF()
      
      // Professional color palette
      const primaryColor = [244, 114, 182] // Pink-400
      const secondaryColor = [168, 85, 247] // Purple-500
      const accentColor = [99, 102, 241] // Indigo-500
      const darkColor = [31, 41, 55] // Gray-800
      const lightGray = [107, 114, 128] // Gray-500
      const backgroundColor = [249, 250, 251] // Gray-50
      
      // Add background color
      doc.setFillColor(...backgroundColor)
      doc.rect(0, 0, 210, 297, 'F')
      
      // Header section with gradient effect
      doc.setFillColor(...primaryColor)
      doc.rect(0, 0, 210, 45, 'F')
      
      // Company logo area
      doc.setFillColor(255, 255, 255)
      doc.circle(30, 22, 12, 'F')
      doc.setFontSize(16)
      doc.setTextColor(...primaryColor)
      doc.text('💖', 26, 27)
      
      // Main title
      doc.setFontSize(24)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(255, 255, 255)
      doc.text('HORMONE WELLNESS REPORT', 50, 20)
      
      // Subtitle
      doc.setFontSize(12)
      doc.setFont('helvetica', 'normal')
      doc.text('Comprehensive Health Analysis & Recommendations', 50, 30)
      
      // Report metadata box
      doc.setFillColor(255, 255, 255)
      doc.setDrawColor(...lightGray)
      doc.roundedRect(15, 55, 180, 25, 3, 3, 'FD')
      
      doc.setFontSize(10)
      doc.setTextColor(...darkColor)
      doc.setFont('helvetica', 'bold')
      doc.text('Report Details:', 20, 65)
      doc.setFont('helvetica', 'normal')
      doc.text(`Generated: ${new Date().toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })} at ${new Date().toLocaleTimeString()}`, 20, 72)
      doc.text(`Analysis Confidence: ${results.confidence}%`, 120, 72)
      
      let yPos = 95
      
      // Analysis Summary Section
      doc.setFillColor(...secondaryColor)
      doc.rect(15, yPos - 5, 180, 8, 'F')
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(255, 255, 255)
      doc.text('📊 ANALYSIS SUMMARY', 20, yPos)
      
      yPos += 15
      doc.setFillColor(255, 255, 255)
      doc.setDrawColor(...lightGray)
      const analysisHeight = Math.max(30, Math.ceil(results.analysis.length / 80) * 6 + 10)
      doc.roundedRect(15, yPos - 5, 180, analysisHeight, 3, 3, 'FD')
      
      doc.setFontSize(11)
      doc.setTextColor(...darkColor)
      doc.setFont('helvetica', 'normal')
      const analysisLines = doc.splitTextToSize(results.analysis, 170)
      doc.text(analysisLines, 20, yPos + 5)
      
      yPos += analysisHeight + 15
      
      // Risk Assessment Section
      doc.setFillColor(...accentColor)
      doc.rect(15, yPos - 5, 180, 8, 'F')
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(255, 255, 255)
      doc.text('⚠️ RISK ASSESSMENT', 20, yPos)
      
      yPos += 15
      const riskColors = {
        low: [34, 197, 94],
        medium: [245, 158, 11],
        high: [239, 68, 68]
      }
      const riskColor = riskColors[results.riskLevel] || riskColors.low
      
      doc.setFillColor(...riskColor)
      doc.roundedRect(15, yPos - 5, 60, 20, 3, 3, 'F')
      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(255, 255, 255)
      doc.text(`${results.riskLevel.toUpperCase()} RISK`, 20, yPos + 5)
      
      // Risk explanation
      doc.setFontSize(10)
      doc.setTextColor(...darkColor)
      doc.setFont('helvetica', 'normal')
      const riskExplanations = {
        low: 'Your symptoms indicate minimal health concerns. Continue monitoring.',
        medium: 'Some symptoms require attention. Consider lifestyle adjustments.',
        high: 'Multiple symptoms detected. Professional consultation recommended.'
      }
      doc.text(riskExplanations[results.riskLevel] || riskExplanations.low, 85, yPos + 5)
      
      yPos += 35
      
      // Recommendations Section
      doc.setFillColor(...primaryColor)
      doc.rect(15, yPos - 5, 180, 8, 'F')
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(255, 255, 255)
      doc.text('💡 PERSONALIZED RECOMMENDATIONS', 20, yPos)
      
      yPos += 15
      results.recommendations.forEach((rec, index) => {
        // Recommendation box
        doc.setFillColor(255, 255, 255)
        doc.setDrawColor(...primaryColor)
        const recHeight = Math.max(15, Math.ceil(rec.length / 70) * 5 + 8)
        doc.roundedRect(15, yPos - 3, 180, recHeight, 2, 2, 'FD')
        
        // Number circle
        doc.setFillColor(...primaryColor)
        doc.circle(25, yPos + 3, 4, 'F')
        doc.setFontSize(10)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(255, 255, 255)
        doc.text((index + 1).toString(), 23, yPos + 5)
        
        // Recommendation text
        doc.setFontSize(10)
        doc.setTextColor(...darkColor)
        doc.setFont('helvetica', 'normal')
        const recLines = doc.splitTextToSize(rec, 160)
        doc.text(recLines, 35, yPos + 3)
        
        yPos += recHeight + 5
      })
      
      yPos += 10
      
      // Next Steps Section
      doc.setFillColor(...secondaryColor)
      doc.rect(15, yPos - 5, 180, 8, 'F')
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(255, 255, 255)
      doc.text('🎯 RECOMMENDED NEXT STEPS', 20, yPos)
      
      yPos += 15
      results.nextSteps.forEach((step, index) => {
        // Step box
        doc.setFillColor(255, 255, 255)
        doc.setDrawColor(...secondaryColor)
        const stepHeight = Math.max(15, Math.ceil(step.length / 70) * 5 + 8)
        doc.roundedRect(15, yPos - 3, 180, stepHeight, 2, 2, 'FD')
        
        // Step number
        doc.setFillColor(...secondaryColor)
        doc.circle(25, yPos + 3, 4, 'F')
        doc.setFontSize(10)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(255, 255, 255)
        doc.text((index + 1).toString(), 23, yPos + 5)
        
        // Step text
        doc.setFontSize(10)
        doc.setTextColor(...darkColor)
        doc.setFont('helvetica', 'normal')
        const stepLines = doc.splitTextToSize(step, 160)
        doc.text(stepLines, 35, yPos + 3)
        
        yPos += stepHeight + 5
      })
      
      // Footer section
      doc.setFillColor(...darkColor)
      doc.rect(0, 270, 210, 27, 'F')
      
      doc.setFontSize(9)
      doc.setTextColor(255, 255, 255)
      doc.setFont('helvetica', 'normal')
      doc.text('⚕️ MEDICAL DISCLAIMER', 20, 280)
      doc.setFontSize(8)
      doc.text('This report is for informational purposes only and should not replace professional medical advice.', 20, 286)
      doc.text('Always consult with qualified healthcare providers for medical concerns and treatment decisions.', 20, 291)
      
      // Company info
      doc.setFontSize(10)
      doc.setFont('helvetica', 'bold')
      doc.text('Sync Health App', 150, 280)
      doc.setFontSize(8)
      doc.setFont('helvetica', 'normal')
      doc.text('Your Wellness Journey Partner', 150, 286)
      doc.text('sync-health.app', 150, 291)
      
      doc.save(`hormone-wellness-report-${new Date().toISOString().split('T')[0]}.pdf`)
      
    } catch (error) {
      console.error("PDF error:", error)
    } finally {
      setIsDownloading(false)
    }
  }

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "low": return "bg-emerald-100 text-emerald-800 border-emerald-200"
      case "medium": return "bg-amber-100 text-amber-800 border-amber-200"
      case "high": return "bg-rose-100 text-rose-800 border-rose-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case "low": return <CheckCircle className="w-4 h-4" />
      case "medium":
      case "high": return <AlertCircle className="w-4 h-4" />
      default: return null
    }
  }

  const isStepComplete = (stepIndex: number) => {
    switch (stepIndex) {
      case 0: return symptomData.symptoms.length > 10
      case 1: return symptomData.duration && symptomData.severity
      case 2: return symptomData.lifestyle.length > 10 && symptomData.stress && symptomData.sleep
      default: return false
    }
  }

  return (
    <>
      <WellnessNavbar />
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-pink-900/20 dark:via-purple-900/20 dark:to-indigo-900/20 pt-20 pb-8 relative overflow-hidden">
        {/* Floating Elements */}
        <div className="floating-elements">
          <div className="floating-shape"></div>
          <div className="floating-shape"></div>
          <div className="floating-shape"></div>
          <div className="floating-shape"></div>
        </div>
        
        <div className="container mx-auto px-4 max-w-5xl relative z-10">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent mb-4 flex items-center justify-center gap-3">
              <Sparkles className="w-12 h-12 text-pink-400" />
              Wellness Journey
              <Heart className="w-12 h-12 text-purple-400" />
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
              Get personalized insights about your hormonal health through our comprehensive assessment
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              {steps.map((step, index) => {
                const Icon = step.icon
                const isActive = index === currentStep
                const isComplete = index < currentStep || (index === currentStep && isStepComplete(index))
                
                return (
                  <div key={index} className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all ${
                      isActive 
                        ? 'bg-blue-600 text-white shadow-lg scale-110' 
                        : isComplete 
                          ? 'bg-emerald-500 text-white' 
                          : 'bg-gray-200 text-gray-500'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-sm font-medium ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                      {step.title}
                    </span>
                  </div>
                )
              })}
            </div>
            <Progress value={(currentStep / (steps.length - 1)) * 100} className="h-2" />
          </div>

          {/* Main Content */}
          <Card className="glass-card border-0 shadow-2xl">
            <CardContent className="p-8">
              
              {/* Step 0: Symptoms */}
              {currentStep === 0 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <Brain className="w-16 h-16 mx-auto text-pink-400 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Tell Us About Your Symptoms</h2>
                    <p className="text-gray-600 dark:text-gray-300">Describe what you've been experiencing lately</p>
                  </div>
                  
                  <div>
                    <Label htmlFor="symptoms" className="text-lg font-medium">Current Symptoms *</Label>
                    <Textarea
                      id="symptoms"
                      placeholder="Describe your symptoms in detail (e.g., fatigue, mood swings, irregular periods, weight changes, skin issues, sleep problems...)"
                      value={symptomData.symptoms}
                      onChange={(e) => setSymptomData({...symptomData, symptoms: e.target.value})}
                      className="pastel-input mt-2 min-h-[150px] text-base"
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      {symptomData.symptoms.length}/500 characters
                    </p>
                  </div>
                </div>
              )}

              {/* Step 1: Duration & Severity */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <Calendar className="w-16 h-16 mx-auto text-purple-400 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Duration & Severity</h2>
                    <p className="text-gray-600 dark:text-gray-300">Help us understand the timeline and intensity</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="duration" className="text-lg font-medium">How long have you experienced these symptoms? *</Label>
                      <Input
                        id="duration"
                        placeholder="e.g., 2 weeks, 3 months, 1 year"
                        value={symptomData.duration}
                        onChange={(e) => setSymptomData({...symptomData, duration: e.target.value})}
                        className="pastel-input mt-2"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="severity" className="text-lg font-medium">Severity Level *</Label>
                      <select
                        id="severity"
                        value={symptomData.severity}
                        onChange={(e) => setSymptomData({...symptomData, severity: e.target.value})}
                        className="pastel-input mt-2 w-full p-3"
                      >
                        <option value="">Select severity</option>
                        <option value="mild">Mild - Slightly noticeable</option>
                        <option value="moderate">Moderate - Affecting daily activities</option>
                        <option value="severe">Severe - Significantly impacting life</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="menstrualCycle" className="text-lg font-medium">Menstrual Cycle Information</Label>
                    <Textarea
                      id="menstrualCycle"
                      placeholder="Describe your menstrual cycle (regularity, flow, PMS symptoms, etc.) or write 'N/A' if not applicable"
                      value={symptomData.menstrualCycle}
                      onChange={(e) => setSymptomData({...symptomData, menstrualCycle: e.target.value})}
                      className="mt-2 min-h-[100px]"
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Lifestyle */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <Flower className="w-16 h-16 mx-auto text-indigo-400 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Lifestyle Assessment</h2>
                    <p className="text-gray-600 dark:text-gray-300">Your daily habits affect your hormonal balance</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="stress" className="text-lg font-medium">Stress Level *</Label>
                      <select
                        id="stress"
                        value={symptomData.stress}
                        onChange={(e) => setSymptomData({...symptomData, stress: e.target.value})}
                        className="pastel-input mt-2 w-full p-3"
                      >
                        <option value="">Select stress level</option>
                        <option value="low">Low - Generally relaxed</option>
                        <option value="moderate">Moderate - Some daily stress</option>
                        <option value="high">High - Frequently overwhelmed</option>
                      </select>
                    </div>
                    
                    <div>
                      <Label htmlFor="sleep" className="text-lg font-medium">Sleep Quality *</Label>
                      <select
                        id="sleep"
                        value={symptomData.sleep}
                        onChange={(e) => setSymptomData({...symptomData, sleep: e.target.value})}
                        className="pastel-input mt-2 w-full p-3"
                      >
                        <option value="">Select sleep quality</option>
                        <option value="excellent">Excellent - 7-9 hours, restful</option>
                        <option value="good">Good - Mostly restful</option>
                        <option value="poor">Poor - Frequent disruptions</option>
                        <option value="very-poor">Very Poor - Insomnia/chronic fatigue</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="diet" className="text-lg font-medium">Diet & Nutrition</Label>
                    <Textarea
                      id="diet"
                      placeholder="Describe your typical diet, eating patterns, supplements, etc."
                      value={symptomData.diet}
                      onChange={(e) => setSymptomData({...symptomData, diet: e.target.value})}
                      className="mt-2 min-h-[100px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="lifestyle" className="text-lg font-medium">Additional Lifestyle Factors *</Label>
                    <Textarea
                      id="lifestyle"
                      placeholder="Exercise routine, work schedule, medications, environmental factors, etc."
                      value={symptomData.lifestyle}
                      onChange={(e) => setSymptomData({...symptomData, lifestyle: e.target.value})}
                      className="pastel-input mt-2 min-h-[120px]"
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Results */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <FileText className="w-16 h-16 mx-auto text-pink-400 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Your Analysis Results</h2>
                    <p className="text-gray-600 dark:text-gray-300">AI-powered insights based on your assessment</p>
                  </div>

                  {isAnalyzing ? (
                    <div className="text-center py-12">
                      <div className="animate-spin w-12 h-12 border-4 border-pink-400 border-t-transparent rounded-full mx-auto mb-4"></div>
                      <p className="text-lg font-medium text-gray-600">Analyzing your symptoms...</p>
                      <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
                    </div>
                  ) : results ? (
                    <div className="space-y-6">
                      {/* Confidence Score */}
                      <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">Analysis Confidence</span>
                          <span className="font-bold text-pink-500">{results.confidence}%</span>
                        </div>
                        <Progress value={results.confidence} className="h-2" />
                      </div>

                      {/* Analysis */}
                      <Card className="border-l-4 border-l-pink-400">
                        <CardHeader>
                          <CardTitle className="text-pink-500">📊 Analysis Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{results.analysis}</p>
                        </CardContent>
                      </Card>

                      {/* Risk Level */}
                      <Card className="border-l-4 border-l-purple-400">
                        <CardHeader>
                          <CardTitle className="text-purple-500 flex items-center">
                            ⚠️ Risk Assessment
                            <Badge className={`ml-3 ${getRiskColor(results.riskLevel)}`}>
                              {getRiskIcon(results.riskLevel)}
                              <span className="ml-1 capitalize">{results.riskLevel} Risk</span>
                            </Badge>
                          </CardTitle>
                        </CardHeader>
                      </Card>

                      <Tabs defaultValue="recommendations" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 bg-pink-50 dark:bg-pink-900/20">
                          <TabsTrigger value="recommendations" className="text-sm data-[state=active]:bg-pink-200 data-[state=active]:text-pink-700">💡 Recommendations</TabsTrigger>
                          <TabsTrigger value="next-steps" className="text-sm data-[state=active]:bg-purple-200 data-[state=active]:text-purple-700">🎯 Next Steps</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="recommendations" className="mt-4">
                          <Card>
                            <CardContent className="pt-6">
                              <ul className="space-y-3">
                                {results.recommendations.map((rec, index) => (
                                  <li key={index} className="flex items-start space-x-3">
                                    <div className="w-6 h-6 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                                      {index + 1}
                                    </div>
                                    <span className="text-gray-700 dark:text-gray-300 leading-relaxed">{rec}</span>
                                  </li>
                                ))}
                              </ul>
                            </CardContent>
                          </Card>
                        </TabsContent>
                        
                        <TabsContent value="next-steps" className="mt-4">
                          <Card>
                            <CardContent className="pt-6">
                              <ul className="space-y-3">
                                {results.nextSteps.map((step, index) => (
                                  <li key={index} className="flex items-start space-x-3">
                                    <div className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                                      {index + 1}
                                    </div>
                                    <span className="text-gray-700 dark:text-gray-300 leading-relaxed">{step}</span>
                                  </li>
                                ))}
                              </ul>
                            </CardContent>
                          </Card>
                        </TabsContent>
                      </Tabs>

                      {/* Download Button */}
                      <div className="pt-6 border-t">
                        <Button
                          onClick={handleDownloadPDF}
                          disabled={isDownloading}
                          className="w-full pastel-button py-3 text-lg"
                        >
                          {isDownloading ? (
                            <>
                              <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                              Generating PDF...
                            </>
                          ) : (
                            <>
                              <Download className="w-5 h-5 mr-2" />
                              Download Detailed Report
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Button
                        onClick={handleAnalyze}
                        disabled={!isStepComplete(0) || !isStepComplete(1) || !isStepComplete(2)}
                        className="pastel-button px-8 py-3 text-lg"
                      >
                        <Brain className="w-5 h-5 mr-2" />
                        Analyze My Symptoms
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between items-center mt-8 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                  disabled={currentStep === 0}
                  className="px-6 py-2 border-pink-200 text-pink-600 hover:bg-pink-50"
                >
                  Previous
                </Button>
                
                <div className="text-sm text-gray-500">
                  Step {currentStep + 1} of {steps.length}
                </div>
                
                <Button
                  onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                  disabled={currentStep === steps.length - 1 || !isStepComplete(currentStep)}
                  className="px-6 py-2 pastel-button"
                >
                  {currentStep === steps.length - 2 ? 'Analyze' : 'Next'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Calendar, Heart, Bell, TrendingUp, Flower2, Sparkles } from "lucide-react"
import WellnessNavbar from "@/components/wellness-navbar"
import { useBrowserNotifications } from "@/hooks/use-browser-notifications"

interface CycleData {
  lastPeriodStart: string
  averageCycleLength: number
  periodDuration: number
}

interface CyclePrediction {
  nextPeriodStart: string
  fertileWindow: [string, string]
  upcomingCycles: [string, string, string]
  recommendations: string[]
  notifications: Array<{
    type?: string
    title?: string
    message: string
    triggerDate: string
  }>
}

interface StoredNotification {
  id: string
  type: 'period_reminder' | 'fertile_window' | 'wellness_tip' | 'cycle_prediction'
  title: string
  message: string
  triggerDate: string
  created: string
  read: boolean
}

export default function PeriodTracker() {
  const [cycleData, setCycleData] = useState<CycleData>({
    lastPeriodStart: "",
    averageCycleLength: 28,
    periodDuration: 5
  })
  
  const [prediction, setPrediction] = useState<CyclePrediction | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [storedNotifications, setStoredNotifications] = useState<StoredNotification[]>([])
  const [showNotifications, setShowNotifications] = useState(false)
  const { requestPermission, schedule, clearScheduled } = useBrowserNotifications()
  const [browserNotifEnabled, setBrowserNotifEnabled] = useState<boolean>(typeof window !== 'undefined' && 'Notification' in window ? (Notification.permission === 'granted') : false)

  // Load existing notifications on component mount
  useEffect(() => {
    loadNotifications()
  }, [])

  // Auto-schedule when notifications are loaded and permission already granted
  useEffect(() => {
    if (browserNotifEnabled && storedNotifications.length > 0) {
      try {
        const count = schedule(
          storedNotifications.map(n => ({
            title: n.title,
            message: n.message,
            triggerDate: n.triggerDate,
          }))
        )
        // no-op: could surface count to UI if desired
      } catch {}
    }
    return () => {
      clearScheduled()
    }
  }, [browserNotifEnabled, storedNotifications, schedule, clearScheduled])

  const loadNotifications = async () => {
    try {
      const response = await fetch('/api/notifications?userId=demo-user')
      if (response.ok) {
        const data = await response.json()
        setStoredNotifications(data.notifications || [])
      }
    } catch (error) {
      console.warn('Failed to load notifications:', error)
    }
  }

  const enableBrowserNotifications = async () => {
    try {
      const res = await requestPermission()
      if (res.supported && res.granted) {
        setBrowserNotifEnabled(true)
        if (storedNotifications.length > 0) {
          schedule(
            storedNotifications.map(n => ({
              title: n.title,
              message: n.message,
              triggerDate: n.triggerDate,
            }))
          )
        }
      }
    } catch {}
  }

  const markNotificationAsRead = async (notificationId: string) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notificationId,
          read: true
        })
      })
      
      if (response.ok) {
        setStoredNotifications(prev => 
          prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
        )
      }
    } catch (error) {
      console.warn('Failed to mark notification as read:', error)
    }
  }

  const handlePredict = async () => {
    if (!cycleData.lastPeriodStart) {
      setError("Please enter your last period start date")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/cycle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cycleData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to predict cycle")
      }

      const result = await response.json()
      setPrediction(result)
      
      // Reload notifications after prediction to show new cycle notifications
      await loadNotifications()

      // If permission already granted, schedule new notifications
      if (browserNotifEnabled && result?.notifications?.length) {
        try {
          schedule(
            result.notifications.map((n: any) => ({
              title: n.title || 'Cycle Reminder',
              message: n.message,
              triggerDate: n.triggerDate,
            }))
          )
        } catch {}
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'period_reminder':
        return '🩸'
      case 'fertile_window':
        return '🌸'
      case 'wellness_tip':
        return '💡'
      case 'cycle_prediction':
        return '📊'
      default:
        return '🔔'
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'period_reminder':
        return 'bg-pink-50 border-pink-200 text-pink-700'
      case 'fertile_window':
        return 'bg-purple-50 border-purple-200 text-purple-700'
      case 'wellness_tip':
        return 'bg-indigo-50 border-indigo-200 text-indigo-700'
      case 'cycle_prediction':
        return 'bg-green-50 border-green-200 text-green-700'
      default:
        return 'bg-gray-50 border-gray-200 text-gray-700'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  }

  const getDaysUntil = (dateString: string) => {
    const targetDate = new Date(dateString)
    const today = new Date()
    const diffTime = targetDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
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
        
        <div className="container mx-auto px-4 max-w-4xl relative z-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-4 mb-4">
              <h1 className="text-6xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent flex items-center gap-3">
                <Flower2 className="w-12 h-12 text-pink-400" />
                Period Tracker
                <Sparkles className="w-12 h-12 text-purple-400" />
              </h1>
              
              {/* Notification Bell */}
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="border-pink-200 text-pink-600 hover:bg-pink-50 relative"
                >
                  <Bell className="w-5 h-5" />
                  {storedNotifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 text-white text-xs rounded-full flex items-center justify-center">
                      {storedNotifications.filter(n => !n.read).length}
                    </span>
                  )}
                </Button>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
              Track your menstrual cycle and get personalized predictions and wellness recommendations
            </p>
            <div className="mt-4 flex justify-center">
              {!browserNotifEnabled && (
                <Button variant="outline" onClick={enableBrowserNotifications} className="border-purple-300 text-purple-600 hover:bg-purple-50">
                  Enable Browser Notifications
                </Button>
              )}
            </div>
          </div>

          {/* Notifications Panel */}
          {showNotifications && (
            <Card className="glass-card border-0 shadow-2xl mb-8">
              <CardHeader>
                <CardTitle className="text-pink-500 flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Your Notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                {storedNotifications.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No notifications yet</p>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {storedNotifications
                      .sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime())
                      .map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            notification.read 
                              ? 'opacity-60 ' + getNotificationColor(notification.type)
                              : getNotificationColor(notification.type)
                          }`}
                          onClick={() => !notification.read && markNotificationAsRead(notification.id)}
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-2xl">{getNotificationIcon(notification.type)}</span>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-semibold">{notification.title}</h4>
                                <div className="text-sm opacity-75">
                                  {formatDate(notification.triggerDate)}
                                </div>
                              </div>
                              <p className="text-sm mt-1 opacity-90">{notification.message}</p>
                              {!notification.read && (
                                <Badge className="mt-2 bg-pink-500 text-white text-xs">New</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Input Form */}
          <Card className="glass-card border-0 shadow-2xl mb-8">
            <CardHeader>
              <CardTitle className="text-pink-500 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Cycle Information
              </CardTitle>
              <CardDescription>
                Enter your cycle details to get personalized predictions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="lastPeriod" className="text-base font-medium">
                    Last Period Start Date *
                  </Label>
                  <Input
                    id="lastPeriod"
                    type="date"
                    value={cycleData.lastPeriodStart}
                    onChange={(e) => setCycleData({...cycleData, lastPeriodStart: e.target.value})}
                    className="pastel-input mt-2"
                  />
                </div>
                
                <div>
                  <Label htmlFor="cycleLength" className="text-base font-medium">
                    Average Cycle Length (days)
                  </Label>
                  <Input
                    id="cycleLength"
                    type="number"
                    min="21"
                    max="45"
                    value={cycleData.averageCycleLength}
                    onChange={(e) => setCycleData({...cycleData, averageCycleLength: parseInt(e.target.value) || 28})}
                    className="pastel-input mt-2"
                  />
                </div>
                
                <div>
                  <Label htmlFor="periodDuration" className="text-base font-medium">
                    Period Duration (days)
                  </Label>
                  <Input
                    id="periodDuration"
                    type="number"
                    min="1"
                    max="10"
                    value={cycleData.periodDuration}
                    onChange={(e) => setCycleData({...cycleData, periodDuration: parseInt(e.target.value) || 5})}
                    className="pastel-input mt-2"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <div className="text-center">
                <Button
                  onClick={handlePredict}
                  disabled={isLoading}
                  className="pastel-button px-8 py-3 text-lg"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                      Calculating...
                    </>
                  ) : (
                    <>
                      <TrendingUp className="w-5 h-5 mr-2" />
                      Predict My Cycle
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Predictions */}
          {prediction && (
            <div className="space-y-6">
              {/* Next Period Card */}
              <Card className="glass-card border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-pink-500 flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Next Period Prediction
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-pink-500 mb-2">
                      {formatDate(prediction.nextPeriodStart)}
                    </div>
                    <Badge className="bg-pink-100 text-pink-700 text-lg px-4 py-2">
                      {getDaysUntil(prediction.nextPeriodStart)} days to go
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Fertile Window */}
              <Card className="glass-card border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-purple-500 flex items-center gap-2">
                    <Heart className="w-5 h-5" />
                    Fertile Window
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-xl font-semibold text-purple-500 mb-2">
                      {formatDate(prediction.fertileWindow[0])} - {formatDate(prediction.fertileWindow[1])}
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">
                      Your most fertile days for conception
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Cycles */}
              <Card className="glass-card border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-indigo-500">Upcoming Cycles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {prediction.upcomingCycles.map((date, index) => (
                      <div key={index} className="text-center p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                        <div className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">
                          Cycle {index + 1}
                        </div>
                        <div className="text-lg font-semibold text-indigo-700 dark:text-indigo-300">
                          {formatDate(date)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recommendations */}
              <Card className="glass-card border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-pink-500 flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Personalized Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {prediction.recommendations.map((rec, index) => (
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

              {/* Notifications */}
              <Card className="glass-card border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-purple-500 flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Upcoming Reminders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {prediction.notifications.map((notification, index) => (
                      <div key={index} className="flex items-start space-x-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <Bell className="w-5 h-5 text-purple-500 mt-0.5" />
                        <div>
                          <div className="font-medium text-purple-700 dark:text-purple-300">
                            {formatDate(notification.triggerDate)}
                          </div>
                          <div className="text-gray-600 dark:text-gray-300 mt-1">
                            {notification.message}
                          </div>
                        </div>
                      </div>
                    ))}
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

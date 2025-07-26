"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Trophy, Target, Clock, Search } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from "recharts"
import WellnessNavbar from "@/components/wellness-navbar"
import { Progress } from "@/components/ui/progress"

const progressData = [
  { date: "Week 1", energy: 40, mood: 35, sleep: 50, stress: 80 },
  { date: "Week 2", energy: 45, mood: 42, sleep: 55, stress: 75 },
  { date: "Week 3", energy: 52, mood: 48, sleep: 62, stress: 68 },
  { date: "Week 4", energy: 58, mood: 55, sleep: 68, stress: 60 },
  { date: "Week 5", energy: 65, mood: 62, sleep: 72, stress: 55 },
  { date: "Week 6", energy: 70, mood: 68, sleep: 78, stress: 50 },
  { date: "Week 7", energy: 75, mood: 72, sleep: 82, stress: 45 },
  { date: "Week 8", energy: 80, mood: 78, sleep: 85, stress: 40 },
]

const currentWeekData = [
  { subject: "Energy", A: 80, fullMark: 100 },
  { subject: "Mood", A: 78, fullMark: 100 },
  { subject: "Sleep", A: 85, fullMark: 100 },
  { subject: "Stress", A: 40, fullMark: 100 },
  { subject: "Focus", A: 75, fullMark: 100 },
  { subject: "Motivation", A: 82, fullMark: 100 },
]

const achievements = [
  {
    title: "7-Day Streak",
    description: "Completed symptom tracking for 7 consecutive days",
    icon: "🔥",
    date: "2 days ago",
    color: "bg-orange-100 text-orange-800",
  },
  {
    title: "Stress Reducer",
    description: "Reduced stress levels by 50% over 8 weeks",
    icon: "🧘",
    date: "1 week ago",
    color: "bg-blue-100 text-blue-800",
  },
  {
    title: "Sleep Champion",
    description: "Improved sleep quality by 70%",
    icon: "😴",
    date: "3 days ago",
    color: "bg-purple-100 text-purple-800",
  },
  {
    title: "Energy Booster",
    description: "Doubled energy levels from baseline",
    icon: "⚡",
    date: "5 days ago",
    color: "bg-yellow-100 text-yellow-800",
  },
]

const goals = [
  {
    title: "Reduce Stress to 30%",
    current: 40,
    target: 30,
    progress: 75,
    color: "bg-red-500",
  },
  {
    title: "Increase Energy to 90%",
    current: 80,
    target: 90,
    progress: 89,
    color: "bg-green-500",
  },
  {
    title: "Maintain Sleep at 85%+",
    current: 85,
    target: 85,
    progress: 100,
    color: "bg-blue-500",
  },
  {
    title: "Improve Mood to 85%",
    current: 78,
    target: 85,
    progress: 92,
    color: "bg-purple-500",
  },
]

export default function ProgressPage() {
  return (
    <>
      <WellnessNavbar />
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-teal-900 dark:to-blue-900 pt-20 pb-8">
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

        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 text-center sm:text-left">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                  Progress Tracking
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-2">Monitor your hormonal health journey over time</p>
              </div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 mt-4 sm:mt-0">
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
              </motion.div>
            </div>

            {/* Progress Overview & Snapshot */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>8-Week Progress Trends</CardTitle>
                    <CardDescription>Track your improvement over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={progressData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="energy"
                          stroke="#10B981"
                          strokeWidth={2}
                          name="Energy"
                          activeDot={{ r: 8 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="mood"
                          stroke="#8B5CF6"
                          strokeWidth={2}
                          name="Mood"
                          activeDot={{ r: 8 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="sleep"
                          stroke="#3B82F6"
                          strokeWidth={2}
                          name="Sleep"
                          activeDot={{ r: 8 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="stress"
                          stroke="#EF4444"
                          strokeWidth={2}
                          name="Stress"
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Current Health Snapshot</CardTitle>
                    <CardDescription>Your current balance across key areas</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={currentWeekData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} />
                        <Radar
                          name="Current Score"
                          dataKey="A"
                          stroke="#8884d8"
                          fill="#8884d8"
                          fillOpacity={0.6}
                          animationDuration={1500}
                        />
                        <Tooltip />
                        <Legend />
                      </RadarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Goals & Achievements */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-0 shadow-lg h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Target className="w-5 h-5 mr-2 text-blue-500" />
                      Your Goals
                    </CardTitle>
                    <CardDescription>Track your progress towards your health objectives</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {goals.map((goal, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 + 0.4 }}
                        className="flex flex-col gap-2"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-700 dark:text-gray-200">{goal.title}</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {goal.current}% / {goal.target}%
                          </span>
                        </div>
                        <Progress value={goal.progress} className="h-2" indicatorColor={goal.color} />
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-0 shadow-lg h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
                      Achievements
                    </CardTitle>
                    <CardDescription>Milestones you've reached on your journey</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {achievements.map((achievement, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 + 0.5 }}
                        className={`flex items-center p-3 rounded-lg border ${achievement.color} dark:bg-gray-700/50 dark:border-gray-600`}
                      >
                        <div className="text-2xl mr-4">{achievement.icon}</div>
                        <div>
                          <h3 className="font-semibold text-gray-800 dark:text-white">{achievement.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{achievement.description}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {achievement.date}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Call to Action for Further Analysis */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-12 text-center"
            >
              <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-0 shadow-lg max-w-2xl mx-auto">
                <CardHeader>
                  <CardTitle className="text-xl">Need More Insights?</CardTitle>
                  <CardDescription>
                    Re-analyze your symptoms or explore new recommendations to continue improving.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                      <Search className="w-4 h-4 mr-2" />
                      Go to Symptom Analyzer
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  )
}

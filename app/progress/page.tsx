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
    color: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-200",
  },
  {
    title: "Stress Reducer",
    description: "Reduced stress levels by 50% over 8 weeks",
    icon: "🧘",
    date: "1 week ago",
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200",
  },
  {
    title: "Sleep Champion",
    description: "Improved sleep quality by 70%",
    icon: "😴",
    date: "3 days ago",
    color: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-200",
  },
  {
    title: "Energy Booster",
    description: "Doubled energy levels from baseline",
    icon: "⚡",
    date: "5 days ago",
    color: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-200",
  },
]

const goals = [
  {
    title: "Reduce Stress to 30%",
    current: 40,
    target: 30,
    progress: 75,
    color: "bg-gradient-to-r from-pink-400 to-pink-500",
  },
  {
    title: "Increase Energy to 90%",
    current: 80,
    target: 90,
    progress: 89,
    color: "bg-gradient-to-r from-purple-400 to-purple-500",
  },
  {
    title: "Maintain Sleep at 85%+",
    current: 85,
    target: 85,
    progress: 100,
    color: "bg-gradient-to-r from-indigo-400 to-indigo-500",
  },
  {
    title: "Improve Mood to 85%",
    current: 78,
    target: 85,
    progress: 92,
    color: "bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400",
  },
]

export default function ProgressPage() {
  return (
    <>
      <WellnessNavbar />
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-pink-900/20 dark:via-purple-900/20 dark:to-indigo-900/20 pt-20 pb-8 relative overflow-hidden">
        {/* Floating pastel shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-pink-200/30 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-purple-200/30 rounded-full blur-lg animate-bounce"></div>
          <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-indigo-200/20 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-pink-300/25 rounded-full blur-xl animate-bounce"></div>
          <div className="absolute top-1/3 left-1/2 w-36 h-36 bg-purple-300/20 rounded-full blur-2xl animate-pulse"></div>
        </div>

        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 text-center sm:text-left">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Progress Tracking
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-2">Monitor your hormonal health journey over time</p>
              </div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 text-white shadow-lg mt-4 sm:mt-0">
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
                          stroke="#F472B6"
                          strokeWidth={3}
                          name="Energy"
                          activeDot={{ r: 8, fill: '#F472B6' }}
                        />
                        <Line
                          type="monotone"
                          dataKey="mood"
                          stroke="#A855F7"
                          strokeWidth={3}
                          name="Mood"
                          activeDot={{ r: 8, fill: '#A855F7' }}
                        />
                        <Line
                          type="monotone"
                          dataKey="sleep"
                          stroke="#6366F1"
                          strokeWidth={3}
                          name="Sleep"
                          activeDot={{ r: 8, fill: '#6366F1' }}
                        />
                        <Line
                          type="monotone"
                          dataKey="stress"
                          stroke="#EC4899"
                          strokeWidth={3}
                          name="Stress"
                          activeDot={{ r: 8, fill: '#EC4899' }}
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
                          stroke="#A855F7"
                          fill="#F472B6"
                          fillOpacity={0.3}
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
                      <Target className="w-5 h-5 mr-2 text-purple-500" />
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
                        <Progress value={goal.progress} className="h-2" />
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
                      <Trophy className="w-5 h-5 mr-2 text-pink-500" />
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
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-purple-100/50 dark:border-pink-500/20 shadow-xl max-w-2xl mx-auto">
                <CardHeader>
                  <CardTitle className="text-xl">Need More Insights?</CardTitle>
                  <CardDescription>
                    Re-analyze your symptoms or explore new recommendations to continue improving.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 text-white shadow-lg">
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

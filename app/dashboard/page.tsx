"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Download, Heart, TrendingUp } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import WellnessNavbar from "@/components/wellness-navbar"

const healthData = [
  { month: "Jan", stress: 65, energy: 45, sleep: 70 },
  { month: "Feb", stress: 55, energy: 55, sleep: 75 },
  { month: "Mar", stress: 45, energy: 65, sleep: 80 },
  { month: "Apr", stress: 40, energy: 70, sleep: 85 },
  { month: "May", stress: 35, energy: 75, sleep: 88 },
  { month: "Jun", stress: 30, energy: 80, sleep: 90 },
]

const riskData = [
  { name: "Low Risk", value: 60, color: "#F472B6" },
  { name: "Medium Risk", value: 30, color: "#A855F7" },
  { name: "High Risk", value: 10, color: "#6366F1" },
]

export default function Dashboard() {
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

        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                  Health Dashboard
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-2">Track your hormonal health journey</p>
              </div>

              <Button
                className="pastel-button"
                onClick={async () => {
                  try {
                    const res = await fetch("/api/report/download", {
                      method: "GET",
                      credentials: "include",
                    });
                    if (!res.ok) {
                      alert("Failed to generate PDF report.");
                      return;
                    }
                    const blob = await res.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "health_report.pdf";
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    window.URL.revokeObjectURL(url);
                  } catch (err) {
                    alert("Network error while downloading PDF.");
                  }
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
            </div>

            {/* Health Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <Card className="glass-card border-0 shadow-lg">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Overall Health</CardTitle>
                    <Heart className="h-4 w-4 text-pink-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-pink-500">85%</div>
                    <div className="flex items-center mt-2">
                      <Progress value={85} className="flex-1" />
                      <Badge variant="secondary" className="ml-2 bg-pink-100 text-pink-700">
                        Good
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="glass-card border-0 shadow-lg">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Risk Level</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-purple-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-500">Low</div>
                    <div className="flex items-center mt-2">
                      <Progress value={25} className="flex-1" />
                      <Badge variant="secondary" className="ml-2 bg-purple-100 text-purple-700">
                        Monitor
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Card className="glass-card border-0 shadow-lg">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Improvement</CardTitle>
                    <TrendingUp className="h-4 w-4 text-indigo-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-indigo-500">+12%</div>
                    <div className="flex items-center mt-2">
                      <Progress value={70} className="flex-1" />
                      <Badge variant="secondary" className="ml-2 bg-indigo-100 text-indigo-700">
                        Rising
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <Card className="glass-card border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Health Trends</CardTitle>
                    <CardDescription>Your progress over the last 6 months</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={healthData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="stress" stroke="#F472B6" strokeWidth={2} name="Stress Level" />
                        <Line type="monotone" dataKey="energy" stroke="#A855F7" strokeWidth={2} name="Energy Level" />
                        <Line type="monotone" dataKey="sleep" stroke="#6366F1" strokeWidth={2} name="Sleep Quality" />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <Card className="glass-card border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Risk Distribution</CardTitle>
                    <CardDescription>Current health risk assessment</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={riskData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {riskData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex justify-center space-x-4 mt-4">
                      {riskData.map((item, index) => (
                        <div key={index} className="flex items-center">
                          <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }} />
                          <span className="text-sm">{item.name}</span>
                        </div>
                      ))}
                    </div>
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

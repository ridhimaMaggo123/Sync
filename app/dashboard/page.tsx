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
  { name: "Low Risk", value: 60, color: "#10B981" },
  { name: "Medium Risk", value: 30, color: "#F59E0B" },
  { name: "High Risk", value: 10, color: "#EF4444" },
]

export default function Dashboard() {
  return (
    <>
      <WellnessNavbar />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 pt-20 pb-8">
        {/* Background particles */}
        <div className="floating-particles">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 10 + 5}px`,
                animationDelay: `${Math.random() * 6}s`,
                animationDuration: `${Math.random() * 3 + 4}s`,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Health Dashboard
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-2">Track your hormonal health journey</p>
              </div>

              <Button
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
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
                <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Overall Health</CardTitle>
                    <Heart className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">85%</div>
                    <div className="flex items-center mt-2">
                      <Progress value={85} className="flex-1" />
                      <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800">
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
                <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Risk Level</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-yellow-600">Low</div>
                    <div className="flex items-center mt-2">
                      <Progress value={25} className="flex-1" />
                      <Badge variant="secondary" className="ml-2 bg-yellow-100 text-yellow-800">
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
                <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Improvement</CardTitle>
                    <TrendingUp className="h-4 w-4 text-blue-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">+12%</div>
                    <div className="flex items-center mt-2">
                      <Progress value={70} className="flex-1" />
                      <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-800">
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
                <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-0 shadow-lg">
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
                        <Line type="monotone" dataKey="stress" stroke="#EF4444" strokeWidth={2} name="Stress Level" />
                        <Line type="monotone" dataKey="energy" stroke="#10B981" strokeWidth={2} name="Energy Level" />
                        <Line type="monotone" dataKey="sleep" stroke="#3B82F6" strokeWidth={2} name="Sleep Quality" />
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
                <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-0 shadow-lg">
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

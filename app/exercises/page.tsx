"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Play, Clock, Target, Zap } from "lucide-react"
import WellnessNavbar from "@/components/wellness-navbar"

const exercises = [
  {
    id: 1,
    name: "Hormonal Balance Yoga Flow",
    type: "Yoga",
    duration: "20 min",
    difficulty: "Beginner",
    benefits: ["Reduces cortisol", "Improves circulation", "Balances hormones"],
    description:
      "A gentle yoga sequence designed to support hormonal balance through specific poses that stimulate the endocrine system.",
    poses: ["Child's Pose", "Cat-Cow", "Butterfly Pose", "Legs Up Wall", "Savasana"],
    color: "from-purple-400 to-pink-500",
  },
  {
    id: 2,
    name: "HIIT for Hormone Health",
    type: "Cardio",
    duration: "15 min",
    difficulty: "Intermediate",
    benefits: ["Boosts metabolism", "Improves insulin sensitivity", "Increases growth hormone"],
    description:
      "High-intensity interval training specifically designed to optimize hormonal response and metabolic health.",
    poses: ["Burpees", "Mountain Climbers", "Jump Squats", "High Knees", "Rest Intervals"],
    color: "from-red-400 to-orange-500",
  },
  {
    id: 3,
    name: "Stress-Relief Meditation",
    type: "Mindfulness",
    duration: "10 min",
    difficulty: "Beginner",
    benefits: ["Lowers cortisol", "Reduces anxiety", "Improves sleep"],
    description: "Guided meditation focused on reducing stress hormones and promoting relaxation.",
    poses: ["Breathing Exercise", "Body Scan", "Mindful Awareness", "Gratitude Practice", "Closing"],
    color: "from-blue-400 to-teal-500",
  },
  {
    id: 4,
    name: "Strength Training Circuit",
    type: "Strength",
    duration: "25 min",
    difficulty: "Intermediate",
    benefits: ["Increases testosterone", "Builds muscle", "Improves bone density"],
    description: "A circuit training routine that supports healthy hormone production through resistance exercises.",
    poses: ["Squats", "Push-ups", "Deadlifts", "Planks", "Lunges"],
    color: "from-green-400 to-blue-500",
  },
  {
    id: 5,
    name: "Restorative Evening Routine",
    type: "Restorative",
    duration: "30 min",
    difficulty: "Beginner",
    benefits: ["Promotes melatonin", "Reduces inflammation", "Improves recovery"],
    description: "A calming evening routine to prepare your body for restorative sleep and hormone recovery.",
    poses: ["Gentle Stretches", "Deep Breathing", "Progressive Relaxation", "Meditation", "Sleep Prep"],
    color: "from-indigo-400 to-purple-500",
  },
  {
    id: 6,
    name: "Core & Pelvic Floor",
    type: "Pilates",
    duration: "18 min",
    difficulty: "Beginner",
    benefits: ["Supports reproductive health", "Improves posture", "Strengthens core"],
    description: "Targeted exercises for core and pelvic floor strength, supporting reproductive and hormonal health.",
    poses: ["Pelvic Tilts", "Bridge Pose", "Dead Bug", "Bird Dog", "Modified Plank"],
    color: "from-pink-400 to-red-500",
  },
]

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "Beginner":
      return "bg-green-100 text-green-800 border-green-200"
    case "Intermediate":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "Advanced":
      return "bg-red-100 text-red-800 border-red-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

export default function Exercises() {
  return (
    <>
      <WellnessNavbar />
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-orange-900 dark:to-purple-900 pt-20 pb-8">
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
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-purple-600 bg-clip-text text-transparent mb-4">
                Exercise & Wellness
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
                Targeted exercises and practices to support your hormonal health
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {exercises.map((exercise, index) => (
                <motion.div
                  key={exercise.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="group"
                >
                  <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-0 shadow-lg h-full overflow-hidden">
                    <div className={`h-2 bg-gradient-to-r ${exercise.color}`} />

                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <Badge variant="outline" className="text-xs">
                          {exercise.type}
                        </Badge>
                        <Badge className={getDifficultyColor(exercise.difficulty)}>{exercise.difficulty}</Badge>
                      </div>

                      <CardTitle className="text-xl group-hover:text-purple-600 transition-colors">
                        {exercise.name}
                      </CardTitle>

                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {exercise.duration}
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <p className="text-gray-600 dark:text-gray-300 text-sm">{exercise.description}</p>

                      <div>
                        <h4 className="font-semibold text-sm mb-2 flex items-center">
                          <Target className="w-4 h-4 mr-1" />
                          Key Benefits
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {exercise.benefits.map((benefit, benefitIndex) => (
                            <Badge
                              key={benefitIndex}
                              variant="secondary"
                              className="text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                            >
                              {benefit}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-sm mb-2">Includes:</h4>
                        <div className="grid grid-cols-2 gap-1 text-xs text-gray-600 dark:text-gray-400">
                          {exercise.poses.slice(0, 4).map((pose, poseIndex) => (
                            <div key={poseIndex} className="flex items-center">
                              <span className="w-1 h-1 bg-purple-500 rounded-full mr-2" />
                              {pose}
                            </div>
                          ))}
                        </div>
                      </div>

                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                          <Play className="w-4 h-4 mr-2" />
                          Start Exercise
                        </Button>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="mt-12"
            >
              <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="w-5 h-5 mr-2 text-yellow-500" />
                    Exercise Tips for Hormonal Health
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Best Practices:</h4>
                      <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                        <li>• Exercise consistently, but avoid overtraining</li>
                        <li>• Include both cardio and strength training</li>
                        <li>• Listen to your body and adjust intensity</li>
                        <li>• Stay hydrated before, during, and after exercise</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Timing Matters:</h4>
                      <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                        <li>• Morning workouts can boost energy</li>
                        <li>• Evening yoga helps with sleep</li>
                        <li>• Sync with your menstrual cycle</li>
                        <li>• Allow rest days for recovery</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  )
}

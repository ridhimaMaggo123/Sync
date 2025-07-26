"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import WellnessNavbar from "@/components/wellness-navbar"
import { ExerciseCard } from "@/components/exercise-card"
import { ExerciseModal } from "@/components/exercise-modal"
import { Leaf, Heart, Zap, Sun, Waves, Sparkles, Moon } from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface Exercise {
  id: string
  name: string
  duration: string
  benefits: string[]
  instructions: string[]
  icon: LucideIcon
  color: string
  durationInSeconds: number
}

const exercises: Exercise[] = [
  {
    id: "yoga-hormone",
    name: "Yoga for Hormone Balance",
    duration: "20 min",
    benefits: ["Reduces cortisol", "Improves circulation", "Balances endocrine system"],
    instructions: [
      "Start with gentle warm-up stretches.",
      "Flow through Cat-Cow, Child's Pose, and Cobra Pose.",
      "Hold Butterfly Pose for 2 minutes.",
      "Finish with Legs Up the Wall for 5 minutes.",
      "Conclude with Savasana (Corpse Pose) for deep relaxation.",
    ],
    icon: Leaf,
    color: "from-green-400 to-blue-500",
    durationInSeconds: 20 * 60,
  },
  {
    id: "breathing-techniques",
    name: "Mindful Breathing",
    duration: "10 min",
    benefits: ["Calms nervous system", "Reduces stress", "Enhances focus"],
    instructions: [
      "Find a quiet, comfortable space to sit or lie down.",
      "Close your eyes gently and place one hand on your chest, one on your belly.",
      "Inhale slowly through your nose, feeling your belly rise.",
      "Exhale slowly through your mouth, feeling your belly fall.",
      "Continue for 10 minutes, focusing only on your breath.",
    ],
    icon: Waves,
    color: "from-blue-400 to-teal-500",
    durationInSeconds: 10 * 60,
  },
  {
    id: "low-impact-hiit",
    name: "Low-Impact HIIT",
    duration: "15 min",
    benefits: ["Boosts metabolism", "Improves insulin sensitivity", "Increases energy"],
    instructions: [
      "Warm-up with light cardio for 2 minutes.",
      "Perform 45 seconds of high knees (low impact), followed by 15 seconds rest.",
      "Perform 45 seconds of bodyweight squats, followed by 15 seconds rest.",
      "Perform 45 seconds of walking lunges, followed by 15 seconds rest.",
      "Repeat the circuit 3 times. Cool down for 2 minutes.",
    ],
    icon: Zap,
    color: "from-orange-400 to-red-500",
    durationInSeconds: 15 * 60,
  },
  {
    id: "restorative-stretch",
    name: "Restorative Stretching",
    duration: "15 min",
    benefits: ["Reduces muscle tension", "Improves flexibility", "Promotes relaxation"],
    instructions: [
      "Begin with gentle neck rolls and shoulder shrugs.",
      "Perform seated forward fold, holding for 30 seconds.",
      "Do a gentle supine twist on each side.",
      "Stretch hamstrings with a standing or seated hamstring stretch.",
      "Finish with a full body stretch, focusing on deep breaths.",
    ],
    icon: Heart,
    color: "from-pink-400 to-purple-500",
    durationInSeconds: 15 * 60,
  },
  {
    id: "morning-sun-salutation",
    name: "Morning Sun Salutation",
    duration: "10 min",
    benefits: ["Energizes body", "Improves mood", "Boosts vitamin D absorption"],
    instructions: [
      "Start standing at the top of your mat, hands at heart center.",
      "Inhale, sweep arms up; exhale, fold forward.",
      "Inhale, lift halfway; exhale, step back to plank.",
      "Lower to Chaturanga, then Cobra/Upward Dog.",
      "Exhale to Downward-Facing Dog. Step forward, lift halfway, fold.",
      "Inhale, rise to stand. Repeat 3-5 times.",
    ],
    icon: Sun,
    color: "from-yellow-400 to-orange-500",
    durationInSeconds: 10 * 60,
  },
  {
    id: "evening-moon-flow",
    name: "Evening Moon Flow",
    duration: "12 min",
    benefits: ["Calms mind", "Prepares for sleep", "Gentle unwinding"],
    instructions: [
      "Begin in a comfortable seated position, focusing on slow breaths.",
      "Move into a gentle seated side bend, then a seated twist.",
      "Transition to Cat-Cow, then Child's Pose.",
      "Perform a gentle supine spinal twist on each side.",
      "End with Legs Up the Wall or a supported bridge pose for relaxation.",
    ],
    icon: Moon,
    color: "from-indigo-400 to-purple-500",
    durationInSeconds: 12 * 60,
  },
]

export default function ExercisePlansPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null)

  const handleCardClick = (exercise: Exercise) => {
    setSelectedExercise(exercise)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedExercise(null)
  }

  return (
    <>
      <WellnessNavbar />
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-emerald-900 dark:to-blue-900 pt-20 pb-8">
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
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-purple-600 bg-clip-text text-transparent mb-4">
                Exercise Plans
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
                Personalized movement and mindfulness practices for hormonal well-being.
                <Sparkles className="inline w-5 h-5 text-yellow-500 ml-2" />
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {exercises.map((exercise, index) => (
                <motion.div
                  key={exercise.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <ExerciseCard exercise={exercise} onClick={() => handleCardClick(exercise)} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <ExerciseModal isOpen={isModalOpen} onClose={handleCloseModal} exercise={selectedExercise} />
    </>
  )
}

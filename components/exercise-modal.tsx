"use client"

import React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ExerciseTimer } from "./exercise-timer"
import { ArrowRight, Play } from "lucide-react"
import { useRouter } from "next/navigation"

interface ExerciseModalProps {
  isOpen: boolean
  onClose: () => void
  exercise: {
    id: string
    name: string
    duration: string
    benefits: string[]
    instructions: string[]
    durationInSeconds: number
  } | null
}

export function ExerciseModal({ isOpen, onClose, exercise }: ExerciseModalProps) {
  const [showTimer, setShowTimer] = useState(false)
  const router = useRouter()

  const handleStartExercise = () => {
    setShowTimer(true)
  }

  const handleTimerComplete = () => {
    // Logic after timer completes, e.g., show a "Great Job!" message
  }

  const handleReturnToDashboard = () => {
    onClose()
    setShowTimer(false)
    router.push("/dashboard")
  }

  const handleStartAnotherExercise = () => {
    setShowTimer(false) // Go back to instructions view for a new exercise
    // The parent component should handle resetting the selected exercise if needed
  }

  // Reset modal state when it closes or a new exercise is selected
  React.useEffect(() => {
    if (!isOpen) {
      setShowTimer(false)
    }
  }, [isOpen])

  if (!exercise) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-0 shadow-2xl">
        <AnimatePresence mode="wait">
          {!showTimer ? (
            <motion.div
              key="instructions"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5 }}
              className="p-6"
            >
              <DialogHeader className="mb-6">
                <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                  {exercise.name}
                </DialogTitle>
                <DialogDescription className="text-gray-600 dark:text-gray-300">
                  Duration: {exercise.duration}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 mb-8">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Benefits:</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                  {exercise.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>

                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Instructions:</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  {exercise.instructions.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={handleStartExercise}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 text-lg rounded-lg shadow-lg"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start Exercise
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
            </motion.div>
          ) : (
            <ExerciseTimer
              key="timer"
              durationInSeconds={exercise.durationInSeconds}
              onTimerComplete={handleTimerComplete}
              onReturnToDashboard={handleReturnToDashboard}
              onStartAnotherExercise={handleStartAnotherExercise}
            />
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}

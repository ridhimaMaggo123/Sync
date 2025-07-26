"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Play, Pause, RotateCcw, CheckCircle } from "lucide-react"
import { useCountdownTimer } from "@/hooks/use-countdown-timer"
import { useEffect, useState } from "react"

interface ExerciseTimerProps {
  durationInSeconds: number
  onTimerComplete: () => void
  onReturnToDashboard: () => void
  onStartAnotherExercise: () => void
}

export function ExerciseTimer({
  durationInSeconds,
  onTimerComplete,
  onReturnToDashboard,
  onStartAnotherExercise,
}: ExerciseTimerProps) {
  const { timeLeft, isRunning, start, pause, reset, formatTime, progress, message } = useCountdownTimer({
    durationInSeconds,
    onComplete: onTimerComplete,
  })

  const circumference = 2 * Math.PI * 90 // For a radius of 90

  // State to control the celebration animation
  const [showCelebration, setShowCelebration] = useState(false)

  useEffect(() => {
    if (timeLeft === 0 && !isRunning) {
      setShowCelebration(true)
    } else {
      setShowCelebration(false)
    }
  }, [timeLeft, isRunning])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center p-6 text-center"
    >
      <div className="relative w-48 h-48 mb-8">
        <svg className="w-full h-full" viewBox="0 0 200 200">
          {/* Background circle */}
          <circle
            className="text-gray-200 dark:text-gray-700"
            strokeWidth="10"
            stroke="currentColor"
            fill="transparent"
            r="90"
            cx="100"
            cy="100"
          />
          {/* Progress circle */}
          <motion.circle
            className="text-purple-500"
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - (progress / 100) * circumference}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="90"
            cx="100"
            cy="100"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - (progress / 100) * circumference }}
            transition={{ duration: 1, ease: "linear" }}
            style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
          />
        </svg>
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={showCelebration ? { scale: [1, 1.1, 1], opacity: [1, 0.7, 1] } : {}}
          transition={showCelebration ? { duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" } : {}}
        >
          <span className="text-5xl font-bold text-gray-800 dark:text-white tabular-nums">{formatTime(timeLeft)}</span>
        </motion.div>
      </div>

      {message && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-semibold text-green-600 dark:text-green-400 mb-6 flex items-center"
        >
          <CheckCircle className="w-6 h-6 mr-2" />
          {message}
        </motion.div>
      )}

      <div className="flex space-x-4">
        {timeLeft > 0 && (
          <>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={isRunning ? pause : start}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                <span className="ml-2">{isRunning ? "Pause" : "Start"}</span>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button onClick={reset} variant="outline">
                <RotateCcw className="w-5 h-5" />
                <span className="ml-2">Reset</span>
              </Button>
            </motion.div>
          </>
        )}
        {timeLeft === 0 && (
          <>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={onStartAnotherExercise}
                className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white"
              >
                Start Another Exercise
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button onClick={onReturnToDashboard} variant="outline">
                Return to Dashboard
              </Button>
            </motion.div>
          </>
        )}
      </div>
    </motion.div>
  )
}

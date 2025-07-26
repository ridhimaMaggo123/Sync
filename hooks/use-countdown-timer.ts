"use client"

import { useState, useEffect, useRef, useCallback } from "react"

interface UseCountdownTimerOptions {
  durationInSeconds: number
  onComplete?: () => void
}

export function useCountdownTimer({ durationInSeconds, onComplete }: UseCountdownTimerOptions) {
  const [timeLeft, setTimeLeft] = useState(durationInSeconds)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const start = useCallback(() => {
    if (!isRunning && timeLeft > 0) {
      setIsRunning(true)
      intervalRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            // Use <= 1 to ensure it hits 0 and then clears
            clearInterval(intervalRef.current!)
            setIsRunning(false)
            onComplete?.()
            return 0
          }
          return prevTime - 1
        })
      }, 1000)
    }
  }, [isRunning, timeLeft, onComplete])

  const pause = useCallback(() => {
    if (isRunning && intervalRef.current) {
      clearInterval(intervalRef.current)
      setIsRunning(false)
    }
  }, [isRunning])

  const reset = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    setTimeLeft(durationInSeconds)
    setIsRunning(false)
    setMessage(null) // Clear any completion message on reset
  }, [durationInSeconds])

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  const progress = (timeLeft / durationInSeconds) * 100
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    if (timeLeft === 0 && !isRunning) {
      setMessage("Great Job! Exercise Complete!")
    } else {
      setMessage(null)
    }
  }, [timeLeft, isRunning])

  return { timeLeft, isRunning, start, pause, reset, formatTime, progress, message }
}

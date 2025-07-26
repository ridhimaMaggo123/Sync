"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface SplashScreenProps {
  onComplete: () => void
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [showTagline, setShowTagline] = useState(false)

  useEffect(() => {
    const timer1 = setTimeout(() => setShowTagline(true), 1000)
    const timer2 = setTimeout(() => onComplete(), 3500)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [onComplete])

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-purple-400 via-pink-500 to-red-500"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <div className="text-center">
        {/* Hormone Molecule Animation */}
        <div className="relative mb-8">
          <motion.div
            className="w-32 h-32 mx-auto rounded-full bg-white/20 backdrop-blur-sm"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 360],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            {/* Central molecule */}
            <motion.div
              className="absolute top-1/2 left-1/2 w-6 h-6 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2"
              animate={{
                boxShadow: [
                  "0 0 20px rgba(255,255,255,0.5)",
                  "0 0 40px rgba(255,255,255,0.8)",
                  "0 0 20px rgba(255,255,255,0.5)",
                ],
              }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            />

            {/* Orbiting particles */}
            {[0, 60, 120, 180, 240, 300].map((angle, index) => (
              <motion.div
                key={index}
                className="absolute w-3 h-3 bg-white/70 rounded-full"
                style={{
                  top: "50%",
                  left: "50%",
                  transformOrigin: "0 0",
                }}
                animate={{
                  rotate: [angle, angle + 360],
                  x: [40, 40],
                  y: [0, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                  delay: index * 0.2,
                }}
              />
            ))}
          </motion.div>
        </div>

        {/* App Title */}
        <motion.h1
          className="text-6xl font-bold text-white mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          Sync
        </motion.h1>

        {/* Tagline */}
        {showTagline && (
          <motion.p
            className="text-xl text-white/90"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Understand, Balance, Thrive
          </motion.p>
        )}
      </div>
    </motion.div>
  )
}

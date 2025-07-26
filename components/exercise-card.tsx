"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock } from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface ExerciseCardProps {
  exercise: {
    id: string
    name: string
    duration: string
    benefits: string[]
    icon: LucideIcon
    color: string
  }
  onClick: () => void
}

export function ExerciseCard({ exercise, onClick }: ExerciseCardProps) {
  const Icon = exercise.icon

  return (
    <motion.div
      className="group cursor-pointer h-full"
      whileHover={{ scale: 1.03, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg h-full overflow-hidden relative">
        {/* Animated background glow on hover */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${exercise.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
        />

        <CardHeader className="relative z-10 pb-4">
          <motion.div
            className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${exercise.color} flex items-center justify-center shadow-md`}
            initial={{ rotate: 0 }}
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <Icon className="w-8 h-8 text-white" />
          </motion.div>
          <CardTitle className="text-xl text-center group-hover:text-purple-600 transition-colors">
            {exercise.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10 text-center">
          <div className="flex items-center justify-center text-sm text-gray-600 dark:text-gray-300 mb-4">
            <Clock className="w-4 h-4 mr-1" />
            {exercise.duration}
          </div>
          <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
            {exercise.benefits.map((benefit, index) => (
              <li key={index} className="flex items-center justify-center">
                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2" />
                {benefit}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  )
}

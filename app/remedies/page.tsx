"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Leaf, Coffee, Pill, Heart } from "lucide-react"
import WellnessNavbar from "@/components/wellness-navbar"

const remedies = [
  {
    id: 1,
    name: "Chamomile Tea",
    category: "Herbal Tea",
    icon: Coffee,
    description: "Natural calming properties for stress relief",
    benefits: [
      "Reduces cortisol levels",
      "Improves sleep quality",
      "Anti-inflammatory properties",
      "Supports digestive health",
    ],
    usage: "Drink 1-2 cups daily, preferably before bedtime",
    color: "from-green-400 to-blue-500",
  },
  {
    id: 2,
    name: "Ashwagandha",
    category: "Adaptogen",
    icon: Pill,
    description: "Powerful adaptogen for hormonal balance",
    benefits: [
      "Balances cortisol levels",
      "Supports thyroid function",
      "Reduces anxiety and stress",
      "Improves energy levels",
    ],
    usage: "300-500mg daily with meals",
    color: "from-purple-400 to-pink-500",
  },
  {
    id: 3,
    name: "Evening Primrose Oil",
    category: "Supplement",
    icon: Leaf,
    description: "Rich in GLA for hormonal support",
    benefits: [
      "Supports menstrual health",
      "Reduces PMS symptoms",
      "Improves skin health",
      "Anti-inflammatory effects",
    ],
    usage: "1000-1300mg daily with food",
    color: "from-yellow-400 to-orange-500",
  },
  {
    id: 4,
    name: "Maca Root",
    category: "Superfood",
    icon: Heart,
    description: "Peruvian superfood for energy and balance",
    benefits: [
      "Balances hormones naturally",
      "Increases energy and stamina",
      "Supports mood stability",
      "Rich in vitamins and minerals",
    ],
    usage: "1-3 teaspoons daily in smoothies or food",
    color: "from-red-400 to-purple-500",
  },
  {
    id: 5,
    name: "Spearmint Tea",
    category: "Herbal Tea",
    icon: Coffee,
    description: "Natural anti-androgen properties",
    benefits: [
      "Reduces excess androgens",
      "Helps with PCOS symptoms",
      "Improves insulin sensitivity",
      "Refreshing and calming",
    ],
    usage: "2 cups daily between meals",
    color: "from-teal-400 to-green-500",
  },
  {
    id: 6,
    name: "Magnesium Glycinate",
    category: "Mineral",
    icon: Pill,
    description: "Essential mineral for hormonal health",
    benefits: ["Supports nervous system", "Improves sleep quality", "Reduces muscle tension", "Supports bone health"],
    usage: "200-400mg before bedtime",
    color: "from-indigo-400 to-blue-500",
  },
]

export default function Remedies() {
  return (
    <>
      <WellnessNavbar />
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-green-900 dark:to-blue-900 pt-20 pb-8">
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
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
                Natural Remedies
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
                Discover natural solutions to support your hormonal health journey
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {remedies.map((remedy, index) => {
                const Icon = remedy.icon

                return (
                  <motion.div
                    key={remedy.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="flip-card h-80"
                  >
                    <div className="flip-card-inner">
                      {/* Front of card */}
                      <div className={`flip-card-front bg-gradient-to-br ${remedy.color} p-6 text-white shadow-lg`}>
                        <div className="flex flex-col h-full">
                          <div className="flex items-center justify-between mb-4">
                            <Icon className="w-8 h-8" />
                            <Badge variant="secondary" className="bg-white/20 text-white border-0">
                              {remedy.category}
                            </Badge>
                          </div>

                          <div className="flex-1">
                            <h3 className="text-xl font-bold mb-3">{remedy.name}</h3>
                            <p className="text-white/90 text-sm leading-relaxed">{remedy.description}</p>
                          </div>

                          <div className="text-center text-white/80 text-xs">Hover for benefits</div>
                        </div>
                      </div>

                      {/* Back of card */}
                      <div className="flip-card-back bg-white dark:bg-gray-800 p-6 shadow-lg">
                        <div className="h-full flex flex-col">
                          <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">Benefits & Usage</h3>

                          <div className="flex-1">
                            <h4 className="font-semibold text-sm mb-2 text-gray-700 dark:text-gray-300">
                              Key Benefits:
                            </h4>
                            <ul className="space-y-1 mb-4">
                              {remedy.benefits.map((benefit, benefitIndex) => (
                                <li
                                  key={benefitIndex}
                                  className="text-xs text-gray-600 dark:text-gray-400 flex items-start"
                                >
                                  <span className="w-1 h-1 bg-green-500 rounded-full mt-1.5 mr-2 flex-shrink-0" />
                                  {benefit}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="border-t pt-3">
                            <h4 className="font-semibold text-sm mb-1 text-gray-700 dark:text-gray-300">Usage:</h4>
                            <p className="text-xs text-gray-600 dark:text-gray-400">{remedy.usage}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="mt-12 text-center"
            >
              <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-0 shadow-lg max-w-2xl mx-auto">
                <CardHeader>
                  <CardTitle className="text-xl">Important Note</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    These natural remedies are for informational purposes only. Always consult with a healthcare
                    professional before starting any new supplement regimen, especially if you have existing health
                    conditions or are taking medications.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  )
}

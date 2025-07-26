"use client"

import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Activity,
  BarChart3,
  Leaf,
  Moon,
  Search,
  Sun,
  TrendingUp,
  Menu,
  X,
  LogIn,
  UserPlus,
  Waves,
  Mail,
} from "lucide-react" // Added Mail icon
import { Button } from "@/components/ui/button"
import { useState } from "react"

const navItems = [
  { href: "/symptom-analyzer", label: "Analyzer", icon: Search },
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/remedies", label: "Remedies", icon: Leaf },
  { href: "/exercises", label: "Exercises", icon: Activity },
  { href: "/progress", label: "Progress", icon: TrendingUp },
  { href: "/contact", label: "Contact", icon: Mail }, // Added Contact link
]

export default function WellnessNavbar() {
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-purple-100/50 dark:border-purple-800/50"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/">
              <motion.div
                className="flex items-center space-x-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="relative">
                  {/* Sync Wave Logo */}
                  <motion.div
                    className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 flex items-center justify-center"
                    animate={{
                      boxShadow: [
                        "0 0 20px rgba(147, 51, 234, 0.3)",
                        "0 0 30px rgba(147, 51, 234, 0.5)",
                        "0 0 20px rgba(147, 51, 234, 0.3)",
                      ],
                    }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  >
                    <Waves className="w-6 h-6 text-white" />
                  </motion.div>

                  {/* Orbiting particles */}
                  <motion.div
                    className="absolute top-0 left-0 w-2 h-2 bg-purple-400 rounded-full"
                    animate={{
                      rotate: [0, 360],
                      x: [20, 20],
                      y: [0, 0],
                    }}
                    transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  />
                  <motion.div
                    className="absolute top-0 left-0 w-1.5 h-1.5 bg-pink-400 rounded-full"
                    animate={{
                      rotate: [120, 480],
                      x: [15, 15],
                      y: [0, 0],
                    }}
                    transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  />
                </div>
                <div>
                  <span className="font-bold text-2xl bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent">
                    Sync
                  </span>
                  <div className="text-xs text-gray-500 dark:text-gray-400 -mt-1">Hormonal Health</div>
                </div>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item, index) => {
                const Icon = item.icon
                const isActive = pathname === item.href

                return (
                  <Link key={item.href} href={item.href}>
                    <motion.div
                      className={`relative px-4 py-2 rounded-full transition-all duration-300 ${
                        isActive
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                          : "text-gray-600 dark:text-gray-300 hover:text-purple-500 hover:bg-purple-50/50 dark:hover:bg-purple-900/20"
                      }`}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <div className="flex items-center space-x-2">
                        <Icon className="w-4 h-4" />
                        <span className="font-medium text-sm">{item.label}</span>
                      </div>
                      {isActive && (
                        <motion.div
                          className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"
                          layoutId="activeIndicator"
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </motion.div>
                  </Link>
                )
              })}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-3">
              {/* Theme Toggle */}
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="rounded-full p-2 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                >
                  <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: theme === "dark" ? 180 : 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    {theme === "dark" ? (
                      <Sun className="w-4 h-4 text-yellow-500" />
                    ) : (
                      <Moon className="w-4 h-4 text-purple-500" />
                    )}
                  </motion.div>
                </Button>
              </motion.div>

              {/* Sign In Button */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Link href="/signin">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hidden sm:flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-purple-500 hover:bg-purple-50/50 dark:hover:bg-purple-900/20 rounded-full px-4"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Sign In</span>
                  </Button>
                </Link>
              </motion.div>

              {/* Register Button */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Link href="/register">
                  <Button
                    size="sm"
                    className="hidden sm:flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full px-4 shadow-lg"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Register</span>
                  </Button>
                </Link>
              </motion.div>

              {/* Mobile Menu Button */}
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden rounded-full p-2"
                >
                  <motion.div animate={{ rotate: isMobileMenuOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                    {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  </motion.div>
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <motion.div
        className={`fixed top-16 left-0 right-0 z-40 lg:hidden ${isMobileMenuOpen ? "block" : "hidden"}`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: isMobileMenuOpen ? 1 : 0, y: isMobileMenuOpen ? 0 : -20 }}
        transition={{ duration: 0.3 }}
      >
        <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-purple-100/50 dark:border-purple-800/50">
          <div className="container mx-auto px-4 py-6">
            <div className="space-y-4">
              {navItems.map((item, index) => {
                const Icon = item.icon
                const isActive = pathname === item.href

                return (
                  <Link key={item.href} href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                    <motion.div
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                        isActive
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                          : "text-gray-600 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                      }`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </motion.div>
                  </Link>
                )
              })}

              {/* Mobile Auth Buttons */}
              <div className="pt-4 border-t border-purple-100/50 dark:border-purple-800/50 space-y-3">
                <Link href="/signin" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-600 dark:text-gray-300 hover:text-purple-500 hover:bg-purple-50/50 dark:hover:bg-purple-900/20"
                  >
                    <LogIn className="w-4 h-4 mr-3" />
                    Sign In
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full justify-start bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                    <UserPlus className="w-4 h-4 mr-3" />
                    Register
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  )
}

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { UserPlus, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name")?.toString() || "";
    const email = formData.get("email")?.toString() || "";
    const password = formData.get("password")?.toString() || "";
    const confirmPassword = formData.get("confirmPassword")?.toString() || "";

    if (password !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match." });
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: "success", text: data.message || "Registered successfully!" });
        e.currentTarget.reset();
      } else {
        setMessage({ type: "error", text: data.message || "Registration failed." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Network error. Please try again." });
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="w-full max-w-md px-4"
      >
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-0 shadow-2xl">
          <CardHeader className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.4 }}
              className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 flex items-center justify-center shadow-lg"
            >
              <UserPlus className="w-8 h-8 text-white" />
            </motion.div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              Join Sync Today!
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              Create your account to unlock personalized hormonal health insights.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input name="name" type="text" placeholder="Name" required className="mt-1" />
              <Input name="email" type="email" placeholder="Email" required className="mt-1" />
              <Input name="password" type="password" placeholder="Password" required className="mt-1" />
              <Input name="confirmPassword" type="password" placeholder="Confirm Password" required className="mt-1" />
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 text-lg rounded-lg shadow-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Registering...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5 mr-2" />
                    Register
                  </>
                )}
              </Button>
            </form>
            {message && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-4 text-center text-sm ${
                  message.type === "success" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                }`}
              >
                {message.text}
              </motion.div>
            )}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="mt-6 text-center text-sm text-gray-600 dark:text-gray-300"
            >
              Already have an account?{" "}
              <Link href="/signin" className="text-purple-600 hover:underline dark:text-purple-400">
                Sign In
              </Link>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

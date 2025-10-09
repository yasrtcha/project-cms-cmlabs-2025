"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/contexts/theme-context"

interface AuthLayoutProps {
  children: React.ReactNode
  imagePosition?: "left" | "right"
}

export function AuthLayout({ children, imagePosition = "right" }: AuthLayoutProps) {
  const { theme, toggleTheme } = useTheme()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <div className="flex min-h-screen">
      {/* Image Left (for Sign Up) */}
      {imagePosition === "left" && (
        <div className="hidden lg:flex flex-1 relative bg-gradient-to-br from-blue-900 to-blue-600 dark:from-gray-800 dark:to-gray-900">
          <Image
            src="/assets/auth.png"
            alt="Authentication"
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Form Section */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white dark:bg-gray-900 transition-colors">
        <div className="w-full max-w-md">
          {/* Theme Toggle */}
          <div className="flex justify-end mb-8">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {isMounted && theme === "dark" ? (
                <Sun className="h-5 w-5 text-gray-400" />
              ) : (
                <Moon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              )}
            </button>
          </div>
          {children}
        </div>
      </div>

      {/* Image Right (for Login, Forgot Password, etc) */}
      {imagePosition === "right" && (
        <div className="hidden lg:flex flex-1 relative bg-gradient-to-br from-blue-900 to-blue-600">
          <Image
            src="/assets/auth.png"
            alt="Authentication"
            fill
            className="object-cover"
            priority
          />
        </div>
      )}
    </div>
  )
}

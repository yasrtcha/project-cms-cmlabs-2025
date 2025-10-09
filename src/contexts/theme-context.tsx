"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark"

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light")
  const [mounted, setMounted] = useState(false)

  // Load theme from localStorage on mount
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("theme") as Theme | null
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      
      const initialTheme = savedTheme || (prefersDark ? "dark" : "light")
      setThemeState(initialTheme)
      applyTheme(initialTheme)
    } catch (error) {
      console.error("Error loading theme:", error)
    } finally {
      setMounted(true)
    }
  }, [])

  const applyTheme = (newTheme: Theme) => {
    try {
      const root = document.documentElement
      if (newTheme === "dark") {
        root.classList.add("dark")
      } else {
        root.classList.remove("dark")
      }
    } catch (error) {
      console.error("Error applying theme:", error)
    }
  }

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    try {
      localStorage.setItem("theme", newTheme)
    } catch (error) {
      console.error("Error saving theme:", error)
    }
    applyTheme(newTheme)
  }

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    // Return default values instead of throwing error during SSR
    if (typeof window === "undefined") {
      return {
        theme: "light" as Theme,
        toggleTheme: () => {},
        setTheme: () => {},
      }
    }
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

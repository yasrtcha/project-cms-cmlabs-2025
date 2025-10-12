"use client"

import { useState, useRef, useEffect, memo } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Moon, Sun, Zap, Filter, User, Settings, LogOut, ChevronDown } from "lucide-react"
import { useTheme } from "@/contexts/theme-context"

function HeaderComponent() {
  const { data: session } = useSession()
  const router = useRouter()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/auth/login" })
  }

  const handleProfileClick = () => {
    setIsDropdownOpen(false)
    router.push("/dashboard/profile")
  }

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="bg-[#3A7AC3] dark:bg-slate-800 px-6 py-3 flex items-center justify-between border-b border-blue-600 dark:border-slate-700 transition-colors">
      {/* Left side - Page title */}
      <div className="flex items-center">
        <h1 className="text-lg font-medium text-white dark:text-slate-100">Pages / Dashboard</h1>
      </div>

      {/* Right side - Actions and user profile */}
      <div className="flex items-center space-x-4">
        {/* Action buttons */}
        <Button variant="outline" size="sm" className="flex items-center space-x-2 text-black dark:text-gray-300">
          <Filter className="h-4 w-4" />
          <span>Filter</span>
        </Button>

        <Button variant="outline" size="sm" className="flex items-center space-x-2 text-black dark:text-gray-300">
          <Zap className="h-4 w-4" />
          <span>Quick Action</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={toggleTheme}
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-300"
        >
          {isMounted && theme === "dark" ? (
            <><Sun className="h-4 w-4" /><span>Light Mode</span></>
          ) : (
            <><Moon className="h-4 w-4" /><span>Dark Mode</span></>
          )}
        </Button>

        {/* User profile with dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-3 ml-6 hover:opacity-90 transition-opacity"
          >
            <div className="text-right">
              <p className="text-xs text-white/80">Welcome Back</p>
              <p className="text-sm font-medium text-white">{session?.user?.name || "User"}</p>
            </div>
            <Avatar className="h-8 w-8">
              <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || "User"} />
              <AvatarFallback className="bg-white text-[#3A7AC3] text-xs font-semibold">
                {getInitials(session?.user?.name)}
              </AvatarFallback>
            </Avatar>
            <ChevronDown className={`h-4 w-4 text-white transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 py-1 z-50">
              <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-700">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{session?.user?.name || "User"}</p>
                <p className="text-xs text-gray-500 dark:text-slate-400 truncate">{session?.user?.email || ""}</p>
              </div>

              <button
                onClick={handleProfileClick}
                className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
              >
                <User className="h-4 w-4" />
                <span>My Profile</span>
              </button>

             

              <div className="border-t border-gray-100 dark:border-slate-700 mt-1 pt-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Memoize to prevent unnecessary re-renders
export const Header = memo(HeaderComponent)

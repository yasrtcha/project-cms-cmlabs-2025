"use client"

import { useState, useRef, useEffect, memo } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter, usePathname } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Moon, Sun, Search, Bell, User, Settings, LogOut, ChevronDown, CreditCard } from "lucide-react"
import { useTheme } from "@/contexts/theme-context"

function getTitleFromPath(pathname: string) {
  if (pathname.includes("/organizational")) {
    return "Pages / Organizational Projects";
  }
  if (pathname.includes("/personal-project")) {
    return "Pages / Personal Project";
  }
  if (pathname.includes("/notification")) {
    return "Pages / Notifications";
  }
  if (pathname.includes("/billing")) {
    return "Dashboard / Pages / Plan and Billing";
  }
  if (pathname.includes("/profile")) {
    return "Pages / My Profile";
  }

  return "Pages / Dashboard";
}

function HeaderComponent() {
  const { data: session } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const pageTitle = getTitleFromPath(pathname)
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
    <div className="px-6 py-3 flex items-center justify-between border-b border-slate-200 dark:border-slate-700 transition-colors">
      {/* Left side - Page title */}
      <div className="flex items-center">
        <h1 className="text-lg font-medium text-slate-800 dark:text-slate-100">
          {pageTitle}
        </h1>
      </div>

      {/* Right side - Actions and user profile */}
      <div className="flex items-center gap-4">
        {/* Search bar to fill space and add functionality */}
        <div className="hidden lg:flex relative items-center max-w-xs xl:max-w-md w-full group">
          <Search className="absolute left-3.5 h-4 w-4 text-slate-400 group-focus-within:text-[#3A7AC3] transition-colors" />
          <input
            type="text"
            placeholder="Search projects, members..."
            className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl text-sm transition-all focus:ring-2 focus:ring-[#3A7AC3]/20 focus:border-[#3A7AC3] outline-none dark:text-slate-200"
          />
        </div>

        <div className="flex items-center gap-1.5 ml-2">
          {/* Notifications */}
          <button className="p-2 text-slate-500 hover:text-[#3A7AC3] hover:bg-blue-50 dark:hover:bg-slate-800 rounded-xl transition-all relative group">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900 group-hover:scale-110 transition-transform"></span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 text-slate-500 hover:text-[#3A7AC3] hover:bg-blue-50 dark:hover:bg-slate-800 rounded-xl transition-all"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isMounted && theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* User profile wrapped in blue accent bubble */}
        <div className="bg-[#3A7AC3] dark:bg-slate-800 pl-4 pr-1.5 py-1.5 rounded-2xl flex items-center shadow-lg shadow-blue-500/10 dark:shadow-none border border-blue-400/20 dark:border-slate-700/50 ml-2 min-w-fit flex-shrink-0">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-3 hover:opacity-90 transition-opacity">
              <div className="text-right hidden sm:block whitespace-nowrap">
                <p className="text-[10px] uppercase tracking-wider text-white/70 font-bold leading-tight">Welcome Back</p>
                <p className="text-sm font-semibold text-white leading-tight">
                  {session?.user?.name || "User"}
                </p>
              </div>
              <Avatar className="h-9 w-9 border-2 border-white/20 flex-shrink-0">
                <AvatarImage
                  src={session?.user?.image || ""}
                  alt={session?.user?.name || "User"}
                />
                <AvatarFallback className="bg-white text-[#3A7AC3] text-xs font-bold">
                  {getInitials(session?.user?.name)}
                </AvatarFallback>
              </Avatar>
              <ChevronDown
                className={`h-4 w-4 text-white transition-transform flex-shrink-0 ${isDropdownOpen ? "rotate-180" : ""
                  }`}
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 py-1 z-50">
                <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-700">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {session?.user?.name || "User"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-slate-400 truncate">
                    {session?.user?.email || ""}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    router.push("/dashboard/billing");
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                  <CreditCard className="h-4 w-4" />
                  <span>Plan and Billing</span>
                </button>

                <button
                  onClick={handleProfileClick}
                  className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </button>

                <div className="border-t border-gray-100 dark:border-slate-700 mt-1 pt-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Memoize to prevent unnecessary re-renders
export const Header = memo(HeaderComponent)

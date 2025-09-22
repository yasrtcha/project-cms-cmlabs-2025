"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MdOutlineDarkMode } from "react-icons/md";
import { MdOutlineCallToAction } from "react-icons/md";
import { IoFilter } from "react-icons/io5";




import { 
  Filter, 
  Zap, 
  Star,
  ChevronDown
} from "lucide-react"

export function Header() {
  return (
    <div className="bg-[#3A7AC3] px-6 py-3 flex items-center justify-between">
      {/* Left side - Page title */}
      <div className="flex items-center">
        <h1 className="text-lg font-medium text-white">Pages / Dashboard</h1>
      </div>

      {/* Right side - Actions and user profile */}
      <div className="flex items-center space-x-4">
        {/* Action buttons */}
        <Button variant="outline" size="sm" className="flex items-center space-x-2 text-gray-600">
          <IoFilter className="h-4 w-4" />
          <span>Filter</span>
        </Button>

        <Button variant="outline" size="sm" className="flex items-center space-x-2 text-gray-600">
          <MdOutlineCallToAction className="h-4 w-4" />
          <span>Quick Action</span>
        </Button>

        <Button
        variant="outline"
        size="sm"
        className="flex items-center space-x-2 text-gray-600">
        <MdOutlineDarkMode className="h-4 w-4" />
        <span>Dark Mode</span>
        </Button>

        {/* User profile */}
        <div className="flex items-center space-x-3 ml-6">
          <div className="text-right">
            <p className="text-xs text-white/80">Welcome Back</p>
            <p className="text-sm font-medium text-white">Danar Rais Al Hakimi</p>
          </div>
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
            <AvatarFallback className="bg-white text-[#3A7AC3] text-xs font-semibold">
              DR
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
    
  )
}

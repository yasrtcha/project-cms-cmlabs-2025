"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Menu, X } from "lucide-react"
import { useState, memo } from "react"
import { MENU_ITEMS } from "@/constants/dashboard"

interface SidebarProps {
  className?: string
}

function SidebarComponent({ className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <div className={cn(
      "flex flex-col h-screen bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-700 transition-all duration-300",
      isCollapsed ? "w-16" : "w-64",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-[77px] border-b border-gray-200 dark:border-slate-700">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <Image
              src="/assets/logo cms black.png"
              alt="CMS WeldFine"
              width={24}
              height={24}
              className="rounded"
            />
            <span className="font-semibold text-gray-900 dark:text-white">CMS WeldFine</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2"
        >
          {isCollapsed ? <Menu className="h-4 w-4 dark:text-white" /> : <X className="h-4 w-4 dark:text-white" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1.5 py-4 overflow-y-auto">
        {MENU_ITEMS.map((item, index) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          
          return (
            <div key={index}>
              {/* 1. Judul DASHBOARD */}
              {index === 0 && !isCollapsed && (
                <p className="px-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-2 tracking-wider">Dashboard</p>
              )}

              {/* 2. Judul ORGANIZATION */}
              {item.href.includes('organizational') && !isCollapsed && (
                <div className="flex items-center justify-between px-4 mb-2 mt-4">
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Organizational</p>
                </div>
              )}

              {/* 3. Judul PERSONAL PROJECT */}
              {item.href.includes('personal-project') && !isCollapsed && (
                <div className="flex items-center justify-between px-4 mb-2 mt-4">
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Personal Project</p>
                </div>
              )}

              {/* 4. GARIS PEMISAH - Diperbaiki agar terlihat di Dark Mode */}
              {item.title.toLowerCase().includes('notification') && (
                <hr className="border-slate-200 dark:border-slate-800 my-4 mx-2" />
              )}

              <Link href={item.href} className="block group">
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-left transition-all duration-300 h-11 px-4 relative overflow-hidden",
                    // Warna Button Aktif & Shadow disesuaikan untuk Dark Mode
                    isActive 
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-200/50 dark:shadow-blue-900/20 rounded-xl hover:bg-blue-700 hover:text-white" 
                      : "text-slate-600 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl",
                    isCollapsed && "justify-center px-0"
                  )}
                >
                  {/* Notch Bar Putih */}
                  {isActive && !isCollapsed && (
                    <div className="absolute left-0 top-3 bottom-3 w-1 bg-white rounded-r-full" />
                  )}

                  <item.icon 
                    className={cn(
                      "h-5 w-5 transition-transform duration-300 group-hover:scale-110", 
                      !isCollapsed && "mr-3",
                      isActive ? "text-white" : "text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                    )} 
                  />
                  
                  {!isCollapsed && (
                    <>
                      <span className={cn(
                        "flex-1 font-medium text-sm transition-colors",
                        isActive ? "text-white" : "group-hover:text-blue-600 dark:group-hover:text-blue-400"
                      )}>
                        {item.title}
                      </span>
                      
                      {item.badge && (
                        <Badge 
                          variant="secondary" 
                          className={cn(
                            "ml-auto text-[10px] h-5 px-1.5 rounded-md border transition-all",
                            isActive 
                              ? "bg-white/20 text-white border-white/30" 
                              : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 group-hover:border-blue-200 dark:group-hover:border-blue-900"
                          )}
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                </Button>
              </Link>
            </div>
          )
        })}
      </nav>
    </div>
  )
}

export const Sidebar = memo(SidebarComponent)
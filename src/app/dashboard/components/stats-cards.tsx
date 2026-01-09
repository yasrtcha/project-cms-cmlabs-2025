"use client"

import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { User, Building2, TrendingUp, ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatsCardsProps {
  personalCount: number
  orgCount: number
}

export function StatsCards({ personalCount, orgCount }: StatsCardsProps) {
  const cards = [
    {
      title: "Personal Projects",
      value: personalCount,
      description: "Projects owned by you personally",
      icon: User,
      color: "blue",
      gradient: "from-blue-500/10 to-transparent",
      borderColor: "border-blue-500/20",
      iconColor: "text-blue-600 dark:text-blue-400",
      bgIcon: "bg-blue-500/10"
    },
    {
      title: "Organizational Projects",
      value: orgCount,
      description: "Projects within your organizations",
      icon: Building2,
      color: "purple",
      gradient: "from-purple-500/10 to-transparent",
      borderColor: "border-purple-500/20",
      iconColor: "text-purple-600 dark:text-purple-400",
      bgIcon: "bg-purple-500/10"
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {cards.map((card, index) => (
        <Card
          key={index}
          className={cn(
            "relative overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:-translate-y-1",
            "bg-white dark:bg-slate-900 border",
            card.borderColor
          )}
        >
          {/* Decorative Gradient Background */}
          <div className={cn("absolute inset-0 bg-gradient-to-br opacity-50 transition-opacity group-hover:opacity-70", card.gradient)} />

          <CardContent className="relative p-6">
            <div className="flex justify-between items-start mb-4">
              <div className={cn("p-3 rounded-2xl", card.bgIcon)}>
                <card.icon className={cn("w-6 h-6", card.iconColor)} />
              </div>
              <div className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">
                <TrendingUp className="w-3 h-3" />
                <span>Live</span>
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {card.title}
              </h3>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-slate-900 dark:text-white">
                  {card.value}
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500 font-normal">
                  projects
                </span>
              </div>
            </div>

            <p className="mt-4 text-sm text-slate-600 dark:text-slate-400 flex items-center justify-between">
              {card.description}
              <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

"use client"

import { memo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis } from "recharts"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"

const data = [
  {
    name: "Portal Ub",
    onProgress: 20,
    completed: 40,
    pending: 50
  },
  {
    name: "Educate Ub", 
    onProgress: 80,
    completed: 30,
    pending: 45
  },
  {
    name: "Beksos Ub",
    onProgress: 35,
    completed: 85,
    pending: 25
  },
  {
    name: "E-Commerce",
    onProgress: 40,
    completed: 90,
    pending: 35
  }
]

const chartConfig = {
  onProgress: {
    label: "On Progress",
    color: "#f59e0b",
  },
  completed: {
    label: "Completed",
    color: "#22c55e",
  },
  pending: {
    label: "Pending",
    color: "#ef4444",
  },
} satisfies ChartConfig

export const ActivityChart = memo(function ActivityChart() {
  return (
    <Card className="w-full bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Activity Chart</CardTitle>
        <Button variant="outline" size="sm" className="bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 border-0">
          All Project
          <ChevronDown className="h-4 w-4 ml-1" />
        </Button>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'currentColor' }}
              className="fill-gray-700 dark:fill-gray-200"
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'currentColor' }}
              className="fill-gray-700 dark:fill-gray-200"
              domain={[0, 100]}
            />
            <ChartTooltip 
              content={
                <ChartTooltipContent 
                  className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 [&_.text-muted-foreground]:text-gray-600 [&_.text-muted-foreground]:dark:text-gray-300 [&_.text-foreground]:text-gray-900 [&_.text-foreground]:dark:text-white"
                  labelClassName="text-gray-900 dark:text-white"
                />
              } 
            />
            <Bar dataKey="onProgress" fill="var(--color-onProgress)" />
            <Bar dataKey="completed" fill="var(--color-completed)" />
            <Bar dataKey="pending" fill="var(--color-pending)" />
          </BarChart>
        </ChartContainer>
        
        {/* Legend */}
        <div className="flex justify-center space-x-6 mt-4">
          {Object.entries(chartConfig).map(([key, config]) => (
            <div key={key} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: config.color }}
              />
              <span className="text-sm text-gray-900 dark:text-slate-200">{config.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
})

"use client"

import { memo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { PieChart, Pie, Cell } from "recharts"

const data = [
  { name: "finalProject", value: 100, fill: "var(--color-finalProject)" },
  { name: "ongoing", value: 30, fill: "var(--color-ongoing)" },
  { name: "lateProject", value: 45, fill: "var(--color-lateProject)" }
]

const chartConfig = {
  finalProject: {
    label: "Final Project",
    color: "#22c55e",
  },
  ongoing: {
    label: "Ongoing",
    color: "#f59e0b",
  },
  lateProject: {
    label: "Late Project",
    color: "#ef4444",
  },
} satisfies ChartConfig

export const DeadlinesChart = memo(function DeadlinesChart() {
  return (
    <Card className="w-full bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Deadlines</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
          </PieChart>
        </ChartContainer>
        
        {/* Legend */}
        <div className="flex justify-center space-x-6 mt-4">
          {Object.entries(chartConfig).map(([key, config]) => (
            <div key={key} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: config.color }}
              />
              <span className="text-sm text-gray-900 dark:text-white font-medium">{config.label}</span>
            </div>
          ))}
        </div>
        
        {/* Percentage labels */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: chartConfig.finalProject.color }}>100%</div>
            <div className="text-xs text-gray-600 dark:text-gray-300 mt-1">Final Project</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: chartConfig.ongoing.color }}>30%</div>
            <div className="text-xs text-gray-600 dark:text-gray-300 mt-1">Ongoing</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: chartConfig.lateProject.color }}>45%</div>
            <div className="text-xs text-gray-600 dark:text-gray-300 mt-1">Late Project</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
})

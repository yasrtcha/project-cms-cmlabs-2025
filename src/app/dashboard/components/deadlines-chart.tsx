"use client"

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

export function DeadlinesChart() {
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
            <ChartTooltip content={<ChartTooltipContent hideLabel className="dark:bg-black dark:text-white dark:border-slate-700"/>} />
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
              <span className="text-sm text-gray-900 dark:text-slate-200">{config.label}</span>
            </div>
          ))}
        </div>
        
        {/* Percentage labels */}
        <div className="text-center mt-4">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">100%</div>
          <div className="flex justify-around mt-2 text-sm">
            <span className="text-amber-600 dark:text-amber-500">30%</span>
            <span className="text-red-600 dark:text-red-500">45%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import { useLanguage } from "@/components/language-provider"
import type { WeatherData } from "@/lib/weather-data"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { BarChart3 } from "lucide-react"

interface WeatherChartProps {
  weatherData: WeatherData[]
  isCelsius?: boolean
}

// Function to convert Fahrenheit to Celsius
const toCelsius = (fahrenheit: number): number => {
  return Math.round(((fahrenheit - 32) * 5) / 9)
}

export default function WeatherChart({ weatherData, isCelsius = false }: WeatherChartProps) {
  const { t } = useLanguage()
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // After mounting, we can safely access the theme
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="h-[400px] flex items-center justify-center">Loading chart...</div>
  }

  // Convert temperatures if needed
  const displayTemp = (temp: number) => {
    return isCelsius ? toCelsius(temp) : temp
  }

  // Sort data chronologically (oldest to newest)
  const sortedData = [...weatherData].sort((a, b) => a.date.getTime() - b.date.getTime())

  // Calculate chart dimensions
  const chartHeight = 300
  const chartWidth = "100%"
  const padding = { top: 20, right: 20, bottom: 40, left: 40 }

  // Find min and max temperatures for scaling
  const allTemps = sortedData.flatMap((day) => [
    displayTemp(day.high),
    displayTemp(day.low),
    displayTemp(day.temperature),
  ])
  const minTemp = Math.min(...allTemps) - 5
  const maxTemp = Math.max(...allTemps) + 5
  const tempRange = maxTemp - minTemp

  // Calculate positions for the chart
  const getY = (temp: number) => {
    return (
      chartHeight -
      padding.bottom -
      ((displayTemp(temp) - minTemp) / tempRange) * (chartHeight - padding.top - padding.bottom)
    )
  }

  // Calculate the available width for the chart
  const availableWidth = 100 - padding.left - padding.right // Using percentage
  // Width of each day section
  const dayWidth = availableWidth / sortedData.length

  const getX = (index: number) => {
    return padding.left + dayWidth * index + dayWidth / 2
  }

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })
  }

  // Colors based on theme
  const highLineColor = theme === "dark" ? "#f87171" : "#ef4444"
  const lowLineColor = theme === "dark" ? "#60a5fa" : "#3b82f6"
  const avgLineColor = theme === "dark" ? "#a78bfa" : "#8b5cf6"
  const gridColor = theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"
  const textColor = theme === "dark" ? "#94a3b8" : "#64748b"

  return (
    <div className="h-[500px] w-full">
      <motion.h3
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-xl font-medium mb-8 flex items-center gap-2"
      >
        <span className="p-1.5 bg-sky-100 dark:bg-sky-900/30 rounded-full inline-flex">
          <BarChart3 className="h-5 w-5 text-sky-500" />
        </span>
        {t("weeklyTemperatureTrend")}
      </motion.h3>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative h-[400px] w-full bg-gradient-to-br from-white to-sky-50/50 dark:from-slate-900 dark:to-slate-800/50 rounded-xl p-4 shadow-inner"
      >
        <svg width={chartWidth} height={chartHeight} className="overflow-visible">
          {/* Y-axis grid lines and labels */}
          {Array.from({ length: 6 }).map((_, i) => {
            const temp = minTemp + (tempRange / 5) * i
            const y = getY(temp)
            return (
              <g key={`grid-${i}`}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2="100%"
                  y2={y}
                  stroke={gridColor}
                  strokeWidth="1"
                  strokeDasharray="5,5"
                />
                <text x={padding.left - 10} y={y + 4} textAnchor="end" fontSize="12" fill={textColor}>
                  {Math.round(temp)}°
                </text>
              </g>
            )
          })}

          {/* High temperature line */}
          <path
            d={sortedData
              .map((day, i) => {
                const x = getX(i)
                const y = getY(day.high)
                return `${i === 0 ? "M" : "L"}${x},${y}`
              })
              .join(" ")}
            fill="none"
            stroke={highLineColor}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="drop-shadow-sm"
          />

          {/* Low temperature line */}
          <path
            d={sortedData
              .map((day, i) => {
                const x = getX(i)
                const y = getY(day.low)
                return `${i === 0 ? "M" : "L"}${x},${y}`
              })
              .join(" ")}
            fill="none"
            stroke={lowLineColor}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="drop-shadow-sm"
          />

          {/* Average temperature line */}
          <path
            d={sortedData
              .map((day, i) => {
                const x = getX(i)
                const y = getY(day.temperature)
                return `${i === 0 ? "M" : "L"}${x},${y}`
              })
              .join(" ")}
            fill="none"
            stroke={avgLineColor}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="drop-shadow-sm"
          />

          {/* Data points with tooltips */}
          {sortedData.map((day, i) => {
            const x = getX(i)

            return (
              <g key={`points-${i}`}>
                {/* High temp point */}
                <circle
                  cx={x}
                  cy={getY(day.high)}
                  r="5"
                  fill={highLineColor}
                  stroke="white"
                  strokeWidth="2"
                  className="hover:r-6 transition-all duration-200 drop-shadow-md"
                />

                {/* Low temp point */}
                <circle
                  cx={x}
                  cy={getY(day.low)}
                  r="5"
                  fill={lowLineColor}
                  stroke="white"
                  strokeWidth="2"
                  className="hover:r-6 transition-all duration-200 drop-shadow-md"
                />

                {/* Average temp point */}
                <circle
                  cx={x}
                  cy={getY(day.temperature)}
                  r="5"
                  fill={avgLineColor}
                  stroke="white"
                  strokeWidth="2"
                  className="hover:r-6 transition-all duration-200 drop-shadow-md"
                />

                {/* X-axis labels */}
                <text x={x} y={chartHeight - 10} textAnchor="middle" fontSize="12" fill={textColor}>
                  {formatDate(day.date)}
                </text>
              </g>
            )
          })}
        </svg>

        {/* Legend */}
        <div className="flex justify-center gap-6 mt-6">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full mr-2 shadow-sm" style={{ backgroundColor: highLineColor }}></div>
            <span className="text-sm">{t("high")}</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full mr-2 shadow-sm" style={{ backgroundColor: avgLineColor }}></div>
            <span className="text-sm">{t("average")}</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full mr-2 shadow-sm" style={{ backgroundColor: lowLineColor }}></div>
            <span className="text-sm">{t("low")}</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

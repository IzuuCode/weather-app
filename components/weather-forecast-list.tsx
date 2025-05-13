"use client"

import { useLanguage } from "@/components/language-provider"
import type { WeatherData } from "@/lib/weather-data"
import {
  Cloud,
  CloudDrizzle,
  CloudLightning,
  CloudRain,
  CloudSnow,
  Sun,
  Thermometer,
  Wind,
  Droplets,
  Clock3,
} from "lucide-react"
import { motion } from "framer-motion"

interface WeatherForecastListProps {
  weatherData: WeatherData[]
  isCelsius?: boolean
}

// Function to convert Fahrenheit to Celsius
const toCelsius = (fahrenheit: number): number => {
  return Math.round(((fahrenheit - 32) * 5) / 9)
}

export default function WeatherForecastList({ weatherData, isCelsius = false }: WeatherForecastListProps) {
  const { t } = useLanguage()

  // Function to get the appropriate weather icon
  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "sunny":
        return <Sun className="h-6 w-6 text-yellow-500" />
      case "cloudy":
        return <Cloud className="h-6 w-6 text-gray-500" />
      case "rainy":
        return <CloudRain className="h-6 w-6 text-blue-500" />
      case "drizzle":
        return <CloudDrizzle className="h-6 w-6 text-blue-400" />
      case "snowy":
        return <CloudSnow className="h-6 w-6 text-sky-200" />
      case "stormy":
        return <CloudLightning className="h-6 w-6 text-purple-500" />
      default:
        return <Sun className="h-6 w-6 text-yellow-500" />
    }
  }

  // Convert temperatures if needed
  const displayTemp = (temp: number) => {
    return isCelsius ? toCelsius(temp) : temp
  }

  // Sort data chronologically (oldest to newest)
  const sortedData = [...weatherData].sort((a, b) => a.date.getTime() - b.date.getTime())

  return (
    <div>
      <h3 className="text-xl font-medium mb-8 flex items-center gap-2">
        <span className="p-1.5 bg-sky-100 dark:bg-sky-900/30 rounded-full inline-flex">
          <Clock3 className="h-5 w-5 text-sky-500" />
        </span>
        {t("hourlyDetailedForecast")}
      </h3>

      <div className="space-y-10">
        {sortedData.map((day, dayIndex) => (
          <motion.div
            key={dayIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: dayIndex * 0.1 }}
            className="border-b border-border/40 pb-8 last:border-0 last:pb-0"
          >
            <div className="flex items-center gap-3 mb-5 bg-gradient-to-r from-sky-50 to-indigo-50/50 dark:from-sky-900/30 dark:to-indigo-900/20 p-3 rounded-xl shadow-sm">
              <div className="p-2.5 bg-white/80 dark:bg-slate-800/80 rounded-xl shadow-sm">
                {getWeatherIcon(day.condition)}
              </div>
              <div>
                <h4 className="font-bold text-lg">
                  {day.date.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {day.condition}, {displayTemp(day.temperature)}°{isCelsius ? "C" : "F"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {day.hourly.map((hour, hourIndex) => (
                <motion.div
                  key={hourIndex}
                  initial={{ opacity: 0, x: hourIndex % 2 === 0 ? -10 : 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 + hourIndex * 0.05 }}
                  className="flex items-center p-4 rounded-xl bg-gradient-to-r from-white to-sky-50/50 dark:from-slate-900 dark:to-slate-800/50 hover:shadow-md transition-all duration-300 group border border-sky-100/50 dark:border-sky-900/50"
                >
                  <div className="w-16 text-center">
                    <p className="font-bold text-lg">{hour.time}</p>
                  </div>

                  <div className="flex-1 flex items-center gap-4">
                    <div className="p-2 bg-white/80 dark:bg-slate-800/80 rounded-xl shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:scale-110">
                      {getWeatherIcon(hour.condition)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{hour.condition}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <div className="flex items-center gap-1">
                          <Thermometer className="h-3.5 w-3.5" />
                          {displayTemp(hour.temp)}°
                        </div>
                        <div className="flex items-center gap-1">
                          <Wind className="h-3.5 w-3.5" />
                          {Math.floor(Math.random() * 15) + 5} mph
                        </div>
                        <div className="flex items-center gap-1">
                          <Droplets className="h-3.5 w-3.5" />
                          {Math.floor(Math.random() * 100)}%
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-indigo-600 dark:from-sky-400 dark:to-indigo-400 bg-clip-text text-transparent">
                        {displayTemp(hour.temp)}°
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

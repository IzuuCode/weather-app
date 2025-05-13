"use client"

import {
  Cloud,
  CloudDrizzle,
  CloudLightning,
  CloudRain,
  CloudSnow,
  Sun,
  Sunrise,
  Sunset,
  Thermometer,
  Wind,
  Droplets,
  Clock3,
} from "lucide-react"
import type { WeatherData } from "@/lib/weather-data"
import { useLanguage } from "@/components/language-provider"
import { Progress } from "@/components/ui/progress"
import { motion } from "framer-motion"

interface WeatherCardProps {
  weather: WeatherData
  isCelsius?: boolean
}

// Function to convert Fahrenheit to Celsius
const toCelsius = (fahrenheit: number): number => {
  return Math.round(((fahrenheit - 32) * 5) / 9)
}

export default function WeatherCard({ weather, isCelsius = false }: WeatherCardProps) {
  const { t } = useLanguage()

  // Function to get the appropriate weather icon
  const getWeatherIcon = (condition: string, size: "sm" | "md" | "lg" = "lg") => {
    const sizeMap = {
      sm: "h-8 w-8",
      md: "h-12 w-12",
      lg: "h-24 w-24",
    }

    const sizeClass = sizeMap[size]

    switch (condition.toLowerCase()) {
      case "sunny":
        return <Sun className={`${sizeClass} text-yellow-500 drop-shadow-md`} />
      case "cloudy":
        return <Cloud className={`${sizeClass} text-gray-500 drop-shadow-md`} />
      case "rainy":
        return <CloudRain className={`${sizeClass} text-blue-500 drop-shadow-md`} />
      case "drizzle":
        return <CloudDrizzle className={`${sizeClass} text-blue-400 drop-shadow-md`} />
      case "snowy":
        return <CloudSnow className={`${sizeClass} text-sky-200 drop-shadow-md`} />
      case "stormy":
        return <CloudLightning className={`${sizeClass} text-purple-500 drop-shadow-md`} />
      default:
        return <Sun className={`${sizeClass} text-yellow-500 drop-shadow-md`} />
    }
  }

  // Convert temperatures if needed
  const displayTemp = (temp: number) => {
    return isCelsius ? toCelsius(temp) : temp
  }

  return (
    <div className="flex flex-col">
      {/* Main weather display */}
      <div className="flex flex-col md:flex-row items-center justify-between">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center md:items-start mb-8 md:mb-0 relative"
        >
          <div className="relative">
            {getWeatherIcon(weather.condition)}
            <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-sky-500 to-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
              {weather.condition}
            </div>
          </div>
          <h3 className="text-7xl font-bold mt-6 bg-gradient-to-r from-sky-600 to-indigo-600 dark:from-sky-400 dark:to-indigo-400 bg-clip-text text-transparent">
            {displayTemp(weather.temperature)}°
          </h3>
          <div className="flex items-center gap-1 mt-2 text-muted-foreground">
            <Thermometer className="h-4 w-4" />
            {t("feelsLike")} {displayTemp(weather.feelsLike)}°
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-2 gap-x-8 gap-y-6 bg-gradient-to-br from-sky-50/80 to-indigo-50/80 dark:from-sky-900/30 dark:to-indigo-900/30 p-6 rounded-2xl shadow-inner"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-rose-100 dark:bg-rose-900/30 rounded-full shadow-sm">
              <Thermometer className="h-5 w-5 text-rose-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t("high")}</p>
              <p className="font-bold text-xl">{displayTemp(weather.high)}°</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-sky-100 dark:bg-sky-900/30 rounded-full shadow-sm">
              <Thermometer className="h-5 w-5 text-sky-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t("low")}</p>
              <p className="font-bold text-xl">{displayTemp(weather.low)}°</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full shadow-sm">
              <Wind className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t("wind")}</p>
              <div className="flex items-center gap-2">
                <p className="font-bold text-xl">{weather.wind}</p>
                <span className="text-xs text-muted-foreground">mph</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-full shadow-sm">
              <Droplets className="h-5 w-5 text-indigo-500" />
            </div>
            <div className="w-full">
              <p className="text-sm text-muted-foreground">{t("precipitation")}</p>
              <div className="flex items-center gap-2">
                <p className="font-bold text-xl">{weather.precipitation}%</p>
                <Progress value={weather.precipitation} className="h-1.5 w-16" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Sunrise/Sunset and hourly forecast */}
      <div className="mt-12 pt-8 border-t border-border/40">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex justify-between mb-10"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full shadow-sm">
              <Sunrise className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t("sunrise")}</p>
              <p className="font-bold text-xl">{weather.sunrise}</p>
            </div>
          </div>

          <div className="relative w-full max-w-[300px] mx-6 hidden md:block">
            <div className="h-1 bg-gradient-to-r from-orange-300 via-yellow-300 to-orange-500 rounded-full mt-10 shadow-sm"></div>
            <div className="absolute left-0 top-10 w-3 h-3 bg-orange-400 rounded-full -translate-y-1/2 shadow-md"></div>
            <div className="absolute right-0 top-10 w-3 h-3 bg-orange-500 rounded-full -translate-y-1/2 shadow-md"></div>

            {/* Sun position indicator */}
            <div
              className="absolute top-10 w-6 h-6 bg-yellow-400 rounded-full -translate-y-1/2 -translate-x-1/2 shadow-lg shadow-yellow-400/30 flex items-center justify-center"
              style={{
                left: `${Math.min(Math.max((new Date().getHours() - 6) * 10, 0), 100)}%`,
                display: new Date().getHours() >= 6 && new Date().getHours() <= 18 ? "flex" : "none",
              }}
            >
              <Sun className="h-4 w-4 text-yellow-600" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full shadow-sm">
              <Sunset className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t("sunset")}</p>
              <p className="font-bold text-xl">{weather.sunset}</p>
            </div>
          </div>
        </motion.div>

        {/* Hourly forecast */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h4 className="font-medium mb-5 flex items-center gap-2 text-lg">
            <Clock3 className="h-5 w-5 text-sky-500" />
            {t("hourlyForecast")}
          </h4>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-4">
            {weather.hourly.map((hour, index) => (
              <div
                key={index}
                className="flex flex-col items-center p-3 rounded-xl hover:bg-sky-50/80 dark:hover:bg-sky-900/20 transition-all duration-300 hover:shadow-md group"
              >
                <p className="text-sm font-medium">{hour.time}</p>
                <div className="my-2 transform group-hover:scale-110 transition-transform duration-300">
                  {getWeatherIcon(hour.condition, "sm")}
                </div>
                <p className="font-bold text-lg">{displayTemp(hour.temp)}°</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

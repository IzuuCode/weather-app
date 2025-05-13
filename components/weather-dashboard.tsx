"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Search,
  X,
  Moon,
  Sun,
  Globe,
  Heart,
  Calendar,
  BarChart3,
  Clock3,
  Star,
  Sparkles,
  Compass,
  Zap,
  Youtube,
} from "lucide-react"
import WeatherCard from "./weather-card"
import { generateWeatherData } from "@/lib/weather-data"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useTheme } from "next-themes"
import { useMobile } from "@/hooks/use-mobile"
import { useLanguage } from "@/components/language-provider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import WeatherChart from "./weather-chart"
import WeatherForecastList from "./weather-forecast-list"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { motion } from "framer-motion"
import YouTubePlayer from "./youtube-player"

export default function WeatherDashboard() {
  // Theme toggle
  const { theme, setTheme } = useTheme()
  const isMobile = useMobile()
  const { language, setLanguage, t } = useLanguage()

  // State for location
  const [location, setLocation] = useState("San Francisco, CA")
  const [searchInput, setSearchInput] = useState("")
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [favoriteLocations, setFavoriteLocations] = useState<string[]>([])
  const [isCelsius, setIsCelsius] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState("today")
  const [activeMainTab, setActiveMainTab] = useState("weather")

  // Generate mock weather data for the last 7 days
  const [weatherData, setWeatherData] = useState(generateWeatherData(7))

  // State to track the current day index (0 = today, 1 = yesterday, etc.)
  const [currentDayIndex, setCurrentDayIndex] = useState(0)

  // After mounting, we can safely show the theme UI
  useEffect(() => {
    setMounted(true)
  }, [])

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedSearches = localStorage.getItem("recentWeatherSearches")
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches))
    }

    const savedFavorites = localStorage.getItem("favoriteLocations")
    if (savedFavorites) {
      setFavoriteLocations(JSON.parse(savedFavorites))
    }

    // Load temperature unit preference
    const savedUnit = localStorage.getItem("temperatureUnit")
    if (savedUnit) {
      setIsCelsius(savedUnit === "celsius")
    }
  }, [])

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("recentWeatherSearches", JSON.stringify(recentSearches))
  }, [recentSearches])

  useEffect(() => {
    localStorage.setItem("favoriteLocations", JSON.stringify(favoriteLocations))
  }, [favoriteLocations])

  // Save temperature unit preference
  useEffect(() => {
    localStorage.setItem("temperatureUnit", isCelsius ? "celsius" : "fahrenheit")
  }, [isCelsius])

  // Navigate to previous day
  const goToPreviousDay = () => {
    if (currentDayIndex < weatherData.length - 1) {
      setCurrentDayIndex(currentDayIndex + 1)
    }
  }

  // Navigate to next day
  const goToNextDay = () => {
    if (currentDayIndex > 0) {
      setCurrentDayIndex(currentDayIndex - 1)
    }
  }

  // Add a location to recent searches
  const addToRecentSearches = (newLocation: string) => {
    setRecentSearches((prev) => {
      // Remove the location if it already exists to avoid duplicates
      const filteredSearches = prev.filter((item) => item !== newLocation)
      // Add the new location at the beginning and limit to 5 items
      return [newLocation, ...filteredSearches].slice(0, 5)
    })
  }

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchInput.trim()) {
      setLocation(searchInput)
      // Add to recent searches
      addToRecentSearches(searchInput)
      // Generate new weather data for the new location
      setWeatherData(generateWeatherData(7))
      // Reset to today's weather
      setCurrentDayIndex(0)
      // Clear search input
      setSearchInput("")
    }
  }

  // Handle clicking on a recent search
  const handleRecentSearchClick = (searchTerm: string) => {
    setLocation(searchTerm)
    // Move this search to the top of recent searches
    addToRecentSearches(searchTerm)
    // Generate new weather data
    setWeatherData(generateWeatherData(7))
    // Reset to today's weather
    setCurrentDayIndex(0)
  }

  // Remove a location from recent searches
  const removeFromRecentSearches = (searchTerm: string, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent triggering the parent click handler
    setRecentSearches((prev) => prev.filter((item) => item !== searchTerm))
  }

  // Toggle favorite location
  const toggleFavorite = () => {
    setFavoriteLocations((prev) => {
      if (prev.includes(location)) {
        return prev.filter((item) => item !== location)
      } else {
        return [...prev, location]
      }
    })
  }

  // Check if current location is favorited
  const isFavorite = favoriteLocations.includes(location)

  // Toggle temperature unit
  const toggleTemperatureUnit = () => {
    setIsCelsius(!isCelsius)
  }

  // Toggle theme
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  // Toggle language
  const toggleLanguage = () => {
    setLanguage(language === "en" ? "si" : "en")
  }

  // If not mounted yet, don't render theme-specific UI to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-sky-200 dark:bg-sky-700 mb-4"></div>
          <div className="h-4 w-32 bg-sky-100 dark:bg-sky-800 rounded mb-3"></div>
          <div className="h-3 w-24 bg-sky-50 dark:bg-sky-900 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header with app title, user profile, and controls */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-wrap justify-between items-center mb-8 gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-sky-500 to-indigo-500 p-2.5 rounded-lg text-white shadow-lg shadow-sky-500/20 dark:shadow-sky-500/10">
            <Sparkles className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-indigo-600 dark:from-sky-400 dark:to-indigo-400 bg-clip-text text-transparent">
            {t("weatherForecast")}
          </h1>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center space-x-2 bg-white/80 dark:bg-slate-800/80 px-3 py-1.5 rounded-full shadow-sm">
            <Switch id="unit-toggle" checked={isCelsius} onCheckedChange={toggleTemperatureUnit} />
            <Label htmlFor="unit-toggle" className="font-medium">
              °{isCelsius ? "C" : "F"}
            </Label>
          </div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleLanguage}
                  className="rounded-full bg-white/80 dark:bg-slate-800/80 border-0 shadow-sm hover:shadow-md transition-all"
                >
                  <Globe className="h-[1.2rem] w-[1.2rem]" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{language === "en" ? "Switch to Sinhala" : "Switch to English"}</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleTheme}
                  className="rounded-full bg-white/80 dark:bg-slate-800/80 border-0 shadow-sm hover:shadow-md transition-all"
                >
                  {theme === "dark" ? (
                    <Sun className="h-[1.2rem] w-[1.2rem]" />
                  ) : (
                    <Moon className="h-[1.2rem] w-[1.2rem]" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Avatar className="h-10 w-10 transition-transform hover:scale-110 shadow-md">
            <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
            <AvatarFallback className="bg-gradient-to-br from-sky-400 to-indigo-500 text-white">WA</AvatarFallback>
          </Avatar>
        </div>
      </motion.div>

      {/* Search and location section */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-10"
      >
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <form onSubmit={handleSearch} className="flex gap-2 flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder={t("searchLocation")}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-9 pr-4 py-2 h-12 rounded-xl border-muted bg-white/80 dark:bg-slate-800/80 shadow-sm focus:shadow-md transition-all"
              />
            </div>
            <Button
              type="submit"
              variant="default"
              className="h-12 px-6 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 transition-all duration-300 shadow-md shadow-sky-500/20 dark:shadow-sky-500/10 hover:shadow-lg"
            >
              {t("search")}
            </Button>
          </form>

          <Button
            variant={isFavorite ? "default" : "outline"}
            className={`h-12 px-4 rounded-xl flex items-center gap-2 shadow-sm hover:shadow-md transition-all ${
              isFavorite
                ? "bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 shadow-rose-500/20 dark:shadow-rose-500/10"
                : "bg-white/80 dark:bg-slate-800/80 border-0"
            }`}
            onClick={toggleFavorite}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? "fill-white" : "fill-none"}`} />
            {isFavorite ? t("favorited") : t("favorite")}
          </Button>
        </div>

        {/* Recent searches and favorites */}
        <div className="flex flex-wrap gap-4">
          {/* Recent searches */}
          {recentSearches.length > 0 && (
            <div className="flex-1 min-w-[250px]">
              <div className="flex items-center gap-1 mb-2 text-sm font-medium">
                <Clock className="h-3.5 w-3.5" />
                <span>{t("recentSearches")}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer flex items-center gap-1 pl-3 hover:bg-secondary/80 transition-colors py-1.5 shadow-sm"
                    onClick={() => handleRecentSearchClick(search)}
                  >
                    {search}
                    <button
                      className="ml-1 rounded-full hover:bg-muted p-0.5 transition-colors"
                      onClick={(e) => removeFromRecentSearches(search, e)}
                      aria-label={`Remove ${search} from recent searches`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Favorite locations */}
          {favoriteLocations.length > 0 && (
            <div className="flex-1 min-w-[250px]">
              <div className="flex items-center gap-1 mb-2 text-sm font-medium">
                <Star className="h-3.5 w-3.5 text-amber-500" />
                <span>{t("favoriteLocations")}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {favoriteLocations.map((favLocation, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="cursor-pointer flex items-center gap-1 pl-3 hover:bg-secondary/30 transition-colors py-1.5 border-amber-200 dark:border-amber-800 shadow-sm"
                    onClick={() => handleRecentSearchClick(favLocation)}
                  >
                    <Heart className="h-3 w-3 fill-amber-500 text-amber-500 mr-1" />
                    {favLocation}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Current location display */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col items-center justify-center mb-8"
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 bg-gradient-to-r from-sky-100 to-indigo-100 dark:from-sky-900/50 dark:to-indigo-900/50 rounded-full shadow-inner">
            <MapPin className="h-5 w-5 text-sky-500" />
          </div>
          <h2 className="text-2xl font-bold">{location}</h2>
        </div>
        <p className="text-muted-foreground">
          {weatherData[currentDayIndex].date.toLocaleDateString(language === "en" ? "en-US" : "si-LK", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </p>
      </motion.div>

      {/* Main content tabs */}
      <Tabs defaultValue="weather" value={activeMainTab} onValueChange={setActiveMainTab}>
        <TabsList className="w-full max-w-md mx-auto bg-white/80 dark:bg-slate-800/80 rounded-full p-1 shadow-md mb-6">
          <TabsTrigger
            value="weather"
            className="flex-1 rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white"
          >
            <Sun className="h-4 w-4 mr-2" />
            {t("weather")}
          </TabsTrigger>
          <TabsTrigger
            value="videos"
            className="flex-1 rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-rose-500 data-[state=active]:text-white"
          >
            <Youtube className="h-4 w-4 mr-2" />
            {t("videos")}
          </TabsTrigger>
        </TabsList>

        {/* Weather Content */}
        <TabsContent value="weather" className="mt-0">
          {/* Main content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-sky-50 dark:from-slate-900 dark:to-slate-800 overflow-hidden rounded-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-sky-200/20 to-indigo-200/20 dark:from-sky-700/20 dark:to-indigo-700/20 rounded-bl-full pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-sky-200/20 to-indigo-200/20 dark:from-sky-700/20 dark:to-indigo-700/20 rounded-tr-full pointer-events-none"></div>

              <CardContent className="p-0">
                {/* Tabs for different views */}
                <Tabs defaultValue="today" value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <div className="border-b border-border/40">
                    <TabsList className="w-full justify-start rounded-none bg-transparent h-14 p-0">
                      <TabsTrigger
                        value="today"
                        className="data-[state=active]:border-b-2 data-[state=active]:border-sky-500 data-[state=active]:shadow-none rounded-none h-14 px-5 transition-all"
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        {t("today")}
                      </TabsTrigger>
                      <TabsTrigger
                        value="week"
                        className="data-[state=active]:border-b-2 data-[state=active]:border-sky-500 data-[state=active]:shadow-none rounded-none h-14 px-5 transition-all"
                      >
                        <BarChart3 className="h-4 w-4 mr-2" />
                        {t("week")}
                      </TabsTrigger>
                      <TabsTrigger
                        value="hourly"
                        className="data-[state=active]:border-b-2 data-[state=active]:border-sky-500 data-[state=active]:shadow-none rounded-none h-14 px-5 transition-all"
                      >
                        <Clock3 className="h-4 w-4 mr-2" />
                        {t("hourly")}
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="today" className="p-6 pt-8 mt-0">
                    {/* Current day weather display */}
                    <WeatherCard weather={weatherData[currentDayIndex]} isCelsius={isCelsius} />

                    {/* Carousel navigation */}
                    <div className="flex items-center justify-between mt-10">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={goToNextDay}
                        disabled={currentDayIndex === 0}
                        className="rounded-full border-sky-200 dark:border-sky-800 hover:bg-sky-100 dark:hover:bg-sky-900 transition-colors shadow-sm"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Previous day</span>
                      </Button>

                      {/* Day indicators */}
                      <div className="flex gap-2">
                        {weatherData.map((_, index) => (
                          <button
                            key={index}
                            className={`h-3 w-3 rounded-full transition-all duration-300 ${
                              currentDayIndex === index
                                ? "bg-gradient-to-r from-sky-500 to-indigo-500 scale-125 shadow-md"
                                : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
                            }`}
                            onClick={() => setCurrentDayIndex(index)}
                            aria-label={`View ${index === 0 ? t("today") : `${index} ${t("daysAgo")}`}`}
                          />
                        ))}
                      </div>

                      <Button
                        variant="outline"
                        size="icon"
                        onClick={goToPreviousDay}
                        disabled={currentDayIndex === weatherData.length - 1}
                        className="rounded-full border-sky-200 dark:border-sky-800 hover:bg-sky-100 dark:hover:bg-sky-900 transition-colors shadow-sm"
                      >
                        <ChevronRight className="h-4 w-4" />
                        <span className="sr-only">Next day</span>
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="week" className="p-6 pt-8 mt-0">
                    <WeatherChart weatherData={weatherData} isCelsius={isCelsius} />
                  </TabsContent>

                  <TabsContent value="hourly" className="mt-0">
                    <ScrollArea className="h-[600px]">
                      <div className="p-6 pt-8">
                        <WeatherForecastList weatherData={weatherData} isCelsius={isCelsius} />
                      </div>
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick stats cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8"
          >
            <Card className="bg-gradient-to-br from-white to-sky-50 dark:from-slate-900 dark:to-slate-800 border-0 shadow-lg overflow-hidden rounded-xl">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  <Compass className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">{t("airQuality")}</h3>
                  <p className="text-2xl font-bold">Good</p>
                  <p className="text-xs text-muted-foreground">AQI: 42</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-white to-sky-50 dark:from-slate-900 dark:to-slate-800 border-0 shadow-lg overflow-hidden rounded-xl">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-full">
                  <Sun className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">{t("uvIndex")}</h3>
                  <p className="text-2xl font-bold">Moderate</p>
                  <p className="text-xs text-muted-foreground">UV: 4</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-white to-sky-50 dark:from-slate-900 dark:to-slate-800 border-0 shadow-lg overflow-hidden rounded-xl">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                  <Zap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">{t("pollen")}</h3>
                  <p className="text-2xl font-bold">Low</p>
                  <p className="text-xs text-muted-foreground">{t("pollenCount")}: 2.1</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Videos Content */}
        <TabsContent value="videos" className="mt-0">
          <YouTubePlayer location={location} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Language = "en" | "si"

type Translations = {
  [key in Language]: {
    [key: string]: string
  }
}

// Define all translations here ok
const translations: Translations = {
  en: {
    weatherForecast: "Weather Forecast",
    search: "Search",
    searchLocation: "Search location...",
    recentSearches: "Recent searches",
    today: "Today",
    daysAgo: "days ago",
    high: "High",
    low: "Low",
    wind: "Wind",
    precipitation: "Precipitation",
    feelsLike: "Feels like",
    sunrise: "Sunrise",
    sunset: "Sunset",
    hourlyForecast: "Hourly Forecast",
    weatherNews: "Weather News",
    latestVideos: "Latest weather videos for",
    views: "views",
    daysAgoVideo: "days ago",
    week: "Week",
    hourly: "Hourly",
    favorite: "Favorite",
    favorited: "Favorited",
    favoriteLocations: "Favorite Locations",
    weeklyTemperatureTrend: "Weekly Temperature Trend",
    average: "Average",
    hourlyDetailedForecast: "Hourly Detailed Forecast",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    contact: "Contact",
    madeWith: "Made with",
    using: "using Next.js and Tailwind CSS",
    stayUpdated: "Stay updated with weather alerts",
    subscribe: "Subscribe",
    about: "About",
    developer: "Full Stack Developer",
    passionateAbout: "Passionate about creating intuitive and beautiful weather experiences.",
    features: "Features",
    realTimeForecasts: "Real-time forecasts",
    hourlyUpdates: "Hourly updates",
    weatherAlerts: "Weather alerts",
    locationSaving: "Location saving",
    multiLanguage: "Multi-language support",
    resources: "Resources",
    documentation: "Documentation",
    apiReference: "API Reference",
    tutorials: "Tutorials",
    blog: "Blog",
    faq: "FAQ",
    download: "Download",
    getTheApp: "Get the WeatherCast app on your device",
    downloadOn: "Download on",
    activeUsers: "Active Users",
    countries: "Countries",
    support: "Support",
    rating: "App Rating",
    sitemap: "Sitemap",
    airQuality: "Air Quality",
    uvIndex: "UV Index",
    pollen: "Pollen",
    pollenCount: "Pollen Count",
    stats: "Statistics",
    weather: "Weather",
    videos: "Videos",
    weatherVideos: "Weather Videos",
    searchWeatherVideos: "Search weather videos...",
    related: "Related",
    trending: "Trending",
    videosRelatedTo: "Videos related to",
    trendingWeatherVideos: "Trending Weather Videos",
    selectVideoToPlay: "Select a video to play",
  },
  si: {
    weatherForecast: "කාලගුණ අනාවැකිය",
    search: "සොයන්න",
    searchLocation: "ස්ථානය සොයන්න...",
    recentSearches: "මෑත සෙවුම්",
    today: "අද",
    daysAgo: "දින කට පෙර",
    high: "උපරිම",
    low: "අවම",
    wind: "සුළඟ",
    precipitation: "වර්ෂාපතනය",
    feelsLike: "දැනෙන්නේ",
    sunrise: "හිරු උදාව",
    sunset: "හිරු බැසීම",
    hourlyForecast: "පැය අනාවැකිය",
    weatherNews: "කාලගුණ පුවත්",
    latestVideos: "සඳහා නවතම කාලගුණ වීඩියෝ",
    views: "නැරඹුම්",
    daysAgoVideo: "දින කට පෙර",
    week: "සතිය",
    hourly: "පැය",
    favorite: "ප්‍රියතම",
    favorited: "ප්‍රියතම කළා",
    favoriteLocations: "ප්‍රියතම ස්ථාන",
    weeklyTemperatureTrend: "සතිපතා උෂ්ණත්ව ප්‍රවණතාව",
    average: "සාමාන්‍ය",
    hourlyDetailedForecast: "පැය විස්තරාත්මක අනාවැකිය",
    privacyPolicy: "පෞද්ගලිකත්ව ප්‍රතිපත්තිය",
    termsOfService: "සේවා කොන්දේසි",
    contact: "සම්බන්ධ වන්න",
    madeWith: "සාදා ඇත්තේ",
    using: "Next.js සහ Tailwind CSS භාවිතයෙන්",
    stayUpdated: "කාලගුණ අනතුරු ඇඟවීම් සමඟ යාවත්කාලීන වන්න",
    subscribe: "දායක වන්න",
    about: "ගැන",
    developer: "පූර්ණ ස්ටැක් සංවර්ධක",
    passionateAbout: "සහජ හා අලංකාර කාලගුණ අත්දැකීම් නිර්මාණය කිරීම ගැන උනන්දුවක් දක්වයි.",
    features: "විශේෂාංග",
    realTimeForecasts: "තත්කාලීන අනාවැකි",
    hourlyUpdates: "පැය යාවත්කාලීන",
    weatherAlerts: "කාලගුණ අනතුරු ඇඟවීම්",
    locationSaving: "ස්ථාන සුරැකීම",
    multiLanguage: "බහු භාෂා සහාය",
    resources: "සම්පත්",
    documentation: "ප්‍රලේඛනය",
    apiReference: "API යොමුව",
    tutorials: "නිබන්ධන",
    blog: "බ්ලොග්",
    faq: "නිති අසන පැණ",
    download: "බාගත කරන්න",
    getTheApp: "ඔබේ උපකරණයේ WeatherCast යෙදුම ලබා ගන්න",
    downloadOn: "බාගත කරන්න",
    activeUsers: "සක්‍රිය පරිශීලකයින්",
    countries: "රටවල්",
    support: "සහාය",
    rating: "යෙදුම් ශ්‍රේණිගත කිරීම",
    sitemap: "අඩවි සිතියම",
    airQuality: "වායු තත්ත්වය",
    uvIndex: "UV දර්ශකය",
    pollen: "පරාග",
    pollenCount: "පරාග ගණන",
    stats: "සංඛ්‍යාලේඛන",
    weather: "කාලගුණය",
    videos: "වීඩියෝ",
    weatherVideos: "කාලගුණ වීඩියෝ",
    searchWeatherVideos: "කාලගුණ වීඩියෝ සොයන්න...",
    related: "සම්බන්ධිත",
    trending: "ප්‍රවණතා",
    videosRelatedTo: "සම්බන්ධිත වීඩියෝ",
    trendingWeatherVideos: "ප්‍රවණතා කාලගුණ වීඩියෝ",
    selectVideoToPlay: "වීඩියෝවක් තෝරන්න",
  },
}

type LanguageContextType = {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en")

  useEffect(() => {
    // Load language preference from localStorage
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "si")) {
      setLanguageState(savedLanguage)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)

    // Save language preference to localStorage
    localStorage.setItem("language", lang)
  }

  const t = (key: string) => {
    return translations[language][key] || key // Fallback to the key if translation is missing
  }

  const value: LanguageContextType = {
    language,
    setLanguage,
    t,
  }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Youtube, ExternalLink } from "lucide-react"
import Image from "next/image"
import { useLanguage } from "@/components/language-provider"
import { Badge } from "@/components/ui/badge"

interface YoutubeNewsPanelProps {
  location: string
}

// Mock YouTube video data
const generateMockVideos = (location: string) => {
  const topics = ["weather forecast", "storm warning", "climate update", "weather news", "meteorology report"]

  const channels = ["Weather Channel", "AccuWeather", "Climate Today", "Weather Network", "Storm Chasers"]

  return Array.from({ length: 5 }, (_, i) => {
    const topic = topics[Math.floor(Math.random() * topics.length)]
    const channel = channels[Math.floor(Math.random() * channels.length)]
    const days = Math.floor(Math.random() * 14) + 1
    const views = Math.floor(Math.random() * 900) + 100
    const duration = `${Math.floor(Math.random() * 10) + 1}:${Math.floor(Math.random() * 60)
      .toString()
      .padStart(2, "0")}`

    return {
      id: `video-${i}`,
      title: `${location} ${topic} - ${new Date().toLocaleDateString()}`,
      channel,
      thumbnail: `/placeholder.svg?height=120&width=200&text=Weather+Video`,
      views: `${views}K`,
      published: days,
      duration,
      verified: Math.random() > 0.5,
    }
  })
}

export default function YoutubeNewsPanel({ location }: YoutubeNewsPanelProps) {
  const videos = generateMockVideos(location)
  const { t, language } = useLanguage()

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-sky-50 dark:from-slate-900 dark:to-slate-800 overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-red-200/20 to-pink-200/20 dark:from-red-700/20 dark:to-pink-700/20 rounded-bl-full pointer-events-none"></div>

      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-red-100 dark:bg-red-900/30 rounded-full">
            <Youtube className="h-4 w-4 text-red-500" />
          </div>
          <CardTitle className="text-lg font-bold">{t("weatherNews")}</CardTitle>
        </div>
        <CardDescription>
          {language === "en" ? `${t("latestVideos")} ${location}` : `${location} ${t("latestVideos")}`}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {videos.map((video) => (
          <div
            key={video.id}
            className="flex gap-3 group cursor-pointer hover:bg-sky-50/50 dark:hover:bg-sky-900/20 p-2 rounded-lg transition-colors"
          >
            <div className="relative flex-shrink-0 w-[120px] h-[68px] rounded-md overflow-hidden">
              <Image
                src={video.thumbnail || "/placeholder.svg"}
                alt={video.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
                {video.duration}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm line-clamp-2 group-hover:text-sky-500 transition-colors">
                {video.title}
              </h4>

              <div className="flex items-center mt-1">
                <p className="text-xs text-muted-foreground flex items-center">
                  {video.channel}
                  {video.verified && (
                    <Badge variant="outline" className="ml-1 h-4 px-1 border-blue-200 dark:border-blue-800">
                      <span className="text-[10px] text-blue-500">✓</span>
                    </Badge>
                  )}
                </p>
              </div>

              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-muted-foreground">
                  {video.views} {t("views")} • {video.published} {t("daysAgoVideo")}
                </p>
                <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

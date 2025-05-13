"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useLanguage } from "@/components/language-provider"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { motion } from "framer-motion"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Search,
  Youtube,
  ThumbsUp,
  MessageSquare,
  Calendar,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  SkipForward,
  SkipBack,
  AlertCircle,
} from "lucide-react"
import { type YouTubeVideo, searchYouTubeVideos, getTrendingWeatherVideos } from "@/lib/youtube-api"

export default function YouTubePlayer({ location }: { location: string }) {
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState("")
  const [videos, setVideos] = useState<YouTubeVideo[]>([])
  const [trendingVideos, setTrendingVideos] = useState<YouTubeVideo[]>([])
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(100)
  const playerRef = useRef<HTMLDivElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)
  const [apiKeyExists, setApiKeyExists] = useState(false)

  // Check if API key exists
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY
    setApiKeyExists(!!apiKey)

    if (!apiKey) {
      setError("Still Didnt finished this part !!Sorry")
      setIsLoading(false)
    }
  }, [])

  // Initialize with videos related to the current location
  useEffect(() => {
    if (!apiKeyExists) return

    const fetchVideos = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Fetch videos related to the location
        const locationVideos = await searchYouTubeVideos(`${location} weather`, 8)

        // Fetch trending weather videos
        const trending = await getTrendingWeatherVideos(5)

        setVideos(locationVideos)
        setTrendingVideos(trending)

        // Set the first video as selected if available
        if (locationVideos.length > 0) {
          setSelectedVideo(locationVideos[0])
          // Set duration based on the selected video
          const durationParts = locationVideos[0].duration.split(":")
          if (durationParts.length === 2) {
            setDuration(Number.parseInt(durationParts[0]) * 60 + Number.parseInt(durationParts[1]))
          } else if (durationParts.length === 3) {
            setDuration(
              Number.parseInt(durationParts[0]) * 3600 +
                Number.parseInt(durationParts[1]) * 60 +
                Number.parseInt(durationParts[2]),
            )
          }
        }
      } catch (err) {
        console.error("Error fetching videos:", err)
        setError("Failed to fetch videos. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchVideos()
  }, [location, apiKeyExists])

  // Handle search
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim() || !apiKeyExists) return

    setIsLoading(true)
    setError(null)

    try {
      const searchResults = await searchYouTubeVideos(searchQuery, 8)
      setVideos(searchResults)

      // Set the first video as selected if available
      if (searchResults.length > 0) {
        setSelectedVideo(searchResults[0])
        // Reset player state
        setCurrentTime(0)
        setIsPlaying(true)

        // Set duration based on the selected video
        const durationParts = searchResults[0].duration.split(":")
        if (durationParts.length === 2) {
          setDuration(Number.parseInt(durationParts[0]) * 60 + Number.parseInt(durationParts[1]))
        } else if (durationParts.length === 3) {
          setDuration(
            Number.parseInt(durationParts[0]) * 3600 +
              Number.parseInt(durationParts[1]) * 60 +
              Number.parseInt(durationParts[2]),
          )
        }
      }
    } catch (err) {
      console.error("Error searching videos:", err)
      setError("Failed to search videos. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle video selection
  const handleVideoSelect = (video: YouTubeVideo) => {
    setSelectedVideo(video)
    setIsPlaying(true)
    setCurrentTime(0)

    // Set duration based on the selected video
    const durationParts = video.duration.split(":")
    if (durationParts.length === 2) {
      setDuration(Number.parseInt(durationParts[0]) * 60 + Number.parseInt(durationParts[1]))
    } else if (durationParts.length === 3) {
      setDuration(
        Number.parseInt(durationParts[0]) * 3600 +
          Number.parseInt(durationParts[1]) * 60 +
          Number.parseInt(durationParts[2]),
      )
    }

    // Scroll to player on mobile
    if (window.innerWidth < 768) {
      playerRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }

  // Handle progress bar click
  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressBarRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect()
      const clickPosition = e.clientX - rect.left
      const percentage = clickPosition / rect.width
      setCurrentTime(Math.floor(percentage * duration))
    }
  }

  // Update progress bar every second when playing
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isPlaying && currentTime < duration) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false)
            return duration
          }
          return prev + 1
        })
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [isPlaying, currentTime, duration])

  // Format time for display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  // Render API key error message
  if (!apiKeyExists) {
    return (
      <div className="w-full">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            YouTube API key is missing. Please add NEXT_PUBLIC_YOUTUBE_API_KEY to your environment variables.
          </AlertDescription>
        </Alert>

        <Card className="overflow-hidden border-0 shadow-xl rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 aspect-video flex items-center justify-center">
          <CardContent>
            <div className="text-center text-white/70">
              <Youtube className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">API key required to display YouTube videos</p>
              <p className="text-sm mt-2 max-w-md mx-auto">
                To use this feature, you need to add a YouTube Data API v3 key to your environment variables.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
            <Youtube className="h-5 w-5 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-bold">{t("weatherVideos")}</h2>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t("searchWeatherVideos")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 h-11 rounded-lg border-muted bg-white/80 dark:bg-slate-800/80 shadow-sm"
            />
          </div>
          <Button
            type="submit"
            variant="default"
            className="h-11 px-6 rounded-lg bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 transition-all duration-300 shadow-md"
          >
            {t("search")}
          </Button>
        </form>
      </motion.div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video Player */}
        <motion.div
          ref={playerRef}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-2"
        >
          {selectedVideo ? (
            <Card className="overflow-hidden border-0 shadow-xl rounded-xl bg-gradient-to-br from-slate-900 to-slate-800">
              <CardContent className="p-0">
                {/* Video Player */}
                <div className="relative aspect-video bg-black">
                  {/* Video Thumbnail/Player */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img
                      src={selectedVideo.thumbnailUrl || "/placeholder.svg"}
                      alt={selectedVideo.title}
                      className="w-full h-full object-cover"
                    />

                    {/* Play/Pause Overlay */}
                    <div
                      className="absolute inset-0 bg-black/30 flex items-center justify-center cursor-pointer group"
                      onClick={() => setIsPlaying(!isPlaying)}
                    >
                      <div className="h-16 w-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                        {isPlaying ? (
                          <Pause className="h-8 w-8 text-white" />
                        ) : (
                          <Play className="h-8 w-8 text-white ml-1" />
                        )}
                      </div>

                      {/* "Playing" indicator */}
                      {isPlaying && (
                        <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
                          <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
                          <span className="text-xs text-white font-medium">PLAYING</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Video Controls */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    {/* Progress Bar */}
                    <div
                      ref={progressBarRef}
                      className="h-1.5 bg-white/30 rounded-full mb-4 cursor-pointer"
                      onClick={handleProgressBarClick}
                    >
                      <div
                        className="h-full bg-red-500 rounded-full relative"
                        style={{ width: `${(currentTime / duration) * 100}%` }}
                      >
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 h-3 w-3 bg-red-500 rounded-full transform scale-0 hover:scale-100 transition-transform"></div>
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <button
                          className="text-white/80 hover:text-white transition-colors"
                          onClick={() => setCurrentTime(Math.max(0, currentTime - 10))}
                        >
                          <SkipBack className="h-5 w-5" />
                        </button>

                        <button
                          className="text-white/80 hover:text-white transition-colors"
                          onClick={() => setIsPlaying(!isPlaying)}
                        >
                          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                        </button>

                        <button
                          className="text-white/80 hover:text-white transition-colors"
                          onClick={() => setCurrentTime(Math.min(duration, currentTime + 10))}
                        >
                          <SkipForward className="h-5 w-5" />
                        </button>

                        <div className="text-white text-sm">
                          {formatTime(currentTime)} / {formatTime(duration)}
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <button
                          className="text-white/80 hover:text-white transition-colors"
                          onClick={() => setIsMuted(!isMuted)}
                        >
                          {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                        </button>

                        <button className="text-white/80 hover:text-white transition-colors">
                          <Maximize2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Video Info */}
                <div className="p-5">
                  <h3 className="text-xl font-bold text-white mb-2">{selectedVideo.title}</h3>

                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/70 mb-4">
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="h-4 w-4" />
                      {selectedVideo.likeCount}
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      {selectedVideo.commentCount}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {selectedVideo.publishedAt}
                    </div>
                    <div>
                      {selectedVideo.viewCount} {t("views")}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white font-bold">
                      {selectedVideo.channelTitle.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-white">{selectedVideo.channelTitle}</p>
                      <p className="text-xs text-white/70">YouTube Channel</p>
                    </div>
                    <Button
                      variant="default"
                      size="sm"
                      className="ml-auto bg-red-600 hover:bg-red-700 text-white rounded-full"
                      onClick={() => window.open(`https://www.youtube.com/watch?v=${selectedVideo.id}`, "_blank")}
                    >
                      Watch on YouTube
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="overflow-hidden border-0 shadow-xl rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 aspect-video flex items-center justify-center">
              <CardContent>
                <div className="text-center text-white/70">
                  <Youtube className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">{t("selectVideoToPlay")}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>

        {/* Video List */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-1"
        >
          <Tabs defaultValue="related">
            <TabsList className="w-full mb-4 bg-white/80 dark:bg-slate-800/80 rounded-lg">
              <TabsTrigger value="related" className="flex-1">
                {t("related")}
              </TabsTrigger>
              <TabsTrigger value="trending" className="flex-1">
                {t("trending")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="related" className="mt-0">
              <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 rounded-xl overflow-hidden">
                <CardContent className="p-0">
                  <ScrollArea className="h-[600px]">
                    <div className="p-4">
                      <h3 className="text-lg font-medium mb-4">
                        {t("videosRelatedTo")} {location}
                      </h3>

                      {isLoading ? (
                        <div className="space-y-4">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="flex gap-3">
                              <Skeleton className="h-24 w-40 rounded-lg" />
                              <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-3 w-1/2" />
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : videos.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <p>No videos found. Try a different search term.</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {videos.map((video) => (
                            <div
                              key={video.id}
                              className={`flex gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                                selectedVideo?.id === video.id
                                  ? "bg-sky-100/80 dark:bg-sky-900/30"
                                  : "hover:bg-gray-100/80 dark:hover:bg-gray-800/50"
                              }`}
                              onClick={() => handleVideoSelect(video)}
                            >
                              <div className="relative flex-shrink-0 w-40 h-24 rounded-lg overflow-hidden">
                                <img
                                  src={video.thumbnailUrl || "/placeholder.svg"}
                                  alt={video.title}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
                                  {video.duration}
                                </div>
                                {selectedVideo?.id === video.id && (
                                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                    <Play className="h-8 w-8 text-white" />
                                  </div>
                                )}
                              </div>

                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-sm line-clamp-2">{video.title}</h4>
                                <p className="text-xs text-muted-foreground mt-1">{video.channelTitle}</p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                  <span>
                                    {video.viewCount} {t("views")}
                                  </span>
                                  <span>•</span>
                                  <span>{video.publishedAt}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="trending" className="mt-0">
              <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 rounded-xl overflow-hidden">
                <CardContent className="p-0">
                  <ScrollArea className="h-[600px]">
                    <div className="p-4">
                      <h3 className="text-lg font-medium mb-4">{t("trendingWeatherVideos")}</h3>

                      {isLoading ? (
                        <div className="space-y-4">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="flex gap-3">
                              <Skeleton className="h-24 w-40 rounded-lg" />
                              <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-3 w-1/2" />
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : trendingVideos.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <p>No trending videos found at the moment.</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {trendingVideos.map((video) => (
                            <div
                              key={video.id}
                              className={`flex gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                                selectedVideo?.id === video.id
                                  ? "bg-sky-100/80 dark:bg-sky-900/30"
                                  : "hover:bg-gray-100/80 dark:hover:bg-gray-800/50"
                              }`}
                              onClick={() => handleVideoSelect(video)}
                            >
                              <div className="relative flex-shrink-0 w-40 h-24 rounded-lg overflow-hidden">
                                <img
                                  src={video.thumbnailUrl || "/placeholder.svg"}
                                  alt={video.title}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
                                  {video.duration}
                                </div>
                                <Badge
                                  variant="default"
                                  className="absolute top-1 left-1 bg-red-600 text-[10px] px-1.5 py-0"
                                >
                                  TRENDING
                                </Badge>
                                {selectedVideo?.id === video.id && (
                                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                    <Play className="h-8 w-8 text-white" />
                                  </div>
                                )}
                              </div>

                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-sm line-clamp-2">{video.title}</h4>
                                <p className="text-xs text-muted-foreground mt-1">{video.channelTitle}</p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                  <span>
                                    {video.viewCount} {t("views")}
                                  </span>
                                  <span>•</span>
                                  <span>{video.publishedAt}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}

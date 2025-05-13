// Types for YouTube API responses
export interface YouTubeSearchResponse {
  kind: string
  etag: string
  nextPageToken?: string
  prevPageToken?: string
  regionCode?: string
  pageInfo: {
    totalResults: number
    resultsPerPage: number
  }
  items: YouTubeSearchItem[]
}

export interface YouTubeSearchItem {
  kind: string
  etag: string
  id: {
    kind: string
    videoId?: string
    channelId?: string
    playlistId?: string
  }
  snippet: {
    publishedAt: string
    channelId: string
    title: string
    description: string
    thumbnails: {
      default: YouTubeThumbnail
      medium: YouTubeThumbnail
      high: YouTubeThumbnail
    }
    channelTitle: string
    liveBroadcastContent: string
    publishTime: string
  }
}

export interface YouTubeThumbnail {
  url: string
  width: number
  height: number
}

export interface YouTubeVideoResponse {
  kind: string
  etag: string
  items: YouTubeVideoItem[]
  pageInfo: {
    totalResults: number
    resultsPerPage: number
  }
}

export interface YouTubeVideoItem {
  kind: string
  etag: string
  id: string
  snippet: {
    publishedAt: string
    channelId: string
    title: string
    description: string
    thumbnails: {
      default: YouTubeThumbnail
      medium: YouTubeThumbnail
      high: YouTubeThumbnail
      standard?: YouTubeThumbnail
      maxres?: YouTubeThumbnail
    }
    channelTitle: string
    tags?: string[]
    categoryId: string
    liveBroadcastContent: string
    defaultLanguage?: string
    localized: {
      title: string
      description: string
    }
    defaultAudioLanguage?: string
  }
  contentDetails: {
    duration: string
    dimension: string
    definition: string
    caption: string
    licensedContent: boolean
    contentRating: {}
    projection: string
  }
  statistics: {
    viewCount: string
    likeCount: string
    dislikeCount?: string
    favoriteCount: string
    commentCount: string
  }
}

// Our simplified video type
export interface YouTubeVideo {
  id: string
  title: string
  channelTitle: string
  publishedAt: string
  thumbnailUrl: string
  viewCount: string
  likeCount: string
  commentCount: string
  duration: string
  description?: string
}

// Function to format duration from ISO 8601 format to MM:SS
export function formatDuration(isoDuration: string): string {
  // Remove PT from the beginning
  let duration = isoDuration.replace("PT", "")

  let hours = 0
  let minutes = 0
  let seconds = 0

  // Extract hours if present
  if (duration.includes("H")) {
    const hoursPart = duration.split("H")[0]
    hours = Number.parseInt(hoursPart, 10)
    duration = duration.split("H")[1]
  }

  // Extract minutes if present
  if (duration.includes("M")) {
    const minutesPart = duration.split("M")[0]
    minutes = Number.parseInt(minutesPart, 10)
    duration = duration.split("M")[1]
  }

  // Extract seconds if present
  if (duration.includes("S")) {
    const secondsPart = duration.split("S")[0]
    seconds = Number.parseInt(secondsPart, 10)
  }

  // Format the duration
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  } else {
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }
}

// Function to format view count
export function formatViewCount(viewCount: string): string {
  const count = Number.parseInt(viewCount, 10)

  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`
  } else {
    return count.toString()
  }
}

// Function to format published date
export function formatPublishedDate(publishedAt: string): string {
  const publishedDate = new Date(publishedAt)
  const now = new Date()

  const diffTime = Math.abs(now.getTime() - publishedDate.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 1) {
    return "1 day ago"
  } else if (diffDays < 30) {
    return `${diffDays} days ago`
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30)
    return `${months} ${months === 1 ? "month" : "months"} ago`
  } else {
    const years = Math.floor(diffDays / 365)
    return `${years} ${years === 1 ? "year" : "years"} ago`
  }
}

// Function to convert YouTube API response to our simplified video type
export function convertToYouTubeVideo(videoItem: YouTubeVideoItem): YouTubeVideo {
  return {
    id: videoItem.id,
    title: videoItem.snippet.title,
    channelTitle: videoItem.snippet.channelTitle,
    publishedAt: formatPublishedDate(videoItem.snippet.publishedAt),
    thumbnailUrl: videoItem.snippet.thumbnails.high.url,
    viewCount: formatViewCount(videoItem.statistics.viewCount),
    likeCount: formatViewCount(videoItem.statistics.likeCount),
    commentCount: formatViewCount(videoItem.statistics.commentCount || "0"),
    duration: formatDuration(videoItem.contentDetails.duration),
    description: videoItem.snippet.description,
  }
}

// Function to search for videos
export async function searchYouTubeVideos(query: string, maxResults = 10): Promise<YouTubeVideo[]> {
  const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY

  if (!apiKey) {
    console.error("YouTube API key is missing")
    return []
  }

  try {
    // First, search for videos
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
      query + " weather",
    )}&type=video&maxResults=${maxResults}&key=${apiKey}`

    const searchResponse = await fetch(searchUrl)
    const searchData: YouTubeSearchResponse = await searchResponse.json()

    if (!searchData.items || searchData.items.length === 0) {
      return []
    }

    // Get video IDs from search results
    const videoIds = searchData.items.filter((item) => item.id.videoId).map((item) => item.id.videoId)

    if (videoIds.length === 0) {
      return []
    }

    // Then, get detailed information about those videos
    const videosUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoIds.join(
      ",",
    )}&key=${apiKey}`

    const videosResponse = await fetch(videosUrl)
    const videosData: YouTubeVideoResponse = await videosResponse.json()

    if (!videosData.items || videosData.items.length === 0) {
      return []
    }

    // Convert to our simplified video type
    return videosData.items.map(convertToYouTubeVideo)
  } catch (error) {
    console.error("Error fetching YouTube videos:", error)
    return []
  }
}

// Function to get trending videos
export async function getTrendingWeatherVideos(maxResults = 10): Promise<YouTubeVideo[]> {
  const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY

  if (!apiKey) {
    console.error("YouTube API key is missing")
    return []
  }

  try {
    // Search for trending weather videos
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=trending%20weather&type=video&maxResults=${maxResults}&key=${apiKey}`

    const searchResponse = await fetch(searchUrl)
    const searchData: YouTubeSearchResponse = await searchResponse.json()

    if (!searchData.items || searchData.items.length === 0) {
      return []
    }

    // Get video IDs from search results
    const videoIds = searchData.items.filter((item) => item.id.videoId).map((item) => item.id.videoId)

    if (videoIds.length === 0) {
      return []
    }

    // Then, get detailed information about those videos
    const videosUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoIds.join(
      ",",
    )}&key=${apiKey}`

    const videosResponse = await fetch(videosUrl)
    const videosData: YouTubeVideoResponse = await videosResponse.json()

    if (!videosData.items || videosData.items.length === 0) {
      return []
    }

    // Convert to our simplified video type
    return videosData.items.map(convertToYouTubeVideo)
  } catch (error) {
    console.error("Error fetching trending YouTube videos:", error)
    return []
  }
}

// Function to get video by ID
export async function getYouTubeVideoById(videoId: string): Promise<YouTubeVideo | null> {
  const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY

  if (!apiKey) {
    console.error("YouTube API key is missing")
    return null
  }

  try {
    const videoUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${apiKey}`

    const videoResponse = await fetch(videoUrl)
    const videoData: YouTubeVideoResponse = await videoResponse.json()

    if (!videoData.items || videoData.items.length === 0) {
      return null
    }

    return convertToYouTubeVideo(videoData.items[0])
  } catch (error) {
    console.error("Error fetching YouTube video:", error)
    return null
  }
}

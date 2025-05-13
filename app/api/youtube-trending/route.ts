import { NextResponse } from "next/server"
import type { YouTubeSearchResponse, YouTubeVideoResponse } from "@/lib/youtube-api"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const maxResults = searchParams.get("maxResults") || "10"

  const apiKey = process.env.YOUTUBE_API_KEY

  if (!apiKey) {
    return NextResponse.json({ error: "YouTube API key is not configured" }, { status: 500 })
  }

  try {
    // Search for trending weather videos
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=trending%20weather&type=video&maxResults=${maxResults}&key=${apiKey}`

    const searchResponse = await fetch(searchUrl)

    if (!searchResponse.ok) {
      const errorData = await searchResponse.json()
      return NextResponse.json(
        { error: "YouTube API search error", details: errorData },
        { status: searchResponse.status },
      )
    }

    const searchData: YouTubeSearchResponse = await searchResponse.json()

    if (!searchData.items || searchData.items.length === 0) {
      return NextResponse.json({ items: [] })
    }

    // Get video IDs from search results
    const videoIds = searchData.items.filter((item) => item.id.videoId).map((item) => item.id.videoId)

    if (videoIds.length === 0) {
      return NextResponse.json({ items: [] })
    }

    // Then, get detailed information about those videos
    const videosUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoIds.join(
      ",",
    )}&key=${apiKey}`

    const videosResponse = await fetch(videosUrl)

    if (!videosResponse.ok) {
      const errorData = await videosResponse.json()
      return NextResponse.json(
        { error: "YouTube API videos error", details: errorData },
        { status: videosResponse.status },
      )
    }

    const videosData: YouTubeVideoResponse = await videosResponse.json()

    return NextResponse.json(videosData)
  } catch (error) {
    console.error("Error fetching trending YouTube videos:", error)
    return NextResponse.json({ error: "Failed to fetch trending YouTube videos" }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import type { YouTubeVideoResponse } from "@/lib/youtube-api"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const videoId = params.id

  const apiKey = process.env.YOUTUBE_API_KEY

  if (!apiKey) {
    return NextResponse.json({ error: "YouTube API key is not configured" }, { status: 500 })
  }

  if (!videoId) {
    return NextResponse.json({ error: "Video ID is required" }, { status: 400 })
  }

  try {
    const videoUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${apiKey}`

    const videoResponse = await fetch(videoUrl)

    if (!videoResponse.ok) {
      const errorData = await videoResponse.json()
      return NextResponse.json(
        { error: "YouTube API video error", details: errorData },
        { status: videoResponse.status },
      )
    }

    const videoData: YouTubeVideoResponse = await videoResponse.json()

    if (!videoData.items || videoData.items.length === 0) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 })
    }

    return NextResponse.json(videoData)
  } catch (error) {
    console.error("Error fetching YouTube video:", error)
    return NextResponse.json({ error: "Failed to fetch YouTube video" }, { status: 500 })
  }
}

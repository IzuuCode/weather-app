import YouTubePlayer from "@/components/youtube-player"

export default function VideosPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-100 to-white dark:from-slate-900 dark:to-slate-800 py-8">
      <div className="container mx-auto px-4">
        <YouTubePlayer location="San Francisco, CA" />
      </div>
    </main>
  )
}

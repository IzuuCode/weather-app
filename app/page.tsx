import WeatherDashboard from "@/components/weather-dashboard"
import Footer from "@/components/footer"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Youtube } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-100 to-white dark:from-slate-900 dark:to-slate-800 flex flex-col">
      <div className="flex-grow">
        <WeatherDashboard />

        {/* Video section link */}
        <div className="container mx-auto px-4 mt-8 mb-12">
          <Link href="/videos">
            <Button className="w-full py-6 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 rounded-xl shadow-lg shadow-red-500/20 dark:shadow-red-500/10 hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3">
              <Youtube className="h-6 w-6" />
              <span className="text-lg font-medium">Watch Weather Videos</span>
            </Button>
          </Link>
        </div>
      </div>
      <Footer />
    </main>
  )
}

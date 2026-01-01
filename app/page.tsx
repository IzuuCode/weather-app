import WeatherDashboard from "@/components/weather-dashboard"
import Footer from "@/components/footer"


export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-100 to-white dark:from-slate-900 dark:to-slate-800 flex flex-col">
      <div className="flex-grow">
        <WeatherDashboard />

        {/* Video section link */}

      </div>
      <Footer />
    </main>
  )
}

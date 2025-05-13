"use client"

import { Github, Heart, Mail, Twitter, ArrowUp, CloudLightning, CloudRain, Sun, Sparkles } from "lucide-react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Separator } from "@/components/ui/separator"

export default function Footer() {
  const { theme } = useTheme()
  const { t } = useLanguage()
  const currentYear = new Date().getFullYear()
  const [showScrollTop, setShowScrollTop] = useState(false)

  // Check scroll position to show/hide scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  return (
    <footer className="w-full mt-16 relative">
      {/* Decorative wave */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none transform translate-y-[-98%]">
        <svg
          className="relative block w-full h-[70px]"
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
            className="fill-background"
          ></path>
        </svg>
      </div>

      {/* Main footer content */}
      <div className="bg-gradient-to-br from-sky-100 to-indigo-50 dark:from-slate-800 dark:to-slate-900 pt-16 pb-8 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 opacity-10 dark:opacity-5">
          <Sun className="h-40 w-40 text-yellow-500" />
        </div>
        <div className="absolute bottom-0 left-0 opacity-10 dark:opacity-5">
          <CloudRain className="h-32 w-32 text-blue-500" />
        </div>
        <div className="absolute top-1/2 left-1/4 opacity-10 dark:opacity-5">
          <CloudLightning className="h-24 w-24 text-purple-500" />
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="container mx-auto px-4"
        >
          {/* Top section with logo and newsletter */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12"
          >
            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-sky-500/20 dark:shadow-sky-500/10 transform hover:rotate-3 transition-all duration-300">
                  <Sparkles className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-indigo-600 dark:from-sky-400 dark:to-indigo-400 bg-clip-text text-transparent">
                  WeatherCast
                </h3>
              </div>
              <p className="text-muted-foreground max-w-md text-center md:text-left">
                Your comprehensive weather forecasting solution with real-time updates, interactive maps, and
                personalized alerts.
              </p>
            </div>

            <div className="w-full md:w-auto">
              <h4 className="font-medium mb-3 text-center md:text-left">{t("stayUpdated")}</h4>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Your email"
                  className="max-w-[220px] bg-white/80 dark:bg-slate-800/80 border-sky-100 dark:border-sky-900 rounded-xl shadow-sm"
                />
                <Button className="bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 rounded-xl shadow-md shadow-sky-500/20 dark:shadow-sky-500/10 hover:shadow-lg transition-all">
                  {t("subscribe")}
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Main footer content - simplified */}
          <motion.div variants={itemVariants} className="mb-12">
            {/* About section */}
            <div className="max-w-lg mx-auto text-center">
              <div className="flex flex-col items-center gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 flex items-center justify-center shadow-md">
                    <span className="text-white font-bold text-sm">IJ</span>
                  </div>
                  <div>
                    <p className="font-bold">Isuru Jayanada</p>
                    <p className="text-xs text-muted-foreground">{t("developer")}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{t("passionateAbout")}</p>
                <div className="flex gap-3 mt-2">
                  <Link
                    href="https://github.com/IzuuCode"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-full bg-white/80 dark:bg-slate-800/80 hover:bg-sky-100 dark:hover:bg-sky-900/30 transition-colors shadow-sm hover:shadow-md hover:scale-110 transition-all duration-300"
                    aria-label="GitHub Profile"
                  >
                    <Github className="h-4 w-4 text-foreground" />
                  </Link>
                  <Link
                    href="mailto:isurujayanada2002@gmail.com"
                    className="p-2.5 rounded-full bg-white/80 dark:bg-slate-800/80 hover:bg-sky-100 dark:hover:bg-sky-900/30 transition-colors shadow-sm hover:shadow-md hover:scale-110 transition-all duration-300"
                    aria-label="Email"
                  >
                    <Mail className="h-4 w-4 text-foreground" />
                  </Link>
                  <Link
                    href="https://www.linkedin.com/in/isuru-jayanada-044738265/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-full bg-white/80 dark:bg-slate-800/80 hover:bg-sky-100 dark:hover:bg-sky-900/30 transition-colors shadow-sm hover:shadow-md hover:scale-110 transition-all duration-300"
                    aria-label="LinkedIN profile"
                  >
                    <Twitter className="h-4 w-4 text-foreground" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Bottom links */}
          <motion.div variants={itemVariants} className="mt-12">
            <Separator className="mb-6 bg-sky-200/50 dark:bg-sky-800/50" />
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm text-muted-foreground mb-8">
              <Link href="#" className="hover:text-sky-500 transition-colors">
                {t("privacyPolicy")}
              </Link>
              <Link href="#" className="hover:text-sky-500 transition-colors">
                {t("termsOfService")}
              </Link>
              <Link href="#" className="hover:text-sky-500 transition-colors">
                {t("contact")}
              </Link>
              <Link href="#" className="hover:text-sky-500 transition-colors">
                {t("sitemap")}
              </Link>
              <Link href="#" className="hover:text-sky-500 transition-colors">
                {t("support")}
              </Link>
            </div>

            <p className="text-center text-muted-foreground flex items-center justify-center gap-1 mt-8">
              <span className="bg-gradient-to-r from-sky-600 to-indigo-600 dark:from-sky-400 dark:to-indigo-400 bg-clip-text text-transparent font-medium">
                © {currentYear} Isuru Jayanada
              </span>
              <span className="mx-2">•</span>
              {t("madeWith")} <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500 mx-1" />
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll to top button */}
      <motion.button
        onClick={scrollToTop}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: showScrollTop ? 1 : 0,
          scale: showScrollTop ? 1 : 0.8,
          y: showScrollTop ? 0 : 10,
        }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-6 right-6 p-3.5 rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-lg shadow-sky-500/20 dark:shadow-sky-500/10 hover:shadow-xl hover:scale-110 transition-all duration-300 z-50"
        aria-label="Scroll to top"
      >
        <ArrowUp className="h-5 w-5" />
      </motion.button>
    </footer>
  )
}

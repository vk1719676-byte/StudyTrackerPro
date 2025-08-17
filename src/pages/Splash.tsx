import type React from "react"
import { useState, useEffect } from "react"
import { ArrowRight, Clock, Target, TrendingUp, Users, Trophy, Star, Sparkles, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface SplashProps {
  onGetStarted: () => void
}

export const Splash: React.FC<SplashProps> = ({ onGetStarted }) => {
  const [isVisible, setIsVisible] = useState(false)

  const features = [
    {
      icon: Clock,
      title: "Smart Time Tracking",
      description: "Track your study sessions with precision and get insights into your productivity patterns.",
    },
    {
      icon: Target,
      title: "Goal Management",
      description: "Set and track your study goals with personalized recommendations.",
    },
    {
      icon: TrendingUp,
      title: "Progress Analytics",
      description: "Visualize your study patterns with detailed charts and performance metrics.",
    },
  ]

  const stats = [
    { icon: Users, value: "15,000+", label: "Active Students" },
    { icon: Trophy, value: "4.9/5", label: "User Rating" },
    { icon: Star, value: "200K+", label: "Study Hours" },
  ]

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        <header className="p-6">
          <div
            className={`transform transition-all duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"}`}
          >
            <div className="flex flex-col items-center space-y-3">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                StudyTracker Pro
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 rounded-full border border-purple-200 dark:border-purple-700 backdrop-blur-sm">
                <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                  #1 Study Tracking Platform
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center px-6">
          <div className="max-w-4xl mx-auto w-full text-center space-y-12">
            <div
              className={`space-y-8 transform transition-all duration-1000 delay-300 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
            >
              <div className="space-y-6">
                <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    Study Smarter,
                  </span>
                  <br />
                  <span className="text-gray-900 dark:text-gray-100">Achieve More! 🚀</span>
                </h1>

                <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-3xl mx-auto">
                  Transform your exam preparation with AI-powered insights, smart time tracking, and personalized study
                  analytics.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
                {stats.map((stat, index) => (
                  <Card
                    key={index}
                    className="p-6 text-center hover:scale-105 transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
                  >
                    <stat.icon className="w-8 h-8 mx-auto mb-3 text-purple-600 dark:text-purple-400" />
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                  </Card>
                ))}
              </div>

              <div className="space-y-4">
                <Button
                  onClick={onGetStarted}
                  size="lg"
                  className="text-xl px-12 py-6 shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  ✨ No credit card required • Free forever • Setup in 30 seconds
                </p>
              </div>
            </div>

            <div
              className={`transform transition-all duration-1000 delay-500 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
            >
              <div className="space-y-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Everything You Need to Excel</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {features.map((feature, index) => {
                    const Icon = feature.icon
                    return (
                      <Card
                        key={index}
                        className="p-6 text-center hover:scale-105 transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
                      >
                        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center">
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">{feature.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.description}</p>
                      </Card>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </main>

        <footer
          className={`p-6 text-center transform transition-all duration-1000 delay-700 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
        >
          <div className="max-w-2xl mx-auto space-y-3">
            <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm">Trusted by 15,000+ students worldwide</span>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Built with ❤️ by{" "}
              <a
                href="https://www.linkedin.com/in/vinay-kumar-964209342/?originalSubdomain=in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 dark:text-purple-400 hover:underline font-medium transition-colors duration-200"
              >
                Vinay Kumar
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

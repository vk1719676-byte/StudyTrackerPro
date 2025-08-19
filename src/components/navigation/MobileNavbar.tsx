"use client"

import React from "react"
import { Link, useLocation } from "react-router-dom"
import { Home, Calendar, Target, Clock, Settings, InfoIcon as Analytics, Upload, Shield } from "lucide-react"
import { FocusMode } from "../focus/FocusMode"

export const MobileNavbar: React.FC = () => {
  const location = useLocation()
  const [showFocusMode, setShowFocusMode] = React.useState(false)
  const [isVisible, setIsVisible] = React.useState(true)
  const [lastScrollY, setLastScrollY] = React.useState(0)

  React.useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/exams", label: "Exams", icon: Calendar },
    { path: "/goals", label: "Goals", icon: Target },
    { path: "/sessions", label: "Sessions", icon: Clock },
    { path: "/analytics", label: "Analytics", icon: Analytics },
    { path: "/materials", label: "Materials", icon: Upload },
    { path: "/settings", label: "Settings", icon: Settings },
  ]

  return (
    <>
      {/* Floating Focus Mode Button */}
      <button
        onClick={() => setShowFocusMode(true)}
        className={`
          md:hidden fixed right-4 z-40 bg-gradient-to-r from-purple-500 to-blue-600 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl 
          transition-all duration-300 hover:scale-105 flex items-center gap-2
          hover:from-purple-600 hover:to-blue-700 active:scale-95
          ${isVisible ? "bottom-20 translate-y-0" : "bottom-4 translate-y-0"}
        `}
        title="Focus Mode"
      >
        <Shield className="w-5 h-5" />
        <span className="text-sm font-medium">Enter Focus Mode</span>
      </button>

      {/* Focus Mode Modal */}
      <FocusMode isOpen={showFocusMode} onClose={() => setShowFocusMode(false)} />

      {/* Bottom Navigation */}
      <nav
        className={`
        md:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md
        border-t border-gray-200 dark:border-gray-700 z-50
        transition-all duration-300 ease-in-out
        ${isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}
      `}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent dark:from-gray-900/5 pointer-events-none" />

        <div className="flex items-center justify-around py-2 relative">
          {navItems.map(({ path, label, icon: Icon }, index) => (
            <Link
              key={path}
              to={path}
              className={`
                flex flex-col items-center gap-1 px-3 py-2 rounded-lg min-w-0 flex-1
                transition-all duration-300 ease-out relative group
                hover:bg-gray-100/50 dark:hover:bg-gray-700/50
                active:scale-95
                ${
                  location.pathname === path
                    ? "text-purple-600 dark:text-purple-400"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                }
              `}
              style={{
                animationDelay: `${index * 50}ms`,
              }}
            >
              {location.pathname === path && (
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-purple-600 dark:bg-purple-400 rounded-full animate-pulse" />
              )}

              <Icon
                className={`
                w-5 h-5 transition-all duration-300 ease-out
                ${location.pathname === path ? "scale-110 drop-shadow-sm" : "group-hover:scale-105"}
              `}
              />

              <span
                className={`
                text-xs font-medium truncate transition-all duration-300
                ${location.pathname === path ? "font-semibold" : ""}
              `}
              >
                {label}
              </span>

              <div className="absolute inset-0 rounded-lg overflow-hidden">
                <div className="absolute inset-0 bg-purple-500/10 scale-0 group-active:scale-100 transition-transform duration-200 rounded-lg" />
              </div>
            </Link>
          ))}
        </div>
      </nav>
    </>
  )
}


"use client"

import { useState, useEffect } from "react"
import { ArrowUp } from "lucide-react"

export default function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false)

  // Show button when page is scrolled down
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener("scroll", toggleVisibility)
    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  // Scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    <button
      onClick={scrollToTop}
      className={`
        fixed bottom-6 left-6 z-50
        w-14 h-14 
        bg-gradient-to-r from-orange-500 to-red-500
        hover:from-orange-600 hover:to-red-600
        text-white rounded-full shadow-lg hover:shadow-xl
        transition-all duration-300 ease-in-out
        flex items-center justify-center
        border-2 border-white/20
        backdrop-blur-sm
        group
        ${isVisible ? 
          'opacity-100 translate-y-0 scale-100' : 
          'opacity-0 translate-y-4 scale-95 pointer-events-none'
        }
      `}
      aria-label="Back to top"
    >
      <ArrowUp className="h-6 w-6 transition-transform duration-200 group-hover:-translate-y-0.5" />
      
      {/* Floating animation ring */}
      <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping opacity-20"></div>
      
      {/* Subtle glow effect */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-400 to-red-400 opacity-20 blur-md"></div>
    </button>
  )
}
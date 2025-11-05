"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Ticket, Eye, Users, Calendar } from "lucide-react"

export default function Footer() {
  const [visitCount, setVisitCount] = useState(0)
  const [onlineUsers, setOnlineUsers] = useState(1)
  const router = useRouter()
  const pathname = usePathname()

  // Initialize visit counter
  useEffect(() => {
    // Get current visit count from localStorage
    const storedCount = localStorage.getItem('visitCount')
    const currentCount = storedCount ? parseInt(storedCount) + 1 : 1
    
    setVisitCount(currentCount)
    localStorage.setItem('visitCount', currentCount.toString())

    // Simulate online users (random number between 15-50)
    const randomUsers = Math.floor(Math.random() * 35) + 15
    setOnlineUsers(randomUsers)

    // Update online users every 30 seconds
    const interval = setInterval(() => {
      const newUsers = Math.floor(Math.random() * 35) + 15
      setOnlineUsers(newUsers)
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  // Navigate to section or page
  const navigateTo = (target: string) => {
    if (target.startsWith('#')) {
      // Internal anchor navigation
      if (pathname !== '/') {
        // If not on home page, go to home first
        router.push('/' + target)
      } else {
        // Already on home, just scroll
        smoothScrollTo(target.substring(1))
      }
    } else {
      // External page navigation
      router.push(target)
    }
  }

  // Smooth scroll function for same-page navigation
  const smoothScrollTo = (elementId: string) => {
    const element = document.getElementById(elementId)
    if (element) {
      const headerHeight = 80
      const elementPosition = element.offsetTop - headerHeight
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      })
    }
  }

  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-foreground mb-4">Browse</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <button 
                  onClick={() => navigateTo("/browse")}
                  className="hover:text-primary transition-all duration-300 hover:translate-x-1"
                >
                  Events
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigateTo("/categories")}
                  className="hover:text-primary transition-all duration-300 hover:translate-x-1"
                >
                  Categories
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigateTo("/#home")}
                  className="hover:text-primary transition-all duration-300 hover:translate-x-1"
                >
                  Venues
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-foreground mb-4">Help</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <button 
                  onClick={() => navigateTo("/#contact")}
                  className="hover:text-primary transition-all duration-300 hover:translate-x-1"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <Link href="/faq" className="hover:text-primary transition-all duration-300 hover:translate-x-1">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-primary transition-all duration-300 hover:translate-x-1">
                  Support
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-foreground mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <button 
                  onClick={() => navigateTo("/#about")}
                  className="hover:text-primary transition-all duration-300 hover:translate-x-1"
                >
                  About
                </button>
              </li>
              <li>
                <Link href="/blog" className="hover:text-primary transition-all duration-300 hover:translate-x-1">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-primary transition-all duration-300 hover:translate-x-1">
                  Careers
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-foreground mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/privacy" className="hover:text-primary transition-all duration-300 hover:translate-x-1">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-primary transition-all duration-300 hover:translate-x-1">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-primary transition-all duration-300 hover:translate-x-1">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="border-t border-border pt-8 pb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Eye className="w-4 h-4 text-primary" />
              <span>Total Visits: <span className="text-foreground font-semibold">{visitCount.toLocaleString()}</span></span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4 text-green-500" />
              <span>Online: <span className="text-foreground font-semibold">{onlineUsers}</span></span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4 text-blue-500" />
              <span>Events: <span className="text-foreground font-semibold">1,250+</span></span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Ticket className="w-4 h-4 text-purple-500" />
              <span>Tickets Sold: <span className="text-foreground font-semibold">50K+</span></span>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                <Ticket className="w-4 h-4" />
              </div>
              <span className="font-bold text-foreground">MyTikiti</span>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-muted-foreground">
              <p>© 2025 MyTikiti. All rights reserved.</p>
              <div className="flex items-center gap-1">
                <span>Made with</span>
                <span className="text-red-500 animate-pulse">❤️</span>
                <span>for event lovers</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

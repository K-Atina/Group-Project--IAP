"use client"

import { Button } from "@/components/ui/button"
import { MessageCircle, Ticket, ChevronDown, Moon, Sun } from "lucide-react"
import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useTheme } from "@/lib/theme-context"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"

interface HeaderProps {
  onOpenChat: () => void
}

export default function Header({ onOpenChat }: HeaderProps) {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const router = useRouter()
  const pathname = usePathname()
  const [showAuthMenu, setShowAuthMenu] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

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
      const headerHeight = 80 // Account for fixed header
      const elementPosition = element.offsetTop - headerHeight
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      })
    }
  }

  // Handle URL hash on page load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash
      if (hash && pathname === '/') {
        setTimeout(() => {
          smoothScrollTo(hash.substring(1))
        }, 100)
      }
    }
  }, [pathname])

  return (
    <header className="sticky top-0 z-40 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold">
              <Ticket className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-foreground">MyTikiti</span>
          </Link>

          <nav className="hidden md:flex items-center gap-4 lg:gap-8">
            <button
              onClick={() => navigateTo("/#home")}
              className={`transition-all duration-300 cursor-pointer hover:scale-105 font-medium ${
                pathname === '/' && (window.location.hash === '#home' || !window.location.hash) 
                  ? 'text-primary' 
                  : 'text-foreground hover:text-primary'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => navigateTo("/browse")}
              className={`transition-all duration-300 hover:scale-105 font-medium ${
                pathname === '/browse' 
                  ? 'text-primary' 
                  : 'text-foreground hover:text-primary'
              }`}
            >
              Browse Tickets
            </button>
            <button
              onClick={() => navigateTo("/categories")}
              className={`transition-all duration-300 hover:scale-105 font-medium ${
                pathname === '/categories' 
                  ? 'text-primary' 
                  : 'text-foreground hover:text-primary'
              }`}
            >
              Categories
            </button>
            <button
              onClick={() => navigateTo("/#about")}
              className={`transition-all duration-300 cursor-pointer hover:scale-105 font-medium ${
                pathname === '/' && window.location.hash === '#about'
                  ? 'text-primary' 
                  : 'text-foreground hover:text-primary'
              }`}
            >
              About
            </button>
            <button
              onClick={() => navigateTo("/#contact")}
              className={`transition-all duration-300 cursor-pointer hover:scale-105 font-medium ${
                pathname === '/' && window.location.hash === '#contact'
                  ? 'text-primary' 
                  : 'text-foreground hover:text-primary'
              }`}
            >
              Contact
            </button>
            {user && (
              <Link 
                href="/dashboard" 
                className={`text-foreground hover:text-primary transition-colors font-medium ${
                  pathname === '/dashboard' ? 'text-primary' : ''
                }`}
              >
                Dashboard
              </Link>
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4 relative">
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-foreground hover:text-primary">
              {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </Button>

            <Button variant="ghost" size="icon" onClick={onOpenChat} className="text-foreground hover:text-primary">
              <MessageCircle className="w-5 h-5" />
            </Button>

            {user ? (
              <div className="relative">
                <Button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2"
                >
                  <img src={user.avatar || "/placeholder.svg"} alt={user.name} className="w-5 h-5 rounded-full" />
                  <span className="hidden sm:inline">{user.name}</span>
                  <ChevronDown className="w-4 h-4" />
                </Button>

                {showUserMenu && (
                  <div className="absolute top-full right-0 mt-2 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50 w-56">
                    <div className="px-4 py-3 border-b border-border">
                      <p className="font-semibold text-foreground">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                      <p className="text-xs text-primary capitalize mt-1 bg-primary/10 px-2 py-1 rounded-full inline-block">
                        {user.role === 'tsh' ? 'Admin' : user.role}
                      </p>
                    </div>
                    
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 text-foreground hover:bg-muted transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      🏠 Dashboard
                    </Link>
                    
                    {user.role === 'buyer' && (
                      <Link
                        href="/dashboard?tab=orders"
                        className="block px-4 py-2 text-foreground hover:bg-muted transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        🎫 My Orders
                      </Link>
                    )}
                    
                    {user.role === 'buyer' && (
                      <Link
                        href="/dashboard?tab=favorites"
                        className="block px-4 py-2 text-foreground hover:bg-muted transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        ❤️ Favorites
                      </Link>
                    )}
                    
                    {user.role === 'creator' && (
                      <Link
                        href="/dashboard?tab=events"
                        className="block px-4 py-2 text-foreground hover:bg-muted transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        🎪 My Events
                      </Link>
                    )}
                    
                    {user.role === 'creator' && (
                      <Link
                        href="/dashboard?tab=create"
                        className="block px-4 py-2 text-foreground hover:bg-muted transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        ➕ Create Event
                      </Link>
                    )}
                    
                    {user.role === 'tsh' && (
                      <Link
                        href="/dashboard?tab=users"
                        className="block px-4 py-2 text-foreground hover:bg-muted transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        👥 Manage Users
                      </Link>
                    )}
                    
                    {user.role === 'tsh' && (
                      <Link
                        href="/dashboard?tab=analytics"
                        className="block px-4 py-2 text-foreground hover:bg-muted transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        📊 Analytics
                      </Link>
                    )}
                    
                    <div className="border-t border-border">
                      <Link
                        href="/dashboard?tab=profile"
                        className="block px-4 py-2 text-foreground hover:bg-muted transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        ⚙️ Profile & Settings
                      </Link>
                      <button
                        onClick={() => {
                          logout()
                          setShowUserMenu(false)
                        }}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                      >
                        🚪 Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative">
                <Button
                  onClick={() => setShowAuthMenu(!showAuthMenu)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2"
                >
                  Sign In
                  <ChevronDown className="w-4 h-4" />
                </Button>

                {showAuthMenu && (
                  <div className="absolute top-full right-0 mt-2 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50">
                    <Link
                      href="/auth/buyer"
                      className="block px-4 py-2 text-foreground hover:bg-muted hover:text-primary transition-colors whitespace-nowrap"
                      onClick={() => setShowAuthMenu(false)}
                    >
                      Sign In as Buyer
                    </Link>
                    <Link
                      href="/auth/creator"
                      className="block px-4 py-2 text-foreground hover:bg-muted hover:text-primary transition-colors border-t border-border whitespace-nowrap"
                      onClick={() => setShowAuthMenu(false)}
                    >
                      Sign In as Event Creator
                    </Link>
                    <Link
                      href="/auth/tsh"
                      className="block px-4 py-2 text-foreground hover:bg-muted hover:text-primary transition-colors border-t border-border whitespace-nowrap"
                      onClick={() => setShowAuthMenu(false)}
                    >
                      Sign In as TSH
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

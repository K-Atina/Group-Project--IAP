"use client"

import { useState, useMemo } from "react"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Heart, MapPin, User } from "lucide-react"
import Link from "next/link"
import Footer from "@/components/footer"
import TicketsCarousel from "@/components/tickets-carousel"
import ChatBot from "@/components/chatbot"

// Mock events data
const allTickets = [
  { id: 1, title: "Summer Music Festival 2025", date: "2025-06-15", location: "Central Park, New York", city: "New York", organizer: "Festival Co", price: 150, image: "/music-festival-outdoor-stage-crowd.jpg", category: "Music" },
  { id: 2, title: "Jazz Night at Blue Note", date: "2025-06-20", location: "Blue Note Jazz Club, New York", city: "New York", organizer: "Blue Note NYC", price: 85, image: "/jazz-club-intimate-performance.jpg", category: "Music" },
  { id: 3, title: "Rock Concert Extravaganza", date: "2025-07-02", location: "Madison Square Garden, New York", city: "New York", organizer: "Rock Productions", price: 120, image: "/rock-concert-stage-lights.jpg", category: "Music" },
  { id: 4, title: "NBA Championship Finals", date: "2025-06-22", location: "Crypto.com Arena, Los Angeles", city: "Los Angeles", organizer: "NBA", price: 350, image: "/basketball-game-arena-packed-crowd.jpg", category: "Sports" },
  { id: 5, title: "World Cup Football Match", date: "2025-07-10", location: "MetLife Stadium, New Jersey", city: "New Jersey", organizer: "FIFA", price: 200, image: "/football-stadium-crowd-cheering.jpg", category: "Sports" },
  { id: 6, title: "Comedy Night Spectacular", date: "2025-06-25", location: "Comedy Cellar, New York", city: "New York", organizer: "Comedy Events LLC", price: 45, image: "/comedy-show-stage-lights-performer.jpg", category: "Comedy" },
  { id: 7, title: "Improv Comedy Show", date: "2025-07-05", location: "UCB Theatre, Los Angeles", city: "Los Angeles", organizer: "UCB LA", price: 25, image: "/improv-comedy-audience-laughing.jpg", category: "Comedy" },
  { id: 8, title: "Broadway Musical: The Lion King", date: "2025-06-30", location: "Minskoff Theatre, New York", city: "New York", organizer: "Disney Theatrical Productions", price: 180, image: "/broadway-theater-performance-stage.jpg", category: "Theater" },
  { id: 9, title: "Shakespeare in the Park", date: "2025-07-12", location: "Delacorte Theater, New York", city: "New York", organizer: "The Public Theater", price: 0, image: "/shakespeare-outdoor-theater.jpg", category: "Theater" },
  { id: 10, title: "Modern Art Exhibition Opening", date: "2025-06-28", location: "MoMA, New York", city: "New York", organizer: "Museum of Modern Art", price: 30, image: "/art-gallery-exhibition-colorful-paintings.jpg", category: "Art" },
  { id: 11, title: "Tech Innovation Conference 2025", date: "2025-07-15", location: "Moscone Center, San Francisco", city: "San Francisco", organizer: "TechCorp", price: 299, image: "/tech-conference-presentation-innovation.jpg", category: "Conference" },
  { id: 12, title: "Food Truck Festival", date: "2025-07-20", location: "Brooklyn Bridge Park, New York", city: "New York", organizer: "NYC Food Events", price: 15, image: "/food-festival-vendors-crowd.jpg", category: "Food" },
]

export default function BrowsePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCity, setSelectedCity] = useState("All")
  const [selectedOrganizer, setSelectedOrganizer] = useState("All")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [minPrice, setMinPrice] = useState<number | null>(null)
  const [maxPrice, setMaxPrice] = useState<number | null>(null)
  const [liked, setLiked] = useState<Set<number>>(new Set())
  const [showChat, setShowChat] = useState(false)

  // Derived lists
  const cities = useMemo(() => ["All", ...Array.from(new Set(allTickets.map((t) => t.city)))], [])
  const organizers = useMemo(() => ["All", ...Array.from(new Set(allTickets.map((t) => t.organizer)))], [])
  const categories = useMemo(() => ["All", ...Array.from(new Set(allTickets.map((t) => t.category)))], [])

  const filteredTickets = useMemo(() => {
    return allTickets.filter((t) => {
      if (searchTerm && !t.title.toLowerCase().includes(searchTerm.toLowerCase()) && !t.location.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false
      }
      if (selectedCity !== "All" && t.city !== selectedCity) return false
      if (selectedOrganizer !== "All" && t.organizer !== selectedOrganizer) return false
      if (selectedCategory !== "All" && t.category !== selectedCategory) return false
      if (minPrice != null && t.price < minPrice) return false
      if (maxPrice != null && t.price > maxPrice) return false
      return true
    })
  }, [searchTerm, selectedCity, selectedOrganizer, selectedCategory, minPrice, maxPrice])

  const toggleLike = (id: number) => {
    setLiked((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <main className="min-h-screen bg-background">
      <Header onOpenChat={() => setShowChat(true)} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-4">Featured Tickets</h2>
          <TicketsCarousel />
        </div>

        <h1 className="text-4xl font-bold text-foreground mb-8">Browse Tickets</h1>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search events, artists, venues..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 py-3 text-lg bg-card border-border text-foreground"
            />
          </div>
        </div>

        {/* Filters Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">City</label>
            <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} className="w-full px-3 py-2 bg-card border border-border rounded">
              {cities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Organizer</label>
            <select value={selectedOrganizer} onChange={(e) => setSelectedOrganizer(e.target.value)} className="w-full px-3 py-2 bg-card border border-border rounded">
              {organizers.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Category</label>
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full px-3 py-2 bg-card border border-border rounded">
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Price range</label>
            <div className="flex gap-2">
              <input type="number" placeholder="Min" value={minPrice ?? ""} onChange={(e) => setMinPrice(e.target.value ? parseInt(e.target.value) : null)} className="w-1/2 px-3 py-2 bg-card border border-border rounded" />
              <input type="number" placeholder="Max" value={maxPrice ?? ""} onChange={(e) => setMaxPrice(e.target.value ? parseInt(e.target.value) : null)} className="w-1/2 px-3 py-2 bg-card border border-border rounded" />
            </div>
          </div>
        </div>

        {/* Results */}
        <div>
          <p className="text-sm text-muted-foreground mb-4">{filteredTickets.length} tickets found</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTickets.map((ticket) => (
              <Link key={ticket.id} href={`/event/${ticket.id}`}>
                <div className="group cursor-pointer h-full">
                  <div className="bg-card rounded-xl overflow-hidden border border-border hover:border-primary transition-all duration-300 h-full flex flex-col">
                    <div className="relative overflow-hidden h-48">
                      <img src={ticket.image || "/placeholder.svg"} alt={ticket.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <button onClick={(e) => { e.preventDefault(); toggleLike(ticket.id) }} className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-colors ${liked.has(ticket.id) ? "bg-primary text-primary-foreground" : "bg-black/20 text-white hover:bg-black/40"}`}>
                        <Heart className={`w-5 h-5 ${liked.has(ticket.id) ? "fill-current" : ""}`} />
                      </button>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-foreground mb-2 line-clamp-2">{ticket.title}</h3>
                        <p className="text-sm text-muted-foreground mb-1">{ticket.date}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1"><MapPin className="w-4 h-4" /> {ticket.location}</p>
                        <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1"><User className="w-3 h-3" /> {ticket.organizer}</p>
                      </div>
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                        <span className="text-lg font-bold text-primary">${ticket.price}</span>
                        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs h-8">Buy</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ChatBot */}
      {showChat && <ChatBot onClose={() => setShowChat(false)} />}

      <Footer />
    </main>
  )
}

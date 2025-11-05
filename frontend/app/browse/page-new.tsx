"use client"

import { useState, useMemo } from "react"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Heart, MapPin, User, Star, X } from "lucide-react"
import Link from "next/link"
import Footer from "@/components/footer"
import TicketsCarousel from "@/components/tickets-carousel"

// Mock events data
const allTickets = [
  { id: 1, title: "Summer Music Festival 2025", date: "2025-06-15", location: "Central Park, New York", city: "New York", organizer: "Festival Co", price: 150, image: "/music-festival-outdoor-stage-crowd.jpg", category: "Music", rating: 4.8 },
  { id: 2, title: "Jazz Night at Blue Note", date: "2025-06-20", location: "Blue Note Jazz Club, New York", city: "New York", organizer: "Blue Note NYC", price: 85, image: "/jazz-club-intimate-performance.jpg", category: "Music", rating: 4.9 },
  { id: 3, title: "Rock Concert Extravaganza", date: "2025-07-02", location: "Madison Square Garden, New York", city: "New York", organizer: "Rock Productions", price: 120, image: "/rock-concert-stage-lights.jpg", category: "Music", rating: 4.7 },
  { id: 4, title: "NBA Championship Finals", date: "2025-06-22", location: "Crypto.com Arena, Los Angeles", city: "Los Angeles", organizer: "NBA", price: 350, image: "/basketball-game-arena-packed-crowd.jpg", category: "Sports", rating: 4.9 },
  { id: 5, title: "World Cup Football Match", date: "2025-07-10", location: "MetLife Stadium, New Jersey", city: "New Jersey", organizer: "FIFA", price: 200, image: "/football-stadium-crowd-cheering.jpg", category: "Sports", rating: 4.8 },
  { id: 6, title: "Comedy Night Spectacular", date: "2025-06-25", location: "Comedy Cellar, New York", city: "New York", organizer: "Comedy Events LLC", price: 45, image: "/comedy-show-stage-lights-performer.jpg", category: "Comedy", rating: 4.6 },
  { id: 7, title: "Broadway Musical: The Lion King", date: "2025-06-30", location: "Minskoff Theatre, New York", city: "New York", organizer: "Disney Theatrical Productions", price: 180, image: "/broadway-theater-performance-stage.jpg", category: "Theater", rating: 4.9 },
  { id: 8, title: "Shakespeare in the Park", date: "2025-07-12", location: "Delacorte Theater, New York", city: "New York", organizer: "The Public Theater", price: 0, image: "/shakespeare-outdoor-theater.jpg", category: "Theater", rating: 4.7 },
  { id: 9, title: "Modern Art Exhibition Opening", date: "2025-06-28", location: "MoMA, New York", city: "New York", organizer: "Museum of Modern Art", price: 30, image: "/art-gallery-exhibition-colorful-paintings.jpg", category: "Art", rating: 4.5 },
  { id: 10, title: "Tech Innovation Conference 2025", date: "2025-07-15", location: "Moscone Center, San Francisco", city: "San Francisco", organizer: "TechCorp", price: 299, image: "/tech-conference-presentation-innovation.jpg", category: "Conference", rating: 4.6 },
  { id: 11, title: "Food Truck Festival", date: "2025-07-20", location: "Brooklyn Bridge Park, New York", city: "New York", organizer: "NYC Food Events", price: 15, image: "/food-festival-vendors-crowd.jpg", category: "Food", rating: 4.3 }
]

export default function BrowsePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCity, setSelectedCity] = useState("All")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedPriceRange, setSelectedPriceRange] = useState("All")
  const [sortBy, setSortBy] = useState("date")
  const [liked, setLiked] = useState<Set<number>>(new Set())
  const [showChat, setShowChat] = useState(false)

  // Filter options
  const cities = useMemo(() => ["All", ...Array.from(new Set(allTickets.map(t => t.city)))], [])
  const categories = useMemo(() => ["All", ...Array.from(new Set(allTickets.map(t => t.category)))], [])
  const priceRanges = [
    { label: "All Prices", min: 0, max: Infinity },
    { label: "Free", min: 0, max: 0 },
    { label: "$1 - $50", min: 1, max: 50 },
    { label: "$51 - $100", min: 51, max: 100 },
    { label: "$101 - $200", min: 101, max: 200 },
    { label: "$200+", min: 201, max: Infinity }
  ]

  const filteredAndSortedTickets = useMemo(() => {
    let filtered = allTickets.filter(ticket => {
      // Search filter
      if (searchTerm && !ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !ticket.location.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false
      }
      
      // City filter  
      if (selectedCity !== "All" && ticket.city !== selectedCity) return false
      
      // Category filter
      if (selectedCategory !== "All" && ticket.category !== selectedCategory) return false
      
      // Price filter
      if (selectedPriceRange !== "All") {
        const range = priceRanges.find(r => r.label === selectedPriceRange)
        if (range && (ticket.price < range.min || ticket.price > range.max)) return false
      }
      
      return true
    })

    // Sort
    if (sortBy === "price-low") {
      filtered = filtered.sort((a, b) => a.price - b.price)
    } else if (sortBy === "price-high") {
      filtered = filtered.sort((a, b) => b.price - a.price)
    } else if (sortBy === "rating") {
      filtered = filtered.sort((a, b) => b.rating - a.rating)
    } else {
      filtered = filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    }

    return filtered
  }, [searchTerm, selectedCity, selectedCategory, selectedPriceRange, sortBy])

  const toggleLike = (id: number) => {
    setLiked(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCity("All")
    setSelectedCategory("All")
    setSelectedPriceRange("All")
    setSortBy("date")
  }

  const activeFilters = [
    searchTerm && `Search: "${searchTerm}"`,
    selectedCity !== "All" && `City: ${selectedCity}`,
    selectedCategory !== "All" && `Category: ${selectedCategory}`,
    selectedPriceRange !== "All" && `Price: ${selectedPriceRange}`
  ].filter(Boolean)

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

        {/* Filters and Sort */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">City</label>
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {cities.map(city => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Category</label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Price Range</label>
            <Select value={selectedPriceRange} onValueChange={setSelectedPriceRange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {priceRanges.map(range => (
                  <SelectItem key={range.label} value={range.label}>{range.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Sort By</label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button 
              variant="outline" 
              onClick={clearFilters}
              className="w-full"
            >
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {activeFilters.map((filter, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {filter}
                <X className="w-3 h-3 cursor-pointer" onClick={clearFilters} />
              </Badge>
            ))}
          </div>
        )}

        {/* Results */}
        <div>
          <p className="text-sm text-muted-foreground mb-4">
            {filteredAndSortedTickets.length} ticket{filteredAndSortedTickets.length !== 1 ? 's' : ''} found
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedTickets.map((ticket) => (
              <Link key={ticket.id} href={`/event/${ticket.id}`}>
                <div className="group cursor-pointer h-full">
                  <div className="bg-card rounded-xl overflow-hidden border border-border hover:border-primary transition-all duration-300 h-full flex flex-col">
                    <div className="relative overflow-hidden h-48">
                      <img 
                        src={ticket.image || "/placeholder.svg"} 
                        alt={ticket.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      />
                      <button 
                        onClick={(e) => { 
                          e.preventDefault(); 
                          toggleLike(ticket.id) 
                        }} 
                        className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-colors ${
                          liked.has(ticket.id) 
                            ? "bg-primary text-primary-foreground" 
                            : "bg-black/20 text-white hover:bg-black/40"
                        }`}
                      >
                        <Heart className={`w-5 h-5 ${liked.has(ticket.id) ? "fill-current" : ""}`} />
                      </button>
                      
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-black/60 text-white border-0">
                          {ticket.category}
                        </Badge>
                      </div>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-foreground mb-2 line-clamp-2">{ticket.title}</h3>
                        <p className="text-sm text-muted-foreground mb-1">{ticket.date}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mb-2">
                          <MapPin className="w-4 h-4" /> {ticket.location}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                          <User className="w-3 h-3" /> {ticket.organizer}
                        </p>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-muted-foreground">{ticket.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                        <span className="text-lg font-bold text-primary">
                          {ticket.price === 0 ? "Free" : `$${ticket.price}`}
                        </span>
                        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs h-8">
                          Buy Ticket
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredAndSortedTickets.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎟️</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No tickets found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search or filters to find more events.
              </p>
              <Button onClick={clearFilters} variant="outline">
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  )
}
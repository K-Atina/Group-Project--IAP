"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import TwoFactorAuth from "@/components/auth/TwoFactorAuth"
import { Search, Calendar, MapPin, Users, DollarSign, ShoppingCart, Heart, Filter, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import ChatBot from "@/components/chatbot"

interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  venue: string
  category: string
  image: string
  ticketTypes: {
    id: string
    name: string
    price: number
    available: number
  }[]
  isFavorite?: boolean
}

interface Order {
  id: string
  eventTitle: string
  ticketType: string
  quantity: number
  totalAmount: number
  status: "confirmed" | "pending" | "cancelled"
  orderDate: string
  eventDate: string
}

export default function BuyerDashboard() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"browse" | "favorites" | "orders" | "profile">("browse")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showChat, setShowChat] = useState(false)
  
  // Sample events data
  const [events] = useState<Event[]>([
    {
      id: "1",
      title: "Tech Conference 2025",
      description: "Annual technology conference featuring latest innovations in AI, blockchain, and cloud computing.",
      date: "2025-12-15",
      time: "09:00",
      venue: "Convention Center, Nairobi",
      category: "Technology",
      image: "/placeholder-event.jpg",
      ticketTypes: [
        { id: "1", name: "Early Bird", price: 5000, available: 50 },
        { id: "2", name: "Regular", price: 7500, available: 300 },
        { id: "3", name: "VIP", price: 15000, available: 100 }
      ],
      isFavorite: true
    },
    {
      id: "2",
      title: "Jazz Festival",
      description: "An evening of smooth jazz with renowned local and international artists.",
      date: "2025-11-20",
      time: "18:00",
      venue: "Uhuru Gardens, Nairobi",
      category: "Music",
      image: "/placeholder-event.jpg",
      ticketTypes: [
        { id: "1", name: "General", price: 2000, available: 500 },
        { id: "2", name: "Premium", price: 5000, available: 100 }
      ],
      isFavorite: false
    },
    {
      id: "3",
      title: "Startup Pitch Night",
      description: "Watch emerging startups pitch their innovative ideas to top investors.",
      date: "2025-11-30",
      time: "19:00",
      venue: "iHub, Nairobi",
      category: "Business",
      image: "/placeholder-event.jpg",
      ticketTypes: [
        { id: "1", name: "Attendee", price: 1500, available: 200 },
        { id: "2", name: "Networking", price: 3000, available: 50 }
      ],
      isFavorite: false
    }
  ])

  // Sample orders data
  const [orders] = useState<Order[]>([
    {
      id: "ORD-001",
      eventTitle: "Tech Conference 2024",
      ticketType: "VIP",
      quantity: 1,
      totalAmount: 15000,
      status: "confirmed",
      orderDate: "2025-10-15",
      eventDate: "2025-11-15"
    },
    {
      id: "ORD-002",
      eventTitle: "Music Festival",
      ticketType: "General",
      quantity: 2,
      totalAmount: 4000,
      status: "confirmed",
      orderDate: "2025-10-10",
      eventDate: "2025-10-25"
    }
  ])

  const categories = ["all", "Technology", "Music", "Sports", "Business", "Entertainment", "Education"]
  
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || event.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const favoriteEvents = events.filter(event => event.isFavorite)

  const getStatusBadge = (status: Order["status"]) => {
    const variants: Record<Order["status"], "default" | "secondary" | "destructive"> = {
      confirmed: "default",
      pending: "secondary",
      cancelled: "destructive"
    }
    return <Badge variant={variants[status]}>{status.toUpperCase()}</Badge>
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Button 
              onClick={() => router.push('/')} 
              variant="outline" 
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => setShowChat(true)}>
                Chat Support
              </Button>
              <Button variant="outline">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Cart (0)
              </Button>
              <Button variant="outline" onClick={logout}>
                Sign Out
              </Button>
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Ticket Buyer Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user?.name}</p>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8">
            {[
              { id: "browse", label: "Browse Events" },
              { id: "favorites", label: "Favorites" },
              { id: "orders", label: "My Orders" },
              { id: "profile", label: "Profile" }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        {activeTab === "browse" && (
          <div>
            {/* Search and Filter */}
            <div className="mb-8 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search events..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  More Filters
                </Button>
              </div>
              
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category === "all" ? "All Categories" : category}
                  </Button>
                ))}
              </div>
            </div>

            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map(event => (
                <div key={event.id} className="bg-card rounded-lg border overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-muted relative">
                    <div className="absolute top-4 right-4">
                      <Button variant="outline" size="sm" className="bg-background/80">
                        <Heart className={`w-4 h-4 ${event.isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                      </Button>
                    </div>
                    <div className="absolute top-4 left-4">
                      <Badge>{event.category}</Badge>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {event.description}
                    </p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4 mr-2" />
                        {event.date} at {event.time}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 mr-2" />
                        {event.venue}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="font-medium text-sm mb-2">Tickets from:</h4>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary">
                          KES {Math.min(...event.ticketTypes.map(tt => tt.price)).toLocaleString()}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {event.ticketTypes.reduce((sum, tt) => sum + tt.available, 0)} available
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button className="flex-1">
                        Buy Tickets
                      </Button>
                      <Button variant="outline" size="sm">
                        <Heart className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredEvents.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No events found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "favorites" && (
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-8">Favorite Events</h2>
            
            {favoriteEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteEvents.map(event => (
                  <div key={event.id} className="bg-card rounded-lg border p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-lg">{event.title}</h3>
                      <Badge>{event.category}</Badge>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4 mr-2" />
                        {event.date} at {event.time}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 mr-2" />
                        {event.venue}
                      </div>
                    </div>
                    
                    <Button className="w-full">Buy Tickets</Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No favorite events</h3>
                <p className="text-muted-foreground mb-4">
                  Start adding events to your favorites to see them here
                </p>
                <Button onClick={() => setActiveTab("browse")}>Browse Events</Button>
              </div>
            )}
          </div>
        )}

        {activeTab === "orders" && (
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-8">My Orders</h2>
            
            {orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map(order => (
                  <div key={order.id} className="bg-card rounded-lg border p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{order.eventTitle}</h3>
                        <p className="text-muted-foreground">Order #{order.id}</p>
                      </div>
                      {getStatusBadge(order.status)}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Ticket Type:</span>
                        <p className="font-medium">{order.ticketType}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Quantity:</span>
                        <p className="font-medium">{order.quantity}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Total Amount:</span>
                        <p className="font-medium">KES {order.totalAmount.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Event Date:</span>
                        <p className="font-medium">{order.eventDate}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm">View Tickets</Button>
                      <Button variant="outline" size="sm">Download PDF</Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
                <p className="text-muted-foreground mb-4">
                  You haven't made any ticket purchases yet
                </p>
                <Button onClick={() => setActiveTab("browse")}>Browse Events</Button>
              </div>
            )}
          </div>
        )}

        {activeTab === "profile" && (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-8">Profile Settings</h2>
            
            <div className="space-y-6">
              <div className="bg-card rounded-lg border p-6">
                <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name</label>
                    <Input value={user?.name || ""} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <Input value={user?.email || ""} disabled />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone</label>
                    <Input placeholder="Enter phone number" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Location</label>
                    <Input placeholder="Enter your location" />
                  </div>
                </div>
                <Button className="mt-4">Save Changes</Button>
              </div>

              <TwoFactorAuth 
                isEnabled={false} 
                onToggle={(enabled: boolean) => console.log("2FA toggled:", enabled)}
                userEmail={user?.email || ""}
              />
              
              <div className="bg-card rounded-lg border p-6">
                <h3 className="text-xl font-semibold mb-4">Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive event recommendations and updates</p>
                    </div>
                    <Button variant="outline" size="sm">Enable</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">SMS Notifications</p>
                      <p className="text-sm text-muted-foreground">Get ticket confirmations via SMS</p>
                    </div>
                    <Button variant="outline" size="sm">Enable</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ChatBot */}
      {showChat && <ChatBot onClose={() => setShowChat(false)} />}
    </div>
  )
}
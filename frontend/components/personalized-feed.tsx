"use client"

import { Heart, MapPin, Calendar, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState } from "react"

const availableTickets = [
  {
    id: 5,
    title: "Electronic Music Festival",
    date: "July 5-7, 2025",
    location: "Coastal Amphitheater",
    image: "/electronic-music-festival-dj-stage-lights.jpg",
    priceRange: "$150 - $300",
    category: "Music",
    availability: 78,
  },
  {
    id: 6,
    title: "Food & Wine Tasting",
    date: "June 28, 2025",
    location: "Downtown Convention Center",
    image: "/wine-tasting-elegant-sophisticated-event.jpg",
    priceRange: "$85 - $120",
    category: "Food",
    availability: 12,
  },
  {
    id: 7,
    title: "Tech Conference 2025",
    date: "July 10-12, 2025",
    location: "Innovation Hub",
    image: "/tech-conference-presentation-innovation-stage.jpg",
    priceRange: "$299 - $599",
    category: "Tech",
    availability: 156,
  },
  {
    id: 8,
    title: "Jazz Night Under Stars",
    date: "June 30, 2025",
    location: "Rooftop Venue",
    image: "/jazz-night-live-music-performers-intimate-venue.jpg",
    priceRange: "$45 - $85",
    category: "Music",
    availability: 3,
  },
]

export default function PersonalizedFeed() {
  const [liked, setLiked] = useState<Set<number>>(new Set())

  const toggleLike = (id: number) => {
    const newLiked = new Set(liked)
    if (newLiked.has(id)) {
      newLiked.delete(id)
    } else {
      newLiked.add(id)
    }
    setLiked(newLiked)
  }

  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-2">Available Now</h2>
          <p className="text-muted-foreground">Browse our current ticket inventory across all categories and venues</p>
        </div>

        {/* Tickets Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {availableTickets.map((ticket) => (
            <Link key={ticket.id} href={`/event/${ticket.id}`}>
              <div className="group cursor-pointer bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg hover:border-primary transition-all duration-300 h-full">
                <div className="flex flex-col sm:flex-row h-full">
                  {/* Image */}
                  <div className="relative w-full sm:w-48 h-48 sm:h-auto overflow-hidden flex-shrink-0">
                    <img
                      src={ticket.image || "/placeholder.svg"}
                      alt={ticket.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3">
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          toggleLike(ticket.id)
                        }}
                        className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                          liked.has(ticket.id)
                            ? "bg-primary text-primary-foreground"
                            : "bg-black/20 text-white hover:bg-black/40"
                        }`}
                      >
                        <Heart className={`w-5 h-5 ${liked.has(ticket.id) ? "fill-current" : ""}`} />
                      </button>
                    </div>
                    <div className="absolute bottom-3 left-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                      {ticket.availability} tickets
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-bold text-foreground flex-1">{ticket.title}</h3>
                        <span className="ml-2 px-2 py-1 bg-accent/10 text-accent rounded text-xs font-semibold flex-shrink-0">
                          {ticket.category}
                        </span>
                      </div>

                      {/* Ticket Details */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          {ticket.date}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          {ticket.location}
                        </div>
                        {ticket.availability < 10 && (
                          <div className="flex items-center gap-2 text-sm text-amber-600">
                            <AlertCircle className="w-4 h-4" />
                            Only {ticket.availability} tickets left
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action */}
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-lg font-bold text-primary">{ticket.priceRange}</span>
                      <Button
                        className="bg-primary hover:bg-primary/90 text-primary-foreground"
                      >
                        Buy Tickets
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

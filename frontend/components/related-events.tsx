"use client"

import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState } from "react"

interface RelatedEventsProps {
  eventId: string
}

const relatedEvents = [
  {
    id: 9,
    title: "Fall Music Festival",
    date: "Sep 10-12, 2025",
    location: "Central Park",
    image: "/placeholder.svg?key=rel1",
    category: "Music",
  },
  {
    id: 10,
    title: "Summer Outdoor Concert",
    date: "Jul 20, 2025",
    location: "Riverside Amphitheater",
    image: "/placeholder.svg?key=rel2",
    category: "Music",
  },
  {
    id: 11,
    title: "Jazz Fest 2025",
    date: "Aug 5-7, 2025",
    location: "Downtown Arts District",
    image: "/placeholder.svg?key=rel3",
    category: "Music",
  },
  {
    id: 12,
    title: "World Music Celebration",
    date: "Aug 18, 2025",
    location: "Convention Center",
    image: "/placeholder.svg?key=rel4",
    category: "Music",
  },
]

export default function RelatedEvents({ eventId }: RelatedEventsProps) {
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
    <section className="py-16 bg-muted/30 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-foreground mb-8">Similar Events</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedEvents.map((event) => (
            <Link key={event.id} href={`/event/${event.id}`}>
              <div className="group cursor-pointer bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg hover:border-primary transition-all duration-300">
                {/* Image */}
                <div className="relative overflow-hidden h-40">
                  <img
                    src={event.image || "/placeholder.svg"}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3">
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        toggleLike(event.id)
                      }}
                      className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                        liked.has(event.id)
                          ? "bg-primary text-primary-foreground"
                          : "bg-black/20 text-white hover:bg-black/40"
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${liked.has(event.id) ? "fill-current" : ""}`} />
                    </button>
                  </div>
                  <div className="absolute top-3 left-3 bg-accent text-accent-foreground px-2 py-1 rounded text-xs font-semibold">
                    {event.category}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-bold text-foreground mb-2 line-clamp-2 text-sm">{event.title}</h3>
                  <p className="text-xs text-muted-foreground mb-1">{event.date}</p>
                  <p className="text-xs text-muted-foreground mb-4">{event.location}</p>
                  <Button
                    onClick={(e) => {
                      e.preventDefault()
                    }}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs h-8"
                  >
                    View Event
                  </Button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Heart } from "lucide-react"
import Link from "next/link"

const ticketListings = [
  {
    id: 1,
    title: "Summer Music Festival 2025",
    date: "Jun 15-17",
    location: "Central Park",
    price: "$150",
    image: "/music-festival-outdoor-stage-crowd.jpg",
    category: "Music",
    ticketsLeft: 342,
  },
  {
    id: 2,
    title: "Comedy Night Spectacular",
    date: "Jun 20",
    location: "Comedy Club Downtown",
    price: "$45",
    image: "/comedy-show-stage-lights-performer.jpg",
    category: "Comedy",
    ticketsLeft: 18,
  },
  {
    id: 3,
    title: "NBA Championship Game",
    date: "Jun 22",
    location: "Sports Arena",
    price: "$200",
    image: "/basketball-game-arena-packed-crowd.jpg",
    category: "Sports",
    ticketsLeft: 89,
  },
  {
    id: 4,
    title: "Art Exhibition Opening",
    date: "Jun 25",
    location: "Modern Art Gallery",
    price: "$25",
    image: "/art-gallery-exhibition-colorful-paintings.jpg",
    category: "Art",
    ticketsLeft: 450,
  },
]

export default function EventCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [liked, setLiked] = useState<Set<number>>(new Set())

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % ticketListings.length)
  }

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + ticketListings.length) % ticketListings.length)
  }

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
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Hot Tickets Now</h2>
            <p className="text-muted-foreground mt-2">Limited availability - grab yours before they're gone</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={prev}
              className="border-border hover:bg-muted bg-transparent"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={next}
              className="border-border hover:bg-muted bg-transparent"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Carousel */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {ticketListings.map((ticket, index) => {
            const position = (index - currentIndex + ticketListings.length) % ticketListings.length
            const isVisible = position < 4

            return isVisible ? (
              <Link key={ticket.id} href={`/event/${ticket.id}`}>
                <div className="group cursor-pointer h-full">
                  <div className="bg-card rounded-xl overflow-hidden border border-border hover:border-primary transition-all duration-300 h-full flex flex-col">
                    {/* Image */}
                    <div className="relative overflow-hidden h-48">
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
                      <div className="absolute top-3 left-3 bg-accent text-accent-foreground px-2 py-1 rounded text-xs font-semibold">
                        {ticket.ticketsLeft} left
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-foreground mb-2 line-clamp-2">{ticket.title}</h3>
                        <p className="text-sm text-muted-foreground mb-1">{ticket.date}</p>
                        <p className="text-sm text-muted-foreground">{ticket.location}</p>
                      </div>
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                        <span className="text-lg font-bold text-primary">{ticket.price}</span>
                        <Button
                          onClick={(e) => {
                            e.preventDefault()
                          }}
                          className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs h-8"
                        >
                          Buy
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ) : null
          })}
        </div>
      </div>
    </section>
  )
}

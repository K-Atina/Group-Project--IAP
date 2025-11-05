"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronLeft, ChevronRight, Heart, MapPin } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const carouselTickets = [
  {
    id: 1,
    title: "Summer Music Festival 2025",
    date: "Jun 15-17",
    location: "Central Park, NY",
    organizer: "Festival Co",
    price: "$150",
    image: "/music-festival-outdoor-stage-crowd.jpg",
    category: "Music",
  },
  {
    id: 2,
    title: "Comedy Night Spectacular",
    date: "Jun 20",
    location: "Comedy Club Downtown, NY",
    organizer: "Comedy Events",
    price: "$45",
    image: "/comedy-show-stage-lights-performer.jpg",
    category: "Comedy",
  },
  {
    id: 3,
    title: "NBA Championship Game",
    date: "Jun 22",
    location: "Sports Arena, LA",
    organizer: "NBA",
    price: "$200",
    image: "/basketball-game-arena-packed-crowd.jpg",
    category: "Sports",
  },
  {
    id: 4,
    title: "Art Exhibition Opening",
    date: "Jun 25",
    location: "Modern Art Gallery, NY",
    organizer: "Art Society",
    price: "$25",
    image: "/art-gallery-exhibition-colorful-paintings.jpg",
    category: "Art",
  },
  {
    id: 5,
    title: "Jazz Night Live",
    date: "Jun 28",
    location: "Jazz Lounge, Chicago, IL",
    organizer: "Jazz Productions",
    price: "$60",
    image: "/jazz-night-live-music-performers-intimate-venue.jpg",
    category: "Music",
  },
  {
    id: 6,
    title: "Tech Conference 2025",
    date: "Jul 1-3",
    location: "Convention Center, SF, CA",
    organizer: "Tech Events",
    price: "$299",
    image: "/tech-conference-presentation-innovation.jpg",
    category: "Conference",
  },
]

export default function TicketsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [liked, setLiked] = useState<Set<number>>(new Set())
  const carouselRef = useRef<HTMLDivElement>(null)
  const autoScrollTimerRef = useRef<NodeJS.Timeout | null>(null)

  const getVisibleCount = () => {
    if (typeof window === "undefined") return 4
    const width = window.innerWidth
    if (width < 640) return 1 // mobile - 1 ticket
    if (width < 1024) return 2 // tablet - 2 tickets
    return 4 // desktop - 4 tickets
  }

  const [visibleCount, setVisibleCount] = useState(4)

  useEffect(() => {
    setVisibleCount(getVisibleCount())
    const handleResize = () => setVisibleCount(getVisibleCount())
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    const startAutoScroll = () => {
      autoScrollTimerRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % carouselTickets.length)
      }, 5000)
    }

    startAutoScroll()

    return () => {
      if (autoScrollTimerRef.current) {
        clearInterval(autoScrollTimerRef.current)
      }
    }
  }, [])

  const scroll = (direction: "left" | "right") => {
    if (autoScrollTimerRef.current) {
      clearInterval(autoScrollTimerRef.current)
    }

    if (direction === "left") {
      setCurrentIndex((prev) => (prev - 1 + carouselTickets.length) % carouselTickets.length)
    } else {
      setCurrentIndex((prev) => (prev + 1) % carouselTickets.length)
    }

    autoScrollTimerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselTickets.length)
    }, 5000)
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

  const visibleTickets = []
  for (let i = 0; i < visibleCount; i++) {
    visibleTickets.push(carouselTickets[(currentIndex + i) % carouselTickets.length])
  }

  return (
    <div className="w-full bg-card border border-border rounded-xl overflow-hidden">
      <div className="flex items-center justify-between gap-2 sm:gap-4 p-3 sm:p-6">
        {/* Left Arrow */}
        <button
          onClick={() => scroll("left")}
          className="flex-shrink-0 p-1.5 sm:p-2 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground transition-colors"
          aria-label="Previous tickets"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <div className="flex-1 overflow-hidden" ref={carouselRef}>
          <div className="flex gap-2 sm:gap-4 transition-transform duration-500 ease-out">
            {visibleTickets.map((ticket, idx) => (
              <div
                key={`${ticket.id}-${idx}`}
                className={`flex-shrink-0 ${
                  visibleCount === 1 ? "w-full" : visibleCount === 2 ? "w-1/2" : "w-1/4"
                } group`}
              >
                <Link href={`/event/${ticket.id}`}>
                  <div className="bg-card rounded-lg overflow-hidden border border-border hover:border-primary transition-all duration-300 h-full flex flex-col cursor-pointer">
                    <div className="relative overflow-hidden h-32 sm:h-40">
                      <img
                        src={ticket.image || "/placeholder.svg"}
                        alt={ticket.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          toggleLike(ticket.id)
                        }}
                        className={`absolute top-2 right-2 p-1 sm:p-1.5 rounded-full backdrop-blur-sm transition-colors ${
                          liked.has(ticket.id)
                            ? "bg-primary text-primary-foreground"
                            : "bg-black/20 text-white hover:bg-black/40"
                        }`}
                      >
                        <Heart className={`w-3 h-3 sm:w-4 sm:h-4 ${liked.has(ticket.id) ? "fill-current" : ""}`} />
                      </button>
                    </div>

                    <div className="p-2 sm:p-3 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-semibold text-xs sm:text-sm text-foreground mb-1 line-clamp-2">
                          {ticket.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mb-1">{ticket.date}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-0.5 line-clamp-1">
                          <MapPin className="w-3 h-3 flex-shrink-0" /> {ticket.location}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
                        <span className="text-xs sm:text-sm font-bold text-primary">{ticket.price}</span>
                        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs h-6 sm:h-7 px-1.5 sm:px-2">
                          Buy
                        </Button>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll("right")}
          className="flex-shrink-0 p-1.5 sm:p-2 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground transition-colors"
          aria-label="Next tickets"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>

      <div className="flex justify-center gap-2 pb-3 sm:pb-4">
        {carouselTickets.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (autoScrollTimerRef.current) {
                clearInterval(autoScrollTimerRef.current)
              }
              setCurrentIndex(index)
              autoScrollTimerRef.current = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % carouselTickets.length)
              }, 5000)
            }}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex ? "bg-primary w-6" : "bg-muted-foreground"
            }`}
            aria-label={`Go to ticket group ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

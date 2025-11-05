"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

const categories = [
  {
    id: 1,
    name: "Music",
    image: "/concert-stage-lights-music-festival.jpg",
  },
  {
    id: 2,
    name: "Sports",
    image: "/stadium-sports-crowd-excitement.jpg",
  },
  {
    id: 3,
    name: "Theater",
    image: "/broadway-theater-performance-stage.jpg",
  },
  {
    id: 4,
    name: "Comedy",
    image: "/comedy-club-comedian-laughing-audience.jpg",
  },
  {
    id: 5,
    name: "Festivals",
    image: "/festival-outdoor-celebration-crowd.jpg",
  },
  {
    id: 6,
    name: "Conferences",
    image: "/tech-conference-presentation-innovation.jpg",
  },
]

export default function CategoryCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)

  useEffect(() => {
    if (!autoPlay) return

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % categories.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [autoPlay])

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % categories.length)
    setAutoPlay(false)
    setTimeout(() => setAutoPlay(true), 8000)
  }

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + categories.length) % categories.length)
    setAutoPlay(false)
    setTimeout(() => setAutoPlay(true), 8000)
  }

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Browse by Category</h2>
            <p className="text-muted-foreground mt-2">Explore tickets across different event types</p>
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

        <div className="overflow-hidden">
          <div
            className="flex gap-3 transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / 3)}%)`,
            }}
          >
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/browse?category=${category.name}`}
                className="group cursor-pointer text-left flex-shrink-0 w-full sm:w-1/2 lg:w-1/3"
              >
                <div className="relative overflow-hidden rounded-lg h-44 w-full bg-card border border-border hover:border-primary transition-all duration-300">
                  <img
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <h3 className="absolute bottom-4 left-4 text-lg font-bold text-white">{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-2 mt-6">
          {categories.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index)
                setAutoPlay(false)
                setTimeout(() => setAutoPlay(true), 8000)
              }}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? "bg-primary" : "bg-border"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

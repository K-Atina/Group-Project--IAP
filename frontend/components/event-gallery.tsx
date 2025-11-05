"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface EventGalleryProps {
  eventId: string
}

const images = [
  { id: 1, url: "/placeholder.svg?key=gal1", alt: "Event main stage" },
  { id: 2, url: "/placeholder.svg?key=gal2", alt: "Crowd view" },
  { id: 3, url: "/placeholder.svg?key=gal3", alt: "Performance" },
  { id: 4, url: "/placeholder.svg?key=gal4", alt: "Venue interior" },
]

export default function EventGallery({ eventId }: EventGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className="relative w-full h-96 md:h-[500px] bg-muted overflow-hidden group">
      {/* Main Image */}
      <img
        src={images[currentImageIndex].url || "/placeholder.svg"}
        alt={images[currentImageIndex].alt}
        className="w-full h-full object-cover"
      />

      {/* Navigation Buttons */}
      <button
        onClick={prevImage}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition-colors z-10 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={nextImage}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition-colors z-10 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Image Counter */}
      <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
        {currentImageIndex + 1} / {images.length}
      </div>

      {/* Thumbnail Strip */}
      <div className="absolute bottom-4 left-4 flex gap-2 z-10">
        {images.map((image, index) => (
          <button
            key={image.id}
            onClick={() => setCurrentImageIndex(index)}
            className={`w-12 h-12 rounded border-2 overflow-hidden transition-all ${
              index === currentImageIndex ? "border-primary" : "border-white/30 hover:border-white/60"
            }`}
          >
            <img src={image.url || "/placeholder.svg"} alt={image.alt} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  )
}

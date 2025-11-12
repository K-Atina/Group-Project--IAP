"use client"

import { useState, lazy, Suspense } from "react"
import { useParams } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import EventGallery from "@/components/event-gallery"
import EventDetails from "@/components/event-details"
import BookingSection from "@/components/booking-section"
import { Button } from "@/components/ui/button"
import { Share2, Heart } from "lucide-react"

// Lazy load non-critical components
const RelatedEvents = lazy(() => import("@/components/related-events"))

export default function EventPage() {
  const params = useParams()
  const eventId = params.id as string
  const [isLiked, setIsLiked] = useState(false)
  const [showChat, setShowChat] = useState(false)

  return (
    <main className="min-h-screen bg-background">
      <Header onOpenChat={() => setShowChat(true)} />

      {/* Gallery Section */}
      <EventGallery eventId={eventId} />

      {/* Main Content */}
      <div className="bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Event Details */}
            <div className="lg:col-span-2 space-y-8">
              <EventDetails eventId={eventId} />

              {/* Action Buttons */}
              <div className="flex gap-3 pt-8 border-t border-border">
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1 border-border text-foreground hover:bg-muted bg-transparent"
                  onClick={() => setIsLiked(!isLiked)}
                >
                  <Heart className={`w-5 h-5 mr-2 ${isLiked ? "fill-primary text-primary" : ""}`} />
                  {isLiked ? "Liked" : "Save Event"}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1 border-border text-foreground hover:bg-muted bg-transparent"
                >
                  <Share2 className="w-5 h-5 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            {/* Right Column - Booking */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <BookingSection eventId={eventId} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Events */}
      <Suspense fallback={<div className="h-96 bg-muted/30 animate-pulse" />}>
        <RelatedEvents eventId={eventId} />
      </Suspense>

      <Footer />
    </main>
  )
}

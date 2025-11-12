"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { MapPin, Calendar, Clock } from "lucide-react"

interface BookingDetails {
  eventId: string
  ticketType: string
  ticketPrice: number
  quantity: number
  subtotal: number
  fees: number
  total: number
}

export default function OrderSummary() {
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('bookingDetails')
      if (stored) {
        setBookingDetails(JSON.parse(stored))
      }
    }
  }, [])

  // Default values if no booking details
  const ticketType = bookingDetails?.ticketType || "General Admission"
  const quantity = bookingDetails?.quantity || 2
  const subtotal = bookingDetails?.subtotal || 300
  const fees = bookingDetails?.fees || 30
  const total = bookingDetails?.total || 330

  return (
    <Card className="bg-card border-border p-6 space-y-6">
      {/* Event Summary */}
      <div>
        <h3 className="font-bold text-foreground mb-4">Order Summary</h3>

        <div className="aspect-video rounded-lg overflow-hidden mb-4 bg-muted">
          <img src="/music-festival-outdoor-stage-crowd.jpg" alt="Event" className="w-full h-full object-cover" />
        </div>

        <div className="space-y-3">
          <p className="font-semibold text-foreground text-lg">Summer Music Festival 2025</p>
          
          {/* Event Details with Icons */}
          <div className="space-y-2">
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
              <span>June 15-17, 2025</span>
            </div>
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
              <span>Doors open at 6:00 PM</span>
            </div>
          </div>

          {/* Location Section - Prominent */}
          <div className="bg-orange-50 dark:bg-orange-950/30 border-2 border-orange-200 dark:border-orange-800 rounded-lg p-3 mt-3">
            <div className="flex items-start gap-2">
              <MapPin className="w-5 h-5 flex-shrink-0 text-orange-600 dark:text-orange-400 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-foreground text-sm mb-1">Event Location</p>
                <p className="text-sm text-foreground">Central Park Great Lawn</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Mid-Park at 79th Street, New York, NY 10024
                </p>
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=Central+Park+Great+Lawn+New+York" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-orange-600 dark:text-orange-400 hover:underline mt-1 inline-block"
                >
                  View on Google Maps →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tickets */}
      <div className="border-t border-border pt-6 space-y-3">
        <h4 className="font-bold text-foreground">Tickets</h4>

        <div className="bg-muted rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-semibold text-foreground text-sm">{ticketType}</p>
              <p className="text-xs text-muted-foreground">Qty: {quantity}</p>
            </div>
            <p className="font-semibold text-foreground">${subtotal}</p>
          </div>
        </div>
      </div>

      {/* Pricing Breakdown */}
      <div className="border-t border-border pt-6 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-foreground">Subtotal</span>
          <span className="text-foreground">${subtotal}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-foreground">Service Fee</span>
          <span className="text-foreground">${fees}</span>
        </div>

        <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
          <div className="flex justify-between">
            <span className="font-bold text-foreground">Total</span>
            <span className="text-lg font-bold text-primary">${total}</span>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-900 space-y-1">
        <p className="font-semibold">Booking Terms</p>
        <ul className="list-disc list-inside space-y-1 text-xs">
          <li>Tickets are non-refundable</li>
          <li>Digital tickets sent via email</li>
          <li>Valid ID required at entry</li>
        </ul>
      </div>

      {/* Promo Code */}
      <div className="border-t border-border pt-6">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter promo code"
            className="flex-1 px-3 py-2 bg-background border border-border rounded text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button className="px-4 py-2 text-primary font-semibold text-sm hover:underline">Apply</button>
        </div>
      </div>
    </Card>
  )
}

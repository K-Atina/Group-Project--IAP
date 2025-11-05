"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Minus, Plus } from "lucide-react"

interface BookingSectionProps {
  eventId: string
}

const ticketOptions = [
  { id: 1, type: "General Admission", price: 150, description: "Full event access" },
  { id: 2, type: "VIP Pass", price: 300, description: "Premium area + perks" },
  { id: 3, type: "Camping Pass", price: 200, description: "Include camping" },
]

export default function BookingSection({ eventId }: BookingSectionProps) {
  const [selectedTicket, setSelectedTicket] = useState(ticketOptions[0])
  const [quantity, setQuantity] = useState(1)

  const subtotal = selectedTicket.price * quantity
  const fees = Math.round(subtotal * 0.1)
  const total = subtotal + fees

  const decreaseQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1))
  }

  const increaseQuantity = () => {
    setQuantity((prev) => Math.min(10, prev + 1))
  }

  return (
    <Card className="bg-card border-border p-6 space-y-6">
      {/* Ticket Selection */}
      <div>
        <h3 className="font-bold text-foreground mb-3">Select Tickets</h3>
        <div className="space-y-2">
          {ticketOptions.map((ticket) => (
            <button
              key={ticket.id}
              onClick={() => setSelectedTicket(ticket)}
              className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                selectedTicket.id === ticket.id
                  ? "border-primary bg-primary/5"
                  : "border-border bg-muted/50 hover:border-border/80"
              }`}
            >
              <div className="flex items-start justify-between mb-1">
                <p className="font-semibold text-foreground">{ticket.type}</p>
                <span className="text-primary font-bold">${ticket.price}</span>
              </div>
              <p className="text-xs text-muted-foreground">{ticket.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Quantity Selector */}
      <div>
        <h3 className="font-bold text-foreground mb-3">Quantity</h3>
        <div className="flex items-center gap-4 bg-muted rounded-lg p-3">
          <button
            onClick={decreaseQuantity}
            className="p-1 hover:bg-background rounded transition-colors"
            disabled={quantity <= 1}
          >
            <Minus className="w-5 h-5 text-foreground" />
          </button>
          <span className="flex-1 text-center text-lg font-bold text-foreground">{quantity}</span>
          <button
            onClick={increaseQuantity}
            className="p-1 hover:bg-background rounded transition-colors"
            disabled={quantity >= 10}
          >
            <Plus className="w-5 h-5 text-foreground" />
          </button>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="space-y-3 py-4 border-y border-border">
        <div className="flex justify-between text-sm text-foreground">
          <span>Subtotal</span>
          <span>${subtotal}</span>
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Service fee</span>
          <span>${fees}</span>
        </div>
        <div className="flex justify-between text-lg font-bold text-foreground">
          <span>Total</span>
          <span className="text-primary">${total}</span>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="space-y-2">
        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-base h-12 font-semibold">
          Proceed to Checkout
        </Button>
        <Button variant="outline" className="w-full border-border text-foreground hover:bg-muted bg-transparent">
          Add to Wishlist
        </Button>
      </div>

      {/* Info */}
      <div className="bg-accent/10 border border-accent/20 rounded-lg p-3 text-xs text-foreground">
        <p className="font-semibold mb-1">Limited availability</p>
        <p className="text-muted-foreground">Only {50 - quantity * 3} tickets remaining!</p>
      </div>
    </Card>
  )
}

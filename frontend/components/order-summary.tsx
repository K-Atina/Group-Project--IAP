"use client"

import { Card } from "@/components/ui/card"

export default function OrderSummary() {
  return (
    <Card className="bg-card border-border p-6 space-y-6">
      {/* Event Summary */}
      <div>
        <h3 className="font-bold text-foreground mb-4">Order Summary</h3>

        <div className="aspect-video rounded-lg overflow-hidden mb-4 bg-muted">
          <img src="/placeholder.svg?height=200&width=400" alt="Event" className="w-full h-full object-cover" />
        </div>

        <div className="space-y-2">
          <p className="font-semibold text-foreground">Summer Music Festival 2025</p>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>June 15-17, 2025</p>
            <p>Central Park, New York</p>
          </div>
        </div>
      </div>

      {/* Tickets */}
      <div className="border-t border-border pt-6 space-y-3">
        <h4 className="font-bold text-foreground">Tickets</h4>

        <div className="bg-muted rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-semibold text-foreground text-sm">General Admission</p>
              <p className="text-xs text-muted-foreground">Qty: 2</p>
            </div>
            <p className="font-semibold text-foreground">$300</p>
          </div>
        </div>
      </div>

      {/* Pricing Breakdown */}
      <div className="border-t border-border pt-6 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-foreground">Subtotal</span>
          <span className="text-foreground">$300</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-foreground">Service Fee</span>
          <span className="text-foreground">$30</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-foreground">Processing Fee</span>
          <span className="text-foreground">$5</span>
        </div>

        <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
          <div className="flex justify-between">
            <span className="font-bold text-foreground">Total</span>
            <span className="text-lg font-bold text-primary">$335</span>
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

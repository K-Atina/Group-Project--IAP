"use client"

import { useState } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import CheckoutForm from "@/components/checkout-form"
import OrderSummary from "@/components/order-summary"
import { Card } from "@/components/ui/card"

export default function CheckoutPage() {
  const [showChat, setShowChat] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success">("idle")

  return (
    <main className="min-h-screen bg-muted/30">
      <Header onOpenChat={() => setShowChat(true)} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">Secure Checkout</h1>
          <p className="text-muted-foreground">Complete your booking for Summer Music Festival 2025</p>
        </div>

        {/* Main Content */}
        {paymentStatus === "success" ? (
          <Card className="bg-card border-border p-12 text-center max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Booking Confirmed!</h2>
            <p className="text-muted-foreground mb-6">
              Your tickets have been confirmed and sent to your email. Check your inbox for confirmation details.
            </p>
            <div className="bg-muted rounded-lg p-6 mb-6 text-left">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-foreground">Confirmation #:</span>
                  <span className="font-semibold text-foreground">EVT-2024-891234</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground">Event:</span>
                  <span className="font-semibold text-foreground">Summer Music Festival</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground">Tickets:</span>
                  <span className="font-semibold text-foreground">2x General Admission</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => (window.location.href = "/")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Back to Home
            </button>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Checkout Form */}
            <div className="lg:col-span-2">
              <CheckoutForm paymentStatus={paymentStatus} onPaymentStatusChange={setPaymentStatus} />
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <OrderSummary />
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}

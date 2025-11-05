"use client"

import React from "react"
import { useAuth } from "@/lib/auth-context"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Ticket, MapPin, Calendar } from "lucide-react"

export default function MyPurchasesPage() {
  const { user } = useAuth()
  const [showChat, setShowChat] = React.useState(false)

  if (!user || user.role !== "buyer") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Access Denied</h1>
          <Link href="/">
            <Button className="bg-primary hover:bg-primary/90">Go to Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  const purchases = [
    {
      id: 1,
      event: "Summer Music Festival 2025",
      date: "Jun 15-17",
      location: "Central Park, NY",
      tickets: 2,
      price: "$300",
      status: "Confirmed",
    },
    {
      id: 2,
      event: "Comedy Night Spectacular",
      date: "Jun 20",
      location: "Comedy Club Downtown, NY",
      tickets: 1,
      price: "$45",
      status: "Confirmed",
    },
    {
      id: 3,
      event: "NBA Championship Game",
      date: "Jun 22",
      location: "Sports Arena, LA",
      tickets: 3,
      price: "$600",
      status: "Processing",
    },
  ]

  return (
    <main className="min-h-screen bg-background">
      <Header onOpenChat={() => setShowChat(true)} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-foreground mb-2">My Purchases</h1>
        <p className="text-muted-foreground mb-8">View and manage all your ticket purchases</p>

        <div className="space-y-4">
          {purchases.map((purchase) => (
            <div
              key={purchase.id}
              className="bg-card rounded-xl border border-border p-6 hover:border-primary transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-foreground mb-3">{purchase.event}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">{purchase.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{purchase.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Ticket className="w-4 h-4" />
                      <span className="text-sm">{purchase.tickets} ticket(s)</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary mb-2">{purchase.price}</p>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      purchase.status === "Confirmed"
                        ? "bg-green-500/10 text-green-700 dark:text-green-400"
                        : "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
                    }`}
                  >
                    {purchase.status}
                  </span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-border flex gap-2">
                <Button variant="outline" className="flex-1 bg-transparent">
                  Download Tickets
                </Button>
                <Button className="flex-1 bg-primary hover:bg-primary/90">View Details</Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-muted-foreground mb-4">Want to buy more tickets?</p>
          <Link href="/browse">
            <Button className="bg-primary hover:bg-primary/90">Browse More Events</Button>
          </Link>
        </div>
      </div>

      <Footer />
    </main>
  )
}

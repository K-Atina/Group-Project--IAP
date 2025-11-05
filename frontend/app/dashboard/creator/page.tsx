"use client"

import React from "react"

import { useAuth } from "@/lib/auth-context"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Plus, Ticket, Users, TrendingUp } from "lucide-react"

export default function CreatorDashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const [showChat, setShowChat] = React.useState(false)

  if (!user || user.role !== "creator") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-4">This page is for event creators only.</p>
          <Link href="/auth/creator">
            <Button className="bg-primary hover:bg-primary/90">Sign in as Creator</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Header onOpenChat={() => setShowChat(true)} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Creator Dashboard</h1>
            <p className="text-muted-foreground mt-2">Welcome back, {user.name}!</p>
          </div>
          <Link href="/create-event">
            <Button className="bg-primary hover:bg-primary/90 flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Create Event
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Ticket className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Active Events</p>
                <p className="text-3xl font-bold text-foreground">5</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Total Tickets Sold</p>
                <p className="text-3xl font-bold text-foreground">1,234</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Total Revenue</p>
                <p className="text-3xl font-bold text-foreground">$45,280</p>
              </div>
            </div>
          </div>
        </div>

        {/* Events List */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-bold text-foreground">Your Events</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-6 py-3 text-sm font-semibold text-foreground">Event Name</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-foreground">Date</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-foreground">Tickets Sold</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-foreground">Revenue</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { id: 1, name: "Summer Music Fest", date: "Jun 15-17", sold: 342, revenue: "$12,840" },
                  { id: 2, name: "Comedy Night", date: "Jun 20", sold: 128, revenue: "$5,760" },
                  { id: 3, name: "Art Exhibition", date: "Jun 25", sold: 412, revenue: "$10,300" },
                ].map((event) => (
                  <tr key={event.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 text-foreground">{event.name}</td>
                    <td className="px-6 py-4 text-foreground">{event.date}</td>
                    <td className="px-6 py-4 text-foreground">{event.sold}</td>
                    <td className="px-6 py-4 font-semibold text-primary">{event.revenue}</td>
                    <td className="px-6 py-4">
                      <Button variant="outline" size="sm" className="text-xs bg-transparent">
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}

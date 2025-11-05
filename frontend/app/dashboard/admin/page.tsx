"use client"

import React from "react"
import { useAuth } from "@/lib/auth-context"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BarChart3, Users, Ticket, TrendingUp } from "lucide-react"

export default function AdminDashboard() {
  const { user } = useAuth()
  const [showChat, setShowChat] = React.useState(false)

  if (!user || user.role !== "tsh") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-4">This page is for TSH admins only.</p>
          <Link href="/auth/tsh">
            <Button className="bg-primary hover:bg-primary/90">Sign in as Admin</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Header onOpenChat={() => setShowChat(true)} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">Platform Analytics & Management</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8 mb-8">
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Total Users</p>
                <p className="text-3xl font-bold text-foreground">12,453</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Ticket className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Total Tickets Sold</p>
                <p className="text-3xl font-bold text-foreground">98,234</p>
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
                <p className="text-3xl font-bold text-foreground">$1.2M</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Active Events</p>
                <p className="text-3xl font-bold text-foreground">356</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-bold text-foreground">Recent Transactions</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-6 py-3 text-sm font-semibold text-foreground">Event</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-foreground">Buyer</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-foreground">Tickets</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-foreground">Amount</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    id: 1,
                    event: "Summer Music Fest",
                    buyer: "John Doe",
                    tickets: 3,
                    amount: "$450",
                    status: "Completed",
                  },
                  { id: 2, event: "Comedy Night", buyer: "Jane Smith", tickets: 2, amount: "$90", status: "Completed" },
                  {
                    id: 3,
                    event: "Art Exhibition",
                    buyer: "Bob Johnson",
                    tickets: 1,
                    amount: "$25",
                    status: "Pending",
                  },
                ].map((tx) => (
                  <tr key={tx.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 text-foreground">{tx.event}</td>
                    <td className="px-6 py-4 text-foreground">{tx.buyer}</td>
                    <td className="px-6 py-4 text-foreground">{tx.tickets}</td>
                    <td className="px-6 py-4 font-semibold text-primary">{tx.amount}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          tx.status === "Completed"
                            ? "bg-green-500/10 text-green-700 dark:text-green-400"
                            : "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
                        }`}
                      >
                        {tx.status}
                      </span>
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

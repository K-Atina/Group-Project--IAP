"use client"

import React from "react"
import { useAuth } from "@/lib/auth-context"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [showChat, setShowChat] = React.useState(false)

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Please Sign In</h1>
          <Link href="/">
            <Button className="bg-primary hover:bg-primary/90">Go to Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Header onOpenChat={() => setShowChat(true)} />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-foreground mb-8">My Profile</h1>

        <div className="bg-card rounded-xl border border-border p-8 space-y-6">
          {/* Profile Picture */}
          <div className="flex items-center gap-6">
            <img src={user.avatar || "/placeholder.svg"} alt={user.name} className="w-16 h-16 rounded-full" />
            <div>
              <h2 className="text-2xl font-bold text-foreground">{user.name}</h2>
              <p className="text-muted-foreground capitalize">{user.role}</p>
            </div>
          </div>

          {/* Profile Fields */}
          <div className="space-y-4 pt-6 border-t border-border">
            <div>
              <label className="text-sm font-medium text-foreground">Email</label>
              <Input type="email" value={user.email} disabled className="mt-1 bg-muted text-foreground border-border" />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Account Type</label>
              <Input
                type="text"
                value={user.role}
                disabled
                className="mt-1 bg-muted text-foreground border-border capitalize"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground flex-1">Edit Profile</Button>
            <Button variant="outline" className="flex-1 bg-transparent">
              Change Password
            </Button>
          </div>
        </div>

        {/* Role-specific sections */}
        {user.role === "buyer" && (
          <div className="mt-8 bg-card rounded-xl border border-border p-8">
            <h3 className="text-xl font-bold text-foreground mb-4">Your Purchases</h3>
            <p className="text-muted-foreground">You have 3 upcoming events</p>
            <Button className="mt-4 bg-primary hover:bg-primary/90">View All Purchases</Button>
          </div>
        )}

        {user.role === "creator" && (
          <div className="mt-8 bg-card rounded-xl border border-border p-8">
            <h3 className="text-xl font-bold text-foreground mb-4">Creator Tools</h3>
            <p className="text-muted-foreground mb-4">Manage your events and sales</p>
            <Link href="/dashboard/creator">
              <Button className="bg-primary hover:bg-primary/90">Go to Creator Dashboard</Button>
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}

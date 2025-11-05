"use client"

import React from "react"
import { useAuth } from "@/lib/auth-context"
import { useTheme } from "@/lib/theme-context"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function SettingsPage() {
  const { user } = useAuth()
  const { theme, toggleTheme } = useTheme()
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
        <h1 className="text-3xl font-bold text-foreground mb-8">Settings</h1>

        {/* Appearance Settings */}
        <div className="bg-card rounded-xl border border-border p-8 mb-6">
          <h2 className="text-xl font-bold text-foreground mb-6">Appearance</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-foreground font-medium">Dark Mode</p>
              <p className="text-muted-foreground text-sm">
                Currently: <span className="capitalize">{theme}</span>
              </p>
            </div>
            <Button onClick={toggleTheme} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Toggle Theme
            </Button>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-card rounded-xl border border-border p-8 mb-6">
          <h2 className="text-xl font-bold text-foreground mb-6">Notifications</h2>
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-border" />
              <span className="text-foreground">Email notifications for new events</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-border" />
              <span className="text-foreground">Order confirmation emails</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-5 h-5 rounded border-border" />
              <span className="text-foreground">Marketing emails and special offers</span>
            </label>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="bg-card rounded-xl border border-border p-8">
          <h2 className="text-xl font-bold text-foreground mb-6">Privacy</h2>
          <div className="space-y-4">
            <p className="text-foreground mb-4">Control who can see your profile and activity</p>
            <Button variant="outline" className="w-full justify-start text-foreground bg-transparent">
              Privacy Policy
            </Button>
            <Button variant="outline" className="w-full justify-start text-foreground bg-transparent">
              Terms of Service
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}

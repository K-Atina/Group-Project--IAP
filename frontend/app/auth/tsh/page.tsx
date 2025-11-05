"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Ticket } from "lucide-react"

export default function TSHAuthPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [adminCode, setAdminCode] = useState("")
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simple admin code verification
    if (adminCode === "ADMIN123") {
      login(email, password, "tsh")
      router.push("/dashboard/admin")
    } else {
      alert("Invalid admin code")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-100 to-orange-100 dark:from-orange-950 dark:via-orange-900 dark:to-orange-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-background rounded-2xl border border-border p-8 shadow-lg">
          <Link href="/" className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold">
              <Ticket className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold text-foreground">MyTikiti</span>
          </Link>

          <h1 className="text-3xl font-bold text-foreground mb-2">TSH Admin Portal</h1>
          <p className="text-muted-foreground mb-8">Sign in to the admin dashboard</p>
          <p className="text-xs bg-muted p-3 rounded mb-6 text-muted-foreground">Demo Code: ADMIN123</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@mytikiti.com"
                className="mt-1 bg-background text-foreground border-border"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1 bg-background text-foreground border-border"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Admin Code</label>
              <Input
                type="password"
                value={adminCode}
                onChange={(e) => setAdminCode(e.target.value)}
                placeholder="Enter admin code"
                className="mt-1 bg-background text-foreground border-border"
                required
              />
            </div>

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground mt-6">
              Sign In
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground text-center mb-3">Other roles:</p>
            <div className="flex gap-2">
              <Link href="/auth/buyer" className="flex-1">
                <Button variant="outline" className="w-full bg-transparent">
                  Ticket Buyer
                </Button>
              </Link>
              <Link href="/auth/creator" className="flex-1">
                <Button variant="outline" className="w-full bg-transparent">
                  Event Creator
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

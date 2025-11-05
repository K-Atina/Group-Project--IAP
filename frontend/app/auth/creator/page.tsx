"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Ticket } from "lucide-react"

export default function CreatorAuthPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [isSignUp, setIsSignUp] = useState(false)
  const { login, signup } = useAuth()
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isSignUp) {
      signup(companyName || name, email, password, "creator")
    } else {
      login(email, password, "creator")
    }
    router.push("/dashboard/creator")
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

          <h1 className="text-3xl font-bold text-foreground mb-2">
            {isSignUp ? "Create Event Creator Account" : "Creator Sign In"}
          </h1>
          <p className="text-muted-foreground mb-8">
            {isSignUp ? "Start creating and selling tickets" : "Sign in to your creator dashboard"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <>
                <div>
                  <label className="text-sm font-medium text-foreground">Full Name</label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                    className="mt-1 bg-background text-foreground border-border"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Company/Organization Name</label>
                  <Input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Event Company"
                    className="mt-1 bg-background text-foreground border-border"
                    required
                  />
                </div>
              </>
            )}

            <div>
              <label className="text-sm font-medium text-foreground">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="creator@company.com"
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

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground mt-6">
              {isSignUp ? "Create Account" : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button onClick={() => setIsSignUp(!isSignUp)} className="text-primary hover:underline text-sm">
              {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground text-center mb-3">Other roles:</p>
            <div className="flex gap-2">
              <Link href="/auth/buyer" className="flex-1">
                <Button variant="outline" className="w-full bg-transparent">
                  Ticket Buyer
                </Button>
              </Link>
              <Link href="/auth/tsh" className="flex-1">
                <Button variant="outline" className="w-full bg-transparent">
                  TSH Admin
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

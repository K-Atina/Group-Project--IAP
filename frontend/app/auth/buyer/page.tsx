"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Ticket, ArrowLeft } from "lucide-react"

export default function BuyerAuthPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [isSignUp, setIsSignUp] = useState(false)
  const [isForgotPassword, setIsForgotPassword] = useState(false)
  const [isOTPVerification, setIsOTPVerification] = useState(false)
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [resetToken, setResetToken] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  
  const { login, signup, forgotPassword, verifyOTP, resetPassword } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")
    
    try {
      if (isForgotPassword) {
        await forgotPassword(email)
        setSuccess("Reset code sent to your email!")
        setIsOTPVerification(true)
      } else if (isOTPVerification && resetToken) {
        if (newPassword !== confirmPassword) {
          setError("Passwords don't match")
          return
        }
        await resetPassword(resetToken, newPassword)
        setSuccess("Password reset successfully!")
        setTimeout(() => {
          setIsForgotPassword(false)
          setIsOTPVerification(false)
          setResetToken("")
        }, 2000)
      } else if (isSignUp) {
        await signup(name, email, password, "buyer")
        setSuccess("Account created! Please check your email for verification.")
      } else {
        await login(email, password, "buyer")
        router.push("/dashboard")
      }
    } catch (err: any) {
      setError(err.message || "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    
    try {
      const token = await verifyOTP(email, otp)
      setResetToken(token)
      setSuccess("OTP verified! Enter your new password.")
    } catch (err: any) {
      setError(err.message || "Invalid OTP")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 via-orange-100 to-orange-100 dark:from-orange-950 dark:via-orange-900 dark:to-orange-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-background rounded-2xl border border-border p-8 shadow-lg">
          <Link href="/" className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold">
              <Ticket className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold text-foreground">MyTikiti</span>
          </Link>

          {isForgotPassword && !isOTPVerification && (
            <button 
              onClick={() => setIsForgotPassword(false)}
              className="flex items-center gap-2 text-primary hover:underline mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Sign In
            </button>
          )}

          <h1 className="text-3xl font-bold text-foreground mb-2">
            {isForgotPassword 
              ? (isOTPVerification 
                  ? (resetToken ? "Reset Password" : "Verify Code") 
                  : "Forgot Password")
              : (isSignUp ? "Create Account" : "Welcome Back")
            }
          </h1>
          <p className="text-muted-foreground mb-8">
            {isForgotPassword 
              ? (isOTPVerification 
                  ? (resetToken ? "Enter your new password" : "Enter the code sent to your email") 
                  : "Enter your email to receive a reset code")
              : (isSignUp ? "Sign up as a Ticket Buyer" : "Sign in as a Ticket Buyer")
            }
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
              {success}
            </div>
          )}

          {isOTPVerification && !resetToken ? (
            <form onSubmit={handleOTPSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">Verification Code</label>
                <Input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit code"
                  className="mt-1 bg-background text-foreground border-border"
                  maxLength={6}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={loading}>
                {loading ? "Verifying..." : "Verify Code"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {isForgotPassword ? (
                <div>
                  <label className="text-sm font-medium text-foreground">Email</label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="mt-1 bg-background text-foreground border-border"
                    required
                  />
                </div>
              ) : resetToken ? (
                <>
                  <div>
                    <label className="text-sm font-medium text-foreground">New Password</label>
                    <Input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="mt-1 bg-background text-foreground border-border"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Confirm Password</label>
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="mt-1 bg-background text-foreground border-border"
                      required
                    />
                  </div>
                </>
              ) : (
                <>
                  {isSignUp && (
                    <div>
                      <label className="text-sm font-medium text-foreground">Full Name</label>
                      <Input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="mt-1 bg-background text-foreground border-border"
                        required
                      />
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-medium text-foreground">Email</label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
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
                </>
              )}

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground mt-6" disabled={loading}>
                {loading 
                  ? "Loading..." 
                  : isForgotPassword 
                    ? "Send Reset Code"
                    : resetToken
                      ? "Reset Password"
                      : isSignUp 
                        ? "Sign Up" 
                        : "Sign In"
                }
              </Button>
            </form>
          )}

          {!isForgotPassword && !isOTPVerification && (
            <div className="mt-6 text-center space-y-2">
              <button 
                onClick={() => setIsSignUp(!isSignUp)} 
                className="text-primary hover:underline text-sm block w-full"
              >
                {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
              </button>
              {!isSignUp && (
                <button 
                  onClick={() => setIsForgotPassword(true)} 
                  className="text-muted-foreground hover:text-primary text-sm"
                >
                  Forgot your password?
                </button>
              )}
            </div>
          )}



          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground text-center mb-3">Other roles:</p>
            <div className="flex gap-2">
              <Link href="/auth/creator" className="flex-1">
                <Button variant="outline" className="w-full bg-transparent">
                  Event Creator
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

"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { apiClient, type User as ApiUser } from "./api"

export type UserRole = "buyer" | "creator" | "tsh" | null

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  verified?: boolean
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string, role: UserRole) => Promise<void>
  logout: () => Promise<void>
  signup: (name: string, email: string, password: string, role: UserRole) => Promise<void>
  forgotPassword: (email: string) => Promise<void>
  verifyOTP: (email: string, otp: string) => Promise<string>
  resetPassword: (token: string, newPassword: string) => Promise<void>
  resendVerification: (email: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Check for existing session on mount
  useEffect(() => {
    checkCurrentUser()
  }, [])

  const checkCurrentUser = async () => {
    try {
      const response = await apiClient.getCurrentUser()
      if (response.success && response.user) {
        setUser(mapApiUserToUser(response.user))
      }
    } catch (error) {
      console.log('No active session')
    } finally {
      setLoading(false)
    }
  }

  const mapApiUserToUser = (apiUser: ApiUser): User => ({
    id: apiUser.id.toString(),
    name: apiUser.name,
    email: apiUser.email,
    role: apiUser.type as UserRole,
    verified: apiUser.verified,
    avatar: `/placeholder-user.jpg`
  })

  const login = async (email: string, password: string, role: UserRole) => {
    try {
      const userType = role === "tsh" ? "creator" : role
      const response = await apiClient.login(email, password, userType as "buyer" | "creator")
      
      if (response.success && response.user) {
        setUser(mapApiUserToUser(response.user))
      } else {
        throw new Error(response.message || 'Login failed')
      }
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await apiClient.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
    }
  }

  const signup = async (name: string, email: string, password: string, role: UserRole) => {
    try {
      const userType = role === "tsh" ? "creator" : role
      const response = await apiClient.signup(name, email, password, userType as "buyer" | "creator")
      
      if (response.success) {
        // For signup, we don't automatically log in since email verification might be required
        console.log('Signup successful:', response.message)
      } else {
        throw new Error(response.message || 'Signup failed')
      }
    } catch (error) {
      console.error('Signup error:', error)
      throw error
    }
  }

  const forgotPassword = async (email: string) => {
    try {
      const response = await apiClient.forgotPassword(email)
      if (!response.success) {
        throw new Error(response.message || 'Failed to send reset code')
      }
    } catch (error) {
      console.error('Forgot password error:', error)
      throw error
    }
  }

  const verifyOTP = async (email: string, otp: string) => {
    try {
      const response = await apiClient.verifyOTP(email, otp)
      if (response.success && response.data?.reset_token) {
        return response.data.reset_token
      } else {
        throw new Error(response.message || 'Invalid OTP')
      }
    } catch (error) {
      console.error('OTP verification error:', error)
      throw error
    }
  }

  const resetPassword = async (token: string, newPassword: string) => {
    try {
      const response = await apiClient.resetPassword(token, newPassword)
      if (!response.success) {
        throw new Error(response.message || 'Failed to reset password')
      }
    } catch (error) {
      console.error('Password reset error:', error)
      throw error
    }
  }

  const resendVerification = async (email: string) => {
    try {
      // You can implement this if you have a resend verification endpoint
      // For now, we'll use a placeholder
      console.log('Resend verification for:', email)
      // const response = await apiClient.resendVerification(email)
      // if (!response.success) {
      //   throw new Error(response.message || 'Failed to resend verification')
      // }
    } catch (error) {
      console.error('Resend verification error:', error)
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      logout, 
      signup, 
      forgotPassword, 
      verifyOTP, 
      resetPassword, 
      resendVerification 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}

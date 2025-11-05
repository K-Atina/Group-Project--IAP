"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import BuyerDashboard from "../../components/dashboard/BuyerDashboard"
import CreatorDashboard from "../../components/dashboard/CreatorDashboard"
import TSHDashboard from "../../components/dashboard/TSHDashboard"

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  // Render different dashboards based on user role
  switch (user.role) {
    case "buyer":
      return <BuyerDashboard />
    case "creator":
      return <CreatorDashboard />
    case "tsh":
      return <TSHDashboard />
    default:
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-lg text-red-600">Unknown user role</div>
        </div>
      )
  }
}
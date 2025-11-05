"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Search, 
  Filter,
  Eye,
  Ban,
  CheckCircle,
  AlertTriangle,
  BarChart3
} from "lucide-react"

interface UserStat {
  totalUsers: number
  buyers: number
  creators: number
  activeToday: number
}

interface EventStat {
  totalEvents: number
  published: number
  pending: number
  revenue: number
}

interface User {
  id: string
  name: string
  email: string
  role: "buyer" | "creator"
  verified: boolean
  joinDate: string
  lastActive: string
  status: "active" | "suspended" | "pending"
}

interface Event {
  id: string
  title: string
  creator: string
  category: string
  date: string
  status: "pending" | "approved" | "rejected"
  ticketsSold: number
  revenue: number
}

export default function TSHDashboard() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "events" | "analytics" | "settings">("overview")
  const [userSearch, setUserSearch] = useState("")
  const [eventSearch, setEventSearch] = useState("")

  // Sample data
  const [userStats] = useState<UserStat>({
    totalUsers: 1250,
    buyers: 850,
    creators: 400,
    activeToday: 142
  })

  const [eventStats] = useState<EventStat>({
    totalEvents: 156,
    published: 89,
    pending: 12,
    revenue: 2450000
  })

  const [users] = useState<User[]>([
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      role: "buyer",
      verified: true,
      joinDate: "2025-01-15",
      lastActive: "2025-11-04",
      status: "active"
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      role: "creator",
      verified: true,
      joinDate: "2025-02-20",
      lastActive: "2025-11-03",
      status: "active"
    },
    {
      id: "3",
      name: "Bob Wilson",
      email: "bob@example.com",
      role: "creator",
      verified: false,
      joinDate: "2025-11-01",
      lastActive: "2025-11-02",
      status: "pending"
    }
  ])

  const [events] = useState<Event[]>([
    {
      id: "1",
      title: "Tech Conference 2025",
      creator: "Jane Smith",
      category: "Technology",
      date: "2025-12-15",
      status: "approved",
      ticketsSold: 450,
      revenue: 337500
    },
    {
      id: "2",
      title: "Music Festival",
      creator: "John Creative",
      category: "Music",
      date: "2025-11-25",
      status: "pending",
      ticketsSold: 0,
      revenue: 0
    },
    {
      id: "3",
      title: "Art Exhibition",
      creator: "Sarah Artist",
      category: "Art",
      date: "2025-12-01",
      status: "rejected",
      ticketsSold: 0,
      revenue: 0
    }
  ])

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearch.toLowerCase())
  )

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(eventSearch.toLowerCase()) ||
    event.creator.toLowerCase().includes(eventSearch.toLowerCase())
  )

  const getUserStatusBadge = (status: User["status"]) => {
    const variants: Record<User["status"], "default" | "secondary" | "destructive"> = {
      active: "default",
      suspended: "destructive",
      pending: "secondary"
    }
    return <Badge variant={variants[status]}>{status.toUpperCase()}</Badge>
  }

  const getEventStatusBadge = (status: Event["status"]) => {
    const variants: Record<Event["status"], "default" | "secondary" | "destructive"> = {
      approved: "default",
      pending: "secondary",
      rejected: "destructive"
    }
    return <Badge variant={variants[status]}>{status.toUpperCase()}</Badge>
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">TSH Admin Dashboard</h1>
            <p className="text-muted-foreground">System Administration Panel</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={logout}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8">
            {[
              { id: "overview", label: "Overview" },
              { id: "users", label: "User Management" },
              { id: "events", label: "Event Moderation" },
              { id: "analytics", label: "Analytics" },
              { id: "settings", label: "Settings" }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        {activeTab === "overview" && (
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-8">System Overview</h2>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-card rounded-lg border p-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-primary" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                    <p className="text-2xl font-bold text-foreground">{userStats.totalUsers}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-card rounded-lg border p-6">
                <div className="flex items-center">
                  <Calendar className="h-8 w-8 text-primary" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Total Events</p>
                    <p className="text-2xl font-bold text-foreground">{eventStats.totalEvents}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-card rounded-lg border p-6">
                <div className="flex items-center">
                  <DollarSign className="h-8 w-8 text-primary" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                    <p className="text-2xl font-bold text-foreground">
                      KES {eventStats.revenue.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-card rounded-lg border p-6">
                <div className="flex items-center">
                  <TrendingUp className="h-8 w-8 text-primary" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Active Today</p>
                    <p className="text-2xl font-bold text-foreground">{userStats.activeToday}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-card rounded-lg border p-6">
                <h3 className="text-lg font-semibold mb-4">Pending Approvals</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Events awaiting approval</span>
                    <Badge variant="secondary">{eventStats.pending}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">User verifications</span>
                    <Badge variant="secondary">5</Badge>
                  </div>
                </div>
                <Button className="w-full mt-4" onClick={() => setActiveTab("events")}>
                  Review Pending
                </Button>
              </div>

              <div className="bg-card rounded-lg border p-6">
                <h3 className="text-lg font-semibold mb-4">User Distribution</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Buyers</span>
                    <span className="font-semibold">{userStats.buyers}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Creators</span>
                    <span className="font-semibold">{userStats.creators}</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4" onClick={() => setActiveTab("users")}>
                  Manage Users
                </Button>
              </div>

              <div className="bg-card rounded-lg border p-6">
                <h3 className="text-lg font-semibold mb-4">System Health</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Database: Healthy</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">API: Operational</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm">Email Service: Slow</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4">
                  System Logs
                </Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-foreground">User Management</h2>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filter Users
              </Button>
            </div>

            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search users by name or email..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-card rounded-lg border">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-border">
                    <tr>
                      <th className="text-left p-4 font-medium">User</th>
                      <th className="text-left p-4 font-medium">Role</th>
                      <th className="text-left p-4 font-medium">Verified</th>
                      <th className="text-left p-4 font-medium">Status</th>
                      <th className="text-left p-4 font-medium">Join Date</th>
                      <th className="text-left p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(user => (
                      <tr key={user.id} className="border-b border-border last:border-b-0">
                        <td className="p-4">
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant="outline">{user.role.toUpperCase()}</Badge>
                        </td>
                        <td className="p-4">
                          {user.verified ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <AlertTriangle className="w-5 h-5 text-yellow-500" />
                          )}
                        </td>
                        <td className="p-4">
                          {getUserStatusBadge(user.status)}
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">
                          {user.joinDate}
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Ban className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "events" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-foreground">Event Moderation</h2>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filter Events
              </Button>
            </div>

            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search events by title or creator..."
                  value={eventSearch}
                  onChange={(e) => setEventSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Events Table */}
            <div className="bg-card rounded-lg border">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-border">
                    <tr>
                      <th className="text-left p-4 font-medium">Event</th>
                      <th className="text-left p-4 font-medium">Creator</th>
                      <th className="text-left p-4 font-medium">Category</th>
                      <th className="text-left p-4 font-medium">Date</th>
                      <th className="text-left p-4 font-medium">Status</th>
                      <th className="text-left p-4 font-medium">Revenue</th>
                      <th className="text-left p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEvents.map(event => (
                      <tr key={event.id} className="border-b border-border last:border-b-0">
                        <td className="p-4">
                          <p className="font-medium">{event.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {event.ticketsSold} tickets sold
                          </p>
                        </td>
                        <td className="p-4 text-sm">{event.creator}</td>
                        <td className="p-4">
                          <Badge variant="outline">{event.category}</Badge>
                        </td>
                        <td className="p-4 text-sm">{event.date}</td>
                        <td className="p-4">
                          {getEventStatusBadge(event.status)}
                        </td>
                        <td className="p-4 text-sm font-medium">
                          KES {event.revenue.toLocaleString()}
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            {event.status === "pending" && (
                              <>
                                <Button variant="outline" size="sm" className="text-green-600">
                                  <CheckCircle className="w-4 h-4" />
                                </Button>
                                <Button variant="outline" size="sm" className="text-red-600">
                                  <Ban className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "analytics" && (
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-8">Analytics & Reports</h2>
            <div className="bg-card rounded-lg border p-8 text-center">
              <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Advanced Analytics</h3>
              <p className="text-muted-foreground">
                Comprehensive analytics dashboard with charts and reports coming soon.
              </p>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-8">System Settings</h2>
            
            <div className="space-y-6">
              <div className="bg-card rounded-lg border p-6">
                <h3 className="text-xl font-semibold mb-4">Platform Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Platform Name</label>
                    <Input value="MyTikiti" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Support Email</label>
                    <Input value="support@mytikiti.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Commission Rate (%)</label>
                    <Input type="number" value="5" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Currency</label>
                    <Input value="KES" />
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-lg border p-6">
                <h3 className="text-xl font-semibold mb-4">Security Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-muted-foreground">Require 2FA for admin accounts</p>
                    </div>
                    <Button variant="outline" size="sm">Enable</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Event Auto-Approval</p>
                      <p className="text-sm text-muted-foreground">Automatically approve events from verified creators</p>
                    </div>
                    <Button variant="outline" size="sm">Disable</Button>
                  </div>
                </div>
              </div>

              <Button>Save Settings</Button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
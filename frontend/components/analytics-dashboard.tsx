"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { TrendingUp, Users, Ticket, DollarSign, Calendar, Eye } from "lucide-react"

interface AnalyticsData {
  totalRevenue: number
  totalTicketsSold: number
  totalEvents: number
  totalUsers: number
  revenueByMonth: Array<{ month: string; revenue: number }>
  ticketsByCategory: Array<{ category: string; tickets: number; color: string }>
  topEvents: Array<{ name: string; sales: number; revenue: number }>
  userGrowth: Array<{ month: string; users: number }>
}

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("month")
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalRevenue: 45230,
    totalTicketsSold: 1543,
    totalEvents: 28,
    totalUsers: 892,
    revenueByMonth: [
      { month: "Jan", revenue: 4200 },
      { month: "Feb", revenue: 3800 },
      { month: "Mar", revenue: 5100 },
      { month: "Apr", revenue: 4600 },
      { month: "May", revenue: 6200 },
      { month: "Jun", revenue: 5800 },
      { month: "Jul", revenue: 7100 },
      { month: "Aug", revenue: 6500 },
      { month: "Sep", revenue: 8200 },
      { month: "Oct", revenue: 7800 },
      { month: "Nov", revenue: 9100 },
      { month: "Dec", revenue: 8900 },
    ],
    ticketsByCategory: [
      { category: "Music", tickets: 456, color: "#3b82f6" },
      { category: "Sports", tickets: 342, color: "#10b981" },
      { category: "Conference", tickets: 289, color: "#f59e0b" },
      { category: "Theater", tickets: 234, color: "#ef4444" },
      { category: "Other", tickets: 222, color: "#8b5cf6" },
    ],
    topEvents: [
      { name: "Summer Music Festival", sales: 456, revenue: 68400 },
      { name: "Tech Conference 2025", sales: 342, revenue: 102600 },
      { name: "Sports Championship", sales: 289, revenue: 43350 },
      { name: "Broadway Musical", sales: 234, revenue: 70200 },
      { name: "Art Exhibition", sales: 222, revenue: 33300 },
    ],
    userGrowth: [
      { month: "Jan", users: 120 },
      { month: "Feb", users: 180 },
      { month: "Mar", users: 250 },
      { month: "Apr", users: 320 },
      { month: "May", users: 410 },
      { month: "Jun", users: 520 },
      { month: "Jul", users: 640 },
      { month: "Aug", users: 720 },
      { month: "Sep", users: 810 },
      { month: "Oct", users: 892 },
    ],
  })

  // Stat cards data
  const stats = [
    {
      title: "Total Revenue",
      value: `$${analyticsData.totalRevenue.toLocaleString()}`,
      change: "+12.5%",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Tickets Sold",
      value: analyticsData.totalTicketsSold.toLocaleString(),
      change: "+8.2%",
      icon: Ticket,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Events",
      value: analyticsData.totalEvents,
      change: "+4.1%",
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Total Users",
      value: analyticsData.totalUsers.toLocaleString(),
      change: "+15.3%",
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-1">Track your platform's performance and insights</p>
        </div>
        
        {/* Time Range Filter */}
        <div className="flex gap-2 bg-muted rounded-lg p-1">
          {(["week", "month", "year"] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                timeRange === range
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-card border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <span className="text-sm font-medium text-green-600 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                {stat.change}
              </span>
            </div>
            <h3 className="text-sm font-medium text-muted-foreground">{stat.title}</h3>
            <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card className="bg-card border-border p-6">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-foreground">Revenue Overview</h3>
            <p className="text-sm text-muted-foreground">Monthly revenue breakdown</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analyticsData.revenueByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: "#3b82f6", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Category Distribution */}
        <Card className="bg-card border-border p-6">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-foreground">Tickets by Category</h3>
            <p className="text-sm text-muted-foreground">Distribution across event types</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analyticsData.ticketsByCategory}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="tickets"
              >
                {analyticsData.ticketsByCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Top Events & User Growth */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Events Table */}
        <Card className="bg-card border-border p-6">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-foreground">Top Performing Events</h3>
            <p className="text-sm text-muted-foreground">Best selling events this period</p>
          </div>
          <div className="space-y-4">
            {analyticsData.topEvents.map((event, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{event.name}</p>
                    <p className="text-sm text-muted-foreground">{event.sales} tickets sold</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">${event.revenue.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* User Growth Chart */}
        <Card className="bg-card border-border p-6">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-foreground">User Growth</h3>
            <p className="text-sm text-muted-foreground">Cumulative user registrations</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData.userGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar dataKey="users" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-card border-border p-6">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-foreground">Recent User Interactions</h3>
          <p className="text-sm text-muted-foreground">Latest platform activities</p>
        </div>
        <div className="space-y-4">
          {[
            { user: "John Doe", action: "Purchased 2 tickets", event: "Summer Music Festival", time: "2 minutes ago", icon: Ticket, color: "text-blue-600" },
            { user: "Jane Smith", action: "Created new event", event: "Tech Conference 2025", time: "15 minutes ago", icon: Calendar, color: "text-purple-600" },
            { user: "Mike Johnson", action: "Registered account", event: "Platform Registration", time: "1 hour ago", icon: Users, color: "text-green-600" },
            { user: "Sarah Williams", action: "Viewed event", event: "Broadway Musical", time: "2 hours ago", icon: Eye, color: "text-orange-600" },
            { user: "Tom Brown", action: "Completed payment", event: "Sports Championship", time: "3 hours ago", icon: DollarSign, color: "text-green-600" },
          ].map((activity, index) => (
            <div key={index} className="flex items-center gap-4 p-3 bg-muted rounded-lg hover:bg-muted/70 transition-colors">
              <div className={`p-2 rounded-full bg-background ${activity.color}`}>
                <activity.icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">{activity.user}</p>
                <p className="text-sm text-muted-foreground">
                  {activity.action} - <span className="font-medium">{activity.event}</span>
                </p>
              </div>
              <p className="text-sm text-muted-foreground">{activity.time}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

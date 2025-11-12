"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { TrendingUp, TrendingDown, DollarSign, Ticket, Users, Calendar, Eye, Download, Filter, ArrowUpRight, ArrowDownRight, FileText, FileSpreadsheet, FileDown } from "lucide-react"
import { exportToPDF, exportToExcel, exportToCSV } from "@/lib/export-utils"

interface OrganizerAnalyticsProps {
  organizerId?: string
}

export default function OrganizerAnalytics({ organizerId }: OrganizerAnalyticsProps) {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "1y">("30d")
  const [loading, setLoading] = useState(false)

  // Full analytics data (all periods)
  const allData = {
    overview: {
      totalRevenue: 145230,
      revenueChange: 12.5,
      totalTicketsSold: 3543,
      ticketsChange: 8.2,
      activeEvents: 12,
      eventsChange: 4.1,
      totalViews: 45892,
      viewsChange: 18.3,
    },
    revenueByDay: [
      { date: "Nov 1", revenue: 4200, tickets: 42 },
      { date: "Nov 2", revenue: 3800, tickets: 38 },
      { date: "Nov 3", revenue: 5100, tickets: 51 },
      { date: "Nov 4", revenue: 4600, tickets: 46 },
      { date: "Nov 5", revenue: 6200, tickets: 62 },
      { date: "Nov 6", revenue: 5800, tickets: 58 },
      { date: "Nov 7", revenue: 7100, tickets: 71 },
      { date: "Nov 8", revenue: 6500, tickets: 65 },
      { date: "Nov 9", revenue: 8200, tickets: 82 },
      { date: "Nov 10", revenue: 7800, tickets: 78 },
      { date: "Nov 11", revenue: 9100, tickets: 91 },
      { date: "Nov 12", revenue: 8900, tickets: 89 },
    ],
    eventPerformance: [
      { name: "Summer Music Festival", revenue: 68400, tickets: 456, views: 12340, conversion: 3.7 },
      { name: "Tech Conference 2025", revenue: 102600, tickets: 342, views: 8920, conversion: 3.8 },
      { name: "Sports Championship", revenue: 43350, tickets: 289, views: 7650, conversion: 3.8 },
      { name: "Broadway Musical", revenue: 70200, tickets: 234, views: 9870, conversion: 2.4 },
      { name: "Art Exhibition", revenue: 33300, tickets: 222, views: 6543, conversion: 3.4 },
    ],
    ticketsByCategory: [
      { category: "Music", tickets: 1256, revenue: 188400, color: "#3b82f6" },
      { category: "Sports", tickets: 842, revenue: 126300, color: "#10b981" },
      { category: "Conference", tickets: 589, revenue: 176700, color: "#f59e0b" },
      { category: "Theater", tickets: 534, revenue: 160200, color: "#ef4444" },
      { category: "Other", tickets: 322, revenue: 48300, color: "#8b5cf6" },
    ],
    customerDemographics: [
      { ageGroup: "18-24", percentage: 28, count: 992 },
      { ageGroup: "25-34", percentage: 35, count: 1240 },
      { ageGroup: "35-44", percentage: 22, count: 780 },
      { ageGroup: "45-54", percentage: 10, count: 354 },
      { ageGroup: "55+", percentage: 5, count: 177 },
    ],
    userInteractions: [
      { action: "Ticket Purchase", user: "John Doe", event: "Summer Music Festival", time: "2 mins ago", status: "Completed" },
      { action: "Event View", user: "Jane Smith", event: "Tech Conference 2025", time: "5 mins ago", status: "Viewed" },
      { action: "Add to Cart", user: "Mike Johnson", event: "Sports Championship", time: "8 mins ago", status: "Pending" },
      { action: "Ticket Purchase", user: "Sarah Williams", event: "Broadway Musical", time: "12 mins ago", status: "Completed" },
      { action: "Event Share", user: "Tom Brown", event: "Art Exhibition", time: "15 mins ago", status: "Shared" },
      { action: "Review Submitted", user: "Emma Davis", event: "Summer Music Festival", time: "18 mins ago", status: "Published" },
      { action: "Event View", user: "Chris Wilson", event: "Tech Conference 2025", time: "22 mins ago", status: "Viewed" },
      { action: "Ticket Purchase", user: "Lisa Anderson", event: "Sports Championship", time: "25 mins ago", status: "Completed" },
    ],
  }

  // Filter data based on time range
  const getFilteredData = () => {
    const dataPoints = {
      "7d": 7,
      "30d": 12,
      "90d": 12,
      "1y": 12,
    }
    
    const points = dataPoints[timeRange]
    const revenueData = allData.revenueByDay.slice(-points)
    
    return {
      ...allData,
      revenueByDay: revenueData,
    }
  }

  const analyticsData = getFilteredData()

  const handleExportPDF = () => {
    const exportData = {
      totalRevenue: analyticsData.overview.totalRevenue,
      totalTicketsSold: analyticsData.overview.totalTicketsSold,
      totalEvents: analyticsData.overview.activeEvents,
      totalViews: analyticsData.overview.totalViews,
      revenueByDay: analyticsData.revenueByDay,
      eventPerformance: analyticsData.eventPerformance,
      ticketsByCategory: analyticsData.ticketsByCategory,
      customerDemographics: analyticsData.customerDemographics,
      userInteractions: analyticsData.userInteractions,
    }
    exportToPDF(exportData, "Event Organizer")
  }

  const handleExportExcel = () => {
    const exportData = {
      totalRevenue: analyticsData.overview.totalRevenue,
      totalTicketsSold: analyticsData.overview.totalTicketsSold,
      totalEvents: analyticsData.overview.activeEvents,
      totalViews: analyticsData.overview.totalViews,
      revenueByDay: analyticsData.revenueByDay,
      eventPerformance: analyticsData.eventPerformance,
      ticketsByCategory: analyticsData.ticketsByCategory,
      customerDemographics: analyticsData.customerDemographics,
      userInteractions: analyticsData.userInteractions,
    }
    exportToExcel(exportData, "Event Organizer")
  }

  const handleExportCSV = () => {
    const exportData = {
      totalRevenue: analyticsData.overview.totalRevenue,
      totalTicketsSold: analyticsData.overview.totalTicketsSold,
      totalEvents: analyticsData.overview.activeEvents,
      totalViews: analyticsData.overview.totalViews,
      revenueByDay: analyticsData.revenueByDay,
      eventPerformance: analyticsData.eventPerformance,
      ticketsByCategory: analyticsData.ticketsByCategory,
      customerDemographics: analyticsData.customerDemographics,
      userInteractions: analyticsData.userInteractions,
    }
    exportToCSV(exportData)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Analytics & Insights</h2>
          <p className="text-muted-foreground mt-1">Track your event performance and audience engagement</p>
        </div>
        
        {/* Export Buttons */}
        <div className="flex gap-2">
          <span className="text-sm text-muted-foreground self-center mr-2">Export as:</span>
          <Button onClick={handleExportPDF} variant="outline" size="sm" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            PDF
          </Button>
          <Button onClick={handleExportExcel} variant="outline" size="sm" className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4" />
            Excel
          </Button>
          <Button onClick={handleExportCSV} variant="outline" size="sm" className="flex items-center gap-2">
            <FileDown className="w-4 h-4" />
            CSV
          </Button>
        </div>
      </div>

      {/* Time Range Filter - Separate Row */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-sm text-muted-foreground">
          Showing data for: <span className="font-semibold text-foreground">
            {timeRange === "7d" && "Last 7 Days"}
            {timeRange === "30d" && "Last 30 Days"}
            {timeRange === "90d" && "Last 90 Days"}
            {timeRange === "1y" && "Last Year"}
          </span>
        </div>
        <div className="flex gap-1 bg-muted rounded-lg p-1">
          {(["7d", "30d", "90d", "1y"] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                timeRange === range
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-background"
              }`}
            >
              {range === "7d" && "7 Days"}
              {range === "30d" && "30 Days"}
              {range === "90d" && "90 Days"}
              {range === "1y" && "1 Year"}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-card border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-green-50">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <span className={`text-sm font-medium flex items-center gap-1 ${
              analyticsData.overview.revenueChange > 0 ? "text-green-600" : "text-red-600"
            }`}>
              {analyticsData.overview.revenueChange > 0 ? (
                <ArrowUpRight className="w-4 h-4" />
              ) : (
                <ArrowDownRight className="w-4 h-4" />
              )}
              {Math.abs(analyticsData.overview.revenueChange)}%
            </span>
          </div>
          <h3 className="text-sm font-medium text-muted-foreground">Total Revenue</h3>
          <p className="text-3xl font-bold text-foreground mt-1">
            ${analyticsData.overview.totalRevenue.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            vs. previous period
          </p>
        </Card>

        <Card className="bg-card border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-blue-50">
              <Ticket className="w-6 h-6 text-blue-600" />
            </div>
            <span className={`text-sm font-medium flex items-center gap-1 ${
              analyticsData.overview.ticketsChange > 0 ? "text-green-600" : "text-red-600"
            }`}>
              {analyticsData.overview.ticketsChange > 0 ? (
                <ArrowUpRight className="w-4 h-4" />
              ) : (
                <ArrowDownRight className="w-4 h-4" />
              )}
              {Math.abs(analyticsData.overview.ticketsChange)}%
            </span>
          </div>
          <h3 className="text-sm font-medium text-muted-foreground">Tickets Sold</h3>
          <p className="text-3xl font-bold text-foreground mt-1">
            {analyticsData.overview.totalTicketsSold.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            across all events
          </p>
        </Card>

        <Card className="bg-card border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-purple-50">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <span className={`text-sm font-medium flex items-center gap-1 ${
              analyticsData.overview.eventsChange > 0 ? "text-green-600" : "text-red-600"
            }`}>
              {analyticsData.overview.eventsChange > 0 ? (
                <ArrowUpRight className="w-4 h-4" />
              ) : (
                <ArrowDownRight className="w-4 h-4" />
              )}
              {Math.abs(analyticsData.overview.eventsChange)}%
            </span>
          </div>
          <h3 className="text-sm font-medium text-muted-foreground">Active Events</h3>
          <p className="text-3xl font-bold text-foreground mt-1">
            {analyticsData.overview.activeEvents}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            currently running
          </p>
        </Card>

        <Card className="bg-card border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-orange-50">
              <Eye className="w-6 h-6 text-orange-600" />
            </div>
            <span className={`text-sm font-medium flex items-center gap-1 ${
              analyticsData.overview.viewsChange > 0 ? "text-green-600" : "text-red-600"
            }`}>
              {analyticsData.overview.viewsChange > 0 ? (
                <ArrowUpRight className="w-4 h-4" />
              ) : (
                <ArrowDownRight className="w-4 h-4" />
              )}
              {Math.abs(analyticsData.overview.viewsChange)}%
            </span>
          </div>
          <h3 className="text-sm font-medium text-muted-foreground">Total Views</h3>
          <p className="text-3xl font-bold text-foreground mt-1">
            {analyticsData.overview.totalViews.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            event page visits
          </p>
        </Card>
      </div>

      {/* Revenue & Tickets Trend */}
      <Card className="bg-card border-border p-6">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-foreground">Revenue & Ticket Sales Trend</h3>
          <p className="text-sm text-muted-foreground">Daily performance over the last {timeRange}</p>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={analyticsData.revenueByDay}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorTickets" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" stroke="#6b7280" />
            <YAxis yAxisId="left" stroke="#6b7280" />
            <YAxis yAxisId="right" orientation="right" stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="revenue"
              stroke="#3b82f6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />
            <Area
              yAxisId="right"
              type="monotone"
              dataKey="tickets"
              stroke="#10b981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorTickets)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Event Performance & Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Events by Revenue */}
        <Card className="bg-card border-border p-6">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-foreground">Event Performance</h3>
            <p className="text-sm text-muted-foreground">Top events by revenue and conversion</p>
          </div>
          <div className="space-y-4">
            {analyticsData.eventPerformance.map((event, index) => (
              <div key={index} className="p-4 bg-muted rounded-lg hover:bg-muted/70 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">
                      #{index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{event.name}</p>
                      <p className="text-xs text-muted-foreground">{event.tickets} tickets • {event.views.toLocaleString()} views</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">${event.revenue.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{event.conversion}% conv.</p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${(event.tickets / 500) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Category Distribution */}
        <Card className="bg-card border-border p-6">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-foreground">Revenue by Category</h3>
            <p className="text-sm text-muted-foreground">Distribution across event types</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analyticsData.ticketsByCategory}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ category, percentage }) => {
                  const pct = ((analyticsData.ticketsByCategory.find(c => c.category === category)?.revenue || 0) / 
                    analyticsData.ticketsByCategory.reduce((sum, c) => sum + c.revenue, 0) * 100).toFixed(0)
                  return `${category} ${pct}%`
                }}
                outerRadius={100}
                fill="#8884d8"
                dataKey="revenue"
              >
                {analyticsData.ticketsByCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => `$${value.toLocaleString()}`}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {analyticsData.ticketsByCategory.map((cat, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }}></div>
                <div className="text-sm">
                  <p className="font-medium text-foreground">{cat.category}</p>
                  <p className="text-xs text-muted-foreground">{cat.tickets} tickets</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Customer Demographics */}
      <Card className="bg-card border-border p-6">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-foreground">Customer Demographics</h3>
          <p className="text-sm text-muted-foreground">Age distribution of ticket buyers</p>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={analyticsData.customerDemographics} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis type="number" stroke="#6b7280" />
            <YAxis dataKey="ageGroup" type="category" stroke="#6b7280" width={80} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
              formatter={(value: number, name: string) => [
                `${value}% (${analyticsData.customerDemographics.find(d => d.percentage === value)?.count || 0} customers)`,
                "Percentage"
              ]}
            />
            <Bar dataKey="percentage" fill="#3b82f6" radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Recent User Interactions */}
      <Card className="bg-card border-border p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-foreground">Recent User Interactions</h3>
            <p className="text-sm text-muted-foreground">Real-time activity across your events</p>
          </div>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
        </div>
        <div className="space-y-3">
          {analyticsData.userInteractions.map((interaction, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted/70 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  interaction.status === "Completed" ? "bg-green-50" :
                  interaction.status === "Pending" ? "bg-yellow-50" :
                  interaction.status === "Viewed" ? "bg-blue-50" :
                  interaction.status === "Shared" ? "bg-purple-50" :
                  "bg-gray-50"
                }`}>
                  {interaction.action === "Ticket Purchase" && <Ticket className={`w-5 h-5 ${interaction.status === "Completed" ? "text-green-600" : "text-yellow-600"}`} />}
                  {interaction.action === "Event View" && <Eye className="w-5 h-5 text-blue-600" />}
                  {interaction.action === "Add to Cart" && <TrendingUp className="w-5 h-5 text-yellow-600" />}
                  {interaction.action === "Event Share" && <Users className="w-5 h-5 text-purple-600" />}
                  {interaction.action === "Review Submitted" && <TrendingUp className="w-5 h-5 text-green-600" />}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{interaction.user}</p>
                  <p className="text-sm text-muted-foreground">
                    {interaction.action} - <span className="font-medium">{interaction.event}</span>
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  interaction.status === "Completed" ? "bg-green-100 text-green-800" :
                  interaction.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
                  interaction.status === "Viewed" ? "bg-blue-100 text-blue-800" :
                  interaction.status === "Shared" ? "bg-purple-100 text-purple-800" :
                  "bg-gray-100 text-gray-800"
                }`}>
                  {interaction.status}
                </span>
                <p className="text-xs text-muted-foreground mt-1">{interaction.time}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

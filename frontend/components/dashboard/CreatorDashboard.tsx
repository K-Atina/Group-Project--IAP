"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { Plus, Calendar, MapPin, Users, DollarSign, Clock, Edit, Trash2, Eye } from "lucide-react"

interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  venue: string
  category: string
  totalCapacity: number
  availableTickets: number
  status: "draft" | "published" | "sold-out" | "ended"
  ticketTypes: TicketType[]
}

interface TicketType {
  id: string
  name: string
  price: number
  quantity: number
  sold: number
  description: string
}

export default function CreatorDashboard() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState<"overview" | "create" | "events" | "analytics">("overview")
  const [events, setEvents] = useState<Event[]>([
    {
      id: "1",
      title: "Tech Conference 2025",
      description: "Annual technology conference featuring latest innovations",
      date: "2025-12-15",
      time: "09:00",
      venue: "Convention Center, Nairobi",
      category: "Technology",
      totalCapacity: 500,
      availableTickets: 450,
      status: "published",
      ticketTypes: [
        { id: "1", name: "Early Bird", price: 5000, quantity: 100, sold: 50, description: "Limited early bird pricing" },
        { id: "2", name: "Regular", price: 7500, quantity: 300, sold: 0, description: "Standard admission" },
        { id: "3", name: "VIP", price: 15000, quantity: 100, sold: 0, description: "VIP access with premium benefits" }
      ]
    }
  ])
  
  // Form state for creating new events
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    venue: "",
    category: "",
    image: null as File | null
  })
  
  const [ticketTypes, setTicketTypes] = useState<Omit<TicketType, "id" | "sold">[]>([
    { name: "General Admission", price: 0, quantity: 0, description: "" }
  ])

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault()
    
    const event: Event = {
      id: Date.now().toString(),
      ...newEvent,
      totalCapacity: ticketTypes.reduce((sum, tt) => sum + tt.quantity, 0),
      availableTickets: ticketTypes.reduce((sum, tt) => sum + tt.quantity, 0),
      status: "draft",
      ticketTypes: ticketTypes.map((tt, index) => ({
        ...tt,
        id: (index + 1).toString(),
        sold: 0
      }))
    }
    
    setEvents(prev => [...prev, event])
    
    // Reset form
    setNewEvent({
      title: "",
      description: "",
      date: "",
      time: "",
      venue: "",
      category: "",
      image: null
    })
    setTicketTypes([{ name: "General Admission", price: 0, quantity: 0, description: "" }])
    setActiveTab("events")
  }

  const addTicketType = () => {
    setTicketTypes(prev => [...prev, { name: "", price: 0, quantity: 0, description: "" }])
  }

  const updateTicketType = (index: number, field: keyof Omit<TicketType, "id" | "sold">, value: any) => {
    setTicketTypes(prev => prev.map((tt, i) => 
      i === index ? { ...tt, [field]: value } : tt
    ))
  }

  const removeTicketType = (index: number) => {
    if (ticketTypes.length > 1) {
      setTicketTypes(prev => prev.filter((_, i) => i !== index))
    }
  }

  const getStatusBadge = (status: Event["status"]) => {
    const variants: Record<Event["status"], "default" | "secondary" | "destructive" | "outline"> = {
      draft: "outline",
      published: "default",
      "sold-out": "secondary",
      ended: "destructive"
    }
    return <Badge variant={variants[status]}>{status.replace("-", " ").toUpperCase()}</Badge>
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Event Creator Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user?.name}</p>
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
              { id: "create", label: "Create Event" },
              { id: "events", label: "My Events" },
              { id: "analytics", label: "Analytics" }
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-card rounded-lg border p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-primary" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Total Events</p>
                  <p className="text-2xl font-bold text-foreground">{events.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-card rounded-lg border p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-primary" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Total Capacity</p>
                  <p className="text-2xl font-bold text-foreground">
                    {events.reduce((sum, event) => sum + event.totalCapacity, 0)}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-card rounded-lg border p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-primary" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Revenue</p>
                  <p className="text-2xl font-bold text-foreground">KES 375,000</p>
                </div>
              </div>
            </div>
            
            <div className="bg-card rounded-lg border p-6">
              <div className="flex items-center">
                <Eye className="h-8 w-8 text-primary" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Active Events</p>
                  <p className="text-2xl font-bold text-foreground">
                    {events.filter(e => e.status === "published").length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "create" && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-8">Create New Event</h2>
            
            <form onSubmit={handleCreateEvent} className="space-y-8">
              {/* Basic Event Information */}
              <div className="bg-card rounded-lg border p-6">
                <h3 className="text-xl font-semibold mb-4">Event Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Event Title</label>
                    <Input
                      value={newEvent.title}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter event title"
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                      value={newEvent.description}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe your event..."
                      rows={4}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Date</label>
                    <Input
                      type="date"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Time</label>
                    <Input
                      type="time"
                      value={newEvent.time}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, time: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Venue</label>
                    <Input
                      value={newEvent.venue}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, venue: e.target.value }))}
                      placeholder="Event venue"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <Select
                      value={newEvent.category}
                      onValueChange={(value) => setNewEvent(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Technology">Technology</SelectItem>
                        <SelectItem value="Music">Music</SelectItem>
                        <SelectItem value="Sports">Sports</SelectItem>
                        <SelectItem value="Business">Business</SelectItem>
                        <SelectItem value="Entertainment">Entertainment</SelectItem>
                        <SelectItem value="Education">Education</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Ticket Types */}
              <div className="bg-card rounded-lg border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">Ticket Types</h3>
                  <Button type="button" onClick={addTicketType} variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Ticket Type
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {ticketTypes.map((ticketType, index) => (
                    <div key={index} className="border border-border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">Ticket Type {index + 1}</h4>
                        {ticketTypes.length > 1 && (
                          <Button
                            type="button"
                            onClick={() => removeTicketType(index)}
                            variant="outline"
                            size="sm"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Name</label>
                          <Input
                            value={ticketType.name}
                            onChange={(e) => updateTicketType(index, "name", e.target.value)}
                            placeholder="e.g., VIP, General"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">Price (KES)</label>
                          <Input
                            type="number"
                            value={ticketType.price}
                            onChange={(e) => updateTicketType(index, "price", Number(e.target.value))}
                            min="0"
                            step="0.01"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">Quantity</label>
                          <Input
                            type="number"
                            value={ticketType.quantity}
                            onChange={(e) => updateTicketType(index, "quantity", Number(e.target.value))}
                            min="1"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">Description</label>
                          <Input
                            value={ticketType.description}
                            onChange={(e) => updateTicketType(index, "description", e.target.value)}
                            placeholder="Brief description"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Total Capacity:</strong> {ticketTypes.reduce((sum, tt) => sum + tt.quantity, 0)} tickets
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Estimated Revenue:</strong> KES {ticketTypes.reduce((sum, tt) => sum + (tt.price * tt.quantity), 0).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="flex-1">
                  Create Event (Draft)
                </Button>
                <Button type="button" variant="outline" className="flex-1">
                  Save & Publish
                </Button>
              </div>
            </form>
          </div>
        )}

        {activeTab === "events" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-foreground">My Events</h2>
              <Button onClick={() => setActiveTab("create")}>
                <Plus className="w-4 h-4 mr-2" />
                Create Event
              </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {events.map(event => (
                <div key={event.id} className="bg-card rounded-lg border p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-lg">{event.title}</h3>
                    {getStatusBadge(event.status)}
                  </div>
                  
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {event.description}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 mr-2" />
                      {event.date} at {event.time}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-2" />
                      {event.venue}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="w-4 h-4 mr-2" />
                      {event.availableTickets}/{event.totalCapacity} available
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Ticket Types:</h4>
                    {event.ticketTypes.map(ticket => (
                      <div key={ticket.id} className="flex justify-between text-sm">
                        <span>{ticket.name}</span>
                        <span>KES {ticket.price.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "analytics" && (
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-8">Analytics</h2>
            <div className="bg-card rounded-lg border p-8 text-center">
              <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Analytics Coming Soon</h3>
              <p className="text-muted-foreground">
                Detailed analytics and reporting features will be available in the next update.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
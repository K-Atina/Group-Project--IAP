"use client"

import { MapPin, Calendar, Users, Clock } from "lucide-react"

interface EventDetailsProps {
  eventId: string
}

export default function EventDetails({ eventId }: EventDetailsProps) {
  return (
    <div className="space-y-6">
      {/* Title & Category */}
      <div>
        <div className="flex items-start gap-3 mb-3">
          <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-semibold">Concerts</span>
          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold">Featured</span>
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Summer Music Festival 2025</h1>
        <p className="text-muted-foreground">Hosted by Festival Productions Inc.</p>
      </div>

      {/* Quick Info */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y border-border">
        <div className="flex items-start gap-3">
          <Calendar className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs text-muted-foreground uppercase font-semibold">Date</p>
            <p className="text-foreground font-medium">Jun 15-17</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Clock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs text-muted-foreground uppercase font-semibold">Time</p>
            <p className="text-foreground font-medium">4:00 PM - 11:00 PM</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs text-muted-foreground uppercase font-semibold">Venue</p>
            <p className="text-foreground font-medium">Central Park</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Users className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs text-muted-foreground uppercase font-semibold">Attendees</p>
            <p className="text-foreground font-medium">12,500+</p>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">About This Event</h2>
        <p className="text-foreground leading-relaxed">
          Experience three days of world-class music, food, and entertainment at the Summer Music Festival 2025.
          Featuring over 50 international and local artists across multiple stages, this is the ultimate celebration of
          music and culture.
        </p>
        <p className="text-foreground leading-relaxed">
          From sunrise yoga sessions to late-night DJ sets, there's something for everyone. Enjoy gourmet food trucks,
          craft beverages, art installations, and interactive experiences throughout the venue.
        </p>
      </div>

      {/* Key Highlights */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Highlights</h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            "Over 50 world-renowned artists",
            "Multiple stages and performance areas",
            "Gourmet food and craft beverages",
            "Art installations and experiences",
            "Camping and glamping options",
            "24-hour venue access",
          ].map((highlight, idx) => (
            <li key={idx} className="flex items-start gap-3 text-foreground">
              <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 text-xs font-bold">
                ✓
              </span>
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Location Map Placeholder */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Location</h2>
        <div className="w-full h-64 bg-muted rounded-xl flex items-center justify-center border border-border">
          <div className="text-center">
            <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">Central Park, New York, NY</p>
            <p className="text-xs text-muted-foreground mt-2">Map integration coming soon</p>
          </div>
        </div>
      </div>

      {/* Organizer Info */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-bold text-foreground mb-4">About the Organizer</h3>
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl flex-shrink-0">
            FP
          </div>
          <div className="flex-1">
            <p className="font-semibold text-foreground">Festival Productions Inc.</p>
            <p className="text-sm text-muted-foreground mb-3">Organizing world-class festivals since 1995</p>
            <button className="text-primary text-sm font-semibold hover:underline">View more events</button>
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import { Button } from "@/components/ui/button"
import { Mail, Phone, MapPin } from "lucide-react"

export default function ContactSection() {
  return (
    <section id="contact" className="py-20 bg-muted/50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">Get In Touch</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Contact our support team.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
          <div className="bg-card rounded-xl p-6 text-center border border-border">
            <Mail className="w-8 h-8 text-primary mx-auto mb-4" />
            <h3 className="font-semibold text-foreground mb-2">Email</h3>
            <p className="text-muted-foreground mb-4">support@mytikiti.com</p>
            <Button
              variant="outline"
              className="w-full bg-transparent"
              onClick={() => (window.location.href = "mailto:support@mytikiti.com")}
            >
              Send Email
            </Button>
          </div>

          <div className="bg-card rounded-xl p-6 text-center border border-border">
            <Phone className="w-8 h-8 text-primary mx-auto mb-4" />
            <h3 className="font-semibold text-foreground mb-2">Phone</h3>
            <p className="text-muted-foreground mb-4">+1 (555) 123-4567</p>
            <Button
              variant="outline"
              className="w-full bg-transparent"
              onClick={() => (window.location.href = "tel:+15551234567")}
            >
              Call Now
            </Button>
          </div>

          <div className="bg-card rounded-xl p-6 text-center border border-border">
            <MapPin className="w-8 h-8 text-primary mx-auto mb-4" />
            <h3 className="font-semibold text-foreground mb-2">Office</h3>
            <p className="text-muted-foreground mb-4">123 Event Street, City, Country</p>
            <Button variant="outline" className="w-full bg-transparent">
              Get Directions
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

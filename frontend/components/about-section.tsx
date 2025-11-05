"use client"

import { CheckCircle } from "lucide-react"

export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-background transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">About MyTikiti</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your trusted platform for discovering and purchasing tickets to the world's best events.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-foreground leading-relaxed">
                MyTikiti is revolutionizing the way people discover and experience live events. Whether you're looking
                for concert tickets, sports events, theater shows, or festivals, we make it easy to find and purchase
                tickets to unforgettable experiences.
              </p>
              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground">Easy Ticket Search</h3>
                    <p className="text-sm text-muted-foreground">
                      Find tickets with advanced filters by category, location, and organizer
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground">Event Creator Tools</h3>
                    <p className="text-sm text-muted-foreground">
                      Organizers can easily create and manage their events and tickets
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground">Secure Transactions</h3>
                    <p className="text-sm text-muted-foreground">
                      All purchases are safe and secure with our trusted payment system
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground">24/7 AI Support</h3>
                    <p className="text-sm text-muted-foreground">
                      Get instant help from our chatbot anytime you need it
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl p-8 border border-primary/20">
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-5xl font-bold text-primary mb-2">1M+</div>
                  <p className="text-foreground font-semibold">Active Users</p>
                </div>
                <div className="text-center border-t border-primary/20 pt-6">
                  <div className="text-5xl font-bold text-primary mb-2">50K+</div>
                  <p className="text-foreground font-semibold">Events Listed</p>
                </div>
                <div className="text-center border-t border-primary/20 pt-6">
                  <div className="text-5xl font-bold text-primary mb-2">$500M+</div>
                  <p className="text-foreground font-semibold">Tickets Sold</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

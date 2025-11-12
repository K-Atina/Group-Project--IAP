"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"

export default function HeroSection() {
  const { user } = useAuth()

  return (
    <section className="relative w-full overflow-hidden py-20 md:py-32 transition-colors">
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url(/concert-hero-background.jpg)",
          backgroundAttachment: "fixed",
        }}
      ></div>

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/40 dark:bg-black/50"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8 text-center max-w-3xl mx-auto">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white text-balance leading-tight">
              Your Ticket to Everything!
            </h1>
            <p className="text-2xl md:text-3xl text-orange-200 font-semibold">Skip the line, not the show</p>
            <p className="text-lg text-gray-100 max-w-2xl mx-auto leading-relaxed">
              Find and purchase tickets to concerts, sports, theater, festivals, and more. Your gateway to unforgettable
              experiences.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link href="/browse">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg h-auto rounded-lg w-full sm:w-auto">
                Browse Events
              </Button>
            </Link>
            {/* Only show Create Tickets button for creators or non-logged-in users */}
            {(!user || user.role === "creator") && (
              <Link href={user?.role === "creator" ? "/dashboard/creator" : "/auth/creator"}>
                <Button
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white/20 px-8 py-3 text-lg h-auto rounded-lg bg-transparent w-full sm:w-auto"
                >
                  Create Tickets
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

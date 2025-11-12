"use client"

import { useState } from "react"
import Header from "@/components/header"
import HeroSection from "@/components/hero-section"
import CategoryCarousel from "@/components/category-carousel"
import ChatBot from "@/components/chatbot"
import EventCarousel from "@/components/event-carousel"
import PersonalizedFeed from "@/components/personalized-feed"
import Footer from "@/components/footer"
import AboutSection from "@/components/about-section"
import ContactSection from "@/components/contact-section"

export default function Home() {
  const [showChat, setShowChat] = useState(false)

  return (
    <main className="min-h-screen bg-background">
      <Header onOpenChat={() => setShowChat(true)} />
      <div id="home">
        <HeroSection />
      </div>
      <CategoryCarousel />
      {showChat && <ChatBot onClose={() => setShowChat(false)} />}
      <EventCarousel />
      <PersonalizedFeed />
      <AboutSection />
      <ContactSection />
      <Footer />
    </main>
  )
}

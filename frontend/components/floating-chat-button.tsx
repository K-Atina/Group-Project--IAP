"use client"

import { useState } from "react"
import { MessageCircle } from "lucide-react"
import ChatBot from "./chatbot"

export default function FloatingChatButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed right-6 bottom-6 z-40 w-14 h-14 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center"
        aria-label="Open chat assistant"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chat modal opens when button is clicked */}
      {isOpen && <ChatBot onClose={() => setIsOpen(false)} />}
    </>
  )
}

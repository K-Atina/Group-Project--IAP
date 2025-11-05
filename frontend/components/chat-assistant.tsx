"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Send } from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

interface ChatAssistantProps {
  onClose: () => void
}

export default function ChatAssistant({ onClose }: ChatAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hi! I'm your ticket assistant at MyTikiti. What event are you looking for? I can help you find and purchase tickets to concerts, sports, theater, and more!",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response with contextual answers
    setTimeout(() => {
      let assistantContent = ""
      const inputLower = input.toLowerCase()

      if (inputLower.includes("music") || inputLower.includes("concert")) {
        assistantContent =
          "Great! I found some amazing music events coming up. We have concerts, festivals, and live performances. Would you like to see what's available this month?"
      } else if (inputLower.includes("sports")) {
        assistantContent =
          "Sports events! Great choice. We have NBA games, football matches, and more. What sport interests you most?"
      } else if (inputLower.includes("comedy") || inputLower.includes("laugh")) {
        assistantContent =
          "Comedy shows are always fun! We have several hilarious acts coming up. Want me to show you the latest comedy events?"
      } else if (inputLower.includes("price") || inputLower.includes("cost")) {
        assistantContent =
          "Prices vary depending on the event. Most tickets range from $25-$500+. I can help you find events within your budget. What's your price range?"
      } else if (inputLower.includes("help") || inputLower.includes("?")) {
        assistantContent =
          "I can help you: 1) Search for events by category 2) Filter by location 3) Find tickets within your budget 4) Show similar events you might like. What would you like to do?"
      } else {
        const responses = [
          "That sounds interesting! Let me find some matching events for you. Give me a moment...",
          "Perfect! I've found several options that match your interest. Would you like to see them?",
          "Excellent choice! I can help you find the perfect ticket. Need any specific details?",
          "I found some great options! Would you like me to filter by location or price?",
        ]
        assistantContent = responses[Math.floor(Math.random() * responses.length)]
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: assistantContent,
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 800)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end md:items-end justify-end">
      <div className="bg-background w-full md:w-80 h-96 rounded-t-2xl md:rounded-2xl flex flex-col shadow-xl border border-border mb-20 mr-6">
        {/* Header with close button - repositioned to bottom right with proper sizing */}
        <div className="bg-primary text-primary-foreground px-6 py-3 flex items-center justify-between rounded-t-2xl">
          <h2 className="font-bold text-base">Ticket Assistant</h2>
          <button
            onClick={onClose}
            className="hover:bg-primary/80 p-1 rounded transition-colors"
            aria-label="Close chat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages - scrollable container with fixed height */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-none"
                    : "bg-muted text-foreground rounded-bl-none"
                }`}
              >
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted text-foreground px-4 py-2 rounded-lg rounded-bl-none">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-border p-4 bg-background">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask about tickets..."
              className="flex-1 bg-card text-foreground border-border placeholder:text-muted-foreground"
              disabled={isLoading}
            />
            <Button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              size="icon"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

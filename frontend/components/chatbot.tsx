"use client"

import React, { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, Send, MessageCircle, Bot } from "lucide-react"

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

interface ChatBotProps {
  onClose: () => void
}

export default function ChatBot({ onClose }: ChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your MyTikiti assistant. How can I help you today? I can assist with finding events, booking tickets, payment issues, or any other questions!",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()

    // Event-related queries
    if (lowerMessage.includes("event") || lowerMessage.includes("show") || lowerMessage.includes("concert")) {
      return "You can browse all our events on the Browse page! We have concerts, sports events, theater shows, and more. Would you like me to help you find something specific?"
    }

    // Ticket booking
    if (lowerMessage.includes("book") || lowerMessage.includes("ticket") || lowerMessage.includes("buy")) {
      return "To book tickets: 1) Browse events and select one you like, 2) Choose your ticket type and quantity, 3) Click 'Buy' to proceed to checkout, 4) Complete payment via M-Pesa. Need help with any specific step?"
    }

    // Payment queries
    if (lowerMessage.includes("payment") || lowerMessage.includes("pay") || lowerMessage.includes("mpesa") || lowerMessage.includes("m-pesa")) {
      return "We use M-Pesa for secure payments. After selecting your tickets, you'll receive an M-Pesa prompt on your phone. Enter your PIN to complete the payment. Having issues? Make sure your phone number is correct and you have sufficient balance."
    }

    // Account/Profile
    if (lowerMessage.includes("account") || lowerMessage.includes("profile") || lowerMessage.includes("login") || lowerMessage.includes("signup")) {
      return "You can manage your account from the Profile section. There you can update your information, view your purchase history, and check your tickets. Need help signing up or logging in?"
    }

    // Creator/Organizer queries
    if (lowerMessage.includes("create") || lowerMessage.includes("organizer") || lowerMessage.includes("sell") || lowerMessage.includes("host")) {
      return "Want to create your own event? Sign up as a Creator! You'll get access to the Creator Dashboard where you can create events, manage tickets, track sales, and view analytics. Ready to get started?"
    }

    // Analytics
    if (lowerMessage.includes("analytic") || lowerMessage.includes("report") || lowerMessage.includes("export") || lowerMessage.includes("data")) {
      return "Event organizers can view detailed analytics in their Creator Dashboard! You can see ticket sales, revenue trends, and export reports in PDF, Excel, or CSV formats. The time filter lets you view data for 7 days, 30 days, 90 days, or 1 year."
    }

    // Help/Support
    if (lowerMessage.includes("help") || lowerMessage.includes("support") || lowerMessage.includes("problem") || lowerMessage.includes("issue")) {
      return "I'm here to help! You can ask me about: finding events, booking tickets, payment methods, your account, creating events, or technical issues. What specific help do you need?"
    }

    // Refund
    if (lowerMessage.includes("refund") || lowerMessage.includes("cancel") || lowerMessage.includes("return")) {
      return "For refund requests, please contact the event organizer directly through their profile page. Refund policies vary by event. You can find organizer contact information on the event details page."
    }

    // Categories
    if (lowerMessage.includes("categor") || lowerMessage.includes("type") || lowerMessage.includes("kind")) {
      return "We have events in many categories: Music & Concerts, Sports, Theater & Arts, Comedy, Food & Drink, Technology, and more! Visit our Categories page to explore events by type."
    }

    // Greetings
    if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.includes("hey")) {
      return "Hello! Great to chat with you! What can I help you with today? 😊"
    }

    // Thanks
    if (lowerMessage.includes("thank") || lowerMessage.includes("thanks")) {
      return "You're welcome! Is there anything else I can help you with?"
    }

    // Default response
    return "I'm here to help! You can ask me about browsing events, booking tickets, payments, creating events, analytics, or any other questions about MyTikiti. What would you like to know?"
  }

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate bot typing delay
    setTimeout(() => {
      const botResponse = generateBotResponse(inputValue)
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
      setIsTyping(false)
    }, 800)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 shadow-2xl">
      <Card className="flex flex-col h-[600px] bg-white dark:bg-gray-900 border-2 border-orange-500">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-t-lg">
          <div className="flex items-center gap-2">
            <div className="bg-white/20 p-2 rounded-full">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold">MyTikiti Assistant</h3>
              <p className="text-xs text-orange-100">Online - Here to help!</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-950">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender === "user"
                    ? "bg-orange-600 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700"
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 max-w-[80%]">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-orange-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="w-2 h-2 bg-orange-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                  <div className="w-2 h-2 bg-orange-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <Button
              onClick={handleSendMessage}
              className="bg-orange-600 hover:bg-orange-700 text-white"
              size="icon"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

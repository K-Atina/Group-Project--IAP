"use client"

import { useState, useMemo } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ChatBot from "@/components/chatbot"
import CategoryCarousel from "@/components/category-carousel"
import { Input } from "@/components/ui/input"
import { Music, Camera, Gamepad2, Utensils, Trophy, Briefcase, Search } from "lucide-react"

const categories = [
  {
    id: 1,
    name: "Music & Concerts",
    icon: Music,
    count: "500+",
    color: "bg-blue-500",
    description: "Live music, concerts, festivals"
  },
  {
    id: 2,
    name: "Arts & Theatre",
    icon: Camera,
    count: "200+", 
    color: "bg-purple-500",
    description: "Theatre, art shows, exhibitions"
  },
  {
    id: 3,
    name: "Sports & Gaming",
    icon: Trophy,
    count: "350+",
    color: "bg-green-500", 
    description: "Sports events, gaming tournaments"
  },
  {
    id: 4,
    name: "Food & Drinks",
    icon: Utensils,
    count: "180+",
    color: "bg-orange-500",
    description: "Food festivals, wine tastings"
  },
  {
    id: 5,
    name: "Business & Tech",
    icon: Briefcase,
    count: "120+",
    color: "bg-indigo-500",
    description: "Conferences, workshops, meetups"
  },
  {
    id: 6,
    name: "Gaming",
    icon: Gamepad2,
    count: "90+",
    color: "bg-pink-500",
    description: "Gaming events, eSports"
  }
]

export default function CategoriesPage() {
  const [showChat, setShowChat] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Filter categories based on search query
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories
    
    return categories.filter(category =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery])

  return (
    <main className="min-h-screen bg-background">
      <Header onOpenChat={() => setShowChat(true)} />
      
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Event Categories
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Explore events by category. Find exactly what you're looking for!
            </p>
            
            {/* Search Bar */}
            <div className="max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 text-lg bg-card border-border focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category) => {
                const IconComponent = category.icon
                return (
                  <div
                    key={category.id}
                    className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`${category.color} p-3 rounded-xl text-white group-hover:scale-110 transition-transform`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {category.count} events
                        </p>
                      </div>
                    </div>
                    <p className="text-muted-foreground">
                      {category.description}
                    </p>
                  </div>
                )
              })
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">No categories found</h3>
                <p className="text-muted-foreground">
                  Try searching for a different term or browse all available categories.
                </p>
              </div>
            )}
          </div>

          {/* Featured Categories Section */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-foreground text-center">
              Popular This Week
            </h2>
            <CategoryCarousel />
          </div>
        </div>
      </div>

      {showChat && <ChatBot onClose={() => setShowChat(false)} />}
      <Footer />
    </main>
  )
}
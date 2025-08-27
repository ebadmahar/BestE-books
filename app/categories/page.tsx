"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Briefcase, Heart, Zap, Users, Lightbulb, Utensils, Code } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

interface CategoryData {
  name: string
  count: number
  icon: React.ComponentType<any>
  description: string
  color: string
}

const categoryIcons: Record<string, { icon: React.ComponentType<any>; color: string; description: string }> = {
  Adventure: { icon: Zap, color: "text-orange-500", description: "Thrilling journeys and epic quests" },
  Business: { icon: Briefcase, color: "text-blue-500", description: "Grow your career and business skills" },
  Cooking: { icon: Utensils, color: "text-green-500", description: "Delicious recipes and culinary arts" },
  Technology: { icon: Code, color: "text-purple-500", description: "Programming and tech insights" },
  Mystery: { icon: BookOpen, color: "text-red-500", description: "Suspenseful stories and puzzles" },
  Health: { icon: Heart, color: "text-pink-500", description: "Wellness and healthy living guides" },
  Biography: { icon: Users, color: "text-indigo-500", description: "Real life stories of remarkable people" },
  "Self-Help": { icon: Lightbulb, color: "text-yellow-500", description: "Personal development and growth" },
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCategories() {
      const supabase = createClient()
      const { data, error } = await supabase.from("books").select("category")

      if (data && !error) {
        // Count books per category
        const categoryCounts = data.reduce(
          (acc, book) => {
            acc[book.category] = (acc[book.category] || 0) + 1
            return acc
          },
          {} as Record<string, number>,
        )

        // Create category data with icons and descriptions
        const categoryData = Object.entries(categoryCounts).map(([name, count]) => ({
          name,
          count,
          icon: categoryIcons[name]?.icon || BookOpen,
          description: categoryIcons[name]?.description || "Discover amazing books",
          color: categoryIcons[name]?.color || "text-primary",
        }))

        setCategories(categoryData.sort((a, b) => b.count - a.count))
      }
      setLoading(false)
    }

    fetchCategories()
  }, [])

  if (loading) {
    return (
      <main className="min-h-screen">
        <Navigation />
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-muted rounded-lg h-32"></div>
              ))}
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="font-serif text-4xl font-bold mb-4">Book Categories</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore our diverse collection of books organized by genre. Find exactly what you're looking for.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link key={category.name} href={`/books?category=${encodeURIComponent(category.name)}`}>
              <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105 h-full">
                <CardContent className="p-8 text-center h-full flex flex-col justify-between">
                  <div>
                    <category.icon
                      className={`h-12 w-12 mx-auto mb-4 ${category.color} group-hover:scale-110 transition-transform`}
                    />
                    <h3 className="font-serif text-xl font-bold mb-2">{category.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {category.count} {category.count === 1 ? "book" : "books"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Featured Categories */}
        <div className="mt-16">
          <h2 className="font-serif text-3xl font-bold mb-8 text-center">Popular This Month</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {categories.slice(0, 2).map((category) => (
              <Link key={category.name} href={`/books?category=${encodeURIComponent(category.name)}`}>
                <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-6">
                      <category.icon
                        className={`h-16 w-16 ${category.color} group-hover:scale-110 transition-transform`}
                      />
                      <div className="flex-1">
                        <h3 className="font-serif text-2xl font-bold mb-2">{category.name}</h3>
                        <p className="text-muted-foreground mb-3">{category.description}</p>
                        <Badge variant="outline" className="text-sm">
                          {category.count} books available
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

"use client"

import { useEffect, useState } from "react"
import { Book3D } from "./book-3d"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface Book {
  id: string
  title: string
  author: string
  price: number
  is_free: boolean
  cover_image_url: string
  category: string
}

export function LatestBooksSlider() {
  const [books, setBooks] = useState<Book[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBooks() {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("books")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(8)

      if (data && !error) {
        setBooks(data)
      }
      setLoading(false)
    }

    fetchBooks()
  }, [])

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, books.length - 3))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.max(1, books.length - 3)) % Math.max(1, books.length - 3))
  }

  if (loading) {
    return (
      <section className="py-16 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-bold mb-4">Latest Arrivals</h2>
            <p className="text-muted-foreground text-lg">Fresh picks just for you</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted rounded-lg aspect-[3/4] mb-4"></div>
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 px-6 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl font-bold mb-4">Latest Arrivals</h2>
          <p className="text-muted-foreground text-lg">Fresh picks just for you</p>
        </div>
        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-300 ease-in-out gap-6"
              style={{ transform: `translateX(-${currentIndex * (100 / 4)}%)` }}
            >
              {books.map((book) => (
                <div key={book.id} className="flex-none w-full md:w-1/2 lg:w-1/4">
                  <Book3D book={book} />
                </div>
              ))}
            </div>
          </div>
          {books.length > 4 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-background shadow-lg"
                onClick={prevSlide}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-background shadow-lg"
                onClick={nextSlide}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    </section>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

const featuredBooks = [
  {
    id: 1,
    title: "Fazlul Bari Sharh Sahih Bukhari",
    author: "Maulana Shabir Ahmad Usmani",
    image: "/fd.jpg",
    description: "A renowned Urdu commentary on Sahih Bukhari, offering deep insights into prophetic traditions and Islamic scholarship.",
  },
  {
    id: 2,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    image: "/placeholder.svg?height=400&width=300&text=To+Kill+a+Mockingbird",
    description: "A gripping tale of racial injustice and childhood innocence.",
  },
  {
    id: 3,
    title: "1984",
    author: "George Orwell",
    image: "/placeholder.svg?height=400&width=300&text=1984",
    description: "A dystopian novel about totalitarian control and surveillance.",
  },
]

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredBooks.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredBooks.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredBooks.length) % featuredBooks.length)
  }

  return (
    <section className="relative min-h-[70vh] bg-gradient-to-br from-primary/10 via-background to-accent/5">
      <div className="relative overflow-hidden h-full">
        <div
          className="flex transition-transform duration-500 ease-in-out h-full"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {featuredBooks.map((book, index) => (
            <div key={book.id} className="w-full flex-shrink-0 flex items-center justify-center px-6">
              <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center py-20">
                <div className="text-center md:text-left">
                  <h1 className="font-serif text-4xl md:text-6xl font-bold mb-4 text-foreground">Featured Book</h1>
                  <h2 className="font-serif text-3xl md:text-4xl font-bold mb-2 text-primary">{book.title}</h2>
                  <p className="text-xl text-muted-foreground mb-4">by {book.author}</p>
                  <p className="text-lg text-muted-foreground mb-8 leading-relaxed">{book.description}</p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                    <Link href="/books">
                      <Button size="lg" className="bg-primary hover:bg-primary/90">
                        Browse All Books
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                    <Link href="/books?filter=free">
                      <Button
                        size="lg"
                        variant="outline"
                        className="border-accent text-accent hover:bg-accent hover:text-accent-foreground bg-transparent"
                      >
                        Free Books
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="flex justify-center">
                  <div className="book-3d">
                    <img
                      src={book.image || "/placeholder.svg"}
                      alt={book.title}
                      className="w-64 h-80 object-cover rounded-lg shadow-2xl"
                    />
                    <div className="book-spine"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background p-2 rounded-full shadow-lg transition-colors"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background p-2 rounded-full shadow-lg transition-colors"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {featuredBooks.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? "bg-primary" : "bg-background/50"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

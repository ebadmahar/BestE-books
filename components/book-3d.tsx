"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"

interface Book {
  id: string
  title: string
  author: string
  price: number
  is_free: boolean
  cover_image_url: string
  category: string
}

interface Book3DProps {
  book: Book
  className?: string
}

export function Book3D({ book, className = "" }: Book3DProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Link href={`/books/${book.id}`}>
      <div
        className={`relative perspective-1000 ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Card className={`book-3d relative overflow-hidden shadow-lg cursor-pointer ${isHovered ? "shadow-2xl" : ""}`}>
          <div className="book-spine"></div>
          <div className="aspect-[3/4] relative">
            <Image src={book.cover_image_url || "/placeholder.svg"} alt={book.title} fill className="object-cover" />
            {book.is_free && <Badge className="absolute top-2 right-2 bg-accent text-accent-foreground">Free</Badge>}
          </div>
          <div className="p-4 space-y-2">
            <h3 className="font-serif font-bold text-sm line-clamp-2">{book.title}</h3>
            <p className="text-xs text-muted-foreground">{book.author}</p>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-primary">{book.is_free ? "Free" : `$${book.price}`}</span>
            </div>
          </div>
        </Card>
      </div>
    </Link>
  )
}

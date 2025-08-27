"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Download, MessageCircle, Share2, Star } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"

interface Book {
  id: string
  title: string
  author: string
  description: string
  price: number
  is_free: boolean
  cover_image_url: string
  category: string
  book_url: string | null
  created_at: string
}

export default function BookDetailPage() {
  const params = useParams()
  const [book, setBook] = useState<Book | null>(null)
  const [loading, setLoading] = useState(true)
  const [relatedBooks, setRelatedBooks] = useState<Book[]>([])

  useEffect(() => {
    async function fetchBook() {
      if (!params.id) return

      const supabase = createClient()
      const { data, error } = await supabase.from("books").select("*").eq("id", params.id).single()

      if (data && !error) {
        setBook(data)

        // Fetch related books from same category
        const { data: related } = await supabase
          .from("books")
          .select("*")
          .eq("category", data.category)
          .neq("id", data.id)
          .limit(4)

        if (related) {
          setRelatedBooks(related)
        }
      }
      setLoading(false)
    }

    fetchBook()
  }, [params.id])

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: book?.title,
          text: `Check out "${book?.title}" by ${book?.author}`,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
        fallbackShare()
      }
    } else {
      fallbackShare()
    }
  }

  const fallbackShare = () => {
    navigator.clipboard.writeText(window.location.href)
    alert("Link copied to clipboard!")
  }

  if (loading) {
    return (
      <main className="min-h-screen">
        <Navigation />
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="animate-pulse">
            <div className="h-6 bg-muted rounded w-24 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="bg-muted rounded-lg aspect-[3/4]"></div>
              <div className="space-y-4">
                <div className="h-8 bg-muted rounded w-3/4"></div>
                <div className="h-6 bg-muted rounded w-1/2"></div>
                <div className="h-4 bg-muted rounded w-1/4"></div>
                <div className="h-20 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (!book) {
    return (
      <main className="min-h-screen">
        <Navigation />
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Book not found</h1>
            <Link href="/books">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Books
              </Button>
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Back Button */}
        <Link href="/books" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Books
        </Link>

        {/* Book Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Book Cover */}
          <div className="relative">
            <div className="relative aspect-[3/4] max-w-md mx-auto">
              <Image
                src={book.cover_image_url || "/placeholder.svg"}
                alt={book.title}
                fill
                className="object-cover rounded-lg shadow-2xl"
              />
              {book.is_free && <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground">Free</Badge>}
            </div>
          </div>

          {/* Book Info */}
          <div className="space-y-6">
            <div>
              <h1 className="font-serif text-4xl font-bold mb-4">{book.title}</h1>
              <p className="text-xl text-muted-foreground mb-4">by {book.author}</p>
              <div className="flex items-center gap-4 mb-4">
                <Badge variant="outline" className="text-sm">
                  {book.category}
                </Badge>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-sm text-muted-foreground ml-2">(4.8)</span>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold text-lg mb-3">Description</h3>
              <p className="text-muted-foreground leading-relaxed">{book.description}</p>
            </div>

            <Separator />

            {/* Price and Actions */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-primary">{book.is_free ? "Free" : `$${book.price}`}</span>
                {!book.is_free && <span className="text-sm text-muted-foreground">One-time purchase</span>}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                {book.is_free ? (
                  book.book_url ? (
                    <a href={book.book_url} target="_blank" rel="noopener noreferrer">
                      <Button size="lg" className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
                        <Download className="mr-2 h-5 w-5" />
                        Download Free
                      </Button>
                    </a>
                  ) : (
                    <Link href="/contact">
                      <Button
                        size="lg"
                        variant="outline"
                        className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto"
                      >
                        <MessageCircle className="mr-2 h-5 w-5" />
                        Request This Book
                      </Button>
                    </Link>
                  )
                ) : (
                  <>
                    <Button size="lg" className="bg-primary hover:bg-primary/90">
                      Click Here to Buy
                    </Button>
                    <Link href="/contact">
                      <Button size="lg" variant="outline" className="bg-green-600 hover:bg-green-700 text-white">
                        <MessageCircle className="mr-2 h-5 w-5" />
                        Contact to Buy
                      </Button>
                    </Link>
                  </>
                )}
                <Button size="lg" variant="outline" onClick={handleShare}>
                  <Share2 className="mr-2 h-5 w-5" />
                  Share
                </Button>
              </div>
            </div>

            <Separator />

            {/* Book Details */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Category:</span>
                <p className="font-medium">{book.category}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Published:</span>
                <p className="font-medium">{new Date(book.created_at).toLocaleDateString()}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Format:</span>
                <p className="font-medium">Digital PDF</p>
              </div>
              <div>
                <span className="text-muted-foreground">Price:</span>
                <p className="font-medium">{book.is_free ? "Free" : `$${book.price}`}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Books */}
        {relatedBooks.length > 0 && (
          <div>
            <h2 className="font-serif text-3xl font-bold mb-8">More from {book.category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedBooks.map((relatedBook) => (
                <Link key={relatedBook.id} href={`/books/${relatedBook.id}`}>
                  <Card className="group hover:shadow-lg transition-shadow">
                    <div className="relative aspect-[3/4] overflow-hidden rounded-t-lg">
                      <Image
                        src={relatedBook.cover_image_url || "/placeholder.svg"}
                        alt={relatedBook.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {relatedBook.is_free && (
                        <Badge className="absolute top-2 right-2 bg-accent text-accent-foreground">Free</Badge>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-serif font-bold text-sm line-clamp-2 mb-2">{relatedBook.title}</h3>
                      <p className="text-xs text-muted-foreground mb-2">{relatedBook.author}</p>
                      <span className="text-sm font-semibold text-primary">
                        {relatedBook.is_free ? "Free" : `$${relatedBook.price}`}
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

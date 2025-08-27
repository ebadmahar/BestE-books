"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, ArrowRight } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import Image from "next/image"

interface BlogPost {
  id: string
  title: string
  excerpt: string
  featured_image_url: string
  created_at: string
}

export function BlogHighlights() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPosts() {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id, title, excerpt, featured_image_url, created_at")
        .eq("published", true)
        .order("created_at", { ascending: false })
        .limit(3)

      if (data && !error) {
        setPosts(data)
      }
      setLoading(false)
    }

    fetchPosts()
  }, [])

  if (loading) {
    return (
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-bold mb-4">From Our Blog</h2>
            <p className="text-muted-foreground text-lg">Stories, insights, and book recommendations</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted rounded-lg aspect-video mb-4"></div>
                <div className="h-6 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl font-bold mb-4">From Our Blog</h2>
          <p className="text-muted-foreground text-lg">Stories, insights, and book recommendations</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <Card
              key={post.id}
              className={`group hover:shadow-lg transition-all duration-300 ${index === 0 ? "md:col-span-2 md:row-span-2" : ""}`}
            >
              <div
                className={`relative ${index === 0 ? "aspect-[16/10]" : "aspect-video"} overflow-hidden rounded-t-lg`}
              >
                <Image
                  src={post.featured_image_url || "/placeholder.svg"}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">Blog</Badge>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                  <Calendar className="h-4 w-4" />
                  {new Date(post.created_at).toLocaleDateString()}
                </div>
                <h3
                  className={`font-serif font-bold mb-3 group-hover:text-primary transition-colors ${index === 0 ? "text-2xl" : "text-lg"}`}
                >
                  {post.title}
                </h3>
                <p className={`text-muted-foreground mb-4 ${index === 0 ? "text-base" : "text-sm"}`}>{post.excerpt}</p>
                <Button variant="ghost" className="p-0 h-auto text-primary hover:text-primary/80">
                  Read More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

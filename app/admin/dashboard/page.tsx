"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  BookOpen,
  FileText,
  MessageSquare,
  Plus,
  Edit,
  LogOut,
  BarChart3,
  Settings,
  Wrench,
  Trash2,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { BookForm } from "@/components/admin/book-form"
import { BlogForm } from "@/components/admin/blog-form"
import { AdminGuard } from "@/components/admin/admin-guard"
import { getAdminSession, logoutAdmin } from "@/lib/admin-auth"

interface Book {
  id: string
  title: string
  author: string
  description: string
  price: number
  is_free: boolean
  category: string
  cover_image?: string
  created_at: string
}

interface BlogPost {
  id: string
  title: string
  content: string
  excerpt: string
  published: boolean
  featured_image?: string
  tags?: string[]
  created_at: string
}

interface BookRequest {
  id: string
  name: string
  email: string
  book_title: string
  author: string
  status: string
  created_at: string
}

interface Stats {
  totalBooks: number
  totalPosts: number
  totalRequests: number
  pendingRequests: number
}

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<Stats>({ totalBooks: 0, totalPosts: 0, totalRequests: 0, pendingRequests: 0 })
  const [books, setBooks] = useState<Book[]>([])
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [requests, setRequests] = useState<BookRequest[]>([])
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [maintenanceLoading, setMaintenanceLoading] = useState(false)

  const [showBookForm, setShowBookForm] = useState(false)
  const [showBlogForm, setShowBlogForm] = useState(false)
  const [editingBook, setEditingBook] = useState<Book | null>(null)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [formLoading, setFormLoading] = useState(false)

  const router = useRouter()

  useEffect(() => {
    async function checkAuth() {
      const session = getAdminSession()

      if (!session) {
        router.push("/admin/login")
        return
      }

      setUser({ email: session.email })
      await fetchData()
      setLoading(false)
    }

    checkAuth()
  }, [router])

  const fetchData = async () => {
    const supabase = createClient()

    try {
      const [booksResponse, postsResponse, requestsResponse] = await Promise.all([
        fetch("/api/admin/books"),
        fetch("/api/admin/blog"), // Use API endpoint instead of direct Supabase call
        fetch("/api/admin/requests"),
      ])

      const booksResult = booksResponse.ok ? await booksResponse.json() : { books: [], count: 0 }
      const books = booksResult.books || []

      const postsResult = postsResponse.ok ? await postsResponse.json() : { posts: [] }
      const posts = postsResult.posts || []

      const requestsResult = requestsResponse.ok ? await requestsResponse.json() : { requests: [] }
      const requests = requestsResult.requests || []

      const pendingRequests = requests.filter((req: BookRequest) => req.status === "pending")

      const { data: maintenanceSetting } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "maintenance_mode")
        .single()

      setMaintenanceMode(maintenanceSetting?.value === "true")

      setStats({
        totalBooks: books.length,
        totalPosts: posts.length, // Use posts array length instead of count
        totalRequests: requests.length,
        pendingRequests: pendingRequests.length,
      })

      setBooks(books.slice(0, 5))
      setPosts(posts.slice(0, 5)) // Use posts from API response
      setRequests(requests.slice(0, 10))
    } catch (error) {
      console.log("[v0] Error fetching data:", error)
      setStats({ totalBooks: 0, totalPosts: 0, totalRequests: 0, pendingRequests: 0 })
    }
  }

  const handleBookSubmit = async (bookData: Book) => {
    setFormLoading(true)
    try {
      const url = editingBook ? "/api/admin/books" : "/api/admin/books"
      const method = editingBook ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookData),
      })

      if (response.ok) {
        await fetchData()
        setShowBookForm(false)
        setEditingBook(null)
      }
    } catch (error) {
      console.error("Error saving book:", error)
    } finally {
      setFormLoading(false)
    }
  }

  const handleDeleteBook = async (bookId: string) => {
    if (!confirm("Are you sure you want to delete this book?")) return

    try {
      const response = await fetch(`/api/admin/books?id=${bookId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchData()
      }
    } catch (error) {
      console.error("Error deleting book:", error)
    }
  }

  const handleBlogSubmit = async (postData: BlogPost) => {
    setFormLoading(true)
    try {
      const url = "/api/admin/blog"
      const method = editingPost ? "PUT" : "POST"

      console.log("[v0] Submitting blog post:", postData) // Add debug logging

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      })

      const result = await response.json()
      console.log("[v0] Blog submission result:", result) // Add debug logging

      if (response.ok && result.success) {
        // Check for success flag
        await fetchData()
        setShowBlogForm(false)
        setEditingPost(null)
      } else {
        console.error("[v0] Blog submission failed:", result.error)
        alert(`Failed to save blog post: ${result.error || "Unknown error"}`) // Show error to user
      }
    } catch (error) {
      console.error("[v0] Error saving blog post:", error)
      alert("Error saving blog post. Please try again.") // Show error to user
    } finally {
      setFormLoading(false)
    }
  }

  const handleDeletePost = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return

    try {
      const response = await fetch(`/api/admin/blog?id=${postId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchData()
      }
    } catch (error) {
      console.error("Error deleting blog post:", error)
    }
  }

  const handleSignOut = async () => {
    logoutAdmin()
    router.push("/admin/login")
  }

  const updateRequestStatus = async (requestId: string, status: string) => {
    try {
      const response = await fetch("/api/admin/requests", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: requestId, status }),
      })

      if (response.ok) {
        setRequests(requests.map((req) => (req.id === requestId ? { ...req, status } : req)))
        if (status !== "pending") {
          setStats((prev) => ({ ...prev, pendingRequests: prev.pendingRequests - 1 }))
        }
      } else {
        console.error("Failed to update request status")
      }
    } catch (error) {
      console.error("Error updating request status:", error)
    }
  }

  const toggleMaintenanceMode = async (enabled: boolean) => {
    setMaintenanceLoading(true)
    const supabase = createClient()

    const { error } = await supabase
      .from("site_settings")
      .update({ value: enabled.toString() })
      .eq("key", "maintenance_mode")

    if (!error) {
      setMaintenanceMode(enabled)
    }
    setMaintenanceLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (showBookForm || editingBook) {
    return (
      <div className="min-h-screen bg-muted/30 p-6">
        <BookForm
          book={editingBook || undefined}
          onSubmit={handleBookSubmit}
          onCancel={() => {
            setShowBookForm(false)
            setEditingBook(null)
          }}
          isLoading={formLoading}
        />
      </div>
    )
  }

  if (showBlogForm || editingPost) {
    return (
      <div className="min-h-screen bg-muted/30 p-6">
        <BlogForm
          post={editingPost || undefined}
          onSubmit={handleBlogSubmit}
          onCancel={() => {
            setShowBlogForm(false)
            setEditingPost(null)
          }}
          isLoading={formLoading}
        />
      </div>
    )
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-muted/30">
        {/* Header */}
        <header className="bg-background border-b">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/" className="flex items-center gap-2">
                  <BookOpen className="h-6 w-6 text-primary" />
                  <span className="font-serif text-xl font-bold">Modern Bookstore</span>
                </Link>
                <Badge variant="secondary">Admin Panel</Badge>
                {maintenanceMode && (
                  <Badge variant="destructive" className="flex items-center gap-1">
                    <Wrench className="h-3 w-3" />
                    Maintenance Mode
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">Welcome, {user?.email}</span>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <BookOpen className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">{stats.totalBooks}</p>
                    <p className="text-sm text-muted-foreground">Total Books</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <FileText className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">{stats.totalPosts}</p>
                    <p className="text-sm text-muted-foreground">Blog Posts</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <MessageSquare className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">{stats.totalRequests}</p>
                    <p className="text-sm text-muted-foreground">Book Requests</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <BarChart3 className="h-8 w-8 text-accent" />
                  <div>
                    <p className="text-2xl font-bold">{stats.pendingRequests}</p>
                    <p className="text-sm text-muted-foreground">Pending Requests</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="books">Books</TabsTrigger>
              <TabsTrigger value="blog">Blog</TabsTrigger>
              <TabsTrigger value="requests">Requests</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {maintenanceMode && (
                <Card className="border-destructive bg-destructive/5">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <Wrench className="h-8 w-8 text-destructive" />
                      <div>
                        <h3 className="font-semibold text-destructive">Maintenance Mode Active</h3>
                        <p className="text-sm text-muted-foreground">
                          The website is currently in maintenance mode. Only administrators can access the site.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Books */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Recent Books</CardTitle>
                    <Button size="sm" onClick={() => setShowBookForm(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Book
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {books.map((book) => (
                        <div key={book.id} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{book.title}</p>
                            <p className="text-sm text-muted-foreground">by {book.author}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={book.is_free ? "secondary" : "outline"}>
                              {book.is_free ? "Free" : `$${book.price}`}
                            </Badge>
                            <Button size="sm" variant="ghost" onClick={() => setEditingBook(book)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Blog Posts */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Recent Blog Posts</CardTitle>
                    <Button size="sm" onClick={() => setShowBlogForm(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      New Post
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {posts.map((post) => (
                        <div key={post.id} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{post.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(post.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={post.published ? "default" : "secondary"}>
                              {post.published ? "Published" : "Draft"}
                            </Badge>
                            <Button size="sm" variant="ghost" onClick={() => setEditingPost(post)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Pending Requests */}
              <Card>
                <CardHeader>
                  <CardTitle>Pending Book Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {requests
                      .filter((req) => req.status === "pending")
                      .map((request) => (
                        <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <p className="font-medium">{request.book_title}</p>
                            <p className="text-sm text-muted-foreground">
                              by {request.author || "Unknown"} • Requested by {request.name}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateRequestStatus(request.id, "approved")}
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateRequestStatus(request.id, "rejected")}
                            >
                              Reject
                            </Button>
                          </div>
                        </div>
                      ))}
                    {requests.filter((req) => req.status === "pending").length === 0 && (
                      <p className="text-muted-foreground text-center py-8">No pending requests</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="books">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Manage Books</CardTitle>
                  <Button onClick={() => setShowBookForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Book
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {books.map((book) => (
                      <div key={book.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h3 className="font-medium">{book.title}</h3>
                          <p className="text-sm text-muted-foreground">by {book.author}</p>
                          <p className="text-sm text-muted-foreground">{book.category}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={book.is_free ? "secondary" : "outline"}>
                            {book.is_free ? "Free" : `$${book.price}`}
                          </Badge>
                          <Button size="sm" variant="ghost" onClick={() => setEditingBook(book)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDeleteBook(book.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="blog">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Manage Blog Posts</CardTitle>
                  <Button onClick={() => setShowBlogForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Blog Post
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {posts.map((post) => (
                      <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h3 className="font-medium">{post.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(post.created_at).toLocaleDateString()}
                          </p>
                          {post.excerpt && (
                            <p className="text-sm text-muted-foreground mt-1">{post.excerpt.substring(0, 100)}...</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={post.published ? "default" : "secondary"}>
                            {post.published ? "Published" : "Draft"}
                          </Badge>
                          <Button size="sm" variant="ghost" onClick={() => setEditingPost(post)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDeletePost(post.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="requests">
              <Card>
                <CardHeader>
                  <CardTitle>Book Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {requests.map((request) => (
                      <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{request.book_title}</p>
                          <p className="text-sm text-muted-foreground">
                            by {request.author || "Unknown"} • Requested by {request.name} ({request.email})
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(request.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              request.status === "approved"
                                ? "default"
                                : request.status === "rejected"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {request.status}
                          </Badge>
                          {request.status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateRequestStatus(request.id, "approved")}
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateRequestStatus(request.id, "rejected")}
                              >
                                Reject
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Site Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <Label htmlFor="maintenance-mode" className="text-base font-medium">
                          Maintenance Mode
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          When enabled, only administrators can access the website. Regular users will see a maintenance
                          page.
                        </p>
                      </div>
                      <Switch
                        id="maintenance-mode"
                        checked={maintenanceMode}
                        onCheckedChange={toggleMaintenanceMode}
                        disabled={maintenanceLoading}
                      />
                    </div>

                    {maintenanceMode && (
                      <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Wrench className="h-4 w-4 text-destructive" />
                          <span className="font-medium text-destructive">Maintenance Mode is Active</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Your website is currently showing a maintenance page to all non-admin users.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AdminGuard>
  )
}

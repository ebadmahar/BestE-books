"use client"

import type React from "react"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, MapPin, Clock, BookOpen, Send, CheckCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface ContactForm {
  name: string
  email: string
  subject: string
  message: string
}

interface BookRequestForm {
  name: string
  email: string
  bookTitle: string
  author: string
  message: string
}

export default function ContactPage() {
  const [contactForm, setContactForm] = useState<ContactForm>({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [bookRequestForm, setBookRequestForm] = useState<BookRequestForm>({
    name: "",
    email: "",
    bookTitle: "",
    author: "",
    message: "",
  })
  const [contactLoading, setContactLoading] = useState(false)
  const [bookRequestLoading, setBookRequestLoading] = useState(false)
  const [contactSuccess, setContactSuccess] = useState(false)
  const [bookRequestSuccess, setBookRequestSuccess] = useState(false)
  const [contactError, setContactError] = useState("")
  const [bookRequestError, setBookRequestError] = useState("")

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setContactLoading(true)
    setContactError("")

    try {
      // For now, we'll just simulate success since we don't have a contact table
      // In a real app, you'd save this to a contacts table or send an email
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setContactSuccess(true)
      setContactForm({ name: "", email: "", subject: "", message: "" })
    } catch (error) {
      setContactError("Failed to send message. Please try again.")
    } finally {
      setContactLoading(false)
    }
  }

  const handleBookRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBookRequestLoading(true)
    setBookRequestError("")

    try {
      const supabase = createClient()

      console.log("[v0] Submitting book request:", {
        name: bookRequestForm.name,
        email: bookRequestForm.email,
        book_title: bookRequestForm.bookTitle,
        author: bookRequestForm.author,
        message: bookRequestForm.message,
      })

      const { error } = await supabase.from("book_requests").insert({
        name: bookRequestForm.name,
        email: bookRequestForm.email,
        book_title: bookRequestForm.bookTitle,
        author: bookRequestForm.author,
        message: bookRequestForm.message,
        status: "pending",
      })

      if (error) {
        console.log("[v0] Book request error:", error)
        throw error
      }

      console.log("[v0] Book request submitted successfully")
      setBookRequestSuccess(true)
      setBookRequestForm({ name: "", email: "", bookTitle: "", author: "", message: "" })
    } catch (error) {
      console.log("[v0] Book request submission failed:", error)
      setBookRequestError("Failed to submit book request. Please try again.")
    } finally {
      setBookRequestLoading(false)
    }
  }

  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="font-serif text-4xl font-bold mb-4">Get in Touch</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Have a question, suggestion, or looking for a specific book? We'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="font-serif text-2xl">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-muted-foreground">hello@Best E-booksbookstore.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-muted-foreground">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-muted-foreground">123 Book Street, Literary District, NY 10001</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="font-medium">Business Hours</p>
                    <p className="text-muted-foreground">Mon-Fri: 9AM-6PM</p>
                    <p className="text-muted-foreground">Sat-Sun: 10AM-4PM</p>
                  </div>
                </div>

                <Separator />

                <div className="text-center">
                  <h3 className="font-semibold mb-2">Follow Us</h3>
                  <p className="text-sm text-muted-foreground">Stay updated with our latest books and news</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Forms */}
          <div className="lg:col-span-2 space-y-8">
            {/* General Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle className="font-serif text-2xl flex items-center gap-2">
                  <Mail className="h-6 w-6 text-primary" />
                  Send us a Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                {contactSuccess ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="font-semibold text-lg mb-2">Message Sent Successfully!</h3>
                    <p className="text-muted-foreground mb-4">
                      Thank you for contacting us. We'll get back to you within 24 hours.
                    </p>
                    <Button onClick={() => setContactSuccess(false)} variant="outline">
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="contact-name">Name *</Label>
                        <Input
                          id="contact-name"
                          value={contactForm.name}
                          onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="contact-email">Email *</Label>
                        <Input
                          id="contact-email"
                          type="email"
                          value={contactForm.email}
                          onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="contact-subject">Subject *</Label>
                      <Input
                        id="contact-subject"
                        value={contactForm.subject}
                        onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact-message">Message *</Label>
                      <Textarea
                        id="contact-message"
                        rows={5}
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        required
                      />
                    </div>
                    {contactError && <p className="text-sm text-red-500">{contactError}</p>}
                    <Button type="submit" disabled={contactLoading} className="w-full">
                      {contactLoading ? (
                        "Sending..."
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>

            {/* Book Request Form */}
            <Card>
              <CardHeader>
                <CardTitle className="font-serif text-2xl flex items-center gap-2">
                  <BookOpen className="h-6 w-6 text-primary" />
                  Request a Book
                </CardTitle>
                <p className="text-muted-foreground">
                  Can't find a book you're looking for? Let us know and we'll try to add it to our collection.
                </p>
              </CardHeader>
              <CardContent>
                {bookRequestSuccess ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="font-semibold text-lg mb-2">Book Request Submitted!</h3>
                    <p className="text-muted-foreground mb-4">
                      We've received your book request. We'll review it and get back to you soon.
                    </p>
                    <Badge variant="secondary" className="mb-4">
                      Status: Pending Review
                    </Badge>
                    <div>
                      <Button onClick={() => setBookRequestSuccess(false)} variant="outline">
                        Request Another Book
                      </Button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleBookRequestSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="request-name">Your Name *</Label>
                        <Input
                          id="request-name"
                          value={bookRequestForm.name}
                          onChange={(e) => setBookRequestForm({ ...bookRequestForm, name: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="request-email">Your Email *</Label>
                        <Input
                          id="request-email"
                          type="email"
                          value={bookRequestForm.email}
                          onChange={(e) => setBookRequestForm({ ...bookRequestForm, email: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="request-title">Book Title *</Label>
                        <Input
                          id="request-title"
                          value={bookRequestForm.bookTitle}
                          onChange={(e) => setBookRequestForm({ ...bookRequestForm, bookTitle: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="request-author">Author</Label>
                        <Input
                          id="request-author"
                          value={bookRequestForm.author}
                          onChange={(e) => setBookRequestForm({ ...bookRequestForm, author: e.target.value })}
                          placeholder="If known"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="request-message">Additional Information</Label>
                      <Textarea
                        id="request-message"
                        rows={4}
                        value={bookRequestForm.message}
                        onChange={(e) => setBookRequestForm({ ...bookRequestForm, message: e.target.value })}
                        placeholder="Any additional details about the book, why you'd like us to add it, etc."
                      />
                    </div>
                    {bookRequestError && <p className="text-sm text-red-500">{bookRequestError}</p>}
                    <Button type="submit" disabled={bookRequestLoading} className="w-full">
                      {bookRequestLoading ? (
                        "Submitting..."
                      ) : (
                        <>
                          <BookOpen className="mr-2 h-4 w-4" />
                          Submit Book Request
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="font-serif text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">How long does it take to add a requested book?</h3>
                <p className="text-muted-foreground text-sm">
                  We typically review book requests within 3-5 business days. If we decide to add the book, it usually
                  takes 1-2 weeks to acquire and make it available.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Do you offer physical books or just digital?</h3>
                <p className="text-muted-foreground text-sm">
                  Currently, we focus on digital books (PDFs and eBooks). However, we're exploring options for physical
                  book delivery in the future.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Can I suggest books for your free collection?</h3>
                <p className="text-muted-foreground text-sm">
                  We love adding quality free books to our collection. Use the book request form and mention that you'd
                  like it added to our free section.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">How do I get notified when a requested book is available?</h3>
                <p className="text-muted-foreground text-sm">
                  We'll send you an email notification when your requested book becomes available in our collection.
                  Make sure to provide a valid email address.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}

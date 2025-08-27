"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "lucide-react"

interface Book {
  id?: string
  title: string
  author: string
  description: string
  price: number
  is_free: boolean
  category: string
  cover_image_url?: string
  book_url?: string
}

interface BookFormProps {
  book?: Book
  onSubmit: (book: Book) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export function BookForm({ book, onSubmit, onCancel, isLoading }: BookFormProps) {
  const [formData, setFormData] = useState<Book>({
    title: book?.title || "",
    author: book?.author || "",
    description: book?.description || "",
    price: book?.price || 0,
    is_free: book?.is_free || false,
    category: book?.category || "",
    cover_image_url: book?.cover_image_url || "",
    book_url: book?.book_url || "",
    ...(book?.id && { id: book.id }),
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
  }

const categories = [
  // Old categories
  "Fiction",
  "Non-Fiction",
  "Mystery",
  "Romance",
  "Science Fiction",
  "Fantasy",
  "Biography",
  "History",
  "Self-Help",
  "Business",

  // New categories
  "Quran e Majeed",
  "Tafseer ul Quran",
  "Uloom e Quran",
  "Tajweed o Qirat",
  "Hadith",
  "Usool e Hadith",
  "Fiqh",
  "Fatawa",
  "Jadid Fiqh",
  "Usool e Fiqh",
  "Ahkam o Masail",
  "Salah",
  "Roza/Ramazan",
  "Zakat",
  "Hajj o Umrah",
  "Nikah o Talaq",
  "Islam",
  "Islamic Beliefs",
  "Khatm e Nubuwwat",
  "Taqabul e Adyan",
  "Deviant Sects",
  "Seerat",
  "Seerat e Sahaba",
  "Tasawwuf",
  "Tableegh",
  "Islahi",
  "Doa o Darood",
  "Khutbaat o Maqalaat",
  "Dictionaries",
  "Encyclopedias",
  "English Books",
  "Falkiyaat",
  "General",
  "History",
  "Khawateen",
  "Children",
  "Khwaab o Tabeer",
  "Qiamat"
];



  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{book ? "Edit Book" : "Add New Book"}</CardTitle>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="author">Author *</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cover_image_url">Cover Image URL</Label>
              <Input
                id="cover_image_url"
                type="url"
                value={formData.cover_image_url}
                onChange={(e) => setFormData({ ...formData, cover_image_url: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <Label htmlFor="is_free" className="text-base font-medium">
                Free Book
              </Label>
              <p className="text-sm text-muted-foreground">Mark this book as free for users</p>
            </div>
            <Switch
              id="is_free"
              checked={formData.is_free}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, is_free: checked, price: checked ? 0 : formData.price })
              }
            />
          </div>

          {!formData.is_free && (
            <div className="space-y-2">
              <Label htmlFor="price">Price ($) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number.parseFloat(e.target.value) || 0 })}
                required={!formData.is_free}
              />
            </div>
          )}

          {formData.is_free && (
            <div className="space-y-2">
              <Label htmlFor="book_url">PDF Download URL</Label>
              <Input
                id="book_url"
                type="url"
                value={formData.book_url}
                onChange={(e) => setFormData({ ...formData, book_url: e.target.value })}
                placeholder="https://example.com/book.pdf"
              />
              <p className="text-sm text-muted-foreground">Provide a direct link to the PDF file for free downloads</p>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Saving..." : book ? "Update Book" : "Add Book"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

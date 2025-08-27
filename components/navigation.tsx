"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { BookOpen, Menu, X } from "lucide-react"
import Link from "next/link"

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-primary" />
            <span className="font-serif text-xl font-bold">Best E-books</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/books" className="text-foreground hover:text-primary transition-colors">
              Books
            </Link>
            <Link href="/blog" className="text-foreground hover:text-primary transition-colors">
              Blog
            </Link>
            <Link href="/contact" className="text-foreground hover:text-primary transition-colors">
              Contact
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col gap-4">
              <Link href="/books" className="text-foreground hover:text-primary transition-colors">
                Books
              </Link>
              <Link href="/blog" className="text-foreground hover:text-primary transition-colors">
                Blog
              </Link>
              <Link href="/contact" className="text-foreground hover:text-primary transition-colors">
                Contact
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

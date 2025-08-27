import { BookOpen, Mail, MapPin, Phone, Facebook, Twitter, Instagram } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="font-serif text-xl font-bold">Modern Bookstore</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Your trusted destination for quality books across all genres. Discover, learn, and grow with our curated
              collection.
            </p>
            <div className="flex gap-4">
              <Facebook className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer" />
              <Twitter className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer" />
              <Instagram className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/books" className="text-muted-foreground hover:text-primary">
                  Books
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-primary">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-muted-foreground hover:text-primary">
                  Categories
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="font-semibold">Popular Categories</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/books?category=Fiction" className="text-muted-foreground hover:text-primary">
                  Fiction
                </Link>
              </li>
              <li>
                <Link href="/books?category=Non-Fiction" className="text-muted-foreground hover:text-primary">
                  Non-Fiction
                </Link>
              </li>
              <li>
                <Link href="/books?category=Technology" className="text-muted-foreground hover:text-primary">
                  Technology
                </Link>
              </li>
              <li>
                <Link href="/books?category=Business" className="text-muted-foreground hover:text-primary">
                  Business
                </Link>
              </li>
              <li>
                <Link href="/books?category=Self-Help" className="text-muted-foreground hover:text-primary">
                  Self-Help
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold">Contact Info</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">info@bestebooks.org</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">+92 123456789</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary mt-0.5" />
                <span className="text-muted-foreground">
                  F-6
                  <br />
                  Islamabad
                  <br />
                  Pakistan
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
           <p>© 2024 Modern Bookstore. All rights reserved.</p>
      <p>
        Developed by{" "}
        <a
          href="https://dev-mepk.netlify.app"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-primary underline"
        >
          DevEm
        </a>{" "}
        with passion and precision.
      </p>

          <div className="flex gap-6 text-sm">
            <Link href="/privacy" className="text-muted-foreground hover:text-primary">
              Sitemap
            </Link>
            <Link href="/support" className="text-muted-foreground hover:text-primary">
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

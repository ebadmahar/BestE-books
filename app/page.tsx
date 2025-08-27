import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { CategoriesSection } from "@/components/categories-section"
import { LatestBooksSlider } from "@/components/latest-books-slider"
import { BlogHighlights } from "@/components/blog-highlights"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSection />
      <CategoriesSection />
      <LatestBooksSlider />
      <BlogHighlights />
    </main>
  )
}

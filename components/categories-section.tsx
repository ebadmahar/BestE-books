import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, Briefcase, Heart, Zap, Users, Lightbulb } from "lucide-react"

const categories = [
  { name: "Fiction", icon: BookOpen, description: "Stories that transport you", color: "text-primary" },
  { name: "Business", icon: Briefcase, description: "Grow your career", color: "text-accent" },
  { name: "Romance", icon: Heart, description: "Love stories & relationships", color: "text-pink-500" },
  { name: "Adventure", icon: Zap, description: "Thrilling journeys", color: "text-orange-500" },
  { name: "Biography", icon: Users, description: "Real life stories", color: "text-green-500" },
  { name: "Self-Help", icon: Lightbulb, description: "Personal development", color: "text-purple-500" },
]

export function CategoriesSection() {
  return (
    <section className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl font-bold mb-4">Browse by Category</h2>
          <p className="text-muted-foreground text-lg">Find exactly what you're looking for</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category) => (
            <Card
              key={category.name}
              className="group hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105"
            >
              <CardContent className="p-6 text-center">
                <category.icon
                  className={`h-8 w-8 mx-auto mb-3 ${category.color} group-hover:scale-110 transition-transform`}
                />
                <h3 className="font-semibold mb-2">{category.name}</h3>
                <p className="text-xs text-muted-foreground">{category.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, Wrench } from "lucide-react"

export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-6">
      <div className="w-full max-w-md text-center">
        <div className="flex items-center justify-center gap-2 mb-8">
          <BookOpen className="h-8 w-8 text-primary" />
          <span className="font-serif text-2xl font-bold">Best E-books</span>
        </div>

        <Card>
          <CardContent className="p-8">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Wrench className="h-16 w-16 text-primary" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full animate-pulse"></div>
              </div>
            </div>

            <h1 className="font-serif text-2xl font-bold mb-4">We'll be right back!</h1>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              We're currently performing some maintenance to improve your experience. We'll be back online shortly.
            </p>

            <div className="text-sm text-muted-foreground">
              <p>Thank you for your patience.</p>
              <p className="mt-2">- The Best E-books Team</p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-xs text-muted-foreground">
          <p>If you're an administrator, you can still access the admin panel.</p>
        </div>
      </div>
    </div>
  )
}

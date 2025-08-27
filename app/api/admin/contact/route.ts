import { type NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("[v0] Contact form submission:", body)

    const { name, email, message, book_title } = body

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email, and message are required" }, { status: 400 })
    }

    const supabase = await createAdminClient()

    // Insert into book_requests table
    const { data, error } = await supabase
      .from("book_requests")
      .insert([
        {
          name,
          email,
          message,
          book_title: book_title || null,
          created_at: new Date().toISOString(),
        },
      ])
      .select()

    if (error) {
      console.error("[v0] Database error:", error)
      return NextResponse.json({ error: "Failed to submit request" }, { status: 500 })
    }

    console.log("[v0] Request submitted successfully:", data)
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("[v0] Contact API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

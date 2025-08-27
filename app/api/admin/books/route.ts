import { type NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

export async function GET() {
  try {
    const supabase = createAdminClient()

    const { data: books, error } = await supabase.from("books").select("*").order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ books })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch books" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createAdminClient()
    const body = await request.json()

    const { title, author, description, price, is_free, category, cover_image_url, book_url } = body

    if (!title || !author || !category) {
      return NextResponse.json({ error: "Title, author, and category are required" }, { status: 400 })
    }

    const { data: book, error } = await supabase
      .from("books")
      .insert([
        {
          title,
          author,
          description: description || "",
          price: is_free ? 0 : price || 0,
          is_free: Boolean(is_free),
          category,
          cover_image_url: cover_image_url || null,
          book_url: book_url || null,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("[v0] Book creation error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log("[v0] Book created successfully:", book)
    return NextResponse.json({ book, success: true })
  } catch (error) {
    console.error("[v0] Book API error:", error)
    return NextResponse.json({ error: "Failed to create book" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = createAdminClient()
    const body = await request.json()

    const { id, title, author, description, price, is_free, category, cover_image_url, book_url } = body

    const { data: book, error } = await supabase
      .from("books")
      .update({
        title,
        author,
        description: description || "",
        price: is_free ? 0 : price || 0,
        is_free: Boolean(is_free),
        category,
        cover_image_url: cover_image_url || null,
        book_url: book_url || null,
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ book })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update book" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createAdminClient()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Book ID is required" }, { status: 400 })
    }

    const { error } = await supabase.from("books").delete().eq("id", id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete book" }, { status: 500 })
  }
}

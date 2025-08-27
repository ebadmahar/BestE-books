import { type NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

export async function GET() {
  try {
    const supabase = createAdminClient()

    const { data: posts, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ posts })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch blog posts" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createAdminClient()
    const body = await request.json()

    const { title, content, excerpt, published, featured_image } = body

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 })
    }

    const { data: post, error } = await supabase
      .from("blog_posts")
      .insert([
        {
          title,
          content,
          excerpt: excerpt || "",
          published: Boolean(published),
          featured_image_url: featured_image || null,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("[v0] Blog creation error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log("[v0] Blog post created successfully:", post)
    return NextResponse.json({ post, success: true })
  } catch (error) {
    console.error("[v0] Blog API error:", error)
    return NextResponse.json({ error: "Failed to create blog post" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = createAdminClient()
    const body = await request.json()

    const { id, title, content, excerpt, published, featured_image, tags } = body

    if (!id || !title || !content) {
      return NextResponse.json({ error: "ID, title and content are required" }, { status: 400 })
    }

    const { data: post, error } = await supabase
      .from("blog_posts")
      .update({
        title,
        content,
        excerpt: excerpt || "",
        published: Boolean(published),
        featured_image_url: featured_image || null,
        tags: tags || [],
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Blog update error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ post, success: true })
  } catch (error) {
    console.error("Blog update API error:", error)
    return NextResponse.json({ error: "Failed to update blog post" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createAdminClient()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 })
    }

    const { error } = await supabase.from("blog_posts").delete().eq("id", id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete blog post" }, { status: 500 })
  }
}

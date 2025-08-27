import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const adminSessionCookie = request.cookies.get("adminSession")?.value
  let isAdminAuthenticated = false

  if (adminSessionCookie) {
    try {
      const adminSession = JSON.parse(adminSessionCookie)
      const isExpired = Date.now() > adminSession.loginTime + adminSession.expiresIn
      isAdminAuthenticated = adminSession.isAdmin && !isExpired
    } catch (error) {
      // Invalid session cookie
      isAdminAuthenticated = false
    }
  }

  const { data: maintenanceSetting } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "maintenance_mode")
    .single()

  const isMaintenanceMode = maintenanceSetting?.value === "true"

  // If maintenance mode is on, check if user is admin
  if (
    isMaintenanceMode &&
    !request.nextUrl.pathname.startsWith("/admin") &&
    !request.nextUrl.pathname.startsWith("/maintenance")
  ) {
    let isAdmin = false

    if (user) {
      const { data: adminUser } = await supabase.from("admin_users").select("*").eq("id", user.id).single()
      isAdmin = !!adminUser
    }

    if (!isAdmin && isAdminAuthenticated) {
      isAdmin = true
    }

    // Redirect non-admin users to maintenance page
    if (!isAdmin) {
      const url = request.nextUrl.clone()
      url.pathname = "/maintenance"
      return NextResponse.redirect(url)
    }
  }

  if (request.nextUrl.pathname.startsWith("/admin") && request.nextUrl.pathname !== "/admin/login") {
    if (!user && !isAdminAuthenticated) {
      const url = request.nextUrl.clone()
      url.pathname = "/admin/login"
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}

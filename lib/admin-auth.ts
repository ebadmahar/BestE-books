export interface AdminSession {
  isAdmin: boolean
  email: string
  loginTime: number
  expiresIn: number
}

export function getAdminSession(): AdminSession | null {
  if (typeof window === "undefined") return null

  try {
    const sessionData = localStorage.getItem("adminSession")
    if (!sessionData) return null

    const session: AdminSession = JSON.parse(sessionData)

    // Check if session has expired
    if (Date.now() - session.loginTime > session.expiresIn) {
      localStorage.removeItem("adminSession")
      return null
    }

    return session
  } catch {
    localStorage.removeItem("adminSession")
    return null
  }
}

export function isAdminAuthenticated(): boolean {
  const session = getAdminSession()
  return session?.isAdmin === true
}

export function logoutAdmin(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("adminSession")
  }
}

export function requireAdminAuth(): AdminSession {
  const session = getAdminSession()
  if (!session) {
    throw new Error("Admin authentication required")
  }
  return session
}

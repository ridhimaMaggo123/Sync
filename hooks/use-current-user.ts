"use client"

import { useEffect, useState } from 'react'

interface CurrentUserResponse {
  success: boolean
  isAuthenticated?: boolean
  user?: { _id: string; name: string; email: string }
  message?: string
}

export function useCurrentUser() {
  const [user, setUser] = useState<CurrentUserResponse['user'] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/status', { credentials: 'include' })
        if (!res.ok) throw new Error('Not authenticated')
        const data: CurrentUserResponse = await res.json()
        if (isMounted && data?.isAuthenticated && data.user) {
          setUser(data.user)
        } else if (isMounted) {
          setUser(null)
        }
      } catch (_e) {
        if (isMounted) setUser(null)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchUser()
    return () => { isMounted = false }
  }, [])

  return { user, loading }
}


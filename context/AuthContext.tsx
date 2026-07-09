'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import {
  login as authLogin,
  logout as authLogout,
  refreshSession,
  roleToPath,
  type AuthUser,
} from '@/lib/auth'

function setRoleCookie(role: string) {
  document.cookie = `tt_role=${role}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Strict`
}

function clearRoleCookie() {
  document.cookie = 'tt_role=; path=/; max-age=0'
}

interface AuthContextValue {
  user: AuthUser | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<string> // returns redirect path
  logout: () => Promise<void>
  refresh: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // On mount: try to restore session via httpOnly refresh cookie
  useEffect(() => {
    async function restore() {
      try {
        const session = await refreshSession()
        if (session) {
          setUser(session.user)
          setRoleCookie(session.user.role)
        }
      } catch {
        // no valid session — user is logged out
      } finally {
        setIsLoading(false)
      }
    }
    restore()
  }, [])

  const login = useCallback(async (email: string, password: string): Promise<string> => {
    const result = await authLogin(email, password)
    setUser(result.user)
    setRoleCookie(result.user.role)
    return roleToPath(result.user.role)
  }, [])

  const logout = useCallback(async () => {
    await authLogout()
    setUser(null)
    clearRoleCookie()
  }, [])

  const refresh = useCallback(async () => {
    const session = await refreshSession()
    if (session) {
      setUser(session.user)
      setRoleCookie(session.user.role)
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>')
  return ctx
}

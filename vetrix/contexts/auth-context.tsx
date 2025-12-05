"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { UserDTO } from "@/lib/api/types/dto"
import { authService } from "@/services/authService"

interface AuthContextType {
  user: UserDTO | null
  token: string | null
  login: (token: string, user: UserDTO) => void
  logout: () => void
  isLoading: boolean
  hasPermission: (permission: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth debe utilizarse dentro de un AuthProvider.")
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserDTO | null>(null)
  // Token is now managed by HttpOnly cookies, so we don't expose it in state directly
  // logic requiring token should use authService or server actions
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // We can import authService dynamically or use the imported instance
  // import { authService } from "@/services/authService" needs to be at top level

  // Permission checking function
  const hasPermission = (permission: string): boolean => {
    if (!user) return false

    // Role IDs: 1=admin, 2=vet, 3=assistant
    switch (permission) {
      case "manage_users":
        return user.roleId === 1
      case "manage_medical_records":
        return [1, 2].includes(user.roleId)
      case "delete_records":
        return [1, 2].includes(user.roleId)
      case "view_all":
        return [1, 2, 3].includes(user.roleId)
      case "create_basic":
        return [1, 2, 3].includes(user.roleId)
      default:
        return false
    }
  }

  const login = (newToken: string, newUser: UserDTO) => {
    // legacy support for signature, but token is now in cookie
    setToken(newToken)
    setUser(newUser)
    router.refresh() // Refresh server components
  }

  const logout = async () => {
    try {
      await authService.logout()
    } catch (error) {
      console.error("Logout failed", error)
    } finally {
      setToken(null)
      setUser(null)
      router.push("/login")
      router.refresh()
    }
  }

  // Check for existing session on mount using authService
  useEffect(() => {
    const checkSession = async () => {
      try {
        const currentUser = await authService.getCurrentUser()
        if (currentUser) {
          setUser(currentUser)
          // We don't have the raw token anymore, but that's fine for cookie-auth
          setToken("cookie-session")
        }
      } catch (error) {
        console.error("Session check failed", error)
        setUser(null)
        setToken(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkSession()
  }, [])

  // Redirect logic
  useEffect(() => {
    if (!isLoading) {
      const isLoginPage = pathname === "/login"
      const isAuthenticated = !!user

      if (!isAuthenticated && !isLoginPage) {
        router.push("/login")
      } else if (isAuthenticated && isLoginPage) {
        router.push("/")
      }
    }
  }, [user, isLoading, pathname, router])

  const value = {
    user,
    token,
    login,
    logout,
    isLoading,
    hasPermission,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
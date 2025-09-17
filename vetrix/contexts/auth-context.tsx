"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

interface User {
  id: number
  username: string
  email: string
  role: "admin" | "vet" | "assistant"
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (token: string, user: User) => void
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
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Permission checking function
  const hasPermission = (permission: string): boolean => {
    if (!user) return false

    switch (permission) {
      case "manage_users":
        return user.role === "admin"
      case "manage_medical_records":
        return ["admin", "vet"].includes(user.role)
      case "delete_records":
        return ["admin", "vet"].includes(user.role)
      case "view_all":
        return ["admin", "vet", "assistant"].includes(user.role)
      case "create_basic":
        return ["admin", "vet", "assistant"].includes(user.role)
      default:
        return false
    }
  }

  const login = (newToken: string, newUser: User) => {
    setToken(newToken)
    setUser(newUser)
    localStorage.setItem("token", newToken)
    localStorage.setItem("user", JSON.stringify(newUser))
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/login")
  }

  // Check for existing session on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    const storedUser = localStorage.getItem("user")

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setToken(storedToken)
        setUser(parsedUser)
      } catch (error) {
        console.error("Error al analizar el usuario almacenado:", error)
        localStorage.removeItem("token")
        localStorage.removeItem("user")
      }
    }

    setIsLoading(false)
  }, [])

  // Redirect logic
  useEffect(() => {
    if (!isLoading) {
      const isLoginPage = pathname === "/login"
      const isAuthenticated = !!user && !!token

      if (!isAuthenticated && !isLoginPage) {
        router.push("/login")
      } else if (isAuthenticated && isLoginPage) {
        router.push("/")
      }
    }
  }, [user, token, isLoading, pathname, router])

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
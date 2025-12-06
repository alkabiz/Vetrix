"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { useRouter, usePathname } from "next/navigation"
import { UserDTO, LoginInput } from "@/lib/api/types/dto"
import { authService } from "@/services/authService"
import { useToast } from "@/hooks/use-toast"
import { AppError } from "@/src/lib/api/httpClient"

interface AuthContextType {
  user: UserDTO | null
  login: (credentials: LoginInput) => Promise<void>
  logout: () => Promise<void>
  isLoading: boolean
  isAuthenticated: boolean
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
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()

  // Permission checking function
  const hasPermission = useCallback((permission: string): boolean => {
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
  }, [user])

  const login = async (credentials: LoginInput) => {
    try {
      setIsLoading(true)
      const response = await authService.login(credentials)
      if (response && response.user) {
         setUser(response.user)
         toast({
           title: "Bienvenido",
           description: `Has iniciado sesión como ${response.user.username}`,
         })
         router.push("/")
         router.refresh()
      }
    } catch (error: any) {
      console.error("Login error", error)
      const message = error instanceof AppError ? error.message : "Error al iniciar sesión"
      toast({
        variant: "destructive",
        title: "Error de autenticación",
        description: message,
      })
      throw error // Re-throw so the form can handle it if needed
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
      setUser(null)
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión correctamente",
      })
      router.push("/login")
      router.refresh()
    } catch (error) {
      console.error("Logout failed", error)
      toast({
        variant: "destructive",
        title: "Error al salir",
        description: "No se pudo cerrar la sesión correctamente",
      })
    }
  }

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        let currentUser = await authService.getCurrentUser()
        
        // If no active session, try to refresh (handles expired access token but valid refresh cookie)
        if (!currentUser) {
          try {
            await authService.refreshToken()
            currentUser = await authService.getCurrentUser()
          } catch {
            // Refresh failed or no refresh token - user remains unauthenticated
          }
        }

        if (currentUser) {
          setUser(currentUser)
        }
      } catch (error) {
        console.error("Session check failed", error)
        setUser(null)
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
    login,
    logout,
    isLoading,
    isAuthenticated: !!user,
    hasPermission,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
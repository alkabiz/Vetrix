"use client"

import type React from "react"
import { useAuth } from "@/contexts/auth-context"
import { usePathname } from "next/navigation"

interface AuthWrapperProps {
  children: React.ReactNode
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const { isLoading } = useAuth()
  const pathname = usePathname()

  // Don't show loading on login page
  if (isLoading && pathname !== "/login") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

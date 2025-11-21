"use client"

import type React from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShieldX, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredPermission?: string
  fallback?: React.ReactNode
}

export function ProtectedRoute({ children, requiredPermission, fallback }: ProtectedRouteProps) {
  const { user, isLoading, hasPermission } = useAuth()
  const router = useRouter()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return null // AuthProvider will handle redirect to login
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="w-full max-w-md text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-red-100 rounded-full">
                  <ShieldX className="h-8 w-8 text-red-600" />
                </div>
              </div>
              <CardTitle className="text-xl text-gray-900">Acceso denegado</CardTitle>
              <CardDescription>No tienes permiso para acceder a esta página.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Permiso requerido: <span className="font-mono">{requiredPermission}</span>
              </p>
              <Button onClick={() => router.back()} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver atrás
              </Button>
            </CardContent>
          </Card>
        </div>
      )
    )
  }

  return <>{children}</>
}

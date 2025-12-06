
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Stethoscope } from "lucide-react"

import { LoginForm, LoginInput } from "@/src/components/LoginForm"
import { useAuth } from "@/src/hooks/useAuth"
import { logAudit } from "@/src/hooks/useAuditLog"

export default function LoginPage() {
  const { login, isLoading } = useAuth()
  const router = useRouter()
  const [loginError, setLoginError] = useState<string | null>(null)

  const handleLogin = async (data: LoginInput) => {
    setLoginError(null)
    try {
      await login(data)
      
      // Log success
      // Note: useAuth.login handles the redirect to '/', but we log here first/parallel
      // We pass the login username so the backend can find the user ID to log against
      logAudit({ 
        action: "login", 
        status: "success",
        login: data.login
      })

      // Explicit navigation as per requirements (though useAuth might also do it)
      router.push('/')
      
    } catch (error: any) {
      const reason = error.message || "Error al iniciar sesión"
      setLoginError(reason)
      
      // Log failure
      logAudit({
        action: "login_failed",
        status: "failure",
        reason,
        login: data.login
      })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-blue-100 rounded-full shadow-sm">
            <Stethoscope className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <LoginForm 
          onSubmit={handleLogin}
          isLoading={isLoading}
          error={loginError}
        />

        <div className="mt-8 text-center text-sm text-gray-500">
          <p className="mb-2">Credenciales de demostración:</p>
          <div className="font-mono text-xs bg-white/50 p-2 rounded border border-blue-100 inline-block">
             admin / admin123 (Admin)<br />
             dr.smith / admin123 (Vet)<br />
             assistant1 / admin123 (Assistant)
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import { LoginForm } from "@/src/components/auth/LoginForm"
import { Stethoscope } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-blue-100 rounded-full shadow-sm">
            <Stethoscope className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <LoginForm />

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

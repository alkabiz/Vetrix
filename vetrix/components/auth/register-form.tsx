"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { EnhancedPasswordInput } from "./enhanced-password-input"

interface RegisterFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RegisterForm({ open, onOpenChange }: RegisterFormProps) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    roleId: "",
    veterinarianId: "",
    sessionTimeoutMinutes: "480", // 8 hours default
    timezone: "America/Bogota",
    preferredLanguage: "es",
    emailNotifications: true,
    smsNotifications: false,
    twoFactorEnabled: false,
    mustChangePassword: false,
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden.")
      return
    }

    if (!formData.roleId) {
      setError("Por favor, seleccione una función")
      return
    }

    setIsLoading(true)

    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          roleId: Number(formData.roleId),
          veterinarianId: formData.veterinarianId ? Number(formData.veterinarianId) : undefined,
          sessionTimeoutMinutes: Number(formData.sessionTimeoutMinutes),
          timezone: formData.timezone,
          preferredLanguage: formData.preferredLanguage,
          emailNotifications: formData.emailNotifications,
          smsNotifications: formData.smsNotifications,
          twoFactorEnabled: formData.twoFactorEnabled,
          mustChangePassword: formData.mustChangePassword,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Error en el registro")
      }

      toast({
        title: "Success",
        description: "Usuario registrado correctamente",
      })

      // Reset form and close dialog
      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        roleId: "",
        veterinarianId: "",
        sessionTimeoutMinutes: "480",
        timezone: "America/Bogota",
        preferredLanguage: "es",
        emailNotifications: true,
        smsNotifications: false,
        twoFactorEnabled: false,
        mustChangePassword: false,
      })
      onOpenChange(false)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error en el registro")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Registrar nuevo usuario</DialogTitle>
          <DialogDescription>Cree una nueva cuenta de usuario con asignación de roles.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Nombre de usuario *</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Ingrese su nombre de usuario"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Ingrese su dirección de correo electrónico"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <EnhancedPasswordInput
                  id="password"
                  name="password"
                  label="Contraseña *"
                  placeholder="Ingrese la contraseña (mínimo 12 caracteres)"
                  value={formData.password}
                  onChange={(value) => setFormData({ ...formData, password: value })}
                  showStrengthIndicator={true}
                  showGenerator={true}
                  required
                  disabled={isLoading}
                />

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar contraseña *</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirmar contraseña"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Role & Access */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Role & Access</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="roleId">Role *</Label>
                  <Select
                    value={formData.roleId}
                    onValueChange={(value) => setFormData({ ...formData, roleId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select user role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Admin</SelectItem>
                      <SelectItem value="2">Veterinarian</SelectItem>
                      <SelectItem value="3">Assistant</SelectItem>
                      <SelectItem value="4">Receptionist</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="veterinarianId">Associated Veterinarian</Label>
                  <Select
                    value={formData.veterinarianId}
                    onValueChange={(value) => setFormData({ ...formData, veterinarianId: value })}
                    disabled={formData.roleId !== "2"}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select veterinarian" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Dr. Anderson</SelectItem>
                      <SelectItem value="2">Dr. Smith</SelectItem>
                      <SelectItem value="3">Dr. Johnson</SelectItem>
                      <SelectItem value="4">Dr. Williams</SelectItem>
                      <SelectItem value="5">Dr. Brown</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sessionTimeoutMinutes">Session Timeout (minutes)</Label>
                <Select
                  value={formData.sessionTimeoutMinutes}
                  onValueChange={(value) => setFormData({ ...formData, sessionTimeoutMinutes: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="240">4 hours</SelectItem>
                    <SelectItem value="480">8 hours</SelectItem>
                    <SelectItem value="720">12 hours</SelectItem>
                    <SelectItem value="1440">24 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={formData.timezone}
                    onValueChange={(value) => setFormData({ ...formData, timezone: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Bogota">America/Bogota (COT)</SelectItem>
                      <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                      <SelectItem value="America/Los_Angeles">America/Los_Angeles (PST)</SelectItem>
                      <SelectItem value="Europe/Madrid">Europe/Madrid (CET)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preferredLanguage">Language</Label>
                  <Select
                    value={formData.preferredLanguage}
                    onValueChange={(value) => setFormData({ ...formData, preferredLanguage: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="emailNotifications"
                    checked={formData.emailNotifications}
                    onCheckedChange={(checked) => setFormData({ ...formData, emailNotifications: checked as boolean })}
                  />
                  <Label htmlFor="emailNotifications">Enable email notifications</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="smsNotifications"
                    checked={formData.smsNotifications}
                    onCheckedChange={(checked) => setFormData({ ...formData, smsNotifications: checked as boolean })}
                  />
                  <Label htmlFor="smsNotifications">Enable SMS notifications</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="twoFactorEnabled"
                    checked={formData.twoFactorEnabled}
                    onCheckedChange={(checked) => setFormData({ ...formData, twoFactorEnabled: checked as boolean })}
                  />
                  <Label htmlFor="twoFactorEnabled">Enable two-factor authentication</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="mustChangePassword"
                    checked={formData.mustChangePassword}
                    onCheckedChange={(checked) => setFormData({ ...formData, mustChangePassword: checked as boolean })}
                  />
                  <Label htmlFor="mustChangePassword">Must change password on first login</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creando...
                </>
              ) : (
                "Crear usuario"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Form } from "@/components/ui/form"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { registerFormSchema, type RegisterFormValues } from "./schemas/register-schema"
import { BasicInfoSection } from "./forms/sections/BasicInfoSection"
import { RoleAccessSection } from "./forms/sections/RoleAccessSection"
import { PreferencesSection } from "./forms/sections/PreferencesSection"

interface RegisterFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RegisterForm({ open, onOpenChange }: RegisterFormProps) {
  const [error, setError] = useState("")
  const { toast } = useToast()

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
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
    },
  })

  useEffect(() => {
    if (open) {
      form.reset()
      setError("")
    }
  }, [open, form])

  const onSubmit = async (values: RegisterFormValues) => {
    setError("")

    try {
      const token = localStorage.getItem("token")

      const payload = {
        username: values.username,
        email: values.email,
        password: values.password,
        roleId: Number(values.roleId),
        veterinarianId: values.veterinarianId ? Number(values.veterinarianId) : undefined,
        sessionTimeoutMinutes: Number(values.sessionTimeoutMinutes),
        timezone: values.timezone,
        preferredLanguage: values.preferredLanguage,
        emailNotifications: values.emailNotifications,
        smsNotifications: values.smsNotifications,
        twoFactorEnabled: values.twoFactorEnabled,
        mustChangePassword: values.mustChangePassword,
      }

      await axios.post("/api/auth/register", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      toast({
        title: "Success",
        description: "Usuario registrado correctamente",
      })

      onOpenChange(false)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.error || "Error en el registro")
      } else {
        setError("Error en el registro")
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Registrar nuevo usuario</DialogTitle>
          <DialogDescription>Cree una nueva cuenta de usuario con asignación de roles.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <BasicInfoSection />
            <RoleAccessSection />
            <PreferencesSection />

            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
                Cancelar
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting} className="flex-1">
                {form.formState.isSubmitting ? (
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
        </Form>
      </DialogContent>
    </Dialog>
  )
}
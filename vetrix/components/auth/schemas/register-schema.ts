import { z } from "zod"

export const registerFormSchema = z.object({
    username: z.string().min(3, "El nombre de usuario debe tener al menos 3 caracteres"),
    email: z.string().email("Ingrese una dirección de correo electrónico válida"),
    password: z.string().min(12, "La contraseña debe tener al menos 12 caracteres"),
    confirmPassword: z.string(),
    roleId: z.string().min(1, "Por favor, seleccione una función"),
    veterinarianId: z.string().optional(),
    sessionTimeoutMinutes: z.string().default("480"),
    timezone: z.string().default("America/Bogota"),
    preferredLanguage: z.string().default("es"),
    emailNotifications: z.boolean().default(true),
    smsNotifications: z.boolean().default(false),
    twoFactorEnabled: z.boolean().default(false),
    mustChangePassword: z.boolean().default(false),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
})

export type RegisterFormValues = z.infer<typeof registerFormSchema>

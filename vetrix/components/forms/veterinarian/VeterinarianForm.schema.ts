import { z } from "zod"

export const veterinarianFormSchema = z.object({
    employeeNumber: z.string().min(1, "Employee number is required"),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    licenseNumber: z.string().min(1, "License number is required"),
    licenseExpiryDate: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email("Invalid email address").optional().or(z.literal("")),
    yearsExperience: z.coerce.number().min(0).optional(),
    education: z.string().optional(),
    certifications: z.array(z.object({
        name: z.string(),
        date: z.string(),
        body: z.string()
    })).default([]),
    specializationNotes: z.string().optional(),
    hireDate: z.string().min(1, "Hire date is required"),
    terminationDate: z.string().optional(),
    employmentStatusId: z.string().default("1"),
    salary: z.coerce.number().min(0).optional(),
    commissionRate: z.coerce.number().min(0).max(100).default(0),
    maxDailyAppointments: z.coerce.number().min(1).default(8),
    appointmentDurationDefault: z.coerce.number().min(15).default(30),
    isActive: z.boolean().default(true),
    notes: z.string().optional(),
})

export type VeterinarianFormValues = z.infer<typeof veterinarianFormSchema>

import { z } from "zod"

export const ownerSchema = z.object({
    firstName: z.string().min(1, "First name is required").max(100),
    lastName: z.string().min(1, "Last name is required").max(100),
    phonePrimary: z.string().min(1, "Primary phone is required").max(20),
    phoneSecondary: z.string().max(20).optional().nullable(),
    email: z.string().email("Invalid email address").optional().or(z.literal("")),
    addressStreet: z.string().max(200).optional().nullable(),
    cityId: z.number().optional().nullable(),
    addressPostalCode: z.string().max(20).optional().nullable(),
    identificationTypeId: z.number().optional().nullable(),
    identificationNumber: z.string().max(50).optional().nullable(),
    emergencyContactName: z.string().max(100).optional().nullable(),
    emergencyContactPhone: z.string().max(20).optional().nullable(),
    emergencyContactRelationship: z.string().max(50).optional().nullable(),
    marketingConsent: z.boolean().optional().default(false),
    dataProcessingConsent: z.boolean().optional().default(false),
    creditLimit: z.number().optional().default(0),
    notes: z.string().optional().nullable(),
})

export const ownerUpdateSchema = ownerSchema.partial()

export type OwnerInput = z.infer<typeof ownerSchema>
export type OwnerUpdateInput = z.infer<typeof ownerUpdateSchema>

export async function validateOwner(request: Request): Promise<OwnerInput> {
    const body = await request.json()
    return ownerSchema.parse(body)
}

export async function validateOwnerUpdate(request: Request): Promise<OwnerUpdateInput> {
    const body = await request.json()
    return ownerUpdateSchema.parse(body)
}

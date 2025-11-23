import { z } from "zod"

export const verificationCodeSchema = z.object({
    code: z
        .string()
        .length(6, "Verification code must be exactly 6 digits")
        .regex(/^\d+$/, "Verification code must contain only numbers"),
})

export type VerificationCodeFormValues = z.infer<typeof verificationCodeSchema>

export const twoFactorStateSchema = z.object({
    step: z.enum(["setup", "verify"]),
    secret: z.string(),
    qrCode: z.string().optional(),
})

export type TwoFactorState = z.infer<typeof twoFactorStateSchema>

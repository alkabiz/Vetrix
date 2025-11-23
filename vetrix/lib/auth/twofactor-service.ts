import crypto from "crypto"
import { authenticator } from "otplib"
import type { TwoFactorAuth, TwoFactorStore } from "./types/auth"

// In-memory store (replace with DB in production)
const twoFactorSecrets: TwoFactorStore = new Map<number, TwoFactorAuth>()

export function generateTwoFactorSecret(userId: number): { secret: string; qrCode: string } {
    const secret = authenticator.generateSecret()
    const backupCodes = Array.from({ length: 10 }, () => crypto.randomBytes(4).toString("hex").toUpperCase())

    const twoFactor: TwoFactorAuth = {
        userId,
        secret,
        isEnabled: false,
        backupCodes,
        createdAt: new Date(),
    }

    twoFactorSecrets.set(userId, twoFactor)

    const qrCode = authenticator.keyuri(userId.toString(), "Vetrix", secret)

    return { secret, qrCode }
}

export function verifyTwoFactorCode(userId: number, code: string): boolean {
    const twoFactor = twoFactorSecrets.get(userId)
    if (!twoFactor) {
        return false
    }

    // Check backup codes
    if (twoFactor.backupCodes.includes(code.toUpperCase())) {
        // Invalidate used backup code
        twoFactor.backupCodes = twoFactor.backupCodes.filter((c) => c !== code.toUpperCase())
        twoFactorSecrets.set(userId, twoFactor)
        return true
    }

    // Verify TOTP
    try {
        return authenticator.check(code, twoFactor.secret)
    } catch (err) {
        console.error("[Auth] TOTP verification error:", err)
        return false
    }
}

export function enableTwoFactor(userId: number, verificationCode: string): boolean {
    const twoFactor = twoFactorSecrets.get(userId)
    if (!twoFactor) {
        return false
    }

    if (verifyTwoFactorCode(userId, verificationCode)) {
        twoFactor.isEnabled = true
        twoFactorSecrets.set(userId, twoFactor)
        return true
    }

    return false
}

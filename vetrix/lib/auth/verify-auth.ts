import {
    validatePasswordPolicy,
    generateAccessToken,
    verifyAccessToken,
    generateRefreshToken,
    createLoginSession,
    logout,
    generateTwoFactorSecret,
    verifyTwoFactorCode,
    User
} from "./auth-enhanced"

async function runVerification() {
    console.log("Starting Auth Verification...")

    // 1. Password Policy
    console.log("\n--- Password Policy ---")
    const weak = validatePasswordPolicy("123")
    console.log("Weak password valid:", weak.isValid, "Errors:", weak.errors)
    const strong = validatePasswordPolicy("StrongP@ssw0rd1!")
    console.log("Strong password valid:", strong.isValid)

    // 2. Token Service
    console.log("\n--- Token Service ---")
    const user: User = {
        id: 1,
        username: "testuser",
        email: "test@example.com",
        role: "admin"
    }

    try {
        const token = generateAccessToken(user, "session-123")
        console.log("Access Token generated:", token.substring(0, 20) + "...")

        const verified = verifyAccessToken(token)
        console.log("Token verified:", verified ? "Success" : "Failed", verified)

        const refreshToken = generateRefreshToken(user.id)
        console.log("Refresh Token generated:", refreshToken.substring(0, 20) + "...")
    } catch (e) {
        console.error("Token error:", e)
    }

    // 3. Session Service
    console.log("\n--- Session Service ---")
    const session = createLoginSession(user, "127.0.0.1", "TestAgent")
    console.log("Session created:", session.sessionId)

    logout(session.sessionId)
    console.log("Session logged out")

    // 4. Two Factor
    console.log("\n--- Two Factor ---")
    const { secret, qrCode } = generateTwoFactorSecret(user.id)
    console.log("2FA Secret generated:", secret)

    // Note: We can't easily generate a valid TOTP code without the library, 
    // but we can verify the function runs.
    const isValid = verifyTwoFactorCode(user.id, "000000")
    console.log("Invalid code check:", isValid === false ? "Correctly rejected" : "Failed rejection")

    console.log("\nVerification Complete.")
}

runVerification().catch(console.error)

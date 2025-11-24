import {
    createLoginSession,
    validateAndRefreshSession,
    refreshAccessToken,
    logoutSession,
    getUserSessions
} from "./session-manager"
import type { User } from "./types/auth"

async function runVerification() {
    console.log("Starting Session Verification...")

    const user: User = {
        id: 1,
        username: "testuser",
        email: "test@example.com",
        role: "admin"
    }

    try {
        // 1. Create Session
        console.log("\n--- Create Session ---")
        const session = await createLoginSession(user, "127.0.0.1", "TestAgent")
        console.log("Session created:", session.sessionId)
        console.log("Access Token:", session.accessToken.substring(0, 20) + "...")

        // 2. Validate Session
        console.log("\n--- Validate Session ---")
        const validation = await validateAndRefreshSession(session.accessToken)
        console.log("Validation result:", validation ? "Success" : "Failed")
        if (validation) {
            console.log("User:", validation.user.username)
        }

        // 3. Get User Sessions
        console.log("\n--- Get User Sessions ---")
        const sessions = await getUserSessions(user.id)
        console.log("Active sessions:", sessions.length)
        console.log("Session IDs:", sessions.map(s => s.id))

        // 4. Refresh Token
        console.log("\n--- Refresh Token ---")
        const refreshed = await refreshAccessToken(session.refreshToken)
        if (refreshed) {
            console.log("Refreshed Access Token:", refreshed.accessToken.substring(0, 20) + "...")
            console.log("Refreshed Refresh Token:", refreshed.refreshToken.substring(0, 20) + "...")
        } else {
            console.error("Refresh failed")
        }

        // 5. Logout
        console.log("\n--- Logout ---")
        await logoutSession(session.sessionId, user.id)
        console.log("Logged out")

        // 6. Validate after logout
        const validationAfterLogout = await validateAndRefreshSession(session.accessToken)
        console.log("Validation after logout (should be null/fail):", validationAfterLogout ? "Failed (still valid)" : "Success (invalid)")

    } catch (e) {
        console.error("Verification error:", e)
    }
}

runVerification().catch(console.error)

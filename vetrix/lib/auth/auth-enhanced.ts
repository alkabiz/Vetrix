/**
 * Enhanced Authentication Module
 *
 * This file serves as the main entry point for authentication services.
 * It re-exports functionality from modular services for backward compatibility.
 */

export * from "./types/auth"
export * from "./password-policy"
export * from "./token-service"
export * from "./session-manager"
export * from "./twofactor-service"

// Re-export legacy auth functions if needed
// export * from "./auth"


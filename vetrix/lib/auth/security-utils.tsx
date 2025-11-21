import crypto from "crypto"

export class SecurityUtils {
  // Sanitize HTML input to prevent XSS
  static sanitizeHtml(input: string): string {
    return input
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;")
      .replace(/\//g, "&#x2F;")
  }

  // Sanitize SQL input (basic protection, use with parameterized queries)
  static sanitizeSql(input: string): string {
    return input.replace(/'/g, "''").replace(/;/g, "").replace(/--/g, "").replace(/\/\*/g, "").replace(/\*\//g, "")
  }

  // Generate secure random token
  static generateSecureToken(length = 32): string {
    return crypto.randomBytes(length).toString("hex")
  }

  // Hash sensitive data
  static hashData(data: string, salt?: string): string {
    const actualSalt = salt || crypto.randomBytes(16).toString("hex")
    const hash = crypto.pbkdf2Sync(data, actualSalt, 10000, 64, "sha512")
    return `${actualSalt}:${hash.toString("hex")}`
  }

  // Verify hashed data
  static verifyHash(data: string, hashedData: string): boolean {
    const [salt, hash] = hashedData.split(":")
    const verifyHash = crypto.pbkdf2Sync(data, salt, 10000, 64, "sha512")
    return hash === verifyHash.toString("hex")
  }

  // Validate email format
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email) && email.length <= 254
  }

  // Validate phone number format
  static isValidPhone(phone: string): boolean {
    const phoneRegex = /^\+?[\d\s\-$$$$]{10,15}$/
    return phoneRegex.test(phone)
  }

  // Check for common SQL injection patterns
  static containsSqlInjection(input: string): boolean {
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/i,
      /(;|--|\/\*|\*\/)/,
      /(\b(OR|AND)\b.*=.*)/i,
      /'.*OR.*'/i,
    ]

    return sqlPatterns.some((pattern) => pattern.test(input))
  }

  // Validate file upload security
  static isValidFileType(filename: string, allowedTypes: string[]): boolean {
    const extension = filename.split(".").pop()?.toLowerCase()
    return extension ? allowedTypes.includes(extension) : false
  }

  // Generate CSRF token
  static generateCsrfToken(): string {
    return crypto.randomBytes(32).toString("base64")
  }

  // Validate CSRF token
  static validateCsrfToken(token: string, sessionToken: string): boolean {
    return crypto.timingSafeEqual(Buffer.from(token, "base64"), Buffer.from(sessionToken, "base64"))
  }
}

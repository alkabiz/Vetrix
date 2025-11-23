export interface PasswordValidationResult {
    isValid: boolean
    errors: string[]
}

export const validatePasswordPolicy = (password: string): PasswordValidationResult => {
    const errors: string[] = []

    if (password.length < 12) {
        errors.push("password.tooShort")
    }

    if (!/[A-Z]/.test(password)) {
        errors.push("password.missingUppercase")
    }

    if (!/[a-z]/.test(password)) {
        errors.push("password.missingLowercase")
    }

    if (!/\d/.test(password)) {
        errors.push("password.missingNumber")
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.push("password.missingSpecialChar")
    }

    // Check for common patterns
    if (/(.)\1{2,}/.test(password)) {
        errors.push("password.repeatedCharacters")
    }

    if (/123|abc|qwe|password|admin/i.test(password)) {
        errors.push("password.commonPattern")
    }

    return {
        isValid: errors.length === 0,
        errors,
    }
}

export const copySecret = async (secret: string): Promise<boolean> => {
    try {
        await navigator.clipboard.writeText(secret)
        return true
    } catch (error) {
        console.error("Failed to copy secret:", error)
        return false
    }
}

export const formatVerificationCode = (value: string): string => {
    return value.replace(/\D/g, "").slice(0, 6)
}

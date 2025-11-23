import { Monitor, Smartphone, Tablet, type LucideIcon } from "lucide-react"

export const getDeviceIcon = (userAgent: string): LucideIcon => {
    if (userAgent.includes("Mobile")) return Smartphone
    if (userAgent.includes("Tablet")) return Tablet
    return Monitor
}

export const getDeviceInfo = (userAgent: string): string => {
    if (userAgent.includes("Chrome")) return "Chrome Browser"
    if (userAgent.includes("Firefox")) return "Firefox Browser"
    if (userAgent.includes("Safari")) return "Safari Browser"
    if (userAgent.includes("Edge")) return "Edge Browser"
    return "Unknown Browser"
}

export const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString()
}

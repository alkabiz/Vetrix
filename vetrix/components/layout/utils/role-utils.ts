import type { NavigationItem } from "../config/navigation.config"

export const ROLE_BADGE_COLORS: Record<string, string> = {
    admin: "bg-red-100 text-red-800",
    vet: "bg-blue-100 text-blue-800",
    assistant: "bg-green-100 text-green-800",
    default: "bg-gray-100 text-gray-800",
}

export const getRoleBadgeColor = (role: string): string => {
    return ROLE_BADGE_COLORS[role] || ROLE_BADGE_COLORS.default
}

export const getUserInitials = (username: string): string => {
    return username
        .split(" ")
        .map((name) => name[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
}

export const filterNavigationByRole = (
    items: NavigationItem[],
    userRole?: string
): NavigationItem[] => {
    if (!userRole) return []
    return items.filter((item) => item.roles.includes(userRole))
}

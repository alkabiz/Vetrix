import {
    Users,
    Heart,
    Calendar,
    FileText,
    Receipt,
    Stethoscope,
    UserCog,
    type LucideIcon,
} from "lucide-react"

export interface NavigationItem {
    name: string
    href: string
    icon: LucideIcon
    roles: string[]
    badge?: string
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
    {
        name: "Panel de control",
        href: "/",
        icon: Stethoscope,
        roles: ["admin", "vet", "assistant"],
    },
    {
        name: "Propietarios",
        href: "/owners",
        icon: Users,
        roles: ["admin", "vet", "assistant"],
    },
    {
        name: "Mascotas",
        href: "/pets",
        icon: Heart,
        roles: ["admin", "vet", "assistant"],
    },
    {
        name: "Citas",
        href: "/appointments",
        icon: Calendar,
        badge: "2",
        roles: ["admin", "vet", "assistant"],
    },
    {
        name: "Historial médico",
        href: "/medical-records",
        icon: FileText,
        roles: ["admin", "vet", "assistant"],
    },
    {
        name: "Facturas",
        href: "/invoices",
        icon: Receipt,
        roles: ["admin", "vet", "assistant"],
    },
    {
        name: "Admin. usuarios",
        href: "/users",
        icon: UserCog,
        roles: ["admin"],
    },
]

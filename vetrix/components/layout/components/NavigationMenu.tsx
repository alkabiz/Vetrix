import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/core/utils"
import type { NavigationItem } from "../config/navigation.config"

interface NavigationMenuProps {
    items: NavigationItem[]
    onItemClick?: () => void
}

export const NavigationMenu: React.FC<NavigationMenuProps> = ({ items, onItemClick }) => {
    const pathname = usePathname()

    return (
        <nav className="flex-1 space-y-1 p-4">
            {items.map((item) => {
                const isActive = pathname === item.href
                return (
                    <Link
                        key={item.name}
                        href={item.href}
                        className={cn(
                            "flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                            isActive
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:shadow-sm",
                        )}
                        onClick={onItemClick}
                    >
                        <div className="flex items-center gap-3">
                            <item.icon className="h-4 w-4" />
                            {item.name}
                        </div>
                        {item.badge && (
                            <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                                {item.badge}
                            </Badge>
                        )}
                    </Link>
                )
            })}
        </nav>
    )
}

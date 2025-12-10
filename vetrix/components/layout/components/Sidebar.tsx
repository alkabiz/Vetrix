import type React from "react"
import { Stethoscope, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/core/utils"
import { SidebarUserInfo } from "./SidebarUserInfo"
import { NavigationMenu } from "./NavigationMenu"
import type { NavigationItem } from "../config/navigation.config"

interface SidebarProps {
    open: boolean
    onClose: () => void
    user?: {
        username: string
        role?: string
    } | null
    navigationItems: NavigationItem[]
}

export const Sidebar: React.FC<SidebarProps> = ({ open, onClose, user, navigationItems }) => {
    return (
        <div
            className={cn(
                "fixed inset-y-0 left-0 z-50 w-64 transform bg-card border-r transition-transform duration-300 ease-in-out lg:static lg:translate-x-0",
                open ? "translate-x-0" : "-translate-x-full",
            )}
        >
            <div className="flex h-full flex-col">
                {/* Logo/Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg">
                            <Stethoscope className="h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="text-lg font-semibold">Vetrix Pro</h1>
                            <p className="text-sm text-muted-foreground">Sistema de gestión</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="sm" className="lg:hidden" onClick={onClose}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                {user && <SidebarUserInfo username={user.username} role={user.role} />}

                <NavigationMenu items={navigationItems} onItemClick={onClose} />

                {/* Footer */}
                <div className="border-t p-4">
                    <div className="text-xs text-muted-foreground">
                        <p>Vetrix Pro v1.0</p>
                        <p>Gestión veterinaria profesional</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

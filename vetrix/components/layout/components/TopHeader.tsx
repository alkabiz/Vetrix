import type React from "react"
import { Menu, Bell, User, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/core/utils"
import { getUserInitials, getRoleBadgeColor } from "../utils/role-utils"

interface TopHeaderProps {
    onMenuClick: () => void
    user?: {
        username: string
        email: string
        role: string
    } | null
    onLogout: () => void
}

export const TopHeader: React.FC<TopHeaderProps> = ({ onMenuClick, user, onLogout }) => {
    return (
        <header className="flex h-16 items-center justify-between border-b bg-card px-6 shadow-sm">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" className="lg:hidden" onClick={onMenuClick}>
                    <Menu className="h-4 w-4" />
                </Button>
                <div className="text-sm text-muted-foreground">
                    {user ? `Welcome back, ${user.username}` : "Welcome to VetCare Pro"}
                </div>
            </div>

            <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" className="relative">
                    <Bell className="h-4 w-4" />
                    <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                            <Avatar className="h-8 w-8">
                                <AvatarFallback className="text-xs font-medium">
                                    {user ? getUserInitials(user.username) : "U"}
                                </AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <div className="flex items-center justify-start gap-2 p-2">
                            <div className="flex flex-col space-y-1 leading-none">
                                <p className="font-medium">{user?.username || "User"}</p>
                                <p className="w-[200px] truncate text-sm text-muted-foreground">
                                    {user?.email || "user@vetcare.com"}
                                </p>
                                <Badge className={cn("text-xs capitalize w-fit", getRoleBadgeColor(user?.role || ""))}>
                                    {user?.role || "user"}
                                </Badge>
                            </div>
                        </div>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <User className="mr-2 h-4 w-4" />
                            <span>Perfil</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Ajustes</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={onLogout} className="text-red-600 focus:text-red-600">
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Salir</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}

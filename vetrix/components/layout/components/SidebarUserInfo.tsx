import type React from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/core/utils"
import { getUserInitials, getRoleBadgeColor } from "../utils/role-utils"

interface SidebarUserInfoProps {
    username: string
    role: string
}

export const SidebarUserInfo: React.FC<SidebarUserInfoProps> = ({ username, role }) => {
    return (
        <div className="p-4 border-b bg-muted/30">
            <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs font-medium">{getUserInitials(username)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{username}</p>
                    <Badge className={cn("text-xs capitalize", getRoleBadgeColor(role))}>{role}</Badge>
                </div>
            </div>
        </div>
    )
}

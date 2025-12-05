import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Shield, UserCheck, Users, MoreHorizontal, Trash2, Edit } from "lucide-react"
import { UserDTO } from "@/lib/api/types/user.types"

interface UserCardProps {
    user: UserDTO
    onEdit?: (user: UserDTO) => void
    onDelete?: (user: UserDTO) => void
    selected?: boolean
    onSelect?: (userId: number, selected: boolean) => void
}

/**
 * UserCard - Displays a single user with their details and actions
 */
export function UserCard({ user, onEdit, onDelete, selected = false, onSelect }: UserCardProps) {
    const getRoleIcon = (roleId: number) => {
        switch (roleId) {
            case 1: // admin
                return <Shield className="h-4 w-4" />
            case 2: // vet
                return <UserCheck className="h-4 w-4" />
            case 3: // assistant
                return <Users className="h-4 w-4" />
            default:
                return <Users className="h-4 w-4" />
        }
    }

    const getRoleBadgeVariant = (roleId: number): "default" | "destructive" | "secondary" | "outline" => {
        switch (roleId) {
            case 1: // admin
                return "destructive"
            case 2: // vet
                return "default"
            case 3: // assistant
                return "secondary"
            default:
                return "secondary"
        }
    }

    const getRoleName = (roleId: number) => {
        switch (roleId) {
            case 1:
                return "Admin"
            case 2:
                return "Vet"
            case 3:
                return "Assistant"
            default:
                return "User"
        }
    }

    const getRoleDescription = (roleId: number) => {
        switch (roleId) {
            case 1:
                return "Acceso completo al sistema y administración de usuarios"
            case 2:
                return "Administra mascotas, citas y registros médicos."
            case 3:
                return "Ingreso de datos básicos y programación de citas"
            default:
                return "Acceso de usuario estándar"
        }
    }

    const handleCheckboxChange = (checked: boolean) => {
        if (onSelect) {
            onSelect(user.id, checked)
        }
    }

    return (
        <Card className={selected ? "border-blue-500 bg-blue-50/50" : ""}>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {/* Checkbox for bulk selection */}
                        {onSelect && (
                            <Checkbox
                                checked={selected}
                                onCheckedChange={handleCheckboxChange}
                                onClick={(e) => e.stopPropagation()}
                            />
                        )}
                        <div className="p-2 bg-blue-100 rounded-full">
                            {getRoleIcon(user.roleId)}
                        </div>
                        <div>
                            <CardTitle className="text-lg">{user.username}</CardTitle>
                            <CardDescription>{user.email}</CardDescription>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant={getRoleBadgeVariant(user.roleId)} className="capitalize">
                            {getRoleName(user.roleId)}
                        </Badge>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {onEdit && (
                                    <DropdownMenuItem onClick={() => onEdit(user)}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Editar usuario
                                    </DropdownMenuItem>
                                )}
                                {onDelete && (
                                    <DropdownMenuItem
                                        className="text-red-600 focus:text-red-600"
                                        onClick={() => onDelete(user)}
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Eliminar usuario
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <p className="text-sm text-gray-600">{getRoleDescription(user.roleId)}</p>
                    {user.createdAt && (
                        <p className="text-xs text-gray-500">
                            Creado: {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

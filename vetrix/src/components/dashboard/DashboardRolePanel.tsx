import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { UserDTO } from "@/lib/api/types/dto"

interface DashboardRolePanelProps {
    user: UserDTO | null
}

/**
 * DashboardRolePanel - Role-specific welcome/info cards
 */
export function DashboardRolePanel({ user }: DashboardRolePanelProps) {
    if (!user) return null

    // Admin panel
    if (user.roleId === 1) {
        return (
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                <CardHeader>
                    <CardTitle className="text-blue-900">Panel de control del administrador</CardTitle>
                    <CardDescription className="text-blue-700">
                        Tienes acceso completo a todas las funciones del sistema, incluyendo la administración de usuarios y la
                        configuración del sistema.
                    </CardDescription>
                </CardHeader>
            </Card>
        )
    }

    // Assistant panel
    if (user.roleId === 3) {
        return (
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                <CardHeader>
                    <CardTitle className="text-green-900">Panel de control del asistente</CardTitle>
                    <CardDescription className="text-green-700">
                        Puede administrar citas, propietarios, mascotas y facturas. Los registros médicos son solo de lectura.
                    </CardDescription>
                </CardHeader>
            </Card>
        )
    }

    // Vet panel (roleId === 2) or default
    return null
}

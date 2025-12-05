import { UserDTO } from "@/lib/api/types/user.types"
import { UserCard } from "./UserCard"

interface UsersTableProps {
    users: UserDTO[]
    onEdit?: (user: UserDTO) => void
    onDelete?: (user: UserDTO) => void
}

/**
 * UsersTable - Container for rendering a list of user cards
 */
export function UsersTable({ users, onEdit, onDelete }: UsersTableProps) {
    if (users.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">No users found</p>
            </div>
        )
    }

    return (
        <div className="grid gap-6">
            {users.map((user) => (
                <UserCard
                    key={user.id}
                    user={user}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    )
}

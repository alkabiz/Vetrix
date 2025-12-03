import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import { OwnerDTO } from "@/lib/api/types/owner.types"

interface OwnersTableProps {
    owners: OwnerDTO[]
    onEdit?: (owner: OwnerDTO) => void
    onDelete?: (owner: OwnerDTO) => void
}

export function OwnersTable({ owners, onEdit, onDelete }: OwnersTableProps) {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead>Created</TableHead>
                        {(onEdit || onDelete) && <TableHead className="text-right">Actions</TableHead>}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {owners.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                No owners found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        owners.map((owner) => (
                            <TableRow key={owner.id}>
                                <TableCell className="font-medium">{owner.firstName} {owner.lastName}</TableCell>
                                <TableCell>{owner.phonePrimary}</TableCell>
                                <TableCell>{owner.email}</TableCell>
                                <TableCell>{owner.addressStreet}</TableCell>
                                <TableCell>
                                    {new Date(owner.createdAt).toLocaleDateString()}
                                </TableCell>
                                {(onEdit || onDelete) && (
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            {onEdit && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => onEdit(owner)}
                                                    title="Edit"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            )}
                                            {onDelete && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-destructive hover:text-destructive"
                                                    onClick={() => onDelete(owner)}
                                                    title="Delete"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

import { Button } from "@/components/ui/button"
import { X, Trash2, UserCog } from "lucide-react"
import { Card } from "@/components/ui/card"

interface BulkActionsBarProps {
    selectedCount: number
    onClearSelection: () => void
    onBulkDelete: () => void
    onBulkRoleChange: () => void
}

/**
 * BulkActionsBar - Floating action bar for bulk operations
 * Appears when users are selected
 */
export function BulkActionsBar({
    selectedCount,
    onClearSelection,
    onBulkDelete,
    onBulkRoleChange,
}: BulkActionsBarProps) {
    if (selectedCount === 0) return null

    return (
        <Card className="fixed bottom-6 left-1/2 transform -translate-x-1/2 shadow-lg border-2 border-blue-500 z-50">
            <div className="flex items-center gap-4 px-6 py-3">
                {/* Selected count */}
                <div className="flex items-center gap-2">
                    <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">
                        {selectedCount}
                    </div>
                    <span className="font-medium text-sm">
                        {selectedCount === 1 ? "user selected" : "users selected"}
                    </span>
                </div>

                {/* Divider */}
                <div className="h-8 w-px bg-gray-300" />

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onBulkRoleChange}
                        className="gap-2"
                    >
                        <UserCog className="h-4 w-4" />
                        Change Role
                    </Button>

                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={onBulkDelete}
                        className="gap-2"
                    >
                        <Trash2 className="h-4 w-4" />
                        Delete Selected
                    </Button>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClearSelection}
                        className="gap-2"
                    >
                        <X className="h-4 w-4" />
                        Clear
                    </Button>
                </div>
            </div>
        </Card>
    )
}

import type React from "react"
import { Button } from "@/components/ui/button"

interface SessionActionsProps {
    onRefresh: () => void
    onClose: () => void
    isLoading: boolean
}

export const SessionActions: React.FC<SessionActionsProps> = ({ onRefresh, onClose, isLoading }) => {
    return (
        <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={onRefresh} disabled={isLoading}>
                Refresh
            </Button>
            <Button variant="outline" onClick={onClose}>
                Close
            </Button>
        </div>
    )
}

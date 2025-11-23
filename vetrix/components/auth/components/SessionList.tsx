import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { SessionCard } from "./SessionCard"
import type { LoginSession } from "../types/session"

interface SessionListProps {
    sessions: LoginSession[]
    isLoading: boolean
    onTerminate: (sessionId: string) => void
    terminatingId: string | null
}

export const SessionList: React.FC<SessionListProps> = ({ sessions, isLoading, onTerminate, terminatingId }) => {
    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="ml-2">Loading sessions...</span>
            </div>
        )
    }

    if (sessions.length === 0) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <p className="text-center text-gray-500">No active sessions found</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-3">
            {sessions.map((session) => (
                <SessionCard
                    key={session.id}
                    session={session}
                    onTerminate={onTerminate}
                    isTerminating={terminatingId === session.id}
                />
            ))}
        </div>
    )
}

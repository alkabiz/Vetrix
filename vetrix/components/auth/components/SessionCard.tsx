import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, LogOut } from "lucide-react"
import { getDeviceIcon, getDeviceInfo, formatDate } from "../utils/session-utils"
import type { LoginSession } from "../types/session"

interface SessionCardProps {
    session: LoginSession
    onTerminate: (sessionId: string) => void
    isTerminating: boolean
}

export const SessionCard: React.FC<SessionCardProps> = ({ session, onTerminate, isTerminating }) => {
    const DeviceIcon = getDeviceIcon(session.userAgent)

    return (
        <Card className={session.isCurrent ? "border-green-200 bg-green-50" : ""}>
            <CardContent className="pt-4">
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                        <DeviceIcon className="h-4 w-4" />
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="font-medium">{getDeviceInfo(session.userAgent)}</span>
                                {session.isCurrent && (
                                    <Badge variant="secondary" className="text-xs">
                                        Current Session
                                    </Badge>
                                )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {session.ipAddress}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {formatDate(session.lastActivity)}
                                </div>
                            </div>
                            <p className="text-xs text-gray-500">Started: {formatDate(session.createdAt)}</p>
                        </div>
                    </div>
                    {!session.isCurrent && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onTerminate(session.id)}
                            disabled={isTerminating}
                            className="text-red-600 hover:text-red-700"
                        >
                            <LogOut className="h-3 w-3 mr-1" />
                            Terminate
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

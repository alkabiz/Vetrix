"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Loader2, Monitor, Smartphone, Tablet, MapPin, Clock, LogOut } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface LoginSession {
  id: string
  ipAddress: string
  userAgent: string
  createdAt: string
  lastActivity: string
  isActive: boolean
  isCurrent?: boolean
}

interface SessionManagerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SessionManager({ open, onOpenChange }: SessionManagerProps) {
  const [sessions, setSessions] = useState<LoginSession[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { toast } = useToast()

  const fetchSessions = async () => {
    setIsLoading(true)
    setError("")

    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/auth/sessions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch sessions")
      }

      setSessions(data.sessions)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to load sessions")
    } finally {
      setIsLoading(false)
    }
  }

  const terminateSession = async (sessionId: string) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/auth/sessions/terminate", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sessionId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to terminate session")
      }

      toast({
        title: "Success",
        description: "Session terminated successfully",
      })

      fetchSessions()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to terminate session",
        variant: "destructive",
      })
    }
  }

  const getDeviceIcon = (userAgent: string) => {
    if (userAgent.includes("Mobile")) return <Smartphone className="h-4 w-4" />
    if (userAgent.includes("Tablet")) return <Tablet className="h-4 w-4" />
    return <Monitor className="h-4 w-4" />
  }

  const getDeviceInfo = (userAgent: string) => {
    if (userAgent.includes("Chrome")) return "Chrome Browser"
    if (userAgent.includes("Firefox")) return "Firefox Browser"
    if (userAgent.includes("Safari")) return "Safari Browser"
    if (userAgent.includes("Edge")) return "Edge Browser"
    return "Unknown Browser"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  useEffect(() => {
    if (open) {
      fetchSessions()
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Active Sessions</DialogTitle>
          <DialogDescription>Manage your active login sessions across different devices</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Loading sessions...</span>
            </div>
          ) : (
            <div className="space-y-3">
              {sessions.length === 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-center text-gray-500">No active sessions found</p>
                  </CardContent>
                </Card>
              ) : (
                sessions.map((session) => (
                  <Card key={session.id} className={session.isCurrent ? "border-green-200 bg-green-50" : ""}>
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          {getDeviceIcon(session.userAgent)}
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
                            onClick={() => terminateSession(session.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <LogOut className="h-3 w-3 mr-1" />
                            Terminate
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={fetchSessions} disabled={isLoading}>
              Refresh
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

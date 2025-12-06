
import { httpClient } from "@/src/lib/api/httpClient"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { SessionList } from "./components/SessionList"
import { SessionActions } from "./components/SessionActions"
import type { LoginSession } from "./types/session"

interface SessionManagerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SessionManager({ open, onOpenChange }: SessionManagerProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [terminatingId, setTerminatingId] = useState<string | null>(null)

  const {
    data: sessions = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["sessions"],
    queryFn: async () => {
      const data = await httpClient.get<{ sessions: LoginSession[] }>("/auth/sessions")
      return data.sessions
    },
    enabled: open,
  })

  const terminateMutation = useMutation({
    mutationFn: async (sessionId: string) => {
      return await httpClient.post("/auth/sessions/terminate", { sessionId })
    },
    onMutate: (sessionId) => {
      setTerminatingId(sessionId)
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Session terminated successfully",
      })
      queryClient.invalidateQueries({ queryKey: ["sessions"] })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to terminate session",
        variant: "destructive",
      })
    },
    onSettled: () => {
      setTerminatingId(null)
    },
  })

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
              <AlertDescription>{error instanceof Error ? error.message : "An error occurred"}</AlertDescription>
            </Alert>
          )}

          <SessionList
            sessions={sessions}
            isLoading={isLoading}
            onTerminate={(id) => terminateMutation.mutate(id)}
            terminatingId={terminatingId}
          />

          <SessionActions
            onRefresh={() => refetch()}
            onClose={() => onOpenChange(false)}
            isLoading={isLoading}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

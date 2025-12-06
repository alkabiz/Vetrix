import { httpClient } from "@/src/lib/api/httpClient"

import { useReducer } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { SetupStep } from "./components/SetupStep"
import { VerifyStep } from "./components/VerifyStep"
import type { TwoFactorState } from "./schemas/twofactor-schema"

interface TwoFactorSetupProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSetupComplete?: () => void
}

type Action =
  | { type: "START_LOADING" }
  | { type: "SET_ERROR"; payload: string }
  | { type: "SETUP_SUCCESS"; payload: { secret: string; qrCode?: string } }
  | { type: "RESET" }

interface State extends TwoFactorState {
  isLoading: boolean
  error: string
}

const initialState: State = {
  step: "setup",
  secret: "",
  qrCode: "",
  isLoading: false,
  error: "",
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "START_LOADING":
      return { ...state, isLoading: true, error: "" }
    case "SET_ERROR":
      return { ...state, isLoading: false, error: action.payload }
    case "SETUP_SUCCESS":
      return {
        ...state,
        isLoading: false,
        step: "verify",
        secret: action.payload.secret,
        qrCode: action.payload.qrCode,
      }
    case "RESET":
      return initialState
    default:
      return state
  }
}

export function TwoFactorSetup({ open, onOpenChange, onSetupComplete }: TwoFactorSetupProps) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const { toast } = useToast()

  const handleSetup = async () => {
    dispatch({ type: "START_LOADING" })

    try {
      const data = await httpClient.post<{ secret: string; qrCode: string }>("/auth/2fa/setup")

      dispatch({
        type: "SETUP_SUCCESS",
        payload: { secret: data.secret, qrCode: data.qrCode },
      })
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: error instanceof Error ? error.message : "Setup failed",
      })
    }
  }

  const handleVerify = async (code: string) => {
    dispatch({ type: "START_LOADING" })

    try {
      await httpClient.post("/auth/2fa/verify", { code })

      toast({
        title: "Success",
        description: "Two-factor authentication enabled successfully",
      })

      onSetupComplete?.()
      onOpenChange(false)
      dispatch({ type: "RESET" })
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: error instanceof Error ? error.message : "Verification failed",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600" />
            Setup Two-Factor Authentication
          </DialogTitle>
          <DialogDescription>Add an extra layer of security to your account</DialogDescription>
        </DialogHeader>

        {state.error && (
          <Alert variant="destructive">
            <AlertDescription>{state.error}</AlertDescription>
          </Alert>
        )}

        {state.step === "setup" && (
          <SetupStep onGenerate={handleSetup} isLoading={state.isLoading} />
        )}

        {state.step === "verify" && (
          <VerifyStep
            secret={state.secret}
            onVerify={handleVerify}
            isLoading={state.isLoading}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

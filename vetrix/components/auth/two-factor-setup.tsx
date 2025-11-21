"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Loader2, Shield, Copy, Check, QrCode } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface TwoFactorSetupProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSetupComplete?: () => void
}

export function TwoFactorSetup({ open, onOpenChange, onSetupComplete }: TwoFactorSetupProps) {
  const [step, setStep] = useState<"setup" | "verify">("setup")
  const [secret, setSecret] = useState("")
  //const [qrCode, setQrCode] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [backupCodes, setBackupCodes] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [copiedSecret, setCopiedSecret] = useState(false)
  const { toast } = useToast()

  const handleSetup = async () => {
    setIsLoading(true)
    setError("")

    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/auth/2fa/setup", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to setup 2FA")
      }

      setSecret(data.secret)
      //setQrCode(data.qrCode)
      setStep("verify")
    } catch (error) {
      setError(error instanceof Error ? error.message : "Setup failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerify = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError("Please enter a valid 6-digit code")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/auth/2fa/verify", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: verificationCode }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Verification failed")
      }

      toast({
        title: "Success",
        description: "Two-factor authentication enabled successfully",
      })

      onSetupComplete?.()
      onOpenChange(false)

      // Reset state
      setStep("setup")
      setSecret("")
      //setQrCode("")
      setVerificationCode("")
    } catch (error) {
      setError(error instanceof Error ? error.message : "Verification failed")
    } finally {
      setIsLoading(false)
    }
  }

  const copySecret = async () => {
    try {
      await navigator.clipboard.writeText(secret)
      setCopiedSecret(true)
      setTimeout(() => setCopiedSecret(false), 2000)
      toast({
        title: "Copied",
        description: "Secret key copied to clipboard",
      })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy secret key",
        variant: "destructive",
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

        {step === "setup" && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Step 1: Install Authenticator App</CardTitle>
                <CardDescription>
                  Install an authenticator app like Google Authenticator, Authy, or Microsoft Authenticator
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Step 2: Generate Secret Key</CardTitle>
                <CardDescription>Click the button below to generate your unique secret key</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={handleSetup} disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <QrCode className="mr-2 h-4 w-4" />
                      Generate Secret Key
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {step === "verify" && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Step 3: Add to Authenticator</CardTitle>
                <CardDescription>
                  Scan the QR code or manually enter the secret key in your authenticator app
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* QR Code placeholder */}
                <div className="flex justify-center p-4 bg-gray-50 rounded-lg">
                  <div className="w-48 h-48 bg-white border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <QrCode className="h-12 w-12 mx-auto mb-2" />
                      <p className="text-sm">QR Code</p>
                      <p className="text-xs">Use your authenticator app</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Manual Entry Key</Label>
                  <div className="flex gap-2">
                    <Input value={secret} readOnly className="font-mono text-sm" />
                    <Button variant="outline" size="sm" onClick={copySecret} className="shrink-0 bg-transparent">
                      {copiedSecret ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Step 4: Verify Setup</CardTitle>
                <CardDescription>Enter the 6-digit code from your authenticator app</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="verificationCode">Verification Code</Label>
                  <Input
                    id="verificationCode"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="000000"
                    className="text-center text-lg font-mono tracking-widest"
                    maxLength={6}
                  />
                </div>

                <Button onClick={handleVerify} disabled={isLoading || verificationCode.length !== 6} className="w-full">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify & Enable 2FA"
                  )}
                </Button>
              </CardContent>
            </Card>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

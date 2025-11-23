import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, QrCode } from "lucide-react"

interface SetupStepProps {
    onGenerate: () => void
    isLoading: boolean
}

export const SetupStep: React.FC<SetupStepProps> = ({ onGenerate, isLoading }) => {
    return (
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
                    <Button onClick={onGenerate} disabled={isLoading} className="w-full">
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
        </div>
    )
}

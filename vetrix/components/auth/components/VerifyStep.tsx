import type React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Loader2 } from "lucide-react"
import { verificationCodeSchema, type VerificationCodeFormValues } from "../../schemas/twofactor-schema"
import { QrCodePlaceholder } from "./QrCodePlaceholder"
import { SecretKeyDisplay } from "./SecretKeyDisplay"
import { formatVerificationCode } from "../../utils/twofactor-utils"

interface VerifyStepProps {
    secret: string
    onVerify: (code: string) => void
    isLoading: boolean
}

export const VerifyStep: React.FC<VerifyStepProps> = ({ secret, onVerify, isLoading }) => {
    const form = useForm<VerificationCodeFormValues>({
        resolver: zodResolver(verificationCodeSchema),
        defaultValues: {
            code: "",
        },
    })

    const onSubmit = (values: VerificationCodeFormValues) => {
        onVerify(values.code)
    }

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Step 3: Add to Authenticator</CardTitle>
                    <CardDescription>
                        Scan the QR code or manually enter the secret key in your authenticator app
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <QrCodePlaceholder />
                    <SecretKeyDisplay secret={secret} />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Step 4: Verify Setup</CardTitle>
                    <CardDescription>Enter the 6-digit code from your authenticator app</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Verification Code</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="000000"
                                                className="text-center text-lg font-mono tracking-widest"
                                                maxLength={6}
                                                onChange={(e) => {
                                                    const formatted = formatVerificationCode(e.target.value)
                                                    field.onChange(formatted)
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" disabled={isLoading} className="w-full">
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Verifying...
                                    </>
                                ) : (
                                    "Verify & Enable 2FA"
                                )}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}

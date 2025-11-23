import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, Check } from "lucide-react"
import { copySecret } from "../utils/twofactor-utils"
import { useToast } from "@/hooks/use-toast"

interface SecretKeyDisplayProps {
    secret: string
}

export const SecretKeyDisplay: React.FC<SecretKeyDisplayProps> = ({ secret }) => {
    const [copied, setCopied] = useState(false)
    const { toast } = useToast()

    const handleCopy = async () => {
        const success = await copySecret(secret)
        if (success) {
            setCopied(true)
            toast({
                title: "Copied",
                description: "Secret key copied to clipboard",
            })
            setTimeout(() => setCopied(false), 2000)
        } else {
            toast({
                title: "Error",
                description: "Failed to copy secret key",
                variant: "destructive",
            })
        }
    }

    return (
        <div className="space-y-2">
            <Label>Manual Entry Key</Label>
            <div className="flex gap-2">
                <Input value={secret} readOnly className="font-mono text-sm" />
                <Button variant="outline" size="sm" onClick={handleCopy} className="shrink-0 bg-transparent">
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
            </div>
        </div>
    )
}

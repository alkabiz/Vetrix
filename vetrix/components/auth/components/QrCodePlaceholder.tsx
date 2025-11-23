import type React from "react"
import { QrCode } from "lucide-react"

export const QrCodePlaceholder: React.FC = () => {
    return (
        <div className="flex justify-center p-4 bg-gray-50 rounded-lg">
            <div className="w-48 h-48 bg-white border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                    <QrCode className="h-12 w-12 mx-auto mb-2" />
                    <p className="text-sm">QR Code</p>
                    <p className="text-xs">Use your authenticator app</p>
                </div>
            </div>
        </div>
    )
}

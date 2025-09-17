"use client"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Check, X } from "lucide-react"

interface PasswordStrengthIndicatorProps {
  password: string
  showRequirements?: boolean
}

interface PasswordRequirement {
  label: string
  test: (password: string) => boolean
  met: boolean
}

export function PasswordStrengthIndicator({ password, showRequirements = true }: PasswordStrengthIndicatorProps) {
  const requirements: PasswordRequirement[] = [
    {
      label: "At least 12 characters",
      test: (pwd) => pwd.length >= 12,
      met: password.length >= 12,
    },
    {
      label: "Contains uppercase letter",
      test: (pwd) => /[A-Z]/.test(pwd),
      met: /[A-Z]/.test(password),
    },
    {
      label: "Contains lowercase letter",
      test: (pwd) => /[a-z]/.test(pwd),
      met: /[a-z]/.test(password),
    },
    {
      label: "Contains number",
      test: (pwd) => /\d/.test(pwd),
      met: /\d/.test(password),
    },
    {
      label: "Contains special character",
      test: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
      met: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    },
    {
      label: "No repeated characters",
      test: (pwd) => !/(.)\1{2,}/.test(pwd),
      met: !/(.)\1{2,}/.test(password),
    },
    {
      label: "No common patterns",
      test: (pwd) => !/123|abc|qwe|password|admin/i.test(pwd),
      met: !/123|abc|qwe|password|admin/i.test(password),
    },
  ]

  const metRequirements = requirements.filter((req) => req.met).length
  const strengthPercentage = (metRequirements / requirements.length) * 100

  const getStrengthLevel = () => {
    if (metRequirements <= 2) return { label: "Weak", color: "text-red-600", bgColor: "bg-red-600" }
    if (metRequirements <= 4) return { label: "Fair", color: "text-yellow-600", bgColor: "bg-yellow-600" }
    if (metRequirements <= 5) return { label: "Good", color: "text-blue-600", bgColor: "bg-blue-600" }
    if (metRequirements <= 6) return { label: "Strong", color: "text-green-600", bgColor: "bg-green-600" }
    return { label: "Very Strong", color: "text-green-700", bgColor: "bg-green-700" }
  }

  const strength = getStrengthLevel()

  if (!password) return null

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Password Strength</span>
          <Badge variant="outline" className={strength.color}>
            {strength.label}
          </Badge>
        </div>
        <Progress
          value={strengthPercentage}
          className="h-2"
          style={{
            background: `linear-gradient(to right, ${strength.bgColor} 0%, ${strength.bgColor} ${strengthPercentage}%, #e5e7eb ${strengthPercentage}%, #e5e7eb 100%)`,
          }}
        />
      </div>

      {showRequirements && (
        <div className="space-y-2">
          <span className="text-sm font-medium">Requirements</span>
          <div className="grid grid-cols-1 gap-1">
            {requirements.map((requirement, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                {requirement.met ? (
                  <Check className="h-3 w-3 text-green-600" />
                ) : (
                  <X className="h-3 w-3 text-red-500" />
                )}
                <span className={requirement.met ? "text-green-700" : "text-gray-600"}>{requirement.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, RefreshCw } from "lucide-react"
import { PasswordStrengthIndicator } from "./password-strength-indicator"

interface EnhancedPasswordInputProps {
  id?: string
  name?: string
  label?: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
  showStrengthIndicator?: boolean
  showGenerator?: boolean
  required?: boolean
  disabled?: boolean
  className?: string
}

export function EnhancedPasswordInput({
  id,
  name,
  label,
  placeholder = "Enter password",
  value,
  onChange,
  showStrengthIndicator = true,
  showGenerator = false,
  required = false,
  disabled = false,
  className,
}: EnhancedPasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false)

  const generateSecurePassword = () => {
    const lowercase = "abcdefghijklmnopqrstuvwxyz"
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const numbers = "0123456789"
    const symbols = '!@#$%^&*(),.?":{}|<>'

    const allChars = lowercase + uppercase + numbers + symbols

    let password = ""

    // Ensure at least one character from each category
    password += lowercase[Math.floor(Math.random() * lowercase.length)]
    password += uppercase[Math.floor(Math.random() * uppercase.length)]
    password += numbers[Math.floor(Math.random() * numbers.length)]
    password += symbols[Math.floor(Math.random() * symbols.length)]

    // Fill the rest randomly (minimum 12 characters total)
    for (let i = password.length; i < 16; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)]
    }

    // Shuffle the password
    const shuffled = password
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("")
    onChange(shuffled)
  }

  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={id}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}

      <div className="relative">
        <Input
          id={id}
          name={name}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          disabled={disabled}
          className={`pr-20 ${className}`}
        />

        <div className="absolute inset-y-0 right-0 flex items-center gap-1 pr-2">
          {showGenerator && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={generateSecurePassword}
              disabled={disabled}
              className="h-6 w-6 p-0"
              title="Generate secure password"
            >
              <RefreshCw className="h-3 w-3" />
            </Button>
          )}

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowPassword(!showPassword)}
            disabled={disabled}
            className="h-6 w-6 p-0"
            title={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
          </Button>
        </div>
      </div>

      {showStrengthIndicator && value && <PasswordStrengthIndicator password={value} />}
    </div>
  )
}

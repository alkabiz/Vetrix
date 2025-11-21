"use client"

import React from "react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface FormSelectProps {
  label: string
  name: string
  value: string
  error?: string
  required?: boolean
  disabled?: boolean
  placeholder?: string
  options: SelectOption[]
  isLoading?: boolean
  emptyMessage?: string
  onChange: (value: string) => void
  onValueChange?: (value: string) => void
  className?: string
  triggerClassName?: string
}

export const FormSelect = React.forwardRef<HTMLButtonElement, FormSelectProps>(
  ({
    label,
    name,
    value,
    error,
    required = false,
    disabled = false,
    placeholder = "Select...",
    options,
    isLoading = false,
    emptyMessage = "No options available",
    onChange,
    onValueChange,
    className,
    triggerClassName,
  }, ref) => {
    const fieldId = `${name}-select`
    const errorId = `${name}-error`

    const handleValueChange = (newValue: string) => {
      onChange(newValue)
      onValueChange?.(newValue)
    }

    return (
      <div className={cn("space-y-2", className)}>
        <Label 
          htmlFor={fieldId}
          className={cn(
            "text-sm font-medium",
            error && "text-destructive",
            disabled && "text-muted-foreground"
          )}
        >
          {label}
          {required && (
            <span 
              className="text-destructive ml-1"
              aria-hidden="true"
            >
              *
            </span>
          )}
        </Label>

        <Select
          value={value}
          onValueChange={handleValueChange}
          disabled={disabled || isLoading}
        >
          <SelectTrigger
            ref={ref}
            id={fieldId}
            className={cn(
              triggerClassName,
              error && "border-destructive focus:ring-destructive",
              disabled && "bg-muted cursor-not-allowed"
            )}
            aria-label={label}
            aria-required={required}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
            aria-busy={isLoading}
          >
            <SelectValue placeholder={
              isLoading ? "Loading..." : placeholder
            } />
          </SelectTrigger>

          <SelectContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="ml-2 text-sm">Loading options...</span>
              </div>
            ) : options.length === 0 ? (
              <div className="py-4 text-center text-sm text-muted-foreground">
                {emptyMessage}
              </div>
            ) : (
              options.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.label}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>

        {error && (
          <p 
            id={errorId}
            className="text-sm text-destructive"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    )
  }
)

FormSelect.displayName = "FormSelect"
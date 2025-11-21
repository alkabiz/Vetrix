"use client"

import React from "react"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils/"

export interface FormCheckboxProps {
  label: string
  name: string
  checked: boolean
  error?: string
  required?: boolean
  disabled?: boolean
  description?: string
  onChange: (checked: boolean) => void
  onBlur?: () => void
  className?: string
  labelClassName?: string
}

export const FormCheckbox = React.forwardRef<HTMLButtonElement, FormCheckboxProps>(
  ({
    label,
    name,
    checked,
    error,
    required = false,
    disabled = false,
    description,
    onChange,
    onBlur,
    className,
    labelClassName,
  }, ref) => {
    const fieldId = `${name}-checkbox`
    const errorId = `${name}-error`
    const descriptionId = `${name}-description`

    return (
      <div className={cn("space-y-2", className)}>
        <div className="flex items-start space-x-2">
          <Checkbox
            ref={ref}
            id={fieldId}
            name={name}
            checked={checked}
            onCheckedChange={(newChecked) => onChange(newChecked as boolean)}
            onBlur={onBlur}
            disabled={disabled}
            required={required}
            className={cn(
              "mt-0.5",
              error && "border-destructive data-[state=checked]:bg-destructive"
            )}
            aria-label={label}
            aria-required={required}
            aria-invalid={!!error}
            aria-describedby={
              error 
                ? errorId 
                : description 
                  ? descriptionId 
                  : undefined
            }
          />

          <div className="grid gap-1.5 leading-none">
            <Label 
              htmlFor={fieldId}
              className={cn(
                "text-sm font-medium cursor-pointer",
                error && "text-destructive",
                disabled && "text-muted-foreground cursor-not-allowed",
                labelClassName
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

            {description && (
              <p 
                id={descriptionId}
                className="text-sm text-muted-foreground"
              >
                {description}
              </p>
            )}
          </div>
        </div>

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

FormCheckbox.displayName = "FormCheckbox"
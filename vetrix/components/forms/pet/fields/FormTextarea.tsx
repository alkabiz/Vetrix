"use client"

import React from "react"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils/index"

export interface FormTextareaProps {
  label: string
  name: string
  value: string
  error?: string
  required?: boolean
  disabled?: boolean
  placeholder?: string
  rows?: number
  maxLength?: number
  showCharCount?: boolean
  onChange: (value: string) => void
  onBlur?: () => void
  onFocus?: () => void
  className?: string
  textareaClassName?: string
  resize?: boolean
}

export const FormTextarea = React.forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({
    label,
    name,
    value,
    error,
    required = false,
    disabled = false,
    placeholder,
    rows = 3,
    maxLength,
    showCharCount = true,
    onChange,
    onBlur,
    onFocus,
    className,
    textareaClassName,
    resize = true,
  }, ref) => {
    const fieldId = `${name}-textarea`
    const errorId = `${name}-error`
    const descriptionId = `${name}-description`

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value
      if (!maxLength || newValue.length <= maxLength) {
        onChange(newValue)
      }
    }

    const characterCount = maxLength ? `${value.length}/${maxLength}` : null

    return (
      <div className={cn("space-y-2", className)}>
        <div className="flex items-center justify-between">
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

          {showCharCount && characterCount && (
            <span 
              className={cn(
                "text-xs",
                value.length > maxLength! * 0.9 
                  ? "text-amber-600" 
                  : "text-muted-foreground"
              )}
            >
              {characterCount}
            </span>
          )}
        </div>

        <Textarea
          ref={ref}
          id={fieldId}
          name={name}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          rows={rows}
          onChange={handleChange}
          onBlur={onBlur}
          onFocus={onFocus}
          className={cn(
            textareaClassName,
            !resize && "resize-none",
            error && "border-destructive focus-visible:ring-destructive",
            disabled && "bg-muted cursor-not-allowed"
          )}
          aria-label={label}
          aria-required={required}
          aria-invalid={!!error}
          aria-describedby={
            error 
              ? errorId 
              : maxLength && showCharCount
                ? descriptionId 
                : undefined
          }
        />

        {error && (
          <p 
            id={errorId}
            className="text-sm text-destructive"
            role="alert"
          >
            {error}
          </p>
        )}

        {maxLength && showCharCount && !error && (
          <p 
            id={descriptionId}
            className="text-xs text-muted-foreground"
          >
            Maximum {maxLength} characters
          </p>
        )}
      </div>
    )
  }
)

FormTextarea.displayName = "FormTextarea"
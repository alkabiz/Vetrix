"use client"

import React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils/index"
import { shallowCompareProps } from "../utils/performance-utils"

export interface FormFieldProps {
  label: string
  name: string
  value: string
  error?: string
  required?: boolean
  disabled?: boolean
  type?: 'text' | 'number' | 'email' | 'tel' | 'url'
  placeholder?: string
  maxLength?: number
  min?: number | string
  max?: number | string
  step?: number | string
  onChange: (value: string) => void
  onBlur?: () => void
  onFocus?: () => void
  className?: string
  inputClassName?: string
  ariaLabel?: string
  autoComplete?: string
  suffix?: React.ReactNode
  prefix?: React.ReactNode
}

const FormFieldComponent = React.forwardRef<HTMLInputElement, FormFieldProps>(
  ({
    label,
    name,
    value,
    error,
    required = false,
    disabled = false,
    type = 'text',
    placeholder,
    maxLength,
    min,
    max,
    step,
    onChange,
    onBlur,
    onFocus,
    className,
    inputClassName,
    ariaLabel,
    autoComplete,
    suffix,
    prefix,
  }, ref) => {
    const fieldId = `${name}-field`
    const errorId = `${name}-error`
    const descriptionId = `${name}-description`

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value)
    }

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      // Allow empty string or valid numbers
      if (value === '' || /^-?\d*\.?\d*$/.test(value)) {
        onChange(value)
      }
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

        <div className="relative">
          {prefix && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {prefix}
            </div>
          )}
          <Input
            ref={ref}
            id={fieldId}
            name={name}
            value={value}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            maxLength={maxLength}
            min={min}
            max={max}
            step={step}
            onChange={type === 'number' ? handleNumberChange : handleChange}
            onBlur={onBlur}
            onFocus={onFocus}
            autoComplete={autoComplete}
            className={cn(
              inputClassName,
              error && "border-destructive focus-visible:ring-destructive",
              disabled && "bg-muted cursor-not-allowed",
              prefix && "pl-10",
              suffix && "pr-10"
            )}
            aria-label={ariaLabel || label}
            aria-required={required}
            aria-invalid={!!error}
            aria-describedby={
              error 
                ? errorId 
                : maxLength 
                  ? descriptionId 
                  : undefined
            }
          />
          {suffix && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {suffix}
            </div>
          )}
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

        {maxLength && !error && (
          <p 
            id={descriptionId}
            className="text-xs text-muted-foreground"
          >
            {value.length}/{maxLength}
          </p>
        )}
      </div>
    )
  }
)

FormFieldComponent.displayName = "FormFieldComponent"

export const FormField = React.memo(FormFieldComponent, shallowCompareProps)
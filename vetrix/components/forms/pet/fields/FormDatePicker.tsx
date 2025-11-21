"use client"

import React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Calendar, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"

export interface FormDatePickerProps {
  label: string
  name: string
  value: string // ISO string (YYYY-MM-DD)
  error?: string
  required?: boolean
  disabled?: boolean
  placeholder?: string
  minDate?: string // ISO string
  maxDate?: string // ISO string
  onChange: (value: string) => void
  onBlur?: () => void
  className?: string
  allowClear?: boolean
  showCalendar?: boolean
}

export const FormDatePicker = React.forwardRef<HTMLInputElement, FormDatePickerProps>(
  ({
    label,
    name,
    value,
    error,
    required = false,
    disabled = false,
    placeholder = "Select date",
    minDate,
    maxDate,
    onChange,
    onBlur,
    className,
    allowClear = true,
    showCalendar = true,
  }, ref) => {
    const fieldId = `${name}-datepicker`
    const errorId = `${name}-error`
    const [isCalendarOpen, setIsCalendarOpen] = React.useState(false)

    const dateValue = value ? new Date(value) : undefined
    const minDateObj = minDate ? new Date(minDate) : undefined
    const maxDateObj = maxDate ? new Date(maxDate) : undefined

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      // Basic date format validation (YYYY-MM-DD)
      if (newValue === "" || /^\d{4}-\d{2}-\d{2}$/.test(newValue)) {
        onChange(newValue)
      }
    }

    const handleCalendarSelect = (date: Date | undefined) => {
      if (date) {
        const isoDate = format(date, "yyyy-MM-dd")
        onChange(isoDate)
      }
      setIsCalendarOpen(false)
    }

    const handleClear = () => {
      onChange("")
    }

    const displayValue = dateValue ? format(dateValue, "PPP") : ""

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
          <Input
            ref={ref}
            id={fieldId}
            name={name}
            type="text"
            value={displayValue}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            onChange={handleInputChange}
            onBlur={onBlur}
            className={cn(
              "pr-20", // Make room for buttons
              error && "border-destructive focus-visible:ring-destructive",
              disabled && "bg-muted cursor-not-allowed"
            )}
            aria-label={label}
            aria-required={required}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
          />

          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
            {allowClear && value && !disabled && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                aria-label="Clear date"
              >
                <X className="h-3 w-3" />
              </Button>
            )}

            {showCalendar && !disabled && (
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    aria-label="Open calendar"
                  >
                    <Calendar className="h-3 w-3" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={dateValue}
                    onSelect={handleCalendarSelect}
                    disabled={(date) => {
                      if (minDateObj && date < minDateObj) return true
                      if (maxDateObj && date > maxDateObj) return true
                      return false
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>

        {/* Hidden input for form submission with ISO format */}
        <input
          type="hidden"
          name={`${name}_iso`}
          value={value}
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

        {/* Date constraints info */}
        {(minDate || maxDate) && !error && (
          <p className="text-xs text-muted-foreground">
            {minDate && maxDate 
              ? `Between ${format(new Date(minDate), "MMM d, yyyy")} and ${format(new Date(maxDate), "MMM d, yyyy")}`
              : minDate 
                ? `After ${format(new Date(minDate), "MMM d, yyyy")}`
                : `Before ${format(new Date(maxDate!), "MMM d, yyyy")}`
            }
          </p>
        )}
      </div>
    )
  }
)

FormDatePicker.displayName = "FormDatePicker"
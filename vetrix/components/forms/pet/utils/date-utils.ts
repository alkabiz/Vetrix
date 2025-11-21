/**
 * Convert Date object to YYYY-MM-DD string for input fields
 */
export function formatDateForInput(date: Date | null | undefined): string {
  if (!date) return ""
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    
    if (isNaN(dateObj.getTime())) {
      return ""
    }
    
    const year = dateObj.getFullYear()
    const month = String(dateObj.getMonth() + 1).padStart(2, '0')
    const day = String(dateObj.getDate()).padStart(2, '0')
    
    return `${year}-${month}-${day}`
  } catch {
    return ""
  }
}

/**
 * Convert YYYY-MM-DD string to Date object
 */
export function parseDateFromInput(dateString: string): Date | null {
  if (!dateString || !/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return null
  }
  
  try {
    const date = new Date(dateString)
    return isNaN(date.getTime()) ? null : date
  } catch {
    return null
  }
}

/**
 * Calculate age from birth date
 */
export function calculateAge(birthDate: Date): { years: number; months: number; days: number } {
  const today = new Date()
  const birth = new Date(birthDate)
  
  let years = today.getFullYear() - birth.getFullYear()
  let months = today.getMonth() - birth.getMonth()
  let days = today.getDate() - birth.getDate()
  
  // Adjust for negative days
  if (days < 0) {
    months--
    // Get days in previous month
    const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0)
    days += lastMonth.getDate()
  }
  
  // Adjust for negative months
  if (months < 0) {
    years--
    months += 12
  }
  
  return { years, months, days }
}

/**
 * Calculate age and return as human-readable string
 */
export function calculateAgeString(birthDate: Date): string {
  const { years, months, days } = calculateAge(birthDate)
  
  if (years > 0) {
    return `${years} year${years !== 1 ? 's' : ''}${
      months > 0 ? `, ${months} month${months !== 1 ? 's' : ''}` : ''
    }`
  } else if (months > 0) {
    return `${months} month${months !== 1 ? 's' : ''}${
      days > 0 ? `, ${days} day${days !== 1 ? 's' : ''}` : ''
    }`
  } else {
    return `${days} day${days !== 1 ? 's' : ''}`
  }
}

/**
 * Validate that date is not in the future
 */
export function isValidPastDate(date: Date): boolean {
  const today = new Date()
  today.setHours(0, 0, 0, 0) // Compare only dates, not times
  
  const checkDate = new Date(date)
  checkDate.setHours(0, 0, 0, 0)
  
  return checkDate <= today
}

/**
 * Validate that date is not before a minimum date
 */
export function isValidDateAfter(minDate: Date, date: Date): boolean {
  const min = new Date(minDate)
  min.setHours(0, 0, 0, 0)
  
  const checkDate = new Date(date)
  checkDate.setHours(0, 0, 0, 0)
  
  return checkDate >= min
}

/**
 * Check if two dates are the same (ignoring time)
 */
export function isSameDate(date1: Date, date2: Date): boolean {
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  
  d1.setHours(0, 0, 0, 0)
  d2.setHours(0, 0, 0, 0)
  
  return d1.getTime() === d2.getTime()
}

/**
 * Get minimum date for date pickers (usually today for future restrictions)
 */
export function getMinDate(): string {
  return formatDateForInput(new Date())
}

/**
 * Get maximum date for date pickers (usually today for past restrictions)
 */
export function getMaxDate(): string {
  return formatDateForInput(new Date())
}

/**
 * Calculate date difference in days
 */
export function getDateDifferenceInDays(startDate: Date, endDate: Date): number {
  const start = new Date(startDate)
  const end = new Date(endDate)
  
  start.setHours(0, 0, 0, 0)
  end.setHours(0, 0, 0, 0)
  
  const diffTime = end.getTime() - start.getTime()
  return Math.floor(diffTime / (1000 * 60 * 60 * 24))
}

/**
 * Format date for display in UI
 */
export function formatDateForDisplay(date: Date | string): string {
  if (!date) return "Not specified"
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    
    if (isNaN(dateObj.getTime())) {
      return "Invalid date"
    }
    
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch {
    return "Invalid date"
  }
}

/**
 * Check if a date string is valid
 */
export function isValidDateString(dateString: string): boolean {
  if (!dateString) return false
  
  try {
    const date = new Date(dateString)
    return !isNaN(date.getTime())
  } catch {
    return false
  }
}
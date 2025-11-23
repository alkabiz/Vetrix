export const ROLE_OPTIONS = [
    { value: "1", label: "Admin" },
    { value: "2", label: "Veterinarian" },
    { value: "3", label: "Assistant" },
    { value: "4", label: "Receptionist" },
] as const

export const TIMEZONE_OPTIONS = [
    { value: "America/Bogota", label: "America/Bogota (COT)" },
    { value: "America/New_York", label: "America/New_York (EST)" },
    { value: "America/Los_Angeles", label: "America/Los_Angeles (PST)" },
    { value: "Europe/Madrid", label: "Europe/Madrid (CET)" },
] as const

export const LANGUAGE_OPTIONS = [
    { value: "es", label: "Español" },
    { value: "en", label: "English" },
] as const

export const SESSION_TIMEOUT_OPTIONS = [
    { value: "60", label: "1 hour" },
    { value: "240", label: "4 hours" },
    { value: "480", label: "8 hours" },
    { value: "720", label: "12 hours" },
    { value: "1440", label: "24 hours" },
] as const

export const VETERINARIAN_OPTIONS = [
    { value: "1", label: "Dr. Anderson" },
    { value: "2", label: "Dr. Smith" },
    { value: "3", label: "Dr. Johnson" },
    { value: "4", label: "Dr. Williams" },
    { value: "5", label: "Dr. Brown" },
] as const

import type { VeterinarianFormValues } from "./VeterinarianForm.schema"

export const EMPLOYMENT_STATUS_OPTIONS = [
    { value: "1", label: "Active" },
    { value: "2", label: "Inactive" },
    { value: "3", label: "On Leave" },
    { value: "4", label: "Terminated" },
] as const

export const DEFAULT_VETERINARIAN_VALUES: Partial<VeterinarianFormValues> = {
    employeeNumber: "",
    firstName: "",
    lastName: "",
    licenseNumber: "",
    licenseExpiryDate: "",
    phone: "",
    email: "",
    yearsExperience: 0,
    education: "",
    certifications: [],
    specializationNotes: "",
    hireDate: new Date().toISOString().split("T")[0],
    terminationDate: "",
    employmentStatusId: "1",
    salary: 0,
    commissionRate: 0,
    maxDailyAppointments: 8,
    appointmentDurationDefault: 30,
    isActive: true,
    notes: "",
}

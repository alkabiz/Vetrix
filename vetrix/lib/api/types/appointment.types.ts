export interface AppointmentEntity {
    id: number
    pet_id: number
    owner_id: number
    appointment_date: string
    appointment_time: string
    reason: string
    status: string
    notes?: string | null
    created_at: string
    updated_at: string
}

export interface AppointmentDTO {
    id: number
    appointmentNumber: string
    petId: number
    ownerId: number
    veterinarianId?: number | null
    petName?: string
    ownerName?: string
    veterinarianName?: string
    date: string
    time: string
    appointmentDatetime: string
    durationMinutes: number
    reason: string
    status: string
    statusId: number
    typeId: number
    priorityId: number
    notes?: string | null
    internalNotes?: string | null
    isFollowUp: boolean
    parentAppointmentId?: number | null
    petConditionOnArrival?: string | null
    reminderSent: boolean
    confirmationRequired: boolean
    isConfirmed: boolean
    followUpRequired: boolean
    followUpDate?: string | null
    followUpReason?: string | null
    estimatedCost?: number | null
    actualCost?: number | null
    createdAt: string
    updatedAt: string
}

export interface CreateAppointmentDTO {
    pet_id: number
    owner_id: number
    appointment_date: string
    appointment_time: string
    reason: string
    status: string
    notes?: string
}

export interface UpdateAppointmentDTO extends Partial<CreateAppointmentDTO> { }

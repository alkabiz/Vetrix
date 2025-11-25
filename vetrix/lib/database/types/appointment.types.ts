export interface AppointmentStatus {
    id: number
    name: string
    description?: string
    colorCode?: string
    isActive: boolean
    isFinalStatus: boolean
    allowsModification: boolean
    sortOrder: number
    createdAt: Date
}

export interface AppointmentType {
    id: number
    name: string
    description?: string | null
    isActive: boolean
    createdAt: Date
}

export interface AppointmentPriority {
    id: number
    name: string
    level: number
    isActive: boolean
    createdAt: Date
}

export interface Appointment {
    id: number
    appointmentNumber: string
    petId: number
    ownerId: number
    veterinarianId?: number | null
    appointmentDatetime: Date
    appointmentDate: string
    durationMinutes: number
    statusId: number
    typeId: number
    priorityId: number
    reason: string
    isFollowUp: boolean
    parentAppointmentId?: number | null
    petConditionOnArrival?: string | null
    checkInTime?: Date | null
    actualStartTime?: Date | null
    actualEndTime?: Date | null
    waitingTimeMinutes?: number | null
    reminderSent: boolean
    reminderSentAt?: Date | null
    confirmationRequired: boolean
    isConfirmed: boolean
    confirmedAt?: Date | null
    followUpRequired: boolean
    followUpDate?: string | null
    followUpReason?: string | null
    estimatedCost?: number | null
    actualCost?: number | null
    cancellationReason?: string | null
    cancelledAt?: Date | null
    cancelledBy?: number | null
    rescheduledFromId?: number | null
    notes?: string | null
    internalNotes?: string | null
    createdAt: Date
    updatedAt: Date
}

export interface AppointmentInput extends Omit<Appointment, 'id' | 'createdAt' | 'updatedAt' | 'appointmentNumber'> {
    appointmentNumber?: string
}

export interface AppointmentReminder {
    reminderId: number
    appointmentId: number
    scheduledAt: Date
    sentAt?: Date | null
    methodId: number
    statusId: number
    retryCount: number
    lastAttemptAt?: Date | null
    errorMessage?: string | null
}

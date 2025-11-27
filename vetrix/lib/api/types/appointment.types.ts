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
    petId: number
    ownerId: number
    petName?: string
    ownerName?: string
    date: string
    time: string
    reason: string
    status: string
    notes?: string | null
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

import { Appointment } from './appointment.types'
import { Pet, Species } from './common.types'

export interface RecordType {
    id: number
    name: string
}

export interface Prognosis {
    id: number
    name: string
}

export interface MedicalRecord {
    id: number
    recordNumber: string
    petId: number
    appointmentId?: number | null
    veterinarianId: number
    visitDatetime: Date
    recordTypeId: number
    chiefComplaint: string
    historyPresentIllness?: string | null
    prognosisId?: number | null
    prognosisNotes?: string | null
    nextVisitDate?: string | null
    nextVisitReason?: string | null
    totalCharges?: number | null
    veterinarianNotes?: string | null
    createdAt: Date
    updatedAt: Date
    // Joined fields
    visit_date?: string | number | Date
}

export interface MedicalRecordInput extends Omit<MedicalRecord, 'id' | 'createdAt' | 'updatedAt' | 'recordNumber'> {
    recordNumber?: string
}

export interface ExamSystem {
    id: number
    name: string
    description?: string | null
    isActive: boolean
}

export interface ExamFinding {
    id: number
    medicalRecordId: number
    systemId: number
    findings: string
    createdAt: Date
}

export interface VitalSigns {
    id: number
    medicalRecordId: number
    temperature?: number | null
    weight?: number | null
    heartRate?: number | null
    respiratoryRate?: number | null
    bloodPressureSystolic?: number | null
    bloodPressureDiastolic?: number | null
    bodyConditionScore?: number | null
    createdAt: Date
}

export interface MedicalRecordWithRelations extends MedicalRecord {
    recordType?: RecordType
    appointment?: Appointment
    pet?: Pet
    // veterinarian?: Veterinarian // Defined elsewhere or can be added if needed
}

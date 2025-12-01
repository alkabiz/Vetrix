import { MedicalRecord } from "@/lib/database/database"

export interface MedicalRecordEntity extends MedicalRecord { }

export interface MedicalRecordDTO extends MedicalRecordEntity {
    pet_name?: string
}

export type MedicalRecordInput = Omit<MedicalRecordDTO, "id" | "createdAt" | "updatedAt" | "pet_name">


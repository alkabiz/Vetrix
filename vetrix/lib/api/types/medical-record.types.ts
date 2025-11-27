import { MedicalRecord } from "@/lib/database/database"

export interface MedicalRecordEntity extends MedicalRecord { }

export interface MedicalRecordDTO extends MedicalRecordEntity {
    pet_name?: string
}

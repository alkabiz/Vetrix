import { Pet } from "@/lib/database/database"

export interface PetEntity extends Pet { }

export interface PetDTO extends PetEntity {
    owner_name?: string
}

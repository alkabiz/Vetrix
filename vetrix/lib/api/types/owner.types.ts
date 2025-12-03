import { Owner } from "@/lib/database/database"

export type OwnerEntity = Owner

export interface OwnerDTO extends OwnerEntity {
    // Add any specific DTO fields if needed, for now it mirrors the DB entity
    // potentially formatted dates or computed fields could go here
}

export interface OwnerInput extends Omit<OwnerEntity, "id" | "created_at" | "updated_at" | "createdAt" | "updatedAt"> {
    // Input for creating/updating an owner
    // Optional fields in DB might be optional here too
}

export interface OwnerFilter {
    search?: string
    page?: number
    limit?: number
}

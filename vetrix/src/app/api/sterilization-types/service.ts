import { getDatabase, SterilizationType } from "@/lib/database/database"

export class SterilizationTypeService {
    /**
     * Get all active sterilization types
     */
    static getAll(): SterilizationType[] {
        const db = getDatabase()
        return db
            .prepare(`
                SELECT * FROM cat_sterilization_types 
                WHERE is_active = 1 
                ORDER BY description
            `)
            .all() as SterilizationType[]
    }

    /**
     * Get sterilization type by ID
     */
    static getById(id: number): SterilizationType | undefined {
        const db = getDatabase()
        return db
            .prepare(`
                SELECT * FROM cat_sterilization_types 
                WHERE id = ? AND is_active = 1
            `)
            .get(id) as SterilizationType | undefined
    }
}

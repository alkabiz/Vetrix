import { getDatabase, Species } from "@/lib/database/database"

export class SpeciesService {
    /**
     * Get all active species
     */
    static getAll(): Species[] {
        const db = getDatabase()
        return db
            .prepare(`
                SELECT * FROM cat_species 
                WHERE is_active = 1 
                ORDER BY name
            `)
            .all() as Species[]
    }

    /**
     * Get species by ID
     */
    static getById(id: number): Species | undefined {
        const db = getDatabase()
        return db
            .prepare(`
                SELECT * FROM cat_species 
                WHERE id = ? AND is_active = 1
            `)
            .get(id) as Species | undefined
    }
}

import { getDatabase, Breed } from "@/lib/database/database"

export class BreedService {
    /**
     * Get all active breeds, optionally filtered by species
     */
    static getAll(speciesId?: number): Breed[] {
        const db = getDatabase()

        if (speciesId !== undefined) {
            return db
                .prepare(`
                    SELECT * FROM cat_breeds 
                    WHERE is_active = 1 AND species_id = ?
                    ORDER BY name
                `)
                .all(speciesId) as Breed[]
        }

        return db
            .prepare(`
                SELECT * FROM cat_breeds 
                WHERE is_active = 1 
                ORDER BY name
            `)
            .all() as Breed[]
    }

    /**
     * Get breed by ID
     */
    static getById(id: number): Breed | undefined {
        const db = getDatabase()
        return db
            .prepare(`
                SELECT * FROM cat_breeds 
                WHERE id = ? AND is_active = 1
            `)
            .get(id) as Breed | undefined
    }
}

import { getDatabase, Sex } from "@/lib/database/database"

export class SexService {
    /**
     * Get all active sexes
     */
    static getAll(): Sex[] {
        const db = getDatabase()
        return db
            .prepare(`
                SELECT * FROM cat_sexes 
                WHERE is_active = 1 
                ORDER BY name
            `)
            .all() as Sex[]
    }

    /**
     * Get sex by ID
     */
    static getById(id: number): Sex | undefined {
        const db = getDatabase()
        return db
            .prepare(`
                SELECT * FROM cat_sexes 
                WHERE id = ? AND is_active = 1
            `)
            .get(id) as Sex | undefined
    }
}

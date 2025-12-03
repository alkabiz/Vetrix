import { getDatabase, Color } from "@/lib/database/database"

export class ColorService {
    /**
     * Get all active colors
     */
    static getAll(): Color[] {
        const db = getDatabase()
        return db
            .prepare(`
                SELECT * FROM cat_colors 
                WHERE is_active = 1 
                ORDER BY name
            `)
            .all() as Color[]
    }

    /**
     * Get color by ID
     */
    static getById(id: number): Color | undefined {
        const db = getDatabase()
        return db
            .prepare(`
                SELECT * FROM cat_colors 
                WHERE id = ? AND is_active = 1
            `)
            .get(id) as Color | undefined
    }
}

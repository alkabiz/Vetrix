import { getDatabase, type Pet } from "@/lib/database/database"
import { type PetInput } from "./validator"

export class PetService {
    static getAll(): Pet[] {
        const db = getDatabase()
        return db
            .prepare(`
      SELECT p.*, o.name as owner_name 
      FROM pets p 
      JOIN owners o ON p.owner_id = o.id 
      ORDER BY p.name
    `)
            .all() as Pet[]
    }

    static create(data: PetInput): Pet {
        const db = getDatabase()

        const stmt = db.prepare(`
      INSERT INTO pets (owner_id, name, species, breed, sex, age, weight, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `)

        const result = stmt.run(
            data.owner_id,
            data.name,
            data.species,
            data.breed,
            data.sex,
            data.age,
            data.weight,
            data.notes
        )

        return db
            .prepare(`
      SELECT p.*, o.name as owner_name 
      FROM pets p 
      JOIN owners o ON p.owner_id = o.id 
      WHERE p.id = ?
    `)
            .get(result.lastInsertRowid) as Pet
    }
}

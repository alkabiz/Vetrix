import { getDatabase, type Owner } from "@/lib/database/database"
import { type OwnerInput } from "./validator"

export class OwnerService {
    static getAll(): Owner[] {
        const db = getDatabase()
        return db.prepare("SELECT * FROM owners ORDER BY name").all() as Owner[]
    }

    static create(data: OwnerInput): Owner {
        const db = getDatabase()

        const stmt = db.prepare(`
      INSERT INTO owners (name, phone, email, address)
      VALUES (?, ?, ?, ?)
    `)

        const result = stmt.run(data.name, data.phone, data.email, data.address)

        return db.prepare("SELECT * FROM owners WHERE id = ?").get(result.lastInsertRowid) as Owner
    }
}

import { getDatabase, type User } from "@/lib/database/database"

export class UserService {
    static getAll(): User[] {
        const db = getDatabase()
        // Select all users, excluding sensitive data like passwordHash if possible, 
        // but for now following the pattern of returning the full object or what's needed.
        // Ideally we should map to a DTO to exclude passwordHash.
        return db.prepare("SELECT * FROM usr_users").all() as User[]
    }

    static getById(id: number): User | undefined {
        const db = getDatabase()
        return db.prepare("SELECT * FROM usr_users WHERE id = ?").get(id) as User | undefined
    }
}

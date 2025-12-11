import pool from "@/lib/db"
import { RegisterInput } from "@/src/app/api/auth/validator"
import { ResultSetHeader, RowDataPacket } from "mysql2"
import bcrypt from "bcryptjs"

export async function createUser(data: RegisterInput): Promise<any> {
    const connection = await pool.getConnection()
    try {
        await connection.beginTransaction()

        // 1. Get role_id
        const [roles] = await connection.query<RowDataPacket[]>(
            "SELECT id FROM cat_roles WHERE name = ?", 
            [data.role]
        )
        
        if (roles.length === 0) {
            throw new Error(`Role '${data.role}' not found`)
        }
        const roleId = roles[0].id

        // 2. Hash password
        const passwordHash = await bcrypt.hash(data.password, 10)

        // 3. Insert user
        // Assuming status_id 1 is 'Active' or 'Pending'. I'll use 1.
        const [result] = await connection.query<ResultSetHeader>(`
            INSERT INTO usr_users (
                username, 
                email, 
                password_hash, 
                role_id, 
                status_id,
                created_at,
                updated_at
            ) VALUES (?, ?, ?, ?, 1, NOW(), NOW())
        `, [
            data.username,
            data.email,
            passwordHash,
            roleId
        ])

        const newUserId = result.insertId

        // 4. Fetch created user
        const [users] = await connection.query<RowDataPacket[]>(
            "SELECT * FROM usr_users WHERE id = ?",
            [newUserId]
        )

        await connection.commit()
        return users[0]

    } catch (error) {
        await connection.rollback()
        throw error
    } finally {
        connection.release()
    }
}

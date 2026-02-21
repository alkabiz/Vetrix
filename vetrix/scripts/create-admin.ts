import 'dotenv/config';
import pool from '../src/lib/db';
import bcrypt from 'bcryptjs';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

async function createAdmin() {
    console.log('Starting admin user creation...');

    try {
        // 1. Check/Create Role
        const [roles] = await pool.query<RowDataPacket[]>('SELECT id FROM cat_roles WHERE name = ?', ['Administrator']);
        
        let roleId: number;

        if (roles.length > 0) {
            roleId = roles[0].id;
            console.log(`Role 'Administrator' found with ID: ${roleId}`);
        } else {
            console.log("Role 'Administrator' not found. Creating it...");
            // level=1 (Highest), is_system_role=1
            const [result] = await pool.query<ResultSetHeader>('INSERT INTO cat_roles (name, level, is_system_role, is_active) VALUES (?, ?, ?, ?)', ['Administrator', 1, 1, 1]);
            roleId = result.insertId;
            console.log(`Role 'Administrator' created with ID: ${roleId}`);
        }

        // 2. Check if user exists
        const [users] = await pool.query<RowDataPacket[]>('SELECT id FROM usr_users WHERE email = ? OR username = ?', ['admin@vetrix.local', 'admin']);
        
        if (users.length > 0) {
            console.log('User already exists. Skipping creation.');
            process.exit(0);
        }

        // 3. Hash Password
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash('admin123', salt);

        // 4. Insert User
        console.log('Inserting admin user...');
        const query = `
            INSERT INTO usr_users (
                username, 
                email, 
                password_hash, 
                role_id, 
                status_id, 
                is_email_verified, 
                email_verified_at,
                api_access_enabled, 
                two_factor_enabled, 
                created_at, 
                updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
        `;

        const [userResult] = await pool.query<ResultSetHeader>(query, [
            'admin',
            'admin@vetrix.local',
            hash,
            roleId,
            1, // status_id = 1 (Active)
            1, // is_email_verified = 1
            new Date(), // email_verified_at
            1, // api_access_enabled = 1
            0  // two_factor_enabled = 0
        ]);

        console.log(`Admin user created successfully with ID: ${userResult.insertId}`);

    } catch (error) {
        console.error('Error creating admin user:', error);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

createAdmin();


import 'dotenv/config';
import pool from '../src/lib/db';
import { RowDataPacket } from 'mysql2';

async function auditPermissions() {
    console.log('--- Permission Audit ---');

    try {
        // 1. Get all Permissions
        const [permissions] = await pool.query<RowDataPacket[]>('SELECT * FROM cat_permissions');
        console.log('\n[cat_permissions]:');
        console.table(permissions);

        // 2. Get all Roles
        const [roles] = await pool.query<RowDataPacket[]>('SELECT * FROM cat_roles');
        console.log('\n[cat_roles]:');
        console.table(roles);

        // 3. Get Role Permissions
        const [rolePermissions] = await pool.query<RowDataPacket[]>(`
            SELECT 
                r.name as Role,
                p.name as Permission
            FROM usr_role_permissions rp
            JOIN cat_roles r ON rp.role_id = r.id
            JOIN cat_permissions p ON rp.permission_id = p.id
            ORDER BY r.name, p.name
        `);
        console.log('\n[Role Permissions Map]:');
        console.table(rolePermissions);

    } catch (error) {
        console.error('Error auditing permissions:', error);
    } finally {
        await pool.end();
    }
}

auditPermissions();

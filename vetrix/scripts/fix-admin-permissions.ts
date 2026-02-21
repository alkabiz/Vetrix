
import 'dotenv/config';
import pool from '../src/lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

async function fixPermissions() {
    console.log('Starting Permission Fix...');

    try {
        // 1. Get Admin Role ID
        const [roles] = await pool.query<RowDataPacket[]>('SELECT id FROM cat_roles WHERE name = ?', ['Administrator']);
        
        if (roles.length === 0) {
            console.error('Administrator role not found!');
            process.exit(1);
        }
        
        const roleId = roles[0].id;
        console.log(`Administrator Role ID: ${roleId}`);

        // 2. Count existing permissions
        const [existing] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) as count FROM usr_role_permissions WHERE role_id = ?', [roleId]);
        console.log(`Current permissions count: ${existing[0].count}`);

        // 3. Mass Insert
        // We select ALL permission IDs from cat_permissions and pair them with the Admin Role ID
        // IGNORE prevents errors if some duplicates already exist (though we checked count is likely 0)
        const query = `
            INSERT IGNORE INTO usr_role_permissions (role_id, permission_id)
            SELECT ?, id FROM cat_permissions
        `;

        const [result] = await pool.query<ResultSetHeader>(query, [roleId]);
        
        console.log(`Affected Rows: ${result.affectedRows}`);
        console.log('Permissions successfully assigned to Administrator.');

    } catch (error) {
        console.error('Error fixing permissions:', error);
    } finally {
        await pool.end();
    }
}

fixPermissions();

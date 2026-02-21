
import 'dotenv/config';
import pool from '../src/lib/db';
import { RowDataPacket } from 'mysql2';

async function checkDb() {
    console.log('Checking database table...');
    try {
        const [tables] = await pool.query<RowDataPacket[]>('SHOW TABLES');
        console.log('Tables:', tables);

        // Check if usr_refresh_tokens exists
        const refreshTable = tables.find(t => Object.values(t)[0] === 'usr_refresh_tokens');
        if (refreshTable) {
            console.log('usr_refresh_tokens exists.');
            const [desc] = await pool.query('DESCRIBE usr_refresh_tokens');
            console.log('Structure:', desc);
        } else {
            console.log('usr_refresh_tokens DOES NOT exist.');
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await pool.end();
    }
}

checkDb();

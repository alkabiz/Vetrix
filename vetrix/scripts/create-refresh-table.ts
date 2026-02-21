
import 'dotenv/config';
import pool from '../src/lib/db';

async function createRefreshTokenTable() {
    console.log('Creating usr_refresh_tokens table...');
    try {
        const query = `
            CREATE TABLE IF NOT EXISTS usr_refresh_tokens (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT UNSIGNED NOT NULL,
                token VARCHAR(255) NOT NULL UNIQUE,
                expires_at DATETIME NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                revoked_at DATETIME NULL,
                replaced_by_token VARCHAR(255) NULL,
                device_info VARCHAR(255) NULL,
                ip_address VARCHAR(45) NULL,
                FOREIGN KEY (user_id) REFERENCES usr_users(id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `;
        
        await pool.query(query);
        console.log('Table usr_refresh_tokens created successfully.');
    } catch (error) {
        console.error('Error creating table:', error);
    } finally {
        await pool.end();
    }
}

createRefreshTokenTable();

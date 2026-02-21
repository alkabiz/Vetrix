
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function testConnection() {
  try {
    const { default: pool } = await import('../src/lib/db');
    console.log('Testing MySQL connection...');
    console.log(`Host: ${process.env.DB_HOST}`);
    console.log(`User: ${process.env.DB_USER}`);
    console.log(`Database: ${process.env.DB_NAME}`);

    const connection = await pool.getConnection();
    console.log('Successfully connected to the database!');
    
    const [rolesSchema] = await connection.query('DESCRIBE cat_roles');
    console.log('Roles Schema:', rolesSchema);
    
    connection.release();
    process.exit(0);
  } catch (error) {
    console.error('Error connecting to database:', error);
    process.exit(1);
  }
}

testConnection();

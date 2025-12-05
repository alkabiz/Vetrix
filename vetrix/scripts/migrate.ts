/**
 * Run database migrations
 * Usage: npm run migrate
 */

import { migrateRefreshTokens } from '../lib/database/migrate-refresh-tokens'

async function runMigrations() {
    try {
        console.log('Starting database migrations...')

        await migrateRefreshTokens()

        console.log('All migrations completed successfully')
        process.exit(0)
    } catch (error) {
        console.error('Migration failed:', error)
        process.exit(1)
    }
}

runMigrations()

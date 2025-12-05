import { getDatabase } from './database'

/**
 * Database migration: Add usr_refresh_tokens table
 */
export function migrateRefreshTokens() {
  const db = getDatabase()

  // Create usr_refresh_tokens table
  db.exec(`
    CREATE TABLE IF NOT EXISTS usr_refresh_tokens (
      id TEXT PRIMARY KEY,
      userId INTEGER NOT NULL,
      token TEXT NOT NULL UNIQUE,
      expiresAt TEXT NOT NULL,
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      revokedAt TEXT DEFAULT NULL,
      replacedByToken TEXT DEFAULT NULL,
      deviceInfo TEXT DEFAULT NULL,
      ipAddress TEXT DEFAULT NULL,
      FOREIGN KEY (userId) REFERENCES usr_users(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user ON usr_refresh_tokens(userId);
    CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token ON usr_refresh_tokens(token);
    CREATE INDEX IF NOT EXISTS idx_refresh_tokens_expires ON usr_refresh_tokens(expiresAt);
  `)

  console.log('Migration: usr_refresh_tokens table created')
}

// Run migration if this is the main module
// ESM doesn't have require.main, so we check if running via tsx
const isMainModule = process.argv[1]?.includes('migrate-refresh-tokens')

if (isMainModule) {
  try {
    migrateRefreshTokens()
    console.log('Migration completed successfully')
    process.exit(0)
  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  }
}

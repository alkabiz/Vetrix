/**
 * Re-export of src/lib/auth-server for compatibility with the '@/lib/auth-server' alias
 * used in API routes and test files. Vitest resolves '@' to the project root ('./'),
 * so this file acts as a bridge so both Next.js and Vitest can resolve the same path.
 */
export { verifyPassword, generateToken, verifyToken } from '../src/lib/auth-server'

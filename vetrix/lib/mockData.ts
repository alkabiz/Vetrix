import { AuthUser } from './types';
import bcrypt from 'bcryptjs';

// Generar hashes únicos para cada usuario
const createMockUser = async (id: number, username: string, email: string, password: string, role: UserRole): Promise<AuthUser> => {
  return {
    id,
    username,
    email,
    password_hash: await bcrypt.hash(password, 12),
    role,
    created_at: new Date().toISOString(),
  };
};

// Mock users con diferentes passwords
export const getMockUsers = async (): Promise<AuthUser[]> => [
  await createMockUser(1, 'admin', 'admin@vetclinic.com', 'SecureAdmin123!', 'admin'),
  await createMockUser(2, 'dr.smith', 'dr.smith@vetclinic.com', 'VetPass456!', 'vet'),
  await createMockUser(3, 'assistant1', 'assistant@vetclinic.com', 'AssistantKey789!', 'assistant'),
];

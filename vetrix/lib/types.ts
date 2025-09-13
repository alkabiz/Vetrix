import { UserRole } from "./database";

// usr_users.interface.ts
export interface User {
  id: number;
  username: string;
  email: string;
  passwordHash: string;

  // Roles y permisos
  roleId: number;
  statusId: number;
  veterinarianId?: number | null;

  // Control de sesiones
  lastLogin?: string | null; // ISO datetime
  lastLoginIp?: string | null;
  currentSessionId?: string | null;
  failedLoginAttempts: number;
  lockedUntil?: string | null; // ISO datetime

  // Seguridad de contraseñas
  passwordChangedAt: string; // ISO datetime
  passwordExpiresAt?: string | null;
  mustChangePassword: boolean;
  passwordHistory?: string[] | null; // JSON array de hashes

  // Autenticación de dos factores
  twoFactorEnabled: boolean;
  twoFactorSecret?: string | null;
  backupCodes?: string[] | null; // JSON array de códigos
  twoFactorVerifiedAt?: string | null; // ISO datetime

  // Configuración de sesión
  sessionTimeoutMinutes: number;
  timezone: string;
  preferredLanguage: string; // 'es', 'en', etc.

  // Configuración de notificaciones
  emailNotifications: boolean;
  smsNotifications: boolean;
  notificationPreferences?: Record<string, any> | null; // JSON flexible

  // Información de activación
  isEmailVerified: boolean;
  emailVerificationToken?: string | null;
  emailVerifiedAt?: string | null; // ISO datetime

  // API y tokens
  apiAccessEnabled: boolean;
  apiKeyHash?: string | null;
  apiLastUsed?: string | null; // ISO datetime

  // Auditoría
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
}

// usr_user_profiles.interface.ts
export interface UserProfile {
  userId: number; // FK → usr_users.id

  // Información personal
  firstName: string;
  lastName: string;
  phone?: string | null;
  address?: string | null;
  dateOfBirth?: string | null; // formato YYYY-MM-DD
  profilePictureUrl?: string | null;
  bio?: string | null;

  // Preferencias de idioma y zona horaria
  preferredLanguage: string; // 'es', 'en', etc.
  timezone: string;

  // Notificaciones
  notificationPreferences?: Record<string, any> | null;

  // Auditoría
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
}

// usr_user_roles.interface.ts
export interface UserRole {
  userId: number; // FK → usr_users.id
  roleId: number; // FK → cat_roles.id
}

export interface AuthUser extends User {
  password_hash: string;
}

export interface AuthRequest {
  user: User;
}

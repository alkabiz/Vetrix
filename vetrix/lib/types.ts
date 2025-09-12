export interface User {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export interface AuthUser extends User {
  password_hash: string;
}

export interface AuthRequest {
  user: User;
}

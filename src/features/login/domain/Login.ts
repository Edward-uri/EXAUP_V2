export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthUser {
  id: string;
  nombre?: string;
  email?: string;
  // Roles de negocio devueltos por el backend (p.ej. "super_admin")
  roles?: string[];
}

export interface AuthResponse {
  user: AuthUser | null;
  message?: string;
}

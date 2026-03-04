export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthUser {
  id: string;
  nombre?: string;
  email?: string;
  roles?: string[];
}

export interface AuthResponse {
  user: AuthUser | null;
  message?: string;
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  email_verified: boolean;
  onboarding_completed_at: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface AuthResponse {
  user: User;
}

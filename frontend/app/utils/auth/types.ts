export type UserRole = "ADMIN" | "OWNER" | "MANAGER" | "STAFF";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organizationId: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  organizationName: string;
}
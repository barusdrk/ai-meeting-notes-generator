import api from "./api";

export interface User {
  id: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

interface AuthRequest {
  email: string;
  password: string;
}

export async function loginUser(
  email: string,
  password: string
): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>(
    "/auth/login",
    {
      email,
      password,
    } satisfies AuthRequest
  );

  return response.data;
}

export async function registerUser(
  email: string,
  password: string
): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>(
    "/auth/register",
    {
      email,
      password,
    } satisfies AuthRequest
  );

  return response.data;
}

export async function getCurrentUser(): Promise<User> {
  const response = await api.get<User>(
    "/auth/me"
  );

  return response.data;
}

export function setAuthToken(
  token: string
): void {
  api.defaults.headers.common.Authorization =
    `Bearer ${token}`;
}

export function removeAuthToken(): void {
  delete api.defaults.headers.common.Authorization;
}

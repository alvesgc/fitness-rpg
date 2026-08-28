import { apiFetch } from "./api";

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
}

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

interface RegisterResponse {
  id: string;
  name: string;
  email: string;
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  return apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function register(
  payload: RegisterPayload,
): Promise<RegisterResponse> {
  return apiFetch<RegisterResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

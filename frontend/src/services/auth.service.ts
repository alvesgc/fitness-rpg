import { apiFetch } from "./api";

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const response = await apiFetch<LoginResponse>("/auth/login", {
    method: "POST",

    body: JSON.stringify(payload),
  });

  localStorage.setItem("accessToken", response.accessToken);

  return response;
}

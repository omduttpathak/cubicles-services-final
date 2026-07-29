import api from "./axios"

export type AdminLoginRequest = {
  email: string
  password: string
}

export type AdminLoginResponse = {
  access_token: string
  token_type: string
}

export async function loginAdmin(
  credentials: AdminLoginRequest
): Promise<AdminLoginResponse> {
  const response = await api.post<AdminLoginResponse>(
    "/auth/login",
    credentials
  )

  return response.data
}

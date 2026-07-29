import api from "./axios"

export type AdminAboutValue = {
  id: number
  title: string
  description: string
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export type AboutValueRequest = {
  title: string
  description: string
  display_order: number
  is_active: boolean
}

export async function getAdminAboutValues(): Promise<AdminAboutValue[]> {
  const response = await api.get<AdminAboutValue[]>("/admin/about-values")

  return response.data
}

export async function createAdminAboutValue(
  data: AboutValueRequest
): Promise<AdminAboutValue> {
  const response = await api.post<AdminAboutValue>("/admin/about-values", data)

  return response.data
}

export async function updateAdminAboutValue(
  valueId: number,
  data: AboutValueRequest
): Promise<AdminAboutValue> {
  const response = await api.put<AdminAboutValue>(
    `/admin/about-values/${valueId}`,
    data
  )

  return response.data
}

export async function deleteAdminAboutValue(valueId: number): Promise<void> {
  await api.delete(`/admin/about-values/${valueId}`)
}

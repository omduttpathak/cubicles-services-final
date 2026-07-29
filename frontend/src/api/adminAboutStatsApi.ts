import api from "./axios"

export type AdminAboutStat = {
  id: number
  value: string
  label: string
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export type AboutStatRequest = {
  value: string
  label: string
  display_order: number
  is_active: boolean
}

export async function getAdminAboutStats(): Promise<AdminAboutStat[]> {
  const response = await api.get<AdminAboutStat[]>("/admin/about-stats")

  return response.data
}

export async function createAdminAboutStat(
  data: AboutStatRequest
): Promise<AdminAboutStat> {
  const response = await api.post<AdminAboutStat>("/admin/about-stats", data)

  return response.data
}

export async function updateAdminAboutStat(
  statId: number,
  data: AboutStatRequest
): Promise<AdminAboutStat> {
  const response = await api.put<AdminAboutStat>(
    `/admin/about-stats/${statId}`,
    data
  )

  return response.data
}

export async function deleteAdminAboutStat(statId: number): Promise<void> {
  await api.delete(`/admin/about-stats/${statId}`)
}

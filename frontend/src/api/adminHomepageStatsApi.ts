import api from "./axios"

export type AdminHomepageStat = {
  id: number
  value: string
  title: string
  display_order: number
  is_active: boolean
}

export type HomepageStatRequest = {
  value: string
  title: string
  display_order: number
  is_active: boolean
}

export async function getAdminHomepageStats(): Promise<AdminHomepageStat[]> {
  const response = await api.get<AdminHomepageStat[]>("/admin/homepage-stats")

  return response.data
}

export async function createAdminHomepageStat(
  data: HomepageStatRequest
): Promise<AdminHomepageStat> {
  const response = await api.post<AdminHomepageStat>(
    "/admin/homepage-stats",
    data
  )

  return response.data
}

export async function updateAdminHomepageStat(
  statId: number,
  data: HomepageStatRequest
): Promise<AdminHomepageStat> {
  const response = await api.put<AdminHomepageStat>(
    `/admin/homepage-stats/${statId}`,
    data
  )

  return response.data
}

export async function deleteAdminHomepageStat(statId: number): Promise<void> {
  await api.delete(`/admin/homepage-stats/${statId}`)
}

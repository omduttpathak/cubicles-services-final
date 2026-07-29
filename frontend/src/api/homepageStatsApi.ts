import api from "./axios"

export type HomepageStat = {
  id: number
  value: string
  title: string
  display_order: number
  is_active: boolean
}

export async function getHomepageStats(): Promise<HomepageStat[]> {
  const response = await api.get<HomepageStat[]>("/homepage-stats")

  return response.data
}

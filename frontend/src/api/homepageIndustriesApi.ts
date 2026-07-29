import api from "./axios"

export type HomepageIndustry = {
  id: number
  title: string
  description: string
  icon: string
  display_order: number
  is_active: boolean
}

export async function getHomepageIndustries(): Promise<HomepageIndustry[]> {
  const response = await api.get<HomepageIndustry[]>("/homepage-industries")

  return response.data
}

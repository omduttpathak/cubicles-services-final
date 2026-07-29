import api from "./axios"

export type HomepageBenefit = {
  id: number
  title: string
  description: string
  icon: string
  display_order: number
  is_active: boolean
}

export async function getHomepageBenefits(): Promise<HomepageBenefit[]> {
  const response = await api.get<HomepageBenefit[]>("/homepage-benefits")

  return response.data
}

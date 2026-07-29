import api from "./axios"

export type AdminHomepageIndustry = {
  id: number
  title: string
  description: string
  icon: string
  display_order: number
  is_active: boolean
}

export type HomepageIndustryRequest = {
  title: string
  description: string
  icon: string
  display_order: number
  is_active: boolean
}

export async function getAdminHomepageIndustries(): Promise<
  AdminHomepageIndustry[]
> {
  const response = await api.get<AdminHomepageIndustry[]>(
    "/admin/homepage-industries"
  )

  return response.data
}

export async function createAdminHomepageIndustry(
  data: HomepageIndustryRequest
): Promise<AdminHomepageIndustry> {
  const response = await api.post<AdminHomepageIndustry>(
    "/admin/homepage-industries",
    data
  )

  return response.data
}

export async function updateAdminHomepageIndustry(
  industryId: number,
  data: HomepageIndustryRequest
): Promise<AdminHomepageIndustry> {
  const response = await api.put<AdminHomepageIndustry>(
    `/admin/homepage-industries/${industryId}`,
    data
  )

  return response.data
}

export async function deleteAdminHomepageIndustry(
  industryId: number
): Promise<void> {
  await api.delete(`/admin/homepage-industries/${industryId}`)
}

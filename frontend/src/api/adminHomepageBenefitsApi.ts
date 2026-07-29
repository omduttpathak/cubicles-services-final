import api from "./axios"

export type AdminHomepageBenefit = {
  id: number
  title: string
  description: string
  icon: string
  display_order: number
  is_active: boolean
}

export type HomepageBenefitRequest = {
  title: string
  description: string
  icon: string
  display_order: number
  is_active: boolean
}

export async function getAdminHomepageBenefits(): Promise<
  AdminHomepageBenefit[]
> {
  const response = await api.get<AdminHomepageBenefit[]>(
    "/admin/homepage-benefits"
  )

  return response.data
}

export async function createAdminHomepageBenefit(
  data: HomepageBenefitRequest
): Promise<AdminHomepageBenefit> {
  const response = await api.post<AdminHomepageBenefit>(
    "/admin/homepage-benefits",
    data
  )

  return response.data
}

export async function updateAdminHomepageBenefit(
  benefitId: number,
  data: HomepageBenefitRequest
): Promise<AdminHomepageBenefit> {
  const response = await api.put<AdminHomepageBenefit>(
    `/admin/homepage-benefits/${benefitId}`,
    data
  )

  return response.data
}

export async function deleteAdminHomepageBenefit(
  benefitId: number
): Promise<void> {
  await api.delete(`/admin/homepage-benefits/${benefitId}`)
}

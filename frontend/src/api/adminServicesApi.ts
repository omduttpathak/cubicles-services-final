import api from "./axios"

export type AdminService = {
  id: number
  title: string
  slug: string
  icon: string
  short_description: string
  description: string
  highlights: string[]
  hero_title: string
  hero_description: string
  seo_title: string
  seo_description: string
}

export type CreateAdminServiceRequest = {
  title: string
  slug: string
  icon: string
  short_description: string
  description: string
  highlights: string[]
  hero_title: string
  hero_description: string
  seo_title: string
  seo_description: string
}

export async function getAdminServices(): Promise<AdminService[]> {
  const response = await api.get<AdminService[]>("/admin/services")

  return response.data
}

export async function createAdminService(
  data: CreateAdminServiceRequest
): Promise<AdminService> {
  const response = await api.post<AdminService>("/admin/services", data)

  return response.data
}

export type UpdateAdminServiceRequest = {
  title: string
  slug: string
  icon: string
  short_description: string
  description: string
  highlights: string[]
  hero_title: string
  hero_description: string
  seo_title: string
  seo_description: string
}

export async function getAdminServiceById(
  serviceId: number
): Promise<AdminService> {
  const response = await api.get<AdminService>(`/admin/services/${serviceId}`)

  return response.data
}

export async function updateAdminService(
  serviceId: number,
  data: UpdateAdminServiceRequest
): Promise<AdminService> {
  const response = await api.put<AdminService>(
    `/admin/services/${serviceId}`,
    data
  )

  return response.data
}

export async function deleteAdminService(serviceId: number): Promise<void> {
  await api.delete(`/admin/services/${serviceId}`)
}

import api from "./axios"

export type AdminTechnology = {
  id: number
  name: string
  slug: string
  category: string
  icon: string
  logo_url: string | null
  description: string
  display_order: number
  is_featured: boolean
  is_active: boolean
  seo_title: string
  seo_description: string
  created_at: string
  updated_at: string
}

export type CreateAdminTechnologyRequest = {
  name: string
  slug: string
  category: string
  icon: string
  logo_url: string | null
  description: string
  display_order: number
  is_featured: boolean
  is_active: boolean
  seo_title: string
  seo_description: string
}

export type UpdateAdminTechnologyRequest = CreateAdminTechnologyRequest

export async function getAdminTechnologies(): Promise<AdminTechnology[]> {
  const response = await api.get<AdminTechnology[]>("/admin/technologies")

  return response.data
}

export async function createAdminTechnology(
  data: CreateAdminTechnologyRequest
): Promise<AdminTechnology> {
  const response = await api.post<AdminTechnology>("/admin/technologies", data)

  return response.data
}

export async function getAdminTechnologyById(
  technologyId: number
): Promise<AdminTechnology> {
  const response = await api.get<AdminTechnology>(
    `/admin/technologies/${technologyId}`
  )

  return response.data
}

export async function updateAdminTechnology(
  technologyId: number,
  data: UpdateAdminTechnologyRequest
): Promise<AdminTechnology> {
  const response = await api.put<AdminTechnology>(
    `/admin/technologies/${technologyId}`,
    data
  )

  return response.data
}

export async function deleteAdminTechnology(
  technologyId: number
): Promise<void> {
  await api.delete(`/admin/technologies/${technologyId}`)
}

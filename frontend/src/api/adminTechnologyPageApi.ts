import api from "./axios"

export type AdminTechnologyPage = {
  id: number

  hero_badge: string
  hero_title: string
  hero_description: string

  featured_eyebrow: string
  featured_title: string
  featured_description: string

  categories_eyebrow: string
  categories_title: string
  categories_description: string

  empty_title: string
  empty_description: string

  seo_title: string
  seo_description: string

  show_hero: boolean
  show_featured: boolean
  show_categories: boolean
  is_active: boolean
}

export type UpdateAdminTechnologyPageRequest = Omit<AdminTechnologyPage, "id">

export async function getAdminTechnologyPage(): Promise<AdminTechnologyPage> {
  const response = await api.get<AdminTechnologyPage>("/admin/technology-page")

  return response.data
}

export async function updateAdminTechnologyPage(
  data: UpdateAdminTechnologyPageRequest
): Promise<AdminTechnologyPage> {
  const response = await api.put<AdminTechnologyPage>(
    "/admin/technology-page",
    data
  )

  return response.data
}

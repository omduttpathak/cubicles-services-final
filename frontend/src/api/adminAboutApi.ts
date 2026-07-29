import api from "./axios"

export type AdminAboutPage = {
  id: number
  hero_badge: string
  hero_title: string
  hero_description: string
  overview_eyebrow: string
  overview_title: string
  overview_description_one: string
  overview_description_two: string
  values_eyebrow: string
  values_title: string
  values_description: string
  seo_title: string
  seo_description: string
  show_hero: boolean
  show_overview: boolean
  show_values: boolean
  is_active: boolean
}

export type UpdateAdminAboutPageRequest = Omit<AdminAboutPage, "id">

export async function getAdminAboutPage(): Promise<AdminAboutPage> {
  const response = await api.get<AdminAboutPage>("/admin/about")

  return response.data
}

export async function updateAdminAboutPage(
  data: UpdateAdminAboutPageRequest
): Promise<AdminAboutPage> {
  const response = await api.put<AdminAboutPage>("/admin/about", data)

  return response.data
}

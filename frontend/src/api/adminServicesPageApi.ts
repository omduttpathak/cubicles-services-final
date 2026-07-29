import api from "./axios"

export type AdminServicesPage = {
  id: number

  hero_badge: string
  hero_title: string
  hero_highlight: string
  hero_description: string

  primary_button_text: string
  primary_button_url: string
  secondary_button_text: string
  secondary_button_url: string

  hero_feature_one: string
  hero_feature_two: string
  hero_feature_three: string
  hero_feature_four: string

  services_eyebrow: string
  services_title: string
  services_description: string
  services_empty_title: string
  services_empty_description: string
  service_button_text: string

  benefits_badge: string
  benefits_title: string
  benefits_description: string

  process_eyebrow: string
  process_title: string
  process_description: string

  industries_eyebrow: string
  industries_title: string
  industries_description: string

  cta_title: string
  cta_description: string
  cta_primary_button_text: string
  cta_primary_button_url: string
  cta_secondary_button_text: string
  cta_secondary_button_url: string

  seo_title: string
  seo_description: string

  show_hero: boolean
  show_services: boolean
  show_benefits: boolean
  show_process: boolean
  show_stats: boolean
  show_industries: boolean
  show_cta: boolean
  is_active: boolean
}

export type UpdateAdminServicesPageRequest = Omit<AdminServicesPage, "id">

export async function getAdminServicesPage(): Promise<AdminServicesPage> {
  const response = await api.get<AdminServicesPage>("/admin/services-page")

  return response.data
}

export async function updateAdminServicesPage(
  data: UpdateAdminServicesPageRequest
): Promise<AdminServicesPage> {
  const response = await api.put<AdminServicesPage>(
    "/admin/services-page",
    data
  )

  return response.data
}

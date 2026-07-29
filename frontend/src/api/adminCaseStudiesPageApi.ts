import api from "./axios"

export type AdminCaseStudiesPage = {
  id: number

  hero_eyebrow: string
  hero_title: string
  hero_description: string

  search_placeholder: string
  all_industries_label: string
  clear_filters_text: string

  empty_title: string
  empty_description: string
  filtered_empty_description: string

  results_heading: string
  view_button_text: string

  seo_title: string
  seo_description: string

  show_hero: boolean
  show_filters: boolean
  show_case_studies: boolean
  show_results: boolean
  show_technologies: boolean
  is_active: boolean
}

export type UpdateAdminCaseStudiesPageRequest = Omit<AdminCaseStudiesPage, "id">

export async function getAdminCaseStudiesPage(): Promise<AdminCaseStudiesPage> {
  const response = await api.get<AdminCaseStudiesPage>(
    "/admin/case-studies-page"
  )

  return response.data
}

export async function updateAdminCaseStudiesPage(
  data: UpdateAdminCaseStudiesPageRequest
): Promise<AdminCaseStudiesPage> {
  const response = await api.put<AdminCaseStudiesPage>(
    "/admin/case-studies-page",
    data
  )

  return response.data
}

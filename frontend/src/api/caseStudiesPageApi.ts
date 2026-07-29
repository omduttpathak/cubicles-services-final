import api from "./axios"

export type CaseStudiesPageSettings = {
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

export async function getCaseStudiesPageSettings(): Promise<CaseStudiesPageSettings> {
  const response = await api.get<CaseStudiesPageSettings>("/case-studies-page")

  return response.data
}

import api from "./axios"

export type HomepageSection =
  | "hero"
  | "services"
  | "technologies"
  | "benefits"
  | "industries"
  | "case_studies"
  | "testimonials"
  | "stats"
  | "faq"
  | "cta"

export type HomepageSettings = {
  id: number
  hero_badge: string
  hero_title: string
  hero_description: string
  primary_button_text: string
  primary_button_url: string
  secondary_button_text: string
  secondary_button_url: string
  cta_title: string
  cta_description: string
  cta_button_text: string
  cta_button_url: string
  seo_title: string
  seo_description: string
  is_active: boolean
  show_hero: boolean
  services_title: string
  services_description: string
  show_services: boolean
  technologies_title: string
  technologies_description: string
  show_technologies: boolean
  benefits_title: string
  benefits_description: string
  show_benefits: boolean
  industries_title: string
  industries_description: string
  show_industries: boolean
  case_studies_title: string
  case_studies_description: string
  show_case_studies: boolean
  testimonials_title: string
  testimonials_description: string
  show_testimonials: boolean
  stats_title: string
  stats_description: string
  show_stats: boolean
  faq_title: string
  faq_description: string
  show_faq: boolean
  show_cta: boolean
  section_order: HomepageSection[]
}

export async function getHomepageSettings(): Promise<HomepageSettings> {
  const response = await api.get<HomepageSettings>("/homepage")

  return response.data
}

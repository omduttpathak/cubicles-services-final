import api from "./axios"

export type TechnologyPageSettings = {
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

export async function getTechnologyPageSettings(): Promise<TechnologyPageSettings> {
  const response = await api.get<TechnologyPageSettings>("/technology-page")

  return response.data
}

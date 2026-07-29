import api from "./axios"

export type AboutPageSettings = {
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

export type AboutStat = {
  id: number
  value: string
  label: string
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export type AboutValue = {
  id: number
  title: string
  description: string
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export async function getAboutPage(): Promise<AboutPageSettings> {
  const response = await api.get<AboutPageSettings>("/about")

  return response.data
}

export async function getAboutStats(): Promise<AboutStat[]> {
  const response = await api.get<AboutStat[]>("/about/stats")

  return response.data
}

export async function getAboutValues(): Promise<AboutValue[]> {
  const response = await api.get<AboutValue[]>("/about/values")

  return response.data
}

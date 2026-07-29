import api from "./axios"

export type TechnologyApiResponse = {
  id: number
  name: string
  slug: string
  category: string
  icon: string
  logo_url: string | null
  description: string
  display_order: number
  is_featured: boolean
}

export type TechnologyDetailsApiResponse = TechnologyApiResponse & {
  seo_title: string
  seo_description: string
}

export async function getTechnologies(): Promise<TechnologyApiResponse[]> {
  const response = await api.get<TechnologyApiResponse[]>("/technologies")

  return response.data
}

export async function getTechnologyBySlug(
  slug: string
): Promise<TechnologyDetailsApiResponse> {
  const response = await api.get<TechnologyDetailsApiResponse>(
    `/technologies/${encodeURIComponent(slug)}`
  )

  return response.data
}

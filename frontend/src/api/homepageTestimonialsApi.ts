import api from "./axios"

export type HomepageTestimonial = {
  id: number
  name: string
  designation: string
  content: string
  display_order: number
  is_active: boolean
}

export async function getHomepageTestimonials(): Promise<
  HomepageTestimonial[]
> {
  const response = await api.get<HomepageTestimonial[]>(
    "/homepage-testimonials"
  )

  return response.data
}

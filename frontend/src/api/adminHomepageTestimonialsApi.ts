import api from "./axios"

export type AdminHomepageTestimonial = {
  id: number
  name: string
  designation: string
  content: string
  display_order: number
  is_active: boolean
}

export type HomepageTestimonialRequest = {
  name: string
  designation: string
  content: string
  display_order: number
  is_active: boolean
}

export async function getAdminHomepageTestimonials(): Promise<
  AdminHomepageTestimonial[]
> {
  const response = await api.get<AdminHomepageTestimonial[]>(
    "/admin/homepage-testimonials"
  )

  return response.data
}

export async function createAdminHomepageTestimonial(
  data: HomepageTestimonialRequest
): Promise<AdminHomepageTestimonial> {
  const response = await api.post<AdminHomepageTestimonial>(
    "/admin/homepage-testimonials",
    data
  )

  return response.data
}

export async function updateAdminHomepageTestimonial(
  testimonialId: number,
  data: HomepageTestimonialRequest
): Promise<AdminHomepageTestimonial> {
  const response = await api.put<AdminHomepageTestimonial>(
    `/admin/homepage-testimonials/${testimonialId}`,
    data
  )

  return response.data
}

export async function deleteAdminHomepageTestimonial(
  testimonialId: number
): Promise<void> {
  await api.delete(`/admin/homepage-testimonials/${testimonialId}`)
}

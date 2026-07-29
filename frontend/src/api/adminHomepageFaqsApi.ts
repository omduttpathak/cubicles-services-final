import api from "./axios"

export type AdminHomepageFaq = {
  id: number
  question: string
  answer: string
  display_order: number
  is_active: boolean
}

export type HomepageFaqRequest = {
  question: string
  answer: string
  display_order: number
  is_active: boolean
}

export async function getAdminHomepageFaqs(): Promise<AdminHomepageFaq[]> {
  const response = await api.get<AdminHomepageFaq[]>("/admin/homepage-faqs")

  return response.data
}

export async function createAdminHomepageFaq(
  data: HomepageFaqRequest
): Promise<AdminHomepageFaq> {
  const response = await api.post<AdminHomepageFaq>(
    "/admin/homepage-faqs",
    data
  )

  return response.data
}

export async function updateAdminHomepageFaq(
  faqId: number,
  data: HomepageFaqRequest
): Promise<AdminHomepageFaq> {
  const response = await api.put<AdminHomepageFaq>(
    `/admin/homepage-faqs/${faqId}`,
    data
  )

  return response.data
}

export async function deleteAdminHomepageFaq(faqId: number): Promise<void> {
  await api.delete(`/admin/homepage-faqs/${faqId}`)
}

import api from "./axios"

export type HomepageFaq = {
  id: number
  question: string
  answer: string
  display_order: number
  is_active: boolean
}

export async function getHomepageFaqs(): Promise<HomepageFaq[]> {
  const response = await api.get<HomepageFaq[]>("/homepage-faqs")

  return response.data
}

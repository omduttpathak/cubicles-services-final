import api from "./axios"

export type AdminBlogPage = {
  id: number

  hero_eyebrow: string
  hero_title: string
  hero_description: string

  search_placeholder: string
  all_categories_label: string
  clear_filters_text: string

  empty_title: string
  empty_description: string
  filtered_empty_description: string

  read_button_text: string
  author_prefix: string

  seo_title: string
  seo_description: string

  show_hero: boolean
  show_filters: boolean
  show_articles: boolean
  show_author: boolean
  show_date: boolean
  is_active: boolean
}

export type UpdateAdminBlogPageRequest = Omit<AdminBlogPage, "id">

export async function getAdminBlogPage(): Promise<AdminBlogPage> {
  const response = await api.get<AdminBlogPage>("/admin/blog-page")

  return response.data
}

export async function updateAdminBlogPage(
  data: UpdateAdminBlogPageRequest
): Promise<AdminBlogPage> {
  const response = await api.put<AdminBlogPage>("/admin/blog-page", data)

  return response.data
}

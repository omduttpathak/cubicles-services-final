import api from "./axios"

export type AdminBlog = {
  id: number
  title: string
  slug: string
  category: string
  excerpt: string
  content: string
  author: string
  image_url: string | null
  seo_title: string
  seo_description: string
  is_published: boolean
  published_at: string
  created_at: string
  updated_at: string
}

export type CreateAdminBlogRequest = {
  title: string
  slug: string
  category: string
  excerpt: string
  content: string
  author: string
  image_url: string | null
  seo_title: string
  seo_description: string
  is_published: boolean
  published_at: string | null
}

export async function getAdminBlogs(): Promise<AdminBlog[]> {
  const response = await api.get<AdminBlog[]>("/admin/blogs")

  return response.data
}

export async function createAdminBlog(
  data: CreateAdminBlogRequest
): Promise<AdminBlog> {
  const response = await api.post<AdminBlog>("/admin/blogs", data)

  return response.data
}

export type UpdateAdminBlogRequest = {
  title: string
  slug: string
  category: string
  excerpt: string
  content: string
  author: string
  image_url: string | null
  seo_title: string
  seo_description: string
}

export async function getAdminBlogById(blogId: number): Promise<AdminBlog> {
  const response = await api.get<AdminBlog>(`/admin/blogs/${blogId}`)

  return response.data
}

export async function updateAdminBlog(
  blogId: number,
  data: UpdateAdminBlogRequest
): Promise<AdminBlog> {
  const response = await api.put<AdminBlog>(`/admin/blogs/${blogId}`, data)

  return response.data
}

export async function updateAdminBlogPublishStatus(
  blogId: number,
  isPublished: boolean
): Promise<AdminBlog> {
  const response = await api.patch<AdminBlog>(
    `/admin/blogs/${blogId}/publish-status`,
    {
      is_published: isPublished,
    }
  )

  return response.data
}

export async function deleteAdminBlog(blogId: number): Promise<void> {
  await api.delete(`/admin/blogs/${blogId}`)
}

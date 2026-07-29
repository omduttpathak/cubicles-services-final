import api from "./axios"

export type BlogApiResponse = {
  id: number
  title: string
  slug: string
  category: string
  excerpt: string
  author: string
  image_url: string | null
  published_at: string
}

export type BlogDetailsApiResponse = BlogApiResponse & {
  content: string
  seo_title: string
  seo_description: string
}

export type Blog = {
  id: number
  title: string
  slug: string
  category: string
  excerpt: string
  author: string
  imageUrl: string | null
  publishedAt: string
}

export type BlogDetails = Blog & {
  content: string
  seoTitle: string
  seoDescription: string
}

function mapBlog(blog: BlogApiResponse): Blog {
  return {
    id: blog.id,
    title: blog.title,
    slug: blog.slug,
    category: blog.category,
    excerpt: blog.excerpt,
    author: blog.author,
    imageUrl: blog.image_url,
    publishedAt: blog.published_at,
  }
}

function mapBlogDetails(blog: BlogDetailsApiResponse): BlogDetails {
  return {
    ...mapBlog(blog),
    content: blog.content,
    seoTitle: blog.seo_title,
    seoDescription: blog.seo_description,
  }
}

export async function getBlogs(): Promise<Blog[]> {
  const response = await api.get<BlogApiResponse[]>("/blogs")

  return response.data.map(mapBlog)
}

export async function getBlogBySlug(slug: string): Promise<BlogDetails> {
  const response = await api.get<BlogDetailsApiResponse>(`/blogs/${slug}`)

  return mapBlogDetails(response.data)
}

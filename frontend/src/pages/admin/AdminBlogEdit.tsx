import ImageUploader from "@/components/admin/ImageUploader"
import RichTextEditor from "@/components/admin/RichTextEditor"
import { useEffect, useState } from "react"
import axios from "axios"
import { ArrowLeft, Save } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"

import {
  getAdminBlogById,
  updateAdminBlog,
  type UpdateAdminBlogRequest,
} from "@/api/adminBlogsApi"
import ErrorState from "@/components/common/ErrorState"
import PageLoader from "@/components/common/PageLoader"
import SEO from "@/components/seo/SEO"

function createSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

export default function AdminBlogEdit() {
  const { blogId } = useParams<{ blogId: string }>()
  const navigate = useNavigate()

  const [formData, setFormData] = useState<UpdateAdminBlogRequest>({
    title: "",
    slug: "",
    category: "",
    excerpt: "",
    content: "",
    author: "",
    image_url: null,
    seo_title: "",
    seo_description: "",
  })

  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasError, setHasError] = useState(false)

  const parsedBlogId = Number(blogId)

  function updateField<Key extends keyof UpdateAdminBlogRequest>(
    field: Key,
    value: UpdateAdminBlogRequest[Key]
  ) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }))
  }

  async function loadBlog() {
    if (!Number.isInteger(parsedBlogId)) {
      setHasError(true)
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setHasError(false)

      const blog = await getAdminBlogById(parsedBlogId)

      setFormData({
        title: blog.title,
        slug: blog.slug,
        category: blog.category,
        excerpt: blog.excerpt,
        content: blog.content,
        author: blog.author,
        image_url: blog.image_url,
        seo_title: blog.seo_title,
        seo_description: blog.seo_description,
      })
    } catch (error) {
      console.error(error)
      setHasError(true)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSubmit() {
    if (
      !formData.title.trim() ||
      !formData.slug.trim() ||
      !formData.category.trim() ||
      !formData.excerpt.trim() ||
      !formData.content.trim() ||
      !formData.author.trim() ||
      !formData.seo_title.trim() ||
      !formData.seo_description.trim()
    ) {
      toast.error("Please complete all required fields.")
      return
    }

    try {
      setIsSubmitting(true)

      await updateAdminBlog(parsedBlogId, {
        ...formData,
        image_url: formData.image_url?.trim() || null,
      })

      toast.success("Blog updated successfully.")
      navigate("/admin/blogs")
    } catch (error) {
      console.error(error)

      if (axios.isAxiosError(error)) {
        const detail = error.response?.data?.detail

        toast.error(
          typeof detail === "string" ? detail : "Unable to update the blog."
        )
      } else {
        toast.error("Unable to update the blog.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    void loadBlog()
  }, [blogId])

  if (isLoading) {
    return <PageLoader message="Loading blog..." />
  }

  if (hasError) {
    return (
      <ErrorState
        title="Unable to Load Blog"
        message="The blog could not be loaded."
        onRetry={() => {
          void loadBlog()
        }}
      />
    )
  }

  return (
    <>
      <SEO
        title="Edit Blog | Cubicles Services Admin"
        description="Edit an existing Cubicles Services article."
      />

      <section>
        <div className="flex flex-col gap-4 rounded-xl bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <button
              type="button"
              onClick={() => navigate("/admin/blogs")}
              className="inline-flex items-center text-sm font-semibold text-blue-600 transition hover:text-blue-700"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blogs
            </button>

            <h1 className="mt-3 text-2xl font-bold text-slate-900">
              Edit Blog
            </h1>

            <p className="mt-1 text-sm text-slate-600">
              Update article content and metadata.
            </p>
          </div>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => {
              void handleSubmit()
            }}
            className="inline-flex items-center rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save className="mr-2 h-4 w-4" />
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">
                Article Content
              </h2>

              <div className="mt-6 space-y-5">
                <div>
                  <label
                    htmlFor="blog-title"
                    className="mb-2 block font-medium text-slate-700"
                  >
                    Title *
                  </label>

                  <input
                    id="blog-title"
                    type="text"
                    value={formData.title}
                    onChange={(event) =>
                      updateField("title", event.target.value)
                    }
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 transition outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="blog-slug"
                    className="mb-2 block font-medium text-slate-700"
                  >
                    Slug *
                  </label>

                  <input
                    id="blog-slug"
                    type="text"
                    value={formData.slug}
                    onChange={(event) =>
                      updateField("slug", createSlug(event.target.value))
                    }
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 font-mono text-sm transition outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="blog-excerpt"
                    className="mb-2 block font-medium text-slate-700"
                  >
                    Excerpt *
                  </label>

                  <textarea
                    id="blog-excerpt"
                    rows={4}
                    maxLength={500}
                    value={formData.excerpt}
                    onChange={(event) =>
                      updateField("excerpt", event.target.value)
                    }
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 transition outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-medium text-slate-700">
                    Content *
                  </label>

                  <RichTextEditor
                    value={formData.content}
                    onChange={(value) => updateField("content", value)}
                    placeholder="Write the article content..."
                    disabled={isSubmitting}
                  />

                  <p className="mt-2 text-sm text-slate-500">
                    Use headings, lists, quotes and formatting to structure the
                    article.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">
                Search Engine Optimization
              </h2>

              <div className="mt-6 space-y-5">
                <div>
                  <label
                    htmlFor="seo-title"
                    className="mb-2 block font-medium text-slate-700"
                  >
                    SEO Title *
                  </label>

                  <input
                    id="seo-title"
                    type="text"
                    maxLength={255}
                    value={formData.seo_title}
                    onChange={(event) =>
                      updateField("seo_title", event.target.value)
                    }
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 transition outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="seo-description"
                    className="mb-2 block font-medium text-slate-700"
                  >
                    SEO Description *
                  </label>

                  <textarea
                    id="seo-description"
                    rows={4}
                    maxLength={500}
                    value={formData.seo_description}
                    onChange={(event) =>
                      updateField("seo_description", event.target.value)
                    }
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 transition outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">
                Article Settings
              </h2>

              <div className="mt-6 space-y-5">
                <div>
                  <label
                    htmlFor="blog-category"
                    className="mb-2 block font-medium text-slate-700"
                  >
                    Category *
                  </label>

                  <input
                    id="blog-category"
                    type="text"
                    value={formData.category}
                    onChange={(event) =>
                      updateField("category", event.target.value)
                    }
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 transition outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="blog-author"
                    className="mb-2 block font-medium text-slate-700"
                  >
                    Author *
                  </label>

                  <input
                    id="blog-author"
                    type="text"
                    value={formData.author}
                    onChange={(event) =>
                      updateField("author", event.target.value)
                    }
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 transition outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <ImageUploader
                  label="Featured Image"
                  value={formData.image_url}
                  onChange={(value) => updateField("image_url", value)}
                  accept=".png,.jpg,.jpeg,.webp"
                  helpText="Upload the blog featured image."
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}

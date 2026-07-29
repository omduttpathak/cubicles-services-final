import ImageUploader from "@/components/admin/ImageUploader"
import RichTextEditor from "@/components/admin/RichTextEditor"
import { useState } from "react"
import axios from "axios"
import { ArrowLeft, Save, Send } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

import {
  createAdminBlog,
  type CreateAdminBlogRequest,
} from "@/api/adminBlogsApi"
import SEO from "@/components/seo/SEO"

function createSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

export default function AdminBlogCreate() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState<CreateAdminBlogRequest>({
    title: "",
    slug: "",
    category: "",
    excerpt: "",
    content: "",
    author: "Cubicles Services",
    image_url: null,
    seo_title: "",
    seo_description: "",
    is_published: false,
    published_at: null,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  function updateField<Key extends keyof CreateAdminBlogRequest>(
    field: Key,
    value: CreateAdminBlogRequest[Key]
  ) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }))
  }

  function handleTitleChange(value: string) {
    setFormData((current) => ({
      ...current,
      title: value,
      slug: createSlug(value),
      seo_title:
        current.seo_title === "" || current.seo_title === current.title
          ? value
          : current.seo_title,
    }))
  }

  async function submitBlog(publishImmediately: boolean) {
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

      await createAdminBlog({
        ...formData,
        image_url: formData.image_url?.trim() || null,
        is_published: publishImmediately,
        published_at: publishImmediately ? new Date().toISOString() : null,
      })

      toast.success(
        publishImmediately
          ? "Blog published successfully."
          : "Blog saved as draft."
      )

      navigate("/admin/blogs")
    } catch (error) {
      console.error(error)

      if (axios.isAxiosError(error)) {
        const detail = error.response?.data?.detail

        toast.error(
          typeof detail === "string" ? detail : "Unable to create the blog."
        )
      } else {
        toast.error("Unable to create the blog.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <SEO
        title="Create Blog | Cubicles Services Admin"
        description="Create a new Cubicles Services article."
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
              Create Blog
            </h1>

            <p className="mt-1 text-sm text-slate-600">
              Create a draft or publish a new article.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => {
                void submitBlog(false)
              }}
              className="inline-flex items-center rounded-lg border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save className="mr-2 h-4 w-4" />
              Save Draft
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => {
                void submitBlog(true)
              }}
              className="inline-flex items-center rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send className="mr-2 h-4 w-4" />
              {isSubmitting ? "Saving..." : "Publish"}
            </button>
          </div>
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
                    onChange={(event) => handleTitleChange(event.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 transition outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    placeholder="Enter article title"
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
                    placeholder="article-url-slug"
                  />

                  <p className="mt-2 text-sm text-slate-500">
                    Public URL: /blogs/
                    {formData.slug || "article-slug"}
                  </p>
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
                    value={formData.excerpt}
                    onChange={(event) =>
                      updateField("excerpt", event.target.value)
                    }
                    maxLength={500}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 transition outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    placeholder="Short summary shown on the blogs page"
                  />

                  <p className="mt-1 text-right text-xs text-slate-500">
                    {formData.excerpt.length}/500
                  </p>
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
                    value={formData.seo_title}
                    onChange={(event) =>
                      updateField("seo_title", event.target.value)
                    }
                    maxLength={255}
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
                    value={formData.seo_description}
                    onChange={(event) =>
                      updateField("seo_description", event.target.value)
                    }
                    maxLength={500}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 transition outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    placeholder="Description used by search engines"
                  />

                  <p className="mt-1 text-right text-xs text-slate-500">
                    {formData.seo_description.length}/500
                  </p>
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
                    placeholder="Cloud, DevOps, Security..."
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

            <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
              <h2 className="font-bold text-slate-900">Publishing</h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Save Draft keeps the article private. Publish makes it
                immediately available on the public Blogs page.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}

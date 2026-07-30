import { useEffect, useMemo, useState, type ReactNode } from "react"
import axios from "axios"
import {
  BookOpen,
  CheckCircle2,
  FileText,
  ImageIcon,
  Link2,
  Save,
  Search,
  Settings2,
  Sparkles,
  UserRound,
} from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"

import {
  getAdminBlogById,
  updateAdminBlog,
  type UpdateAdminBlogRequest,
} from "@/api/adminBlogsApi"
import AdminFormPageHeader from "@/components/admin/forms/AdminFormPageHeader"
import CharacterCount from "@/components/admin/forms/CharacterCount"
import FormCard from "@/components/admin/forms/FormCard"
import FormField from "@/components/admin/forms/FormField"
import ImageUploader from "@/components/admin/ImageUploader"
import RichTextEditor from "@/components/admin/RichTextEditor"
import ErrorState from "@/components/common/ErrorState"
import PageLoader from "@/components/common/PageLoader"
import SEO from "@/components/seo/SEO"

const initialFormData: UpdateAdminBlogRequest = {
  title: "",
  slug: "",
  category: "",
  excerpt: "",
  content: "",
  author: "",
  image_url: null,
  seo_title: "",
  seo_description: "",
}

const requiredFields: Array<keyof UpdateAdminBlogRequest> = [
  "title",
  "slug",
  "category",
  "excerpt",
  "content",
  "author",
  "seo_title",
  "seo_description",
]

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

  const [formData, setFormData] =
    useState<UpdateAdminBlogRequest>(initialFormData)
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
    if (!Number.isInteger(parsedBlogId) || parsedBlogId <= 0) {
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
    const hasMissingField = requiredFields.some((field) => {
      const value = formData[field]
      return typeof value === "string" && !value.trim()
    })

    if (hasMissingField) {
      toast.error("Please complete all required fields.")
      return
    }

    if (!Number.isInteger(parsedBlogId) || parsedBlogId <= 0) {
      toast.error("The blog identifier is invalid.")
      return
    }

    try {
      setIsSubmitting(true)

      await updateAdminBlog(parsedBlogId, {
        ...formData,
        title: formData.title.trim(),
        slug: formData.slug.trim(),
        category: formData.category.trim(),
        excerpt: formData.excerpt.trim(),
        content: formData.content.trim(),
        author: formData.author.trim(),
        image_url: formData.image_url?.trim() || null,
        seo_title: formData.seo_title.trim(),
        seo_description: formData.seo_description.trim(),
      })

      toast.success("Blog updated successfully.")
      navigate("/admin/blogs")
    } catch (error) {
      console.error(error)

      if (axios.isAxiosError(error)) {
        const detail = error.response?.data?.detail

        if (typeof detail === "string") {
          toast.error(detail)
        } else if (Array.isArray(detail) && detail.length > 0) {
          const message = detail
            .map((item) => {
              const field = Array.isArray(item?.loc)
                ? item.loc.filter((part: unknown) => part !== "body").join(".")
                : "field"

              return `${field}: ${item?.msg || "Please check this value."}`
            })
            .join(" | ")

          toast.error(message)
        } else {
          toast.error("Unable to update the blog.")
        }
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

  const completedFields = useMemo(
    () =>
      requiredFields.filter((field) => {
        const value = formData[field]
        return typeof value === "string" && Boolean(value.trim())
      }).length,
    [formData]
  )

  const completionPercentage = Math.round(
    (completedFields / requiredFields.length) * 100
  )

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

      <div className="space-y-6">
        <AdminFormPageHeader
          eyebrow="Blog management"
          title="Edit Blog"
          description="Update the article content, featured media, author information, and search metadata."
          backLabel="Back to Blogs"
          onBack={() => navigate("/admin/blogs")}
          submitLabel="Save Changes"
          submittingLabel="Saving..."
          isSubmitting={isSubmitting}
          onSubmit={() => {
            void handleSubmit()
          }}
        />

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            <SectionCard
              icon={<BookOpen className="size-5" />}
              title="Article content"
              description="Edit the article title, URL, summary, and full body content."
            >
              <FormField id="blog-title" label="Title" required>
                <input
                  id="blog-title"
                  type="text"
                  value={formData.title}
                  onChange={(event) => updateField("title", event.target.value)}
                  placeholder="Enter article title"
                  className={inputClassName}
                  disabled={isSubmitting}
                />
              </FormField>

              <FormField
                id="blog-slug"
                label="Slug"
                description={`Public URL: /blogs/${formData.slug || "article-slug"}`}
                required
              >
                <div className="relative">
                  <Link2 className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-slate-400" />

                  <input
                    id="blog-slug"
                    type="text"
                    value={formData.slug}
                    onChange={(event) =>
                      updateField("slug", createSlug(event.target.value))
                    }
                    placeholder="article-url-slug"
                    className={`${inputClassName} pl-11 font-mono text-sm`}
                    disabled={isSubmitting}
                  />
                </div>
              </FormField>

              <FormField id="blog-excerpt" label="Excerpt" required>
                <textarea
                  id="blog-excerpt"
                  rows={5}
                  value={formData.excerpt}
                  onChange={(event) =>
                    updateField("excerpt", event.target.value)
                  }
                  maxLength={500}
                  placeholder="Short summary shown on the Blogs page"
                  className={`${inputClassName} leading-7`}
                  disabled={isSubmitting}
                />
              </FormField>

              <CharacterCount current={formData.excerpt.length} maximum={500} />

              <FormField
                id="blog-content"
                label="Content"
                description="Use headings, lists, quotes, and formatting to structure the article."
                required
              >
                <RichTextEditor
                  value={formData.content}
                  onChange={(value) => updateField("content", value)}
                  placeholder="Write the article content..."
                  disabled={isSubmitting}
                />
              </FormField>
            </SectionCard>

            <SectionCard
              icon={<Search className="size-5" />}
              title="Search engine optimization"
              description="Control how the article appears in search results and social previews."
            >
              <FormField id="seo-title" label="SEO Title" required>
                <input
                  id="seo-title"
                  type="text"
                  value={formData.seo_title}
                  onChange={(event) =>
                    updateField("seo_title", event.target.value)
                  }
                  maxLength={255}
                  placeholder="Search-friendly article title"
                  className={inputClassName}
                  disabled={isSubmitting}
                />
              </FormField>

              <CharacterCount
                current={formData.seo_title.length}
                maximum={255}
              />

              <FormField id="seo-description" label="SEO Description" required>
                <textarea
                  id="seo-description"
                  rows={5}
                  value={formData.seo_description}
                  onChange={(event) =>
                    updateField("seo_description", event.target.value)
                  }
                  maxLength={500}
                  placeholder="Description used by search engines"
                  className={`${inputClassName} leading-7`}
                  disabled={isSubmitting}
                />
              </FormField>

              <CharacterCount
                current={formData.seo_description.length}
                maximum={500}
              />

              <SearchPreview
                title={formData.seo_title || formData.title}
                slug={formData.slug}
                description={formData.seo_description || formData.excerpt}
              />
            </SectionCard>
          </div>

          <aside className="space-y-6">
            <section className="sticky top-24 space-y-6">
              <FormCard
                title="Save changes"
                description="Apply the current content and metadata updates to this article."
              >
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => {
                    void handleSubmit()
                  }}
                  className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-extrabold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Save className="mr-2 size-4" />
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </FormCard>

              <FormCard
                title="Article settings"
                description="Manage attribution, classification, and featured media."
              >
                <div className="space-y-5">
                  <FormField id="blog-category" label="Category" required>
                    <div className="relative">
                      <FileText className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-slate-400" />

                      <input
                        id="blog-category"
                        type="text"
                        value={formData.category}
                        onChange={(event) =>
                          updateField("category", event.target.value)
                        }
                        placeholder="Cloud, DevOps, Security..."
                        className={`${inputClassName} pl-11`}
                        disabled={isSubmitting}
                      />
                    </div>
                  </FormField>

                  <FormField id="blog-author" label="Author" required>
                    <div className="relative">
                      <UserRound className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-slate-400" />

                      <input
                        id="blog-author"
                        type="text"
                        value={formData.author}
                        onChange={(event) =>
                          updateField("author", event.target.value)
                        }
                        className={`${inputClassName} pl-11`}
                        disabled={isSubmitting}
                      />
                    </div>
                  </FormField>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex size-9 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm ring-1 ring-slate-200">
                        <ImageIcon className="size-4" />
                      </div>

                      <div>
                        <p className="text-sm font-extrabold text-slate-950">
                          Featured image
                        </p>
                        <p className="text-xs text-slate-500">
                          PNG, JPG, JPEG, or WebP
                        </p>
                      </div>
                    </div>

                    <ImageUploader
                      label="Featured Image"
                      value={formData.image_url}
                      onChange={(value) => updateField("image_url", value)}
                      accept=".png,.jpg,.jpeg,.webp"
                      helpText="Upload or replace the blog featured image."
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </FormCard>

              <CompletionCard
                completedFields={completedFields}
                totalFields={requiredFields.length}
                percentage={completionPercentage}
              />

              <section className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-violet-50 p-5">
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm ring-1 ring-blue-100">
                    <Settings2 className="size-5" />
                  </div>

                  <div>
                    <h2 className="font-extrabold text-slate-950">
                      Editing an existing article
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Saving updates the existing blog record. Its current
                      publication status is preserved by the blog update API.
                    </p>
                  </div>
                </div>
              </section>
            </section>
          </aside>
        </div>
      </div>
    </>
  )
}

type SectionCardProps = {
  icon: ReactNode
  title: string
  description: string
  children: ReactNode
}

function SectionCard({ icon, title, description, children }: SectionCardProps) {
  return (
    <FormCard
      title={title}
      description={description}
      action={
        <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          {icon}
        </div>
      }
    >
      <div className="space-y-5">{children}</div>
    </FormCard>
  )
}

type CompletionCardProps = {
  completedFields: number
  totalFields: number
  percentage: number
}

function CompletionCard({
  completedFields,
  totalFields,
  percentage,
}: CompletionCardProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-extrabold text-slate-950">
            Article completion
          </p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            {completedFields} of {totalFields} required fields completed
          </p>
        </div>

        <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="size-5" />
        </div>
      </div>

      <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-blue-600 transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <p className="mt-3 text-right text-xs font-extrabold text-slate-600">
        {percentage}%
      </p>
    </section>
  )
}

type SearchPreviewProps = {
  title: string
  slug: string
  description: string
}

function SearchPreview({ title, slug, description }: SearchPreviewProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <div className="flex items-center gap-2 text-xs font-extrabold tracking-[0.16em] text-slate-500 uppercase">
        <Sparkles className="size-3.5" />
        Search preview
      </div>

      <div className="mt-4 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
        <p className="truncate text-xs text-emerald-700">
          cubiclesservices.com › blogs › {slug || "article-slug"}
        </p>

        <p className="mt-1 line-clamp-2 text-lg font-medium text-blue-700">
          {title || "Your article title will appear here"}
        </p>

        <p className="mt-1 line-clamp-3 text-sm leading-6 text-slate-600">
          {description ||
            "Add an SEO description to preview how this article may appear in search results."}
        </p>
      </div>
    </section>
  )
}

const inputClassName =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"

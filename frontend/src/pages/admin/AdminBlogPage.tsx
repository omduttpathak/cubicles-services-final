import { useEffect, useState, type ReactNode } from "react"
import axios from "axios"
import { BookOpen, Eye, Filter, Save, Search, Type } from "lucide-react"
import { toast } from "sonner"

import {
  getAdminBlogPage,
  updateAdminBlogPage,
  type UpdateAdminBlogPageRequest,
} from "@/api/adminBlogPageApi"
import ErrorState from "@/components/common/ErrorState"
import PageLoader from "@/components/common/PageLoader"
import SEO from "@/components/seo/SEO"

const initialFormData: UpdateAdminBlogPageRequest = {
  hero_eyebrow: "Insights & Resources",
  hero_title: "Technology Insights for Modern Businesses",
  hero_description:
    "Practical guidance on cloud migration, DevOps automation, application modernization and modern infrastructure operations.",

  search_placeholder: "Search articles...",
  all_categories_label: "All Categories",
  clear_filters_text: "Clear Filters",

  empty_title: "No Articles Found",
  empty_description: "Published articles will appear here.",
  filtered_empty_description: "No articles match the selected filters.",

  read_button_text: "Read Article",
  author_prefix: "By",

  seo_title: "Technology Blogs | Cubicles Services",
  seo_description:
    "Explore insights on cloud migration, DevOps, application modernization and managed IT services.",

  show_hero: true,
  show_filters: true,
  show_articles: true,
  show_author: true,
  show_date: true,
  is_active: true,
}

const requiredStringFields: Array<keyof UpdateAdminBlogPageRequest> = [
  "hero_eyebrow",
  "hero_title",
  "hero_description",
  "search_placeholder",
  "all_categories_label",
  "clear_filters_text",
  "empty_title",
  "empty_description",
  "filtered_empty_description",
  "read_button_text",
  "author_prefix",
  "seo_title",
  "seo_description",
]

export default function AdminBlogPage() {
  const [formData, setFormData] =
    useState<UpdateAdminBlogPageRequest>(initialFormData)

  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function updateField<Key extends keyof UpdateAdminBlogPageRequest>(
    field: Key,
    value: UpdateAdminBlogPageRequest[Key]
  ) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }))
  }

  async function loadBlogPage() {
    try {
      setIsLoading(true)
      setHasError(false)

      const response = await getAdminBlogPage()
      const { id: _id, ...settings } = response

      setFormData(settings)
    } catch (error) {
      console.error(error)
      setHasError(true)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSubmit() {
    const hasMissingField = requiredStringFields.some((field) => {
      const value = formData[field]

      return typeof value === "string" && !value.trim()
    })

    if (hasMissingField) {
      toast.error("Please complete all required fields.")
      return
    }

    try {
      setIsSubmitting(true)

      const payload = trimBlogPageData(formData)
      const updated = await updateAdminBlogPage(payload)

      const { id: _id, ...settings } = updated

      setFormData(settings)
      toast.success("Blogs page settings updated successfully.")
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
          toast.error("Unable to update Blogs page settings.")
        }
      } else {
        toast.error("Unable to update Blogs page settings.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    void loadBlogPage()
  }, [])

  if (isLoading) {
    return <PageLoader message="Loading Blogs page settings..." />
  }

  if (hasError) {
    return (
      <ErrorState
        title="Unable to Load Blogs Page"
        message="The Blogs page settings could not be loaded."
        onRetry={() => {
          void loadBlogPage()
        }}
      />
    )
  }

  return (
    <>
      <SEO
        title="Blogs Page | Cubicles Services Admin"
        description="Manage the public Blogs page content, visibility and SEO."
      />

      <section>
        <div className="flex flex-col gap-4 rounded-xl bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold tracking-wider text-blue-600 uppercase">
              Content Management
            </p>

            <h1 className="mt-1 text-2xl font-bold text-slate-900">
              Blogs Page
            </h1>

            <p className="mt-1 text-sm text-slate-600">
              Manage the Blogs page hero, filters, card labels, empty states,
              visibility and SEO.
            </p>
          </div>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => {
              void handleSubmit()
            }}
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save className="mr-2 h-4 w-4" />
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            <Panel
              icon={<BookOpen className="h-5 w-5" />}
              title="Hero Section"
              description="Manage the introduction displayed at the top of the Blogs page."
            >
              <TextField
                id="blog-page-hero-eyebrow"
                label="Hero Eyebrow"
                value={formData.hero_eyebrow}
                maxLength={255}
                onChange={(value) => updateField("hero_eyebrow", value)}
              />

              <TextField
                id="blog-page-hero-title"
                label="Hero Title"
                value={formData.hero_title}
                maxLength={500}
                onChange={(value) => updateField("hero_title", value)}
              />

              <TextAreaField
                id="blog-page-hero-description"
                label="Hero Description"
                value={formData.hero_description}
                rows={6}
                maxLength={1000}
                onChange={(value) => updateField("hero_description", value)}
              />
            </Panel>

            <Panel
              icon={<Filter className="h-5 w-5" />}
              title="Search and Filters"
              description="Customize the search and category-filter controls."
            >
              <TextField
                id="blog-page-search-placeholder"
                label="Search Placeholder"
                value={formData.search_placeholder}
                maxLength={255}
                onChange={(value) => updateField("search_placeholder", value)}
              />

              <TextField
                id="blog-page-all-categories"
                label="All Categories Label"
                value={formData.all_categories_label}
                maxLength={150}
                onChange={(value) => updateField("all_categories_label", value)}
              />

              <TextField
                id="blog-page-clear-filters"
                label="Clear Filters Text"
                value={formData.clear_filters_text}
                maxLength={150}
                onChange={(value) => updateField("clear_filters_text", value)}
              />
            </Panel>

            <Panel
              icon={<Type className="h-5 w-5" />}
              title="Article Card Labels"
              description="Manage the button and author labels shown on article cards."
            >
              <TextField
                id="blog-page-read-button"
                label="Read Button Text"
                value={formData.read_button_text}
                maxLength={150}
                onChange={(value) => updateField("read_button_text", value)}
              />

              <TextField
                id="blog-page-author-prefix"
                label="Author Prefix"
                value={formData.author_prefix}
                maxLength={100}
                onChange={(value) => updateField("author_prefix", value)}
              />
            </Panel>

            <Panel
              icon={<BookOpen className="h-5 w-5" />}
              title="Empty States"
              description="Content shown when no articles are available or filters return no results."
            >
              <TextField
                id="blog-page-empty-title"
                label="Empty State Title"
                value={formData.empty_title}
                maxLength={255}
                onChange={(value) => updateField("empty_title", value)}
              />

              <TextAreaField
                id="blog-page-empty-description"
                label="No Articles Description"
                value={formData.empty_description}
                rows={4}
                maxLength={500}
                onChange={(value) => updateField("empty_description", value)}
              />

              <TextAreaField
                id="blog-page-filtered-empty-description"
                label="No Filter Results Description"
                value={formData.filtered_empty_description}
                rows={4}
                maxLength={500}
                onChange={(value) =>
                  updateField("filtered_empty_description", value)
                }
              />
            </Panel>

            <Panel
              icon={<Search className="h-5 w-5" />}
              title="Search Engine Optimization"
              description="Metadata used by search engines and social previews."
            >
              <TextField
                id="blog-page-seo-title"
                label="SEO Title"
                value={formData.seo_title}
                maxLength={255}
                onChange={(value) => updateField("seo_title", value)}
              />

              <TextAreaField
                id="blog-page-seo-description"
                label="SEO Description"
                value={formData.seo_description}
                rows={5}
                maxLength={500}
                onChange={(value) => updateField("seo_description", value)}
              />
            </Panel>
          </div>

          <aside className="space-y-6">
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                  <Eye className="h-6 w-6" />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">Page Visibility</h2>

                  <p className="text-sm text-slate-500">
                    Control the public Blogs page.
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <ToggleField
                  title="Blogs Page Active"
                  description="Keep enabled so the public Blogs page can load these settings."
                  checked={formData.is_active}
                  onChange={(checked) => updateField("is_active", checked)}
                />

                <ToggleField
                  title="Show Hero Section"
                  description="Display the Blogs page introduction."
                  checked={formData.show_hero}
                  onChange={(checked) => updateField("show_hero", checked)}
                />

                <ToggleField
                  title="Show Filters"
                  description="Display search and category controls."
                  checked={formData.show_filters}
                  onChange={(checked) => updateField("show_filters", checked)}
                />

                <ToggleField
                  title="Show Articles"
                  description="Display the published blog cards."
                  checked={formData.show_articles}
                  onChange={(checked) => updateField("show_articles", checked)}
                />

                <ToggleField
                  title="Show Author"
                  description="Display the author beneath each article."
                  checked={formData.show_author}
                  onChange={(checked) => updateField("show_author", checked)}
                />

                <ToggleField
                  title="Show Date"
                  description="Display the publication date on article cards."
                  checked={formData.show_date}
                  onChange={(checked) => updateField("show_date", checked)}
                />
              </div>
            </div>

            <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
              <h2 className="font-bold text-slate-900">Blog Articles</h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Individual articles, categories, images, content and publication
                status are managed from Blogs in the admin sidebar.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}

function trimBlogPageData(
  data: UpdateAdminBlogPageRequest
): UpdateAdminBlogPageRequest {
  const trimmed = { ...data }

  for (const field of requiredStringFields) {
    const value = trimmed[field]

    if (typeof value === "string") {
      ;(trimmed[field] as string) = value.trim()
    }
  }

  return trimmed
}

type PanelProps = {
  icon: ReactNode
  title: string
  description: string
  children: ReactNode
}

function Panel({ icon, title, description, children }: PanelProps) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-blue-50 p-2.5 text-blue-600">{icon}</div>

        <div>
          <h2 className="text-lg font-bold text-slate-900">{title}</h2>
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>
      </div>

      <div className="mt-6 space-y-5">{children}</div>
    </div>
  )
}

type TextFieldProps = {
  id: string
  label: string
  value: string
  maxLength?: number
  onChange: (value: string) => void
}

function TextField({ id, label, value, maxLength, onChange }: TextFieldProps) {
  return (
    <FormField id={id} label={label} required>
      <input
        id={id}
        type="text"
        value={value}
        maxLength={maxLength}
        onChange={(event) => onChange(event.target.value)}
        className={inputClassName}
      />
    </FormField>
  )
}

type TextAreaFieldProps = {
  id: string
  label: string
  value: string
  rows: number
  maxLength?: number
  onChange: (value: string) => void
}

function TextAreaField({
  id,
  label,
  value,
  rows,
  maxLength,
  onChange,
}: TextAreaFieldProps) {
  return (
    <FormField id={id} label={label} required>
      <textarea
        id={id}
        rows={rows}
        value={value}
        maxLength={maxLength}
        onChange={(event) => onChange(event.target.value)}
        className={`${inputClassName} leading-7`}
      />
    </FormField>
  )
}

type FormFieldProps = {
  id: string
  label: string
  required?: boolean
  children: ReactNode
}

function FormField({ id, label, required = false, children }: FormFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block font-medium text-slate-700">
        {label}
        {required && <span className="text-red-600"> *</span>}
      </label>

      {children}
    </div>
  )
}

type ToggleFieldProps = {
  title: string
  description: string
  checked: boolean
  onChange: (checked: boolean) => void
}

function ToggleField({
  title,
  description,
  checked,
  onChange,
}: ToggleFieldProps) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4 transition hover:bg-slate-50">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-1 h-4 w-4"
      />

      <span>
        <span className="block font-semibold text-slate-900">{title}</span>

        <span className="mt-1 block text-sm leading-6 text-slate-500">
          {description}
        </span>
      </span>
    </label>
  )
}

const inputClassName =
  "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"

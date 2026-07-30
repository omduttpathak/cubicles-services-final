import { useEffect, useMemo, useState, type ReactNode } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import {
  BookOpen,
  CheckCircle2,
  Eye,
  FileText,
  Filter,
  LayoutPanelTop,
  Save,
  Search,
  Settings2,
  Sparkles,
  Type,
} from "lucide-react"
import { toast } from "sonner"

import {
  getAdminBlogPage,
  updateAdminBlogPage,
  type UpdateAdminBlogPageRequest,
} from "@/api/adminBlogPageApi"
import AdminFormPageHeader from "@/components/admin/forms/AdminFormPageHeader"
import CharacterCount from "@/components/admin/forms/CharacterCount"
import FormCard from "@/components/admin/forms/FormCard"
import FormField from "@/components/admin/forms/FormField"
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
  const navigate = useNavigate()
  const [formData, setFormData] =
    useState<UpdateAdminBlogPageRequest>(initialFormData)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function updateField<Key extends keyof UpdateAdminBlogPageRequest>(
    field: Key,
    value: UpdateAdminBlogPageRequest[Key]
  ) {
    setFormData((current) => ({ ...current, [field]: value }))
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

  const completedFields = useMemo(
    () =>
      requiredStringFields.filter((field) => {
        const value = formData[field]
        return typeof value === "string" && Boolean(value.trim())
      }).length,
    [formData]
  )

  const completionPercentage = Math.round(
    (completedFields / requiredStringFields.length) * 100
  )

  const enabledSections = [
    formData.show_hero,
    formData.show_filters,
    formData.show_articles,
    formData.show_author,
    formData.show_date,
  ].filter(Boolean).length

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

      <div className="space-y-6">
        <AdminFormPageHeader
          eyebrow="Content management"
          title="Blogs Page"
          description="Manage the public Blogs page hero, filters, article labels, empty states, visibility, and search metadata."
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
              icon={<LayoutPanelTop className="size-5" />}
              title="Hero section"
              description="Manage the introduction displayed at the top of the public Blogs page."
            >
              <TextField
                id="blog-page-hero-eyebrow"
                label="Hero Eyebrow"
                value={formData.hero_eyebrow}
                maxLength={255}
                placeholder="Insights & Resources"
                disabled={isSubmitting}
                onChange={(value) => updateField("hero_eyebrow", value)}
              />
              <TextField
                id="blog-page-hero-title"
                label="Hero Title"
                value={formData.hero_title}
                maxLength={500}
                placeholder="Technology Insights for Modern Businesses"
                disabled={isSubmitting}
                onChange={(value) => updateField("hero_title", value)}
              />
              <TextAreaField
                id="blog-page-hero-description"
                label="Hero Description"
                value={formData.hero_description}
                rows={6}
                maxLength={1000}
                placeholder="Describe the value and topics visitors will find on the Blogs page."
                disabled={isSubmitting}
                onChange={(value) => updateField("hero_description", value)}
              />
            </SectionCard>

            <SectionCard
              icon={<Filter className="size-5" />}
              title="Search and filters"
              description="Customize the search input and category-filter controls."
            >
              <TextField
                id="blog-page-search-placeholder"
                label="Search Placeholder"
                value={formData.search_placeholder}
                maxLength={255}
                placeholder="Search articles..."
                disabled={isSubmitting}
                onChange={(value) => updateField("search_placeholder", value)}
              />
              <TextField
                id="blog-page-all-categories"
                label="All Categories Label"
                value={formData.all_categories_label}
                maxLength={150}
                placeholder="All Categories"
                disabled={isSubmitting}
                onChange={(value) => updateField("all_categories_label", value)}
              />
              <TextField
                id="blog-page-clear-filters"
                label="Clear Filters Text"
                value={formData.clear_filters_text}
                maxLength={150}
                placeholder="Clear Filters"
                disabled={isSubmitting}
                onChange={(value) => updateField("clear_filters_text", value)}
              />
            </SectionCard>

            <SectionCard
              icon={<Type className="size-5" />}
              title="Article card labels"
              description="Manage the action and author labels shown on article cards."
            >
              <TextField
                id="blog-page-read-button"
                label="Read Button Text"
                value={formData.read_button_text}
                maxLength={150}
                placeholder="Read Article"
                disabled={isSubmitting}
                onChange={(value) => updateField("read_button_text", value)}
              />
              <TextField
                id="blog-page-author-prefix"
                label="Author Prefix"
                value={formData.author_prefix}
                maxLength={100}
                placeholder="By"
                disabled={isSubmitting}
                onChange={(value) => updateField("author_prefix", value)}
              />
            </SectionCard>

            <SectionCard
              icon={<BookOpen className="size-5" />}
              title="Empty states"
              description="Configure what visitors see when articles are unavailable or filters return no matches."
            >
              <TextField
                id="blog-page-empty-title"
                label="Empty State Title"
                value={formData.empty_title}
                maxLength={255}
                placeholder="No Articles Found"
                disabled={isSubmitting}
                onChange={(value) => updateField("empty_title", value)}
              />
              <TextAreaField
                id="blog-page-empty-description"
                label="No Articles Description"
                value={formData.empty_description}
                rows={4}
                maxLength={500}
                placeholder="Published articles will appear here."
                disabled={isSubmitting}
                onChange={(value) => updateField("empty_description", value)}
              />
              <TextAreaField
                id="blog-page-filtered-empty-description"
                label="No Filter Results Description"
                value={formData.filtered_empty_description}
                rows={4}
                maxLength={500}
                placeholder="No articles match the selected filters."
                disabled={isSubmitting}
                onChange={(value) =>
                  updateField("filtered_empty_description", value)
                }
              />
            </SectionCard>

            <SectionCard
              icon={<Search className="size-5" />}
              title="Search engine optimization"
              description="Control the metadata used by search engines and social previews."
            >
              <TextField
                id="blog-page-seo-title"
                label="SEO Title"
                value={formData.seo_title}
                maxLength={255}
                placeholder="Technology Blogs | Cubicles Services"
                disabled={isSubmitting}
                onChange={(value) => updateField("seo_title", value)}
              />
              <TextAreaField
                id="blog-page-seo-description"
                label="SEO Description"
                value={formData.seo_description}
                rows={5}
                maxLength={500}
                placeholder="Describe the Blogs page for search engines."
                disabled={isSubmitting}
                onChange={(value) => updateField("seo_description", value)}
              />
              <SearchPreview
                title={formData.seo_title}
                description={formData.seo_description}
              />
            </SectionCard>
          </div>

          <aside className="space-y-6">
            <section className="sticky top-24 space-y-6">
              <FormCard
                title="Save changes"
                description="Apply the current content, visibility, and SEO settings to the public Blogs page."
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
                title="Page visibility"
                description="Control which sections and details appear on the public Blogs page."
              >
                <div className="space-y-3">
                  <ToggleField
                    title="Blogs Page Active"
                    description="Keep enabled so the public Blogs page can load these settings."
                    checked={formData.is_active}
                    disabled={isSubmitting}
                    onChange={(checked) => updateField("is_active", checked)}
                  />
                  <ToggleField
                    title="Show Hero Section"
                    description="Display the Blogs page introduction."
                    checked={formData.show_hero}
                    disabled={isSubmitting}
                    onChange={(checked) => updateField("show_hero", checked)}
                  />
                  <ToggleField
                    title="Show Filters"
                    description="Display search and category controls."
                    checked={formData.show_filters}
                    disabled={isSubmitting}
                    onChange={(checked) => updateField("show_filters", checked)}
                  />
                  <ToggleField
                    title="Show Articles"
                    description="Display the published blog cards."
                    checked={formData.show_articles}
                    disabled={isSubmitting}
                    onChange={(checked) =>
                      updateField("show_articles", checked)
                    }
                  />
                  <ToggleField
                    title="Show Author"
                    description="Display the author beneath each article."
                    checked={formData.show_author}
                    disabled={isSubmitting}
                    onChange={(checked) => updateField("show_author", checked)}
                  />
                  <ToggleField
                    title="Show Date"
                    description="Display the publication date on article cards."
                    checked={formData.show_date}
                    disabled={isSubmitting}
                    onChange={(checked) => updateField("show_date", checked)}
                  />
                </div>
              </FormCard>

              <CompletionCard
                completedFields={completedFields}
                totalFields={requiredStringFields.length}
                percentage={completionPercentage}
                enabledSections={enabledSections}
                isActive={formData.is_active}
              />

              <section className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-violet-50 p-5">
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm ring-1 ring-blue-100">
                    <Settings2 className="size-5" />
                  </div>
                  <div>
                    <h2 className="font-extrabold text-slate-950">
                      Article management
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Individual articles, categories, images, content, and
                      publication status are managed from Blogs in the admin
                      sidebar.
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

type TextFieldProps = {
  id: string
  label: string
  value: string
  maxLength?: number
  placeholder?: string
  disabled?: boolean
  onChange: (value: string) => void
}

function TextField({
  id,
  label,
  value,
  maxLength,
  placeholder,
  disabled = false,
  onChange,
}: TextFieldProps) {
  return (
    <div className="space-y-2">
      <FormField id={id} label={label} required>
        <input
          id={id}
          type="text"
          value={value}
          maxLength={maxLength}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          className={inputClassName}
        />
      </FormField>
      {typeof maxLength === "number" && (
        <CharacterCount current={value.length} maximum={maxLength} />
      )}
    </div>
  )
}

type TextAreaFieldProps = {
  id: string
  label: string
  value: string
  rows: number
  maxLength?: number
  placeholder?: string
  disabled?: boolean
  onChange: (value: string) => void
}

function TextAreaField({
  id,
  label,
  value,
  rows,
  maxLength,
  placeholder,
  disabled = false,
  onChange,
}: TextAreaFieldProps) {
  return (
    <div className="space-y-2">
      <FormField id={id} label={label} required>
        <textarea
          id={id}
          rows={rows}
          value={value}
          maxLength={maxLength}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          className={`${inputClassName} leading-7`}
        />
      </FormField>
      {typeof maxLength === "number" && (
        <CharacterCount current={value.length} maximum={maxLength} />
      )}
    </div>
  )
}

type ToggleFieldProps = {
  title: string
  description: string
  checked: boolean
  disabled?: boolean
  onChange: (checked: boolean) => void
}

function ToggleField({
  title,
  description,
  checked,
  disabled = false,
  onChange,
}: ToggleFieldProps) {
  return (
    <label
      className={`flex items-start gap-3 rounded-2xl border p-4 transition ${
        checked
          ? "border-blue-200 bg-blue-50/70"
          : "border-slate-200 bg-white hover:bg-slate-50"
      } ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className={`relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition ${
          checked ? "bg-blue-600" : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute top-1 size-4 rounded-full bg-white shadow-sm transition ${
            checked ? "left-6" : "left-1"
          }`}
        />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-extrabold text-slate-950">
          {title}
        </span>
        <span className="mt-1 block text-xs leading-5 text-slate-500">
          {description}
        </span>
      </span>
    </label>
  )
}

type CompletionCardProps = {
  completedFields: number
  totalFields: number
  percentage: number
  enabledSections: number
  isActive: boolean
}

function CompletionCard({
  completedFields,
  totalFields,
  percentage,
  enabledSections,
  isActive,
}: CompletionCardProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-extrabold text-slate-950">
            Page readiness
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

      <div className="mt-4 grid grid-cols-2 gap-3">
        <StatusMetric
          label="Completion"
          value={`${percentage}%`}
          icon={<FileText className="size-4" />}
        />
        <StatusMetric
          label="Visible items"
          value={`${enabledSections}/5`}
          icon={<Eye className="size-4" />}
        />
      </div>

      <div
        className={`mt-3 rounded-xl border px-4 py-3 text-sm font-bold ${
          isActive
            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
            : "border-amber-200 bg-amber-50 text-amber-700"
        }`}
      >
        {isActive ? "Blogs page is active" : "Blogs page is inactive"}
      </div>
    </section>
  )
}

type StatusMetricProps = {
  label: string
  value: string
  icon: ReactNode
}

function StatusMetric({ label, value, icon }: StatusMetricProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <div className="flex items-center gap-2 text-slate-500">
        {icon}
        <span className="text-[11px] font-bold tracking-[0.12em] uppercase">
          {label}
        </span>
      </div>
      <p className="mt-2 text-lg font-black text-slate-950">{value}</p>
    </div>
  )
}

type SearchPreviewProps = {
  title: string
  description: string
}

function SearchPreview({ title, description }: SearchPreviewProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <div className="flex items-center gap-2 text-xs font-extrabold tracking-[0.16em] text-slate-500 uppercase">
        <Sparkles className="size-3.5" />
        Search preview
      </div>
      <div className="mt-4 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
        <p className="truncate text-xs text-emerald-700">
          cubiclesservices.com › blogs
        </p>
        <p className="mt-1 line-clamp-2 text-lg font-medium text-blue-700">
          {title || "Technology Blogs | Cubicles Services"}
        </p>
        <p className="mt-1 line-clamp-3 text-sm leading-6 text-slate-600">
          {description ||
            "Add an SEO description to preview how the Blogs page may appear in search results."}
        </p>
      </div>
    </section>
  )
}

const inputClassName =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"

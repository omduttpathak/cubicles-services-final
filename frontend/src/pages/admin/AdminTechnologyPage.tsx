import { useEffect, useState, type ReactNode } from "react"
import axios from "axios"
import {
  Cpu,
  Eye,
  FileText,
  Layers3,
  Save,
  Search,
  Sparkles,
} from "lucide-react"
import { toast } from "sonner"

import {
  getAdminTechnologyPage,
  updateAdminTechnologyPage,
  type UpdateAdminTechnologyPageRequest,
} from "@/api/adminTechnologyPageApi"
import ErrorState from "@/components/common/ErrorState"
import PageLoader from "@/components/common/PageLoader"
import SEO from "@/components/seo/SEO"

const initialFormData: UpdateAdminTechnologyPageRequest = {
  hero_badge: "Technologies",
  hero_title: "Modern Technologies We Use",
  hero_description:
    "We leverage industry-leading cloud platforms, DevOps tools and modern development frameworks to build scalable, secure and high-performance digital solutions.",

  featured_eyebrow: "Featured Capabilities",
  featured_title: "Core Technologies We Specialize In",
  featured_description:
    "These featured technologies support our cloud, DevOps, modernization and managed infrastructure services.",

  categories_eyebrow: "Technology Stack",
  categories_title: "Technologies We Work With",
  categories_description:
    "We use modern cloud platforms, automation tools, programming languages and infrastructure technologies to build secure, scalable enterprise solutions.",

  empty_title: "Technologies Coming Soon",
  empty_description:
    "Our technology capabilities are being updated. Please check back soon.",

  seo_title: "Technologies | Cubicles Services",
  seo_description:
    "Explore the cloud platforms, DevOps tools, programming languages and modern technologies used by Cubicles Services.",

  show_hero: true,
  show_featured: true,
  show_categories: true,
  is_active: true,
}

const requiredStringFields: Array<keyof UpdateAdminTechnologyPageRequest> = [
  "hero_badge",
  "hero_title",
  "hero_description",
  "featured_eyebrow",
  "featured_title",
  "featured_description",
  "categories_eyebrow",
  "categories_title",
  "categories_description",
  "empty_title",
  "empty_description",
  "seo_title",
  "seo_description",
]

export default function AdminTechnologyPage() {
  const [formData, setFormData] =
    useState<UpdateAdminTechnologyPageRequest>(initialFormData)

  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function updateField<Key extends keyof UpdateAdminTechnologyPageRequest>(
    field: Key,
    value: UpdateAdminTechnologyPageRequest[Key]
  ) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }))
  }

  async function loadTechnologyPage() {
    try {
      setIsLoading(true)
      setHasError(false)

      const response = await getAdminTechnologyPage()
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

      const payload = trimTechnologyPageData(formData)

      const updated = await updateAdminTechnologyPage(payload)

      const { id: _id, ...settings } = updated

      setFormData(settings)

      toast.success("Technologies page settings updated successfully.")
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
          toast.error("Unable to update Technologies page settings.")
        }
      } else {
        toast.error("Unable to update Technologies page settings.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    void loadTechnologyPage()
  }, [])

  if (isLoading) {
    return <PageLoader message="Loading Technologies page settings..." />
  }

  if (hasError) {
    return (
      <ErrorState
        title="Unable to Load Technologies Page"
        message="The Technologies page settings could not be loaded."
        onRetry={() => {
          void loadTechnologyPage()
        }}
      />
    )
  }

  return (
    <>
      <SEO
        title="Technologies Page | Cubicles Services Admin"
        description="Manage the public Technologies page content, visibility and SEO."
      />

      <section>
        <div className="flex flex-col gap-4 rounded-xl bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold tracking-wider text-blue-600 uppercase">
              Content Management
            </p>

            <h1 className="mt-1 text-2xl font-bold text-slate-900">
              Technologies Page
            </h1>

            <p className="mt-1 text-sm text-slate-600">
              Manage the Technologies page hero, featured content, category
              headings, empty state, visibility and SEO.
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
              icon={<Cpu className="h-5 w-5" />}
              title="Hero Section"
              description="Manage the introduction displayed at the top of the Technologies page."
            >
              <TextField
                id="technology-page-hero-badge"
                label="Hero Badge"
                value={formData.hero_badge}
                maxLength={255}
                onChange={(value) => updateField("hero_badge", value)}
              />

              <TextField
                id="technology-page-hero-title"
                label="Hero Title"
                value={formData.hero_title}
                maxLength={500}
                onChange={(value) => updateField("hero_title", value)}
              />

              <TextAreaField
                id="technology-page-hero-description"
                label="Hero Description"
                value={formData.hero_description}
                rows={6}
                maxLength={1000}
                onChange={(value) => updateField("hero_description", value)}
              />

              <CharacterCount
                current={formData.hero_description.length}
                maximum={1000}
              />
            </Panel>

            <Panel
              icon={<Sparkles className="h-5 w-5" />}
              title="Featured Technologies Section"
              description="Manage the heading displayed above featured technologies."
            >
              <TextField
                id="technology-page-featured-eyebrow"
                label="Section Eyebrow"
                value={formData.featured_eyebrow}
                maxLength={255}
                onChange={(value) => updateField("featured_eyebrow", value)}
              />

              <TextField
                id="technology-page-featured-title"
                label="Section Title"
                value={formData.featured_title}
                maxLength={500}
                onChange={(value) => updateField("featured_title", value)}
              />

              <TextAreaField
                id="technology-page-featured-description"
                label="Section Description"
                value={formData.featured_description}
                rows={5}
                maxLength={1000}
                onChange={(value) => updateField("featured_description", value)}
              />

              <CharacterCount
                current={formData.featured_description.length}
                maximum={1000}
              />
            </Panel>

            <Panel
              icon={<Layers3 className="h-5 w-5" />}
              title="Technology Categories Section"
              description="Manage the heading shown above grouped technology categories."
            >
              <TextField
                id="technology-page-categories-eyebrow"
                label="Section Eyebrow"
                value={formData.categories_eyebrow}
                maxLength={255}
                onChange={(value) => updateField("categories_eyebrow", value)}
              />

              <TextField
                id="technology-page-categories-title"
                label="Section Title"
                value={formData.categories_title}
                maxLength={500}
                onChange={(value) => updateField("categories_title", value)}
              />

              <TextAreaField
                id="technology-page-categories-description"
                label="Section Description"
                value={formData.categories_description}
                rows={5}
                maxLength={1000}
                onChange={(value) =>
                  updateField("categories_description", value)
                }
              />

              <CharacterCount
                current={formData.categories_description.length}
                maximum={1000}
              />
            </Panel>

            <Panel
              icon={<FileText className="h-5 w-5" />}
              title="Empty Technologies State"
              description="Content displayed when no active technologies are available."
            >
              <TextField
                id="technology-page-empty-title"
                label="Empty State Title"
                value={formData.empty_title}
                maxLength={255}
                onChange={(value) => updateField("empty_title", value)}
              />

              <TextAreaField
                id="technology-page-empty-description"
                label="Empty State Description"
                value={formData.empty_description}
                rows={4}
                maxLength={500}
                onChange={(value) => updateField("empty_description", value)}
              />

              <CharacterCount
                current={formData.empty_description.length}
                maximum={500}
              />
            </Panel>

            <Panel
              icon={<Search className="h-5 w-5" />}
              title="Search Engine Optimization"
              description="Metadata used by search engines and social previews."
            >
              <TextField
                id="technology-page-seo-title"
                label="SEO Title"
                value={formData.seo_title}
                maxLength={255}
                onChange={(value) => updateField("seo_title", value)}
              />

              <CharacterCount
                current={formData.seo_title.length}
                maximum={255}
              />

              <TextAreaField
                id="technology-page-seo-description"
                label="SEO Description"
                value={formData.seo_description}
                rows={5}
                maxLength={500}
                onChange={(value) => updateField("seo_description", value)}
              />

              <CharacterCount
                current={formData.seo_description.length}
                maximum={500}
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
                    Control the public Technologies page.
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <ToggleField
                  title="Technologies Page Active"
                  description="Keep enabled so the public Technologies page can load these settings."
                  checked={formData.is_active}
                  onChange={(checked) => updateField("is_active", checked)}
                />

                <ToggleField
                  title="Show Hero Section"
                  description="Display the Technologies page introduction."
                  checked={formData.show_hero}
                  onChange={(checked) => updateField("show_hero", checked)}
                />

                <ToggleField
                  title="Show Featured Technologies"
                  description="Display technologies marked as featured."
                  checked={formData.show_featured}
                  onChange={(checked) => updateField("show_featured", checked)}
                />

                <ToggleField
                  title="Show Technology Categories"
                  description="Display active technologies grouped by category."
                  checked={formData.show_categories}
                  onChange={(checked) =>
                    updateField("show_categories", checked)
                  }
                />
              </div>
            </div>

            <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
              <h2 className="font-bold text-slate-900">Technology Records</h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Individual technologies, categories, logos, featured status and
                active status are managed from the Technologies menu in the
                admin sidebar.
              </p>
            </div>

            <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
              <h2 className="font-bold text-slate-900">Featured Content</h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                The featured section is displayed only when this setting is
                enabled and at least one active technology is marked as
                featured.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}

function trimTechnologyPageData(
  data: UpdateAdminTechnologyPageRequest
): UpdateAdminTechnologyPageRequest {
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

function CharacterCount({
  current,
  maximum,
}: {
  current: number
  maximum: number
}) {
  return (
    <p className="-mt-3 text-right text-xs text-slate-500">
      {current}/{maximum}
    </p>
  )
}

const inputClassName =
  "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"

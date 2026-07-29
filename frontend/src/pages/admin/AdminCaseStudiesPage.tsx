import { useEffect, useState, type ReactNode } from "react"
import axios from "axios"
import {
  BriefcaseBusiness,
  CheckCircle2,
  Eye,
  Filter,
  Save,
  Search,
  Tags,
} from "lucide-react"
import { toast } from "sonner"

import {
  getAdminCaseStudiesPage,
  updateAdminCaseStudiesPage,
  type UpdateAdminCaseStudiesPageRequest,
} from "@/api/adminCaseStudiesPageApi"
import ErrorState from "@/components/common/ErrorState"
import PageLoader from "@/components/common/PageLoader"
import SEO from "@/components/seo/SEO"

const initialFormData: UpdateAdminCaseStudiesPageRequest = {
  hero_eyebrow: "Client Success",
  hero_title: "Technology Transformation Case Studies",
  hero_description:
    "Discover how we help organizations modernize infrastructure, automate software delivery and build scalable digital platforms.",

  search_placeholder: "Search case studies...",
  all_industries_label: "All Industries",
  clear_filters_text: "Clear Filters",

  empty_title: "No Case Studies Found",
  empty_description: "Published case studies will appear here.",
  filtered_empty_description: "No case studies match the selected filters.",

  results_heading: "Key Results",
  view_button_text: "View Case Study",

  seo_title: "Case Studies | Cubicles Services",
  seo_description:
    "Explore successful cloud migration, DevOps and application modernization projects delivered by Cubicles Services.",

  show_hero: true,
  show_filters: true,
  show_case_studies: true,
  show_results: true,
  show_technologies: true,
  is_active: true,
}

const requiredStringFields: Array<keyof UpdateAdminCaseStudiesPageRequest> = [
  "hero_eyebrow",
  "hero_title",
  "hero_description",
  "search_placeholder",
  "all_industries_label",
  "clear_filters_text",
  "empty_title",
  "empty_description",
  "filtered_empty_description",
  "results_heading",
  "view_button_text",
  "seo_title",
  "seo_description",
]

export default function AdminCaseStudiesPage() {
  const [formData, setFormData] =
    useState<UpdateAdminCaseStudiesPageRequest>(initialFormData)

  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function updateField<Key extends keyof UpdateAdminCaseStudiesPageRequest>(
    field: Key,
    value: UpdateAdminCaseStudiesPageRequest[Key]
  ) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }))
  }

  async function loadCaseStudiesPage() {
    try {
      setIsLoading(true)
      setHasError(false)

      const response = await getAdminCaseStudiesPage()
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

      const payload = trimCaseStudiesPageData(formData)
      const updated = await updateAdminCaseStudiesPage(payload)

      const { id: _id, ...settings } = updated

      setFormData(settings)

      toast.success("Case Studies page settings updated successfully.")
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
          toast.error("Unable to update Case Studies page settings.")
        }
      } else {
        toast.error("Unable to update Case Studies page settings.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    void loadCaseStudiesPage()
  }, [])

  if (isLoading) {
    return <PageLoader message="Loading Case Studies page settings..." />
  }

  if (hasError) {
    return (
      <ErrorState
        title="Unable to Load Case Studies Page"
        message="The Case Studies page settings could not be loaded."
        onRetry={() => {
          void loadCaseStudiesPage()
        }}
      />
    )
  }

  return (
    <>
      <SEO
        title="Case Studies Page | Cubicles Services Admin"
        description="Manage the public Case Studies page content, visibility and SEO."
      />

      <section>
        <div className="flex flex-col gap-4 rounded-xl bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold tracking-wider text-blue-600 uppercase">
              Content Management
            </p>

            <h1 className="mt-1 text-2xl font-bold text-slate-900">
              Case Studies Page
            </h1>

            <p className="mt-1 text-sm text-slate-600">
              Manage the Case Studies page hero, filters, card labels, empty
              states, visibility and SEO.
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
              icon={<BriefcaseBusiness className="h-5 w-5" />}
              title="Hero Section"
              description="Manage the introduction displayed at the top of the Case Studies page."
            >
              <TextField
                id="case-studies-page-hero-eyebrow"
                label="Hero Eyebrow"
                value={formData.hero_eyebrow}
                maxLength={255}
                onChange={(value) => updateField("hero_eyebrow", value)}
              />

              <TextField
                id="case-studies-page-hero-title"
                label="Hero Title"
                value={formData.hero_title}
                maxLength={500}
                onChange={(value) => updateField("hero_title", value)}
              />

              <TextAreaField
                id="case-studies-page-hero-description"
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
              icon={<Filter className="h-5 w-5" />}
              title="Search and Filters"
              description="Customize the search and industry-filter controls."
            >
              <TextField
                id="case-studies-page-search-placeholder"
                label="Search Placeholder"
                value={formData.search_placeholder}
                maxLength={255}
                onChange={(value) => updateField("search_placeholder", value)}
              />

              <TextField
                id="case-studies-page-all-industries"
                label="All Industries Label"
                value={formData.all_industries_label}
                maxLength={150}
                onChange={(value) => updateField("all_industries_label", value)}
              />

              <TextField
                id="case-studies-page-clear-filters"
                label="Clear Filters Text"
                value={formData.clear_filters_text}
                maxLength={150}
                onChange={(value) => updateField("clear_filters_text", value)}
              />
            </Panel>

            <Panel
              icon={<CheckCircle2 className="h-5 w-5" />}
              title="Case Study Card Labels"
              description="Manage the results heading and detail-button text."
            >
              <TextField
                id="case-studies-page-results-heading"
                label="Results Heading"
                value={formData.results_heading}
                maxLength={150}
                onChange={(value) => updateField("results_heading", value)}
              />

              <TextField
                id="case-studies-page-view-button"
                label="View Button Text"
                value={formData.view_button_text}
                maxLength={150}
                onChange={(value) => updateField("view_button_text", value)}
              />
            </Panel>

            <Panel
              icon={<BriefcaseBusiness className="h-5 w-5" />}
              title="Empty States"
              description="Content displayed when no case studies are available or filters return no results."
            >
              <TextField
                id="case-studies-page-empty-title"
                label="Empty State Title"
                value={formData.empty_title}
                maxLength={255}
                onChange={(value) => updateField("empty_title", value)}
              />

              <TextAreaField
                id="case-studies-page-empty-description"
                label="No Case Studies Description"
                value={formData.empty_description}
                rows={4}
                maxLength={500}
                onChange={(value) => updateField("empty_description", value)}
              />

              <CharacterCount
                current={formData.empty_description.length}
                maximum={500}
              />

              <TextAreaField
                id="case-studies-page-filtered-empty-description"
                label="No Filter Results Description"
                value={formData.filtered_empty_description}
                rows={4}
                maxLength={500}
                onChange={(value) =>
                  updateField("filtered_empty_description", value)
                }
              />

              <CharacterCount
                current={formData.filtered_empty_description.length}
                maximum={500}
              />
            </Panel>

            <Panel
              icon={<Search className="h-5 w-5" />}
              title="Search Engine Optimization"
              description="Metadata used by search engines and social previews."
            >
              <TextField
                id="case-studies-page-seo-title"
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
                id="case-studies-page-seo-description"
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
                    Control the public Case Studies page.
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <ToggleField
                  title="Case Studies Page Active"
                  description="Keep enabled so the public Case Studies page can load these settings."
                  checked={formData.is_active}
                  onChange={(checked) => updateField("is_active", checked)}
                />

                <ToggleField
                  title="Show Hero Section"
                  description="Display the Case Studies page introduction."
                  checked={formData.show_hero}
                  onChange={(checked) => updateField("show_hero", checked)}
                />

                <ToggleField
                  title="Show Filters"
                  description="Display search and industry controls."
                  checked={formData.show_filters}
                  onChange={(checked) => updateField("show_filters", checked)}
                />

                <ToggleField
                  title="Show Case Studies"
                  description="Display published case-study cards."
                  checked={formData.show_case_studies}
                  onChange={(checked) =>
                    updateField("show_case_studies", checked)
                  }
                />

                <ToggleField
                  title="Show Results"
                  description="Display key results on case-study cards."
                  checked={formData.show_results}
                  onChange={(checked) => updateField("show_results", checked)}
                />

                <ToggleField
                  title="Show Technologies"
                  description="Display technology tags on case-study cards."
                  checked={formData.show_technologies}
                  onChange={(checked) =>
                    updateField("show_technologies", checked)
                  }
                />
              </div>
            </div>

            <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
              <div className="flex items-start gap-3">
                <Tags className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />

                <div>
                  <h2 className="font-bold text-slate-900">
                    Case Study Records
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Individual case studies, industries, services, results,
                    technologies, images and publication status are managed from
                    Case Studies in the admin sidebar.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
              <h2 className="font-bold text-slate-900">Public Card Content</h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                The card-level visibility settings on this page affect every
                published case study displayed in the listing.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}

function trimCaseStudiesPageData(
  data: UpdateAdminCaseStudiesPageRequest
): UpdateAdminCaseStudiesPageRequest {
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

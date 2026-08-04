import { useEffect, useMemo, useState, type ReactNode } from "react"
import axios from "axios"
import {
  BriefcaseBusiness,
  CheckCircle2,
  Eye,
  FileText,
  Filter,
  Save,
  Search,
  Settings2,
  Sparkles,
  Tags,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

import {
  getAdminCaseStudiesPage,
  updateAdminCaseStudiesPage,
  type UpdateAdminCaseStudiesPageRequest,
} from "@/api/adminCaseStudiesPageApi"
import AdminFormPageHeader from "@/components/admin/forms/AdminFormPageHeader"
import CharacterCount from "@/components/admin/forms/CharacterCount"
import FormCard from "@/components/admin/forms/FormCard"
import FormField from "@/components/admin/forms/FormField"
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
  const navigate = useNavigate()

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

  const visibleSections = [
    formData.show_hero,
    formData.show_filters,
    formData.show_case_studies,
    formData.show_results,
    formData.show_technologies,
  ].filter(Boolean).length

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

      <div className="space-y-6">
        <AdminFormPageHeader
          eyebrow="Content management"
          title="Case Studies Page"
          description="Manage the public Case Studies page hero, filters, card labels, empty states, visibility, and search metadata."
          backLabel="Back to Case Studies"
          onBack={() => navigate("/admin/case-studies")}
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
              icon={<BriefcaseBusiness className="size-5" />}
              title="Hero section"
              description="Manage the introduction displayed at the top of the public Case Studies page."
            >
              <TextField
                id="case-studies-page-hero-eyebrow"
                label="Hero Eyebrow"
                value={formData.hero_eyebrow}
                maxLength={255}
                placeholder="Client Success"
                disabled={isSubmitting}
                onChange={(value) => updateField("hero_eyebrow", value)}
              />

              <TextField
                id="case-studies-page-hero-title"
                label="Hero Title"
                value={formData.hero_title}
                maxLength={500}
                placeholder="Technology Transformation Case Studies"
                disabled={isSubmitting}
                onChange={(value) => updateField("hero_title", value)}
              />

              <TextAreaField
                id="case-studies-page-hero-description"
                label="Hero Description"
                value={formData.hero_description}
                rows={6}
                maxLength={1000}
                placeholder="Describe the value and outcomes visitors will discover on this page."
                disabled={isSubmitting}
                onChange={(value) => updateField("hero_description", value)}
              />
            </SectionCard>

            <SectionCard
              icon={<Filter className="size-5" />}
              title="Search and filters"
              description="Customize the search input and industry-filter controls."
            >
              <TextField
                id="case-studies-page-search-placeholder"
                label="Search Placeholder"
                value={formData.search_placeholder}
                maxLength={255}
                placeholder="Search case studies..."
                disabled={isSubmitting}
                onChange={(value) => updateField("search_placeholder", value)}
              />

              <TextField
                id="case-studies-page-all-industries"
                label="All Industries Label"
                value={formData.all_industries_label}
                maxLength={150}
                placeholder="All Industries"
                disabled={isSubmitting}
                onChange={(value) => updateField("all_industries_label", value)}
              />

              <TextField
                id="case-studies-page-clear-filters"
                label="Clear Filters Text"
                value={formData.clear_filters_text}
                maxLength={150}
                placeholder="Clear Filters"
                disabled={isSubmitting}
                onChange={(value) => updateField("clear_filters_text", value)}
              />
            </SectionCard>

            <SectionCard
              icon={<CheckCircle2 className="size-5" />}
              title="Case-study card labels"
              description="Manage the heading for outcomes and the action shown on each card."
            >
              <TextField
                id="case-studies-page-results-heading"
                label="Results Heading"
                value={formData.results_heading}
                maxLength={150}
                placeholder="Key Results"
                disabled={isSubmitting}
                onChange={(value) => updateField("results_heading", value)}
              />

              <TextField
                id="case-studies-page-view-button"
                label="View Button Text"
                value={formData.view_button_text}
                maxLength={150}
                placeholder="View Case Study"
                disabled={isSubmitting}
                onChange={(value) => updateField("view_button_text", value)}
              />
            </SectionCard>

            <SectionCard
              icon={<FileText className="size-5" />}
              title="Empty states"
              description="Configure what visitors see when case studies are unavailable or filters return no matches."
            >
              <TextField
                id="case-studies-page-empty-title"
                label="Empty State Title"
                value={formData.empty_title}
                maxLength={255}
                placeholder="No Case Studies Found"
                disabled={isSubmitting}
                onChange={(value) => updateField("empty_title", value)}
              />

              <TextAreaField
                id="case-studies-page-empty-description"
                label="No Case Studies Description"
                value={formData.empty_description}
                rows={4}
                maxLength={500}
                placeholder="Published case studies will appear here."
                disabled={isSubmitting}
                onChange={(value) => updateField("empty_description", value)}
              />

              <TextAreaField
                id="case-studies-page-filtered-empty-description"
                label="No Filter Results Description"
                value={formData.filtered_empty_description}
                rows={4}
                maxLength={500}
                placeholder="No case studies match the selected filters."
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
                id="case-studies-page-seo-title"
                label="SEO Title"
                value={formData.seo_title}
                maxLength={255}
                placeholder="Case Studies | Cubicles Services"
                disabled={isSubmitting}
                onChange={(value) => updateField("seo_title", value)}
              />

              <TextAreaField
                id="case-studies-page-seo-description"
                label="SEO Description"
                value={formData.seo_description}
                rows={5}
                maxLength={500}
                placeholder="Describe the public Case Studies page for search engines."
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
                description="Apply the current content, visibility, and SEO settings to the public Case Studies page."
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
                description="Control which sections and details appear on the public Case Studies page."
              >
                <div className="space-y-3">
                  <ToggleField
                    title="Case Studies Page Active"
                    description="Keep enabled so the public page can load these settings."
                    checked={formData.is_active}
                    disabled={isSubmitting}
                    onChange={(checked) => updateField("is_active", checked)}
                  />

                  <ToggleField
                    title="Show Hero Section"
                    description="Display the Case Studies page introduction."
                    checked={formData.show_hero}
                    disabled={isSubmitting}
                    onChange={(checked) => updateField("show_hero", checked)}
                  />

                  <ToggleField
                    title="Show Filters"
                    description="Display search and industry controls."
                    checked={formData.show_filters}
                    disabled={isSubmitting}
                    onChange={(checked) => updateField("show_filters", checked)}
                  />

                  <ToggleField
                    title="Show Case Studies"
                    description="Display published case-study cards."
                    checked={formData.show_case_studies}
                    disabled={isSubmitting}
                    onChange={(checked) =>
                      updateField("show_case_studies", checked)
                    }
                  />

                  <ToggleField
                    title="Show Results"
                    description="Display key results on case-study cards."
                    checked={formData.show_results}
                    disabled={isSubmitting}
                    onChange={(checked) => updateField("show_results", checked)}
                  />

                  <ToggleField
                    title="Show Technologies"
                    description="Display technology tags on case-study cards."
                    checked={formData.show_technologies}
                    disabled={isSubmitting}
                    onChange={(checked) =>
                      updateField("show_technologies", checked)
                    }
                  />
                </div>
              </FormCard>

              <CompletionCard
                completedFields={completedFields}
                totalFields={requiredStringFields.length}
                percentage={completionPercentage}
                visibleSections={visibleSections}
                isActive={formData.is_active}
              />

              <section className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-violet-50 p-5">
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm ring-1 ring-blue-100">
                    <Tags className="size-5" />
                  </div>

                  <div>
                    <h2 className="font-extrabold text-slate-950">
                      Case-study records
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Individual case studies, industries, services, results,
                      technologies, images, and publication status are managed
                      from Case Studies in the admin sidebar.
                    </p>
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-amber-600 shadow-sm ring-1 ring-amber-100">
                    <Settings2 className="size-5" />
                  </div>

                  <div>
                    <h2 className="font-extrabold text-slate-950">
                      Public card content
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Card-level visibility settings on this page affect every
                      published case study displayed in the listing.
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
  visibleSections: number
  isActive: boolean
}

function CompletionCard({
  completedFields,
  totalFields,
  percentage,
  visibleSections,
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
          value={`${visibleSections}/5`}
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
        {isActive
          ? "Case Studies page is active"
          : "Case Studies page is inactive"}
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
          cubiclesservices.com › case-studies
        </p>

        <p className="mt-1 line-clamp-2 text-lg font-medium text-blue-700">
          {title || "Case Studies | Cubicles Services"}
        </p>

        <p className="mt-1 line-clamp-3 text-sm leading-6 text-slate-600">
          {description ||
            "Add an SEO description to preview how the Case Studies page may appear in search results."}
        </p>
      </div>
    </section>
  )
}

const inputClassName =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"

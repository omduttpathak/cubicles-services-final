import { useMemo, useState, type ReactNode } from "react"
import axios from "axios"
import {
  CheckCircle2,
  Cpu,
  Eye,
  FileText,
  Globe2,
  ImageIcon,
  Layers3,
  Save,
  Search,
  Settings2,
  Sparkles,
  Star,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

import {
  createAdminTechnology,
  type CreateAdminTechnologyRequest,
} from "@/api/adminTechnologiesApi"
import AdminFormPageHeader from "@/components/admin/forms/AdminFormPageHeader"
import CharacterCount from "@/components/admin/forms/CharacterCount"
import FormCard from "@/components/admin/forms/FormCard"
import FormField from "@/components/admin/forms/FormField"
import ImageUploader from "@/components/admin/ImageUploader"
import RichTextEditor from "@/components/admin/RichTextEditor"
import SEO from "@/components/seo/SEO"

const initialFormData: CreateAdminTechnologyRequest = {
  name: "",
  slug: "",
  category: "",
  icon: "",
  logo_url: null,
  description: "",
  display_order: 0,
  is_featured: false,
  is_active: true,
  seo_title: "",
  seo_description: "",
}

function createSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

function getPlainText(value: string): string {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim()
}

function getValidationMessage(detail: unknown): string {
  if (typeof detail === "string") {
    return detail
  }

  if (!Array.isArray(detail) || detail.length === 0) {
    return "Unable to create the technology."
  }

  return detail
    .map((validationError) => {
      const field = Array.isArray(validationError?.loc)
        ? validationError.loc
            .filter((item: unknown) => item !== "body")
            .join(".")
        : "field"

      const message =
        typeof validationError?.msg === "string"
          ? validationError.msg
          : "Please check this value."

      return `${field}: ${message}`
    })
    .join(" | ")
}

export default function AdminTechnologyCreate() {
  const navigate = useNavigate()

  const [formData, setFormData] =
    useState<CreateAdminTechnologyRequest>(initialFormData)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  function updateField<Key extends keyof CreateAdminTechnologyRequest>(
    field: Key,
    value: CreateAdminTechnologyRequest[Key]
  ) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }))
  }

  function handleNameChange(value: string) {
    setFormData((current) => {
      const previousName = current.name

      return {
        ...current,
        name: value,
        slug:
          current.slug === createSlug(previousName) || current.slug === ""
            ? createSlug(value)
            : current.slug,
        seo_title:
          current.seo_title === `${previousName} | Cubicles Services` ||
          current.seo_title === ""
            ? `${value} | Cubicles Services`
            : current.seo_title,
      }
    })
  }

  async function handleSubmit() {
    if (isSubmitting) {
      return
    }

    setFormError(null)

    const name = formData.name.trim()
    const slug = createSlug(formData.slug)
    const category = formData.category.trim()
    const icon = formData.icon.trim()
    const description = formData.description.trim()
    const descriptionText = getPlainText(description)
    const seoTitle = formData.seo_title.trim()
    const seoDescription = formData.seo_description.trim()

    let validationMessage: string | null = null

    if (name.length < 2) {
      validationMessage = "Technology name must contain at least 2 characters."
    } else if (slug.length < 2) {
      validationMessage = "Slug must contain at least 2 characters."
    } else if (category.length < 2) {
      validationMessage = "Category must contain at least 2 characters."
    } else if (icon.length < 1) {
      validationMessage = "Please enter an icon name."
    } else if (descriptionText.length < 10) {
      validationMessage =
        "Description must contain at least 10 visible characters."
    } else if (seoTitle.length < 3) {
      validationMessage = "SEO title must contain at least 3 characters."
    } else if (seoDescription.length < 10) {
      validationMessage = "SEO description must contain at least 10 characters."
    }

    if (validationMessage) {
      setFormError(validationMessage)
      toast.error(validationMessage)

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })

      return
    }

    try {
      setIsSubmitting(true)

      await createAdminTechnology({
        name,
        slug,
        category,
        icon,
        logo_url: formData.logo_url?.trim() || null,
        description,
        display_order: formData.display_order,
        is_featured: formData.is_featured,
        is_active: formData.is_active,
        seo_title: seoTitle,
        seo_description: seoDescription,
      })

      toast.success("Technology created successfully.")
      navigate("/admin/technologies")
    } catch (error) {
      console.error(error)

      let message = "Unable to create the technology."

      if (axios.isAxiosError(error)) {
        message = getValidationMessage(error.response?.data?.detail)
      }

      setFormError(message)
      toast.error(message)

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const requiredChecks = useMemo(
    () => [
      formData.name.trim().length >= 2,
      createSlug(formData.slug).length >= 2,
      formData.category.trim().length >= 2,
      formData.icon.trim().length >= 1,
      getPlainText(formData.description).length >= 10,
      formData.seo_title.trim().length >= 3,
      formData.seo_description.trim().length >= 10,
    ],
    [formData]
  )

  const completedFields = requiredChecks.filter(Boolean).length
  const completionPercentage = Math.round(
    (completedFields / requiredChecks.length) * 100
  )

  return (
    <>
      <SEO
        title="Create Technology | Cubicles Services Admin"
        description="Create a new Cubicles Services technology."
      />

      <div className="space-y-6">
        <AdminFormPageHeader
          eyebrow="Technology management"
          title="Create Technology"
          description="Add a new technology capability, configure its presentation, and optimize it for search."
          backLabel="Back to Technologies"
          onBack={() => navigate("/admin/technologies")}
          submitLabel="Create Technology"
          submittingLabel="Creating..."
          isSubmitting={isSubmitting}
          onSubmit={() => {
            void handleSubmit()
          }}
        />

        {formError && (
          <div
            role="alert"
            className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700 shadow-sm"
          >
            {formError}
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            <SectionCard
              icon={<Cpu className="size-5" />}
              title="Technology information"
              description="Define the technology name, URL, category, and public description."
            >
              <FormField id="technology-name" label="Technology Name" required>
                <input
                  id="technology-name"
                  type="text"
                  maxLength={150}
                  value={formData.name}
                  onChange={(event) => handleNameChange(event.target.value)}
                  className={inputClassName}
                  placeholder="Amazon Web Services"
                  disabled={isSubmitting}
                />

                <CharacterCount current={formData.name.length} maximum={150} />
              </FormField>

              <FormField
                id="technology-slug"
                label="Slug"
                required
                description={`Public URL: /technologies/${
                  formData.slug || "technology-slug"
                }`}
              >
                <div className="relative">
                  <Globe2 className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-slate-400" />

                  <input
                    id="technology-slug"
                    type="text"
                    maxLength={150}
                    value={formData.slug}
                    onChange={(event) =>
                      updateField("slug", createSlug(event.target.value))
                    }
                    className={`${inputClassName} pl-12 font-mono text-sm`}
                    placeholder="amazon-web-services"
                    disabled={isSubmitting}
                  />
                </div>

                <CharacterCount current={formData.slug.length} maximum={150} />
              </FormField>

              <FormField id="technology-category" label="Category" required>
                <input
                  id="technology-category"
                  type="text"
                  maxLength={100}
                  value={formData.category}
                  onChange={(event) =>
                    updateField("category", event.target.value)
                  }
                  className={inputClassName}
                  placeholder="Cloud Platforms"
                  disabled={isSubmitting}
                />

                <CharacterCount
                  current={formData.category.length}
                  maximum={100}
                />
              </FormField>

              <RichEditorField
                value={formData.description}
                disabled={isSubmitting}
                onChange={(value) => updateField("description", value)}
              />
            </SectionCard>

            <SectionCard
              icon={<Search className="size-5" />}
              title="Search engine optimization"
              description="Control how this technology appears in search results and shared links."
            >
              <FormField id="technology-seo-title" label="SEO Title" required>
                <input
                  id="technology-seo-title"
                  type="text"
                  maxLength={255}
                  value={formData.seo_title}
                  onChange={(event) =>
                    updateField("seo_title", event.target.value)
                  }
                  className={inputClassName}
                  disabled={isSubmitting}
                />

                <CharacterCount
                  current={formData.seo_title.length}
                  maximum={255}
                />
              </FormField>

              <FormField
                id="technology-seo-description"
                label="SEO Description"
                required
              >
                <textarea
                  id="technology-seo-description"
                  rows={5}
                  maxLength={500}
                  value={formData.seo_description}
                  onChange={(event) =>
                    updateField("seo_description", event.target.value)
                  }
                  className={`${inputClassName} leading-7`}
                  placeholder="Describe this technology capability for search engines."
                  disabled={isSubmitting}
                />

                <CharacterCount
                  current={formData.seo_description.length}
                  maximum={500}
                />
              </FormField>

              <SearchPreview
                title={formData.seo_title}
                slug={formData.slug}
                description={formData.seo_description}
              />
            </SectionCard>
          </div>

          <aside className="space-y-6">
            <section className="sticky top-24 space-y-6">
              <FormCard
                title="Create technology"
                description="Save this technology and return to the management list."
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
                  {isSubmitting ? "Creating..." : "Create Technology"}
                </button>
              </FormCard>

              <FormCard
                title="Display settings"
                description="Configure the icon, ordering, visibility, and featured state."
              >
                <div className="space-y-5">
                  <FormField
                    id="technology-icon"
                    label="Icon Name"
                    required
                    description="Enter the icon identifier used by the public interface."
                  >
                    <div className="relative">
                      <Sparkles className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-slate-400" />

                      <input
                        id="technology-icon"
                        type="text"
                        maxLength={100}
                        value={formData.icon}
                        onChange={(event) =>
                          updateField("icon", event.target.value)
                        }
                        className={`${inputClassName} pl-12 font-mono`}
                        placeholder="cloud"
                        disabled={isSubmitting}
                      />
                    </div>
                  </FormField>

                  <FormField
                    id="technology-order"
                    label="Display Order"
                    description="Lower numbers appear earlier in technology listings."
                  >
                    <input
                      id="technology-order"
                      type="number"
                      min={0}
                      value={formData.display_order}
                      onChange={(event) =>
                        updateField(
                          "display_order",
                          Math.max(0, Number(event.target.value))
                        )
                      }
                      className={inputClassName}
                      disabled={isSubmitting}
                    />
                  </FormField>

                  <ToggleField
                    icon={<Star className="size-4" />}
                    title="Featured Technology"
                    description="Highlight this technology in featured website sections."
                    checked={formData.is_featured}
                    disabled={isSubmitting}
                    onChange={(checked) => updateField("is_featured", checked)}
                  />

                  <ToggleField
                    icon={<Eye className="size-4" />}
                    title="Active"
                    description="Active technologies are visible on the public website."
                    checked={formData.is_active}
                    disabled={isSubmitting}
                    onChange={(checked) => updateField("is_active", checked)}
                  />
                </div>
              </FormCard>

              <FormCard
                title="Technology logo"
                description="Upload the logo shown on technology cards and detail pages."
              >
                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm ring-1 ring-slate-200">
                      <ImageIcon className="size-4" />
                    </div>

                    <div>
                      <p className="text-sm font-extrabold text-slate-950">
                        Brand image
                      </p>

                      <p className="text-xs text-slate-500">
                        PNG, JPG, WebP, or SVG
                      </p>
                    </div>
                  </div>

                  <ImageUploader
                    label="Technology Logo"
                    value={formData.logo_url}
                    onChange={(value) => updateField("logo_url", value)}
                    accept=".png,.jpg,.jpeg,.webp,.svg"
                    helpText="Upload PNG, JPG, WebP or SVG up to 5 MB."
                    disabled={isSubmitting}
                    compactPreview
                  />
                </div>
              </FormCard>

              <CompletionCard
                completedFields={completedFields}
                totalFields={requiredChecks.length}
                percentage={completionPercentage}
                isActive={formData.is_active}
                isFeatured={formData.is_featured}
              />

              <section className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-violet-50 p-5">
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm ring-1 ring-blue-100">
                    <Settings2 className="size-5" />
                  </div>

                  <div>
                    <h2 className="font-extrabold text-slate-950">
                      Display guidance
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Use a clear category, concise icon name, and sensible
                      display order to keep technology listings organized and
                      easy to scan.
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
      <div className="space-y-6">{children}</div>
    </FormCard>
  )
}

function RichEditorField({
  value,
  disabled,
  onChange,
}: {
  value: string
  disabled: boolean
  onChange: (value: string) => void
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-slate-700">
        Description
        <span className="text-red-600"> *</span>
      </label>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white focus-within:border-blue-300 focus-within:ring-4 focus-within:ring-blue-100">
        <RichTextEditor
          value={value}
          onChange={onChange}
          placeholder="Describe the technology capability and how it is used."
          disabled={disabled}
        />
      </div>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        Enter at least 10 visible characters. Use headings, lists, and
        formatting where helpful.
      </p>
    </div>
  )
}

function ToggleField({
  icon,
  title,
  description,
  checked,
  disabled,
  onChange,
}: {
  icon: ReactNode
  title: string
  description: string
  checked: boolean
  disabled: boolean
  onChange: (checked: boolean) => void
}) {
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
        <span className="flex items-center gap-2 text-sm font-extrabold text-slate-950">
          {icon}
          {title}
        </span>

        <span className="mt-1 block text-xs leading-5 text-slate-500">
          {description}
        </span>
      </span>
    </label>
  )
}

function CompletionCard({
  completedFields,
  totalFields,
  percentage,
  isActive,
  isFeatured,
}: {
  completedFields: number
  totalFields: number
  percentage: number
  isActive: boolean
  isFeatured: boolean
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-extrabold text-slate-950">
            Technology completion
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
          icon={<FileText className="size-4" />}
          label="Completion"
          value={`${percentage}%`}
        />

        <StatusMetric
          icon={<Layers3 className="size-4" />}
          label="Visibility"
          value={isActive ? "Active" : "Inactive"}
        />
      </div>

      <div
        className={`mt-3 rounded-xl border px-4 py-3 text-sm font-bold ${
          isFeatured
            ? "border-violet-200 bg-violet-50 text-violet-700"
            : "border-slate-200 bg-slate-50 text-slate-700"
        }`}
      >
        {isFeatured ? "Featured technology" : "Standard technology"}
      </div>
    </section>
  )
}

function StatusMetric({
  icon,
  label,
  value,
}: {
  icon: ReactNode
  label: string
  value: string
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <div className="flex items-center gap-2 text-slate-500">
        {icon}

        <span className="text-[11px] font-bold tracking-[0.12em] uppercase">
          {label}
        </span>
      </div>

      <p className="mt-2 text-sm font-black text-slate-950">{value}</p>
    </div>
  )
}

function SearchPreview({
  title,
  slug,
  description,
}: {
  title: string
  slug: string
  description: string
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <div className="flex items-center gap-2 text-xs font-extrabold tracking-[0.16em] text-slate-500 uppercase">
        <Sparkles className="size-3.5" />
        Search preview
      </div>

      <div className="mt-4 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
        <p className="truncate text-xs text-emerald-700">
          cubiclesservices.com › technologies › {slug || "technology-slug"}
        </p>

        <p className="mt-1 line-clamp-2 text-lg font-medium text-blue-700">
          {title || "Technology | Cubicles Services"}
        </p>

        <p className="mt-1 line-clamp-3 text-sm leading-6 text-slate-600">
          {description ||
            "Add an SEO description to preview how this technology may appear in search results."}
        </p>
      </div>
    </section>
  )
}

const inputClassName =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"

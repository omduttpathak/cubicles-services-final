import { useEffect, useState } from "react"
import axios from "axios"
import { ArrowLeft, Plus, Save, Trash2 } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"

import {
  getAdminServiceById,
  updateAdminService,
  type UpdateAdminServiceRequest,
} from "@/api/adminServicesApi"
import RichTextEditor from "@/components/admin/RichTextEditor"
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

const initialFormData: UpdateAdminServiceRequest = {
  title: "",
  slug: "",
  icon: "",
  short_description: "",
  description: "",
  highlights: [""],
  hero_title: "",
  hero_description: "",
  seo_title: "",
  seo_description: "",
}

export default function AdminServiceEdit() {
  const { serviceId } = useParams<{
    serviceId: string
  }>()

  const navigate = useNavigate()

  const parsedServiceId = Number(serviceId)

  const [formData, setFormData] =
    useState<UpdateAdminServiceRequest>(initialFormData)

  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function updateField<Key extends keyof UpdateAdminServiceRequest>(
    field: Key,
    value: UpdateAdminServiceRequest[Key]
  ) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }))
  }

  function updateHighlight(index: number, value: string) {
    setFormData((current) => ({
      ...current,
      highlights: current.highlights.map((highlight, highlightIndex) =>
        highlightIndex === index ? value : highlight
      ),
    }))
  }

  function addHighlight() {
    setFormData((current) => ({
      ...current,
      highlights: [...current.highlights, ""],
    }))
  }

  function removeHighlight(index: number) {
    setFormData((current) => {
      if (current.highlights.length === 1) {
        return current
      }

      return {
        ...current,
        highlights: current.highlights.filter(
          (_, highlightIndex) => highlightIndex !== index
        ),
      }
    })
  }

  async function loadService() {
    if (!Number.isInteger(parsedServiceId) || parsedServiceId <= 0) {
      setHasError(true)
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setHasError(false)

      const service = await getAdminServiceById(parsedServiceId)

      setFormData({
        title: service.title,
        slug: service.slug,
        icon: service.icon,
        short_description: service.short_description,
        description: service.description,
        highlights: service.highlights.length > 0 ? service.highlights : [""],
        hero_title: service.hero_title,
        hero_description: service.hero_description,
        seo_title: service.seo_title,
        seo_description: service.seo_description,
      })
    } catch (error) {
      console.error(error)
      setHasError(true)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSubmit() {
    const normalizedHighlights = formData.highlights
      .map((highlight) => highlight.trim())
      .filter(Boolean)

    const title = formData.title.trim()
    const slug = createSlug(formData.slug)
    const icon = formData.icon.trim()
    const shortDescription = formData.short_description.trim()
    const description = formData.description.trim()
    const descriptionText = getPlainText(description)
    const heroTitle = formData.hero_title.trim()
    const heroDescription = formData.hero_description.trim()
    const seoTitle = formData.seo_title.trim()
    const seoDescription = formData.seo_description.trim()

    if (title.length < 3) {
      toast.error("Service title must contain at least 3 characters.")
      return
    }

    if (slug.length < 3) {
      toast.error("Slug must contain at least 3 characters.")
      return
    }

    if (icon.length < 2) {
      toast.error("Icon name must contain at least 2 characters.")
      return
    }

    if (shortDescription.length < 20) {
      toast.error("Short description must contain at least 20 characters.")
      return
    }

    if (descriptionText.length < 50) {
      toast.error(
        "Full description must contain at least 50 visible characters."
      )
      return
    }

    if (normalizedHighlights.length === 0) {
      toast.error("Please enter at least one service highlight.")
      return
    }

    if (heroTitle.length < 3) {
      toast.error("Hero title must contain at least 3 characters.")
      return
    }

    if (heroDescription.length < 20) {
      toast.error("Hero description must contain at least 20 characters.")
      return
    }

    if (seoTitle.length < 10) {
      toast.error("SEO title must contain at least 10 characters.")
      return
    }

    if (seoDescription.length < 20) {
      toast.error("SEO description must contain at least 20 characters.")
      return
    }

    try {
      setIsSubmitting(true)

      await updateAdminService(parsedServiceId, {
        title,
        slug,
        icon,
        short_description: shortDescription,
        description,
        highlights: normalizedHighlights,
        hero_title: heroTitle,
        hero_description: heroDescription,
        seo_title: seoTitle,
        seo_description: seoDescription,
      })

      toast.success("Service updated successfully.")

      navigate("/admin/services")
    } catch (error) {
      console.error(error)

      if (axios.isAxiosError(error)) {
        const detail = error.response?.data?.detail

        if (typeof detail === "string") {
          toast.error(detail)
        } else if (Array.isArray(detail) && detail.length > 0) {
          const messages = detail.map((validationError) => {
            const field = Array.isArray(validationError?.loc)
              ? validationError.loc
                  .filter((item: unknown) => item !== "body")
                  .join(".")
              : "field"

            return `${field}: ${
              validationError?.msg || "Please check this value."
            }`
          })

          toast.error(messages.join(" | "))
        } else {
          toast.error("Unable to update the service.")
        }
      } else {
        toast.error("Unable to update the service.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    void loadService()
  }, [serviceId])

  if (isLoading) {
    return <PageLoader message="Loading service..." />
  }

  if (hasError) {
    return (
      <ErrorState
        title="Unable to Load Service"
        message="The service could not be loaded."
        onRetry={() => {
          void loadService()
        }}
      />
    )
  }

  return (
    <>
      <SEO
        title="Edit Service | Cubicles Services Admin"
        description="Edit an existing Cubicles Services website service."
      />

      <section>
        <div className="flex flex-col gap-4 rounded-xl bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <button
              type="button"
              onClick={() => navigate("/admin/services")}
              className="inline-flex items-center text-sm font-semibold text-blue-600 transition hover:text-blue-700"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Services
            </button>

            <h1 className="mt-3 text-2xl font-bold text-slate-900">
              Edit Service
            </h1>

            <p className="mt-1 text-sm text-slate-600">
              Update service content, highlights, hero copy and SEO information.
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
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">
                Service Information
              </h2>

              <div className="mt-6 space-y-5">
                <FormField id="service-title" label="Service Title" required>
                  <input
                    id="service-title"
                    type="text"
                    maxLength={150}
                    value={formData.title}
                    onChange={(event) =>
                      updateField("title", event.target.value)
                    }
                    className={inputClassName}
                  />
                </FormField>

                <FormField id="service-slug" label="Slug" required>
                  <input
                    id="service-slug"
                    type="text"
                    maxLength={150}
                    value={formData.slug}
                    onChange={(event) =>
                      updateField("slug", createSlug(event.target.value))
                    }
                    className={`${inputClassName} font-mono text-sm`}
                  />

                  <p className="mt-2 text-sm text-slate-500">
                    Public URL: /services/
                    {formData.slug}
                  </p>
                </FormField>

                <FormField
                  id="service-short-description"
                  label="Short Description"
                  required
                >
                  <textarea
                    id="service-short-description"
                    rows={4}
                    maxLength={500}
                    value={formData.short_description}
                    onChange={(event) =>
                      updateField("short_description", event.target.value)
                    }
                    className={inputClassName}
                  />

                  <CharacterCount
                    current={formData.short_description.length}
                    maximum={500}
                  />
                </FormField>

                <div>
                  <label className="mb-2 block font-medium text-slate-700">
                    Full Description
                    <span className="text-red-600"> *</span>
                  </label>

                  <RichTextEditor
                    value={formData.description}
                    onChange={(value) => updateField("description", value)}
                    placeholder="Describe the service, business value and delivery approach."
                    disabled={isSubmitting}
                  />

                  <p className="mt-2 text-sm text-slate-500">
                    Enter at least 50 visible characters. Use headings, lists,
                    quotes and formatting to structure the service content.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Service Highlights
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Update the capabilities displayed on the service page.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addHighlight}
                  className="inline-flex items-center justify-center rounded-lg border border-blue-200 px-4 py-2 font-semibold text-blue-600 transition hover:bg-blue-50"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Highlight
                </button>
              </div>

              <div className="mt-6 space-y-3">
                {formData.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <input
                      type="text"
                      value={highlight}
                      onChange={(event) =>
                        updateHighlight(index, event.target.value)
                      }
                      className={inputClassName}
                      placeholder={`Highlight ${index + 1}`}
                    />

                    <button
                      type="button"
                      disabled={formData.highlights.length === 1}
                      onClick={() => removeHighlight(index)}
                      title="Remove highlight"
                      aria-label={`Remove highlight ${index + 1}`}
                      className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-red-200 text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">Hero Section</h2>

              <div className="mt-6 space-y-5">
                <FormField id="service-hero-title" label="Hero Title" required>
                  <input
                    id="service-hero-title"
                    type="text"
                    maxLength={200}
                    value={formData.hero_title}
                    onChange={(event) =>
                      updateField("hero_title", event.target.value)
                    }
                    className={inputClassName}
                  />
                </FormField>

                <FormField
                  id="service-hero-description"
                  label="Hero Description"
                  required
                >
                  <textarea
                    id="service-hero-description"
                    rows={5}
                    maxLength={500}
                    value={formData.hero_description}
                    onChange={(event) =>
                      updateField("hero_description", event.target.value)
                    }
                    className={inputClassName}
                  />

                  <CharacterCount
                    current={formData.hero_description.length}
                    maximum={500}
                  />
                </FormField>
              </div>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">
                Search Engine Optimization
              </h2>

              <div className="mt-6 space-y-5">
                <FormField id="service-seo-title" label="SEO Title" required>
                  <input
                    id="service-seo-title"
                    type="text"
                    maxLength={255}
                    value={formData.seo_title}
                    onChange={(event) =>
                      updateField("seo_title", event.target.value)
                    }
                    className={inputClassName}
                  />

                  <CharacterCount
                    current={formData.seo_title.length}
                    maximum={255}
                  />
                </FormField>

                <FormField
                  id="service-seo-description"
                  label="SEO Description"
                  required
                >
                  <textarea
                    id="service-seo-description"
                    rows={5}
                    maxLength={500}
                    value={formData.seo_description}
                    onChange={(event) =>
                      updateField("seo_description", event.target.value)
                    }
                    className={inputClassName}
                  />

                  <CharacterCount
                    current={formData.seo_description.length}
                    maximum={500}
                  />
                </FormField>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">
                Display Settings
              </h2>

              <div className="mt-6">
                <FormField id="service-icon" label="Icon Name" required>
                  <input
                    id="service-icon"
                    type="text"
                    maxLength={50}
                    value={formData.icon}
                    onChange={(event) =>
                      updateField("icon", event.target.value)
                    }
                    className={`${inputClassName} font-mono`}
                  />

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Existing values include cloud, workflow, refresh and shield.
                  </p>
                </FormField>
              </div>
            </div>

            <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
              <h2 className="font-bold text-slate-900">Public Visibility</h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Saving changes updates the public service page immediately.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}

type FormFieldProps = {
  id: string
  label: string
  required?: boolean
  children: React.ReactNode
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

function CharacterCount({
  current,
  maximum,
}: {
  current: number
  maximum: number
}) {
  return (
    <p className="mt-1 text-right text-xs text-slate-500">
      {current}/{maximum}
    </p>
  )
}

const inputClassName =
  "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"

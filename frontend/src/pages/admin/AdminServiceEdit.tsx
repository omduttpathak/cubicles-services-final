import { useEffect, useState } from "react"
import axios from "axios"
import {
  CheckCircle2,
  Globe2,
  Plus,
  Sparkles,
  Trash2,
  Wrench,
} from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"

import {
  getAdminServiceById,
  updateAdminService,
  type UpdateAdminServiceRequest,
} from "@/api/adminServicesApi"
import AdminFormPageHeader from "@/components/admin/forms/AdminFormPageHeader"
import CharacterCount from "@/components/admin/forms/CharacterCount"
import FormCard from "@/components/admin/forms/FormCard"
import FormField from "@/components/admin/forms/FormField"
import StickyActionPanel from "@/components/admin/forms/StickyActionPanel"
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

  const completedRequiredFields = [
    formData.title.trim().length >= 3,
    createSlug(formData.slug).length >= 3,
    formData.icon.trim().length >= 2,
    formData.short_description.trim().length >= 20,
    getPlainText(formData.description).length >= 50,
    formData.highlights.some((highlight) => highlight.trim().length > 0),
    formData.hero_title.trim().length >= 3,
    formData.hero_description.trim().length >= 20,
    formData.seo_title.trim().length >= 10,
    formData.seo_description.trim().length >= 20,
  ].filter(Boolean).length

  return (
    <>
      <SEO
        title="Edit Service | Cubicles Services Admin"
        description="Edit an existing Cubicles Services website service."
      />

      <div className="space-y-6">
        <AdminFormPageHeader
          eyebrow="Service management"
          title={`Edit ${formData.title || "Service"}`}
          description="Update the public service page, its highlights, hero messaging, and search-engine metadata."
          backLabel="Back to Services"
          onBack={() => navigate("/admin/services")}
          submitLabel="Save Changes"
          submittingLabel="Saving..."
          isSubmitting={isSubmitting}
          onSubmit={() => {
            void handleSubmit()
          }}
        />

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            <FormCard
              title="Service information"
              description="Update the core identity and public-facing service content."
            >
              <div className="space-y-6">
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

                <FormField
                  id="service-slug"
                  label="Slug"
                  required
                  description={`Public URL: /services/${formData.slug}`}
                >
                  <div className="relative">
                    <Globe2 className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-slate-400" />
                    <input
                      id="service-slug"
                      type="text"
                      maxLength={150}
                      value={formData.slug}
                      onChange={(event) =>
                        updateField("slug", createSlug(event.target.value))
                      }
                      className={`${inputClassName} pl-12 font-mono text-sm`}
                    />
                  </div>
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
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Full Description
                    <span className="text-red-600"> *</span>
                  </label>

                  <div className="overflow-hidden rounded-xl border border-slate-200 bg-white focus-within:border-blue-300 focus-within:ring-4 focus-within:ring-blue-100">
                    <RichTextEditor
                      value={formData.description}
                      onChange={(value) => updateField("description", value)}
                      placeholder="Describe the service, business value and delivery approach."
                      disabled={isSubmitting}
                    />
                  </div>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Enter at least 50 visible characters. Use headings, lists,
                    quotes, and formatting to structure the content.
                  </p>
                </div>
              </div>
            </FormCard>

            <FormCard
              title="Service highlights"
              description="Update the capabilities and benefits shown on the public service page."
              action={
                <button
                  type="button"
                  onClick={addHighlight}
                  className="inline-flex h-10 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 px-4 text-sm font-bold text-blue-700 transition hover:border-blue-300 hover:bg-blue-100"
                >
                  <Plus className="mr-2 size-4" />
                  Add Highlight
                </button>
              }
            >
              <div className="space-y-3">
                {formData.highlights.map((highlight, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-3"
                  >
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white text-sm font-extrabold text-blue-600 shadow-sm ring-1 ring-slate-200">
                      {index + 1}
                    </div>

                    <input
                      type="text"
                      value={highlight}
                      onChange={(event) =>
                        updateHighlight(index, event.target.value)
                      }
                      className={`${inputClassName} bg-white`}
                      placeholder={`Highlight ${index + 1}`}
                    />

                    <button
                      type="button"
                      disabled={formData.highlights.length === 1}
                      onClick={() => removeHighlight(index)}
                      title="Remove highlight"
                      aria-label={`Remove highlight ${index + 1}`}
                      className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-600 transition hover:border-red-300 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                ))}
              </div>
            </FormCard>

            <FormCard
              title="Hero section"
              description="Update the primary message visitors see at the top of the service page."
            >
              <div className="space-y-6">
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
            </FormCard>

            <FormCard
              title="Search engine optimization"
              description="Update how the service appears in search results and shared links."
            >
              <div className="space-y-6">
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
            </FormCard>
          </div>

          <div className="space-y-6">
            <StickyActionPanel
              title="Save changes"
              description="Review the updated content before publishing it to the live service page."
              submitLabel="Save Changes"
              submittingLabel="Saving..."
              isSubmitting={isSubmitting}
              onSubmit={() => {
                void handleSubmit()
              }}
              secondaryAction={
                <button
                  type="button"
                  onClick={() => navigate("/admin/services")}
                  className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  Cancel
                </button>
              }
            />

            <FormCard
              title="Display settings"
              description="Update the icon identifier used by the public service page."
            >
              <FormField
                id="service-icon"
                label="Icon Name"
                required
                description="Existing values include cloud, workflow, refresh, and shield."
              >
                <div className="relative">
                  <Wrench className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-slate-400" />
                  <input
                    id="service-icon"
                    type="text"
                    maxLength={50}
                    value={formData.icon}
                    onChange={(event) =>
                      updateField("icon", event.target.value)
                    }
                    className={`${inputClassName} pl-12 font-mono`}
                  />
                </div>
              </FormField>
            </FormCard>

            <section className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-violet-50 p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm ring-1 ring-blue-100">
                  <Sparkles className="size-5" />
                </div>

                <div>
                  <h2 className="font-extrabold text-slate-950">
                    Completion progress
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {completedRequiredFields} of 10 required checks currently
                    pass.
                  </p>
                </div>
              </div>

              <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-white/80">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-600 to-violet-600 transition-all duration-500"
                  style={{
                    width: `${(completedRequiredFields / 10) * 100}%`,
                  }}
                />
              </div>
            </section>

            <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600" />

                <div>
                  <h2 className="font-extrabold text-slate-950">
                    Public visibility
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Saving changes updates the public service page immediately.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  )
}

const inputClassName =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"

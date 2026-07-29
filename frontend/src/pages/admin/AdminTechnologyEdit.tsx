import { useEffect, useState, type ReactNode } from "react"
import axios from "axios"
import { ArrowLeft, Save } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"

import {
  getAdminTechnologyById,
  updateAdminTechnology,
  type UpdateAdminTechnologyRequest,
} from "@/api/adminTechnologiesApi"
import ImageUploader from "@/components/admin/ImageUploader"
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

const initialFormData: UpdateAdminTechnologyRequest = {
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

export default function AdminTechnologyEdit() {
  const { technologyId } = useParams<{
    technologyId: string
  }>()

  const navigate = useNavigate()
  const parsedTechnologyId = Number(technologyId)

  const [formData, setFormData] =
    useState<UpdateAdminTechnologyRequest>(initialFormData)

  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function updateField<Key extends keyof UpdateAdminTechnologyRequest>(
    field: Key,
    value: UpdateAdminTechnologyRequest[Key]
  ) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }))
  }

  async function loadTechnology() {
    if (!Number.isInteger(parsedTechnologyId) || parsedTechnologyId <= 0) {
      setHasError(true)
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setHasError(false)

      const technology = await getAdminTechnologyById(parsedTechnologyId)

      setFormData({
        name: technology.name,
        slug: technology.slug,
        category: technology.category,
        icon: technology.icon,
        logo_url: technology.logo_url,
        description: technology.description,
        display_order: technology.display_order,
        is_featured: technology.is_featured,
        is_active: technology.is_active,
        seo_title: technology.seo_title,
        seo_description: technology.seo_description,
      })
    } catch (error) {
      console.error(error)
      setHasError(true)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSubmit() {
    const name = formData.name.trim()
    const slug = createSlug(formData.slug)
    const category = formData.category.trim()
    const icon = formData.icon.trim()
    const description = formData.description.trim()
    const descriptionText = getPlainText(description)
    const seoTitle = formData.seo_title.trim()
    const seoDescription = formData.seo_description.trim()

    if (name.length < 2) {
      toast.error("Technology name must contain at least 2 characters.")
      return
    }

    if (slug.length < 2) {
      toast.error("Slug must contain at least 2 characters.")
      return
    }

    if (category.length < 2) {
      toast.error("Category must contain at least 2 characters.")
      return
    }

    if (icon.length < 1) {
      toast.error("Please enter an icon name.")
      return
    }

    if (descriptionText.length < 10) {
      toast.error("Description must contain at least 10 visible characters.")
      return
    }

    if (seoTitle.length < 3) {
      toast.error("SEO title must contain at least 3 characters.")
      return
    }

    if (seoDescription.length < 10) {
      toast.error("SEO description must contain at least 10 characters.")
      return
    }

    try {
      setIsSubmitting(true)

      await updateAdminTechnology(parsedTechnologyId, {
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

      toast.success("Technology updated successfully.")

      navigate("/admin/technologies")
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
          toast.error("Unable to update the technology.")
        }
      } else {
        toast.error("Unable to update the technology.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    void loadTechnology()
  }, [technologyId])

  if (isLoading) {
    return <PageLoader message="Loading technology..." />
  }

  if (hasError) {
    return (
      <ErrorState
        title="Unable to Load Technology"
        message="The technology could not be loaded."
        onRetry={() => {
          void loadTechnology()
        }}
      />
    )
  }

  return (
    <>
      <SEO
        title="Edit Technology | Cubicles Services Admin"
        description="Edit an existing Cubicles Services technology."
      />

      <section>
        <div className="flex flex-col gap-4 rounded-xl bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <button
              type="button"
              onClick={() => navigate("/admin/technologies")}
              className="inline-flex items-center text-sm font-semibold text-blue-600 transition hover:text-blue-700"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Technologies
            </button>

            <h1 className="mt-3 text-2xl font-bold text-slate-900">
              Edit Technology
            </h1>

            <p className="mt-1 text-sm text-slate-600">
              Update technology content, display settings and SEO information.
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
                Technology Information
              </h2>

              <div className="mt-6 space-y-5">
                <FormField
                  id="technology-name"
                  label="Technology Name"
                  required
                >
                  <input
                    id="technology-name"
                    type="text"
                    maxLength={150}
                    value={formData.name}
                    onChange={(event) =>
                      updateField("name", event.target.value)
                    }
                    className={inputClassName}
                  />
                </FormField>

                <FormField id="technology-slug" label="Slug" required>
                  <input
                    id="technology-slug"
                    type="text"
                    maxLength={150}
                    value={formData.slug}
                    onChange={(event) =>
                      updateField("slug", createSlug(event.target.value))
                    }
                    className={`${inputClassName} font-mono text-sm`}
                  />

                  <p className="mt-2 text-sm text-slate-500">
                    Public URL: /technologies/
                    {formData.slug}
                  </p>
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
                  />
                </FormField>

                <div>
                  <label className="mb-2 block font-medium text-slate-700">
                    Description
                    <span className="text-red-600"> *</span>
                  </label>

                  <RichTextEditor
                    value={formData.description}
                    onChange={(value) => updateField("description", value)}
                    placeholder="Describe the technology capability and how it is used."
                    disabled={isSubmitting}
                  />

                  <p className="mt-2 text-sm text-slate-500">
                    Enter at least 10 visible characters.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">
                Search Engine Optimization
              </h2>

              <div className="mt-6 space-y-5">
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

              <div className="mt-6 space-y-5">
                <FormField id="technology-icon" label="Icon Name" required>
                  <input
                    id="technology-icon"
                    type="text"
                    maxLength={100}
                    value={formData.icon}
                    onChange={(event) =>
                      updateField("icon", event.target.value)
                    }
                    className={`${inputClassName} font-mono`}
                  />
                </FormField>

                <ImageUploader
                  label="Technology Logo"
                  value={formData.logo_url}
                  onChange={(value) => updateField("logo_url", value)}
                  accept=".png,.jpg,.jpeg,.webp,.svg"
                  helpText="Upload PNG, JPG, WebP or SVG up to 5 MB."
                  disabled={isSubmitting}
                  compactPreview
                />

                <FormField id="technology-order" label="Display Order">
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
                  />
                </FormField>

                <ToggleField
                  title="Featured Technology"
                  description="Highlight this technology in featured website sections."
                  checked={formData.is_featured}
                  onChange={(checked) => updateField("is_featured", checked)}
                />

                <ToggleField
                  title="Active"
                  description="Active technologies are visible on the public website."
                  checked={formData.is_active}
                  onChange={(checked) => updateField("is_active", checked)}
                />
              </div>
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

function ToggleField({
  title,
  description,
  checked,
  onChange,
}: {
  title: string
  description: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-1 h-4 w-4"
      />

      <span>
        <span className="block font-semibold text-slate-900">{title}</span>

        <span className="mt-1 block text-sm text-slate-500">{description}</span>
      </span>
    </label>
  )
}

const inputClassName =
  "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"

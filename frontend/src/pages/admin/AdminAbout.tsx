import { useEffect, useState, type ReactNode } from "react"
import axios from "axios"
import { Building2, Eye, FileText, Save, Search, Sparkles } from "lucide-react"
import { toast } from "sonner"

import {
  getAdminAboutPage,
  updateAdminAboutPage,
  type UpdateAdminAboutPageRequest,
} from "@/api/adminAboutApi"
import ErrorState from "@/components/common/ErrorState"
import PageLoader from "@/components/common/PageLoader"
import SEO from "@/components/seo/SEO"

const initialFormData: UpdateAdminAboutPageRequest = {
  hero_badge: "About Cubicles Services",
  hero_title: "Cloud, DevOps and Modern Application Engineering Experts",
  hero_description:
    "We help organizations modernize infrastructure, automate software delivery and build secure cloud-native platforms.",

  overview_eyebrow: "Company Overview",
  overview_title: "Building Cloud-Native Businesses",
  overview_description_one:
    "We specialize in Cloud Migration, DevOps Engineering, Application Modernization and Managed IT Services. Our engineers help organizations modernize infrastructure, automate deployments and build highly available platforms capable of supporting future business growth.",
  overview_description_two:
    "From startups to enterprise organizations, our focus is on delivering secure, scalable and cost-effective technology solutions that create measurable business value.",

  values_eyebrow: "Our Values",
  values_title: "What Drives Us",
  values_description:
    "Our culture is built on innovation, customer success and engineering excellence.",

  seo_title: "About Us | Cubicles Services",
  seo_description:
    "Learn about Cubicles Services, our mission, values and expertise in Cloud, DevOps and Application Modernization.",

  show_hero: true,
  show_overview: true,
  show_values: true,
  is_active: true,
}

export default function AdminAbout() {
  const [formData, setFormData] =
    useState<UpdateAdminAboutPageRequest>(initialFormData)

  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function updateField<Key extends keyof UpdateAdminAboutPageRequest>(
    field: Key,
    value: UpdateAdminAboutPageRequest[Key]
  ) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }))
  }

  async function loadAboutPage() {
    try {
      setIsLoading(true)
      setHasError(false)

      const response = await getAdminAboutPage()
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
    if (
      !formData.hero_badge.trim() ||
      !formData.hero_title.trim() ||
      !formData.hero_description.trim() ||
      !formData.overview_eyebrow.trim() ||
      !formData.overview_title.trim() ||
      !formData.overview_description_one.trim() ||
      !formData.overview_description_two.trim() ||
      !formData.values_eyebrow.trim() ||
      !formData.values_title.trim() ||
      !formData.values_description.trim() ||
      !formData.seo_title.trim() ||
      !formData.seo_description.trim()
    ) {
      toast.error("Please complete all required fields.")
      return
    }

    try {
      setIsSubmitting(true)

      const updated = await updateAdminAboutPage({
        hero_badge: formData.hero_badge.trim(),
        hero_title: formData.hero_title.trim(),
        hero_description: formData.hero_description.trim(),

        overview_eyebrow: formData.overview_eyebrow.trim(),
        overview_title: formData.overview_title.trim(),
        overview_description_one: formData.overview_description_one.trim(),
        overview_description_two: formData.overview_description_two.trim(),

        values_eyebrow: formData.values_eyebrow.trim(),
        values_title: formData.values_title.trim(),
        values_description: formData.values_description.trim(),

        seo_title: formData.seo_title.trim(),
        seo_description: formData.seo_description.trim(),

        show_hero: formData.show_hero,
        show_overview: formData.show_overview,
        show_values: formData.show_values,
        is_active: formData.is_active,
      })

      const { id: _id, ...settings } = updated

      setFormData(settings)

      toast.success("About page settings updated successfully.")
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
          toast.error("Unable to update About page settings.")
        }
      } else {
        toast.error("Unable to update About page settings.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    void loadAboutPage()
  }, [])

  if (isLoading) {
    return <PageLoader message="Loading About page settings..." />
  }

  if (hasError) {
    return (
      <ErrorState
        title="Unable to Load About Page"
        message="The About page settings could not be loaded."
        onRetry={() => {
          void loadAboutPage()
        }}
      />
    )
  }

  return (
    <>
      <SEO
        title="About Page | Cubicles Services Admin"
        description="Manage the Cubicles Services About page content and visibility."
      />

      <section>
        <div className="flex flex-col gap-4 rounded-xl bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold tracking-wider text-blue-600 uppercase">
              Content Management
            </p>

            <h1 className="mt-1 text-2xl font-bold text-slate-900">
              About Page
            </h1>

            <p className="mt-1 text-sm text-slate-600">
              Manage the About page hero, company overview, values heading,
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
              icon={<Sparkles className="h-5 w-5" />}
              title="Hero Section"
              description="The first section visitors see on the About page."
            >
              <TextField
                id="about-hero-badge"
                label="Hero Badge"
                value={formData.hero_badge}
                maxLength={255}
                onChange={(value) => updateField("hero_badge", value)}
              />

              <TextAreaField
                id="about-hero-title"
                label="Hero Title"
                value={formData.hero_title}
                rows={4}
                maxLength={500}
                onChange={(value) => updateField("hero_title", value)}
              />

              <TextAreaField
                id="about-hero-description"
                label="Hero Description"
                value={formData.hero_description}
                rows={5}
                onChange={(value) => updateField("hero_description", value)}
              />
            </Panel>

            <Panel
              icon={<Building2 className="h-5 w-5" />}
              title="Company Overview"
              description="Describe the company, expertise and business focus."
            >
              <TextField
                id="about-overview-eyebrow"
                label="Section Eyebrow"
                value={formData.overview_eyebrow}
                maxLength={255}
                onChange={(value) => updateField("overview_eyebrow", value)}
              />

              <TextAreaField
                id="about-overview-title"
                label="Section Title"
                value={formData.overview_title}
                rows={3}
                maxLength={500}
                onChange={(value) => updateField("overview_title", value)}
              />

              <TextAreaField
                id="about-overview-description-one"
                label="Overview Paragraph One"
                value={formData.overview_description_one}
                rows={7}
                onChange={(value) =>
                  updateField("overview_description_one", value)
                }
              />

              <TextAreaField
                id="about-overview-description-two"
                label="Overview Paragraph Two"
                value={formData.overview_description_two}
                rows={6}
                onChange={(value) =>
                  updateField("overview_description_two", value)
                }
              />
            </Panel>

            <Panel
              icon={<FileText className="h-5 w-5" />}
              title="Values Section"
              description="Manage the heading shown above the company values cards."
            >
              <TextField
                id="about-values-eyebrow"
                label="Section Eyebrow"
                value={formData.values_eyebrow}
                maxLength={255}
                onChange={(value) => updateField("values_eyebrow", value)}
              />

              <TextAreaField
                id="about-values-title"
                label="Section Title"
                value={formData.values_title}
                rows={3}
                maxLength={500}
                onChange={(value) => updateField("values_title", value)}
              />

              <TextAreaField
                id="about-values-description"
                label="Section Description"
                value={formData.values_description}
                rows={5}
                maxLength={500}
                onChange={(value) => updateField("values_description", value)}
              />

              <CharacterCount
                current={formData.values_description.length}
                maximum={500}
              />
            </Panel>

            <Panel
              icon={<Search className="h-5 w-5" />}
              title="Search Engine Optimization"
              description="Metadata used by search engines and social previews."
            >
              <TextField
                id="about-seo-title"
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
                id="about-seo-description"
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
                    Control the public About page.
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <ToggleField
                  title="About Page Active"
                  description="Keep enabled so the public About page can load these settings."
                  checked={formData.is_active}
                  onChange={(checked) => updateField("is_active", checked)}
                />

                <ToggleField
                  title="Show Hero Section"
                  description="Display the main About page hero."
                  checked={formData.show_hero}
                  onChange={(checked) => updateField("show_hero", checked)}
                />

                <ToggleField
                  title="Show Company Overview"
                  description="Display the overview text and company statistics."
                  checked={formData.show_overview}
                  onChange={(checked) => updateField("show_overview", checked)}
                />

                <ToggleField
                  title="Show Company Values"
                  description="Display the company values card section."
                  checked={formData.show_values}
                  onChange={(checked) => updateField("show_values", checked)}
                />
              </div>
            </div>

            <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
              <h2 className="font-bold text-slate-900">Related Content</h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Company statistics and individual values are managed from
                separate admin pages.
              </p>

              <div className="mt-4 space-y-2 text-sm font-semibold text-blue-700">
                <p>About Statistics</p>
                <p>About Values</p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
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

import { useEffect, useState, type ReactNode } from "react"
import axios from "axios"
import {
  Blocks,
  BriefcaseBusiness,
  CheckCircle2,
  Eye,
  Flag,
  Layers3,
  MousePointerClick,
  Search,
  Sparkles,
} from "lucide-react"
import { toast } from "sonner"

import {
  getAdminServicesPage,
  updateAdminServicesPage,
  type UpdateAdminServicesPageRequest,
} from "@/api/adminServicesPageApi"
import AdminFormPageHeader from "@/components/admin/forms/AdminFormPageHeader"
import CharacterCount from "@/components/admin/forms/CharacterCount"
import FormCard from "@/components/admin/forms/FormCard"
import FormField from "@/components/admin/forms/FormField"
import StickyActionPanel from "@/components/admin/forms/StickyActionPanel"
import ErrorState from "@/components/common/ErrorState"
import PageLoader from "@/components/common/PageLoader"
import SEO from "@/components/seo/SEO"

const initialFormData: UpdateAdminServicesPageRequest = {
  hero_badge: "Our Services",
  hero_title: "Transforming Ideas into",
  hero_highlight: "Digital Solutions",
  hero_description:
    "At Cubicles Services, we help startups and enterprises build scalable software solutions using modern technologies. From web applications to cloud infrastructure and DevOps automation, we deliver reliable digital products that drive business growth.",
  primary_button_text: "Get Started",
  primary_button_url: "/contact",
  secondary_button_text: "Contact Us",
  secondary_button_url: "/contact",
  hero_feature_one: "Web Development",
  hero_feature_two: "Cloud & DevOps",
  hero_feature_three: "Mobile Applications",
  hero_feature_four: "AI Solutions",
  services_eyebrow: "Our Services",
  services_title: "End-to-End Cloud & Digital Engineering Services",
  services_description:
    "We help organizations modernize infrastructure, accelerate software delivery and build secure cloud-native solutions that scale with business growth.",
  services_empty_title: "No Services Available",
  services_empty_description:
    "Service information will appear here when available.",
  service_button_text: "Learn More",
  benefits_badge: "Why Choose Us",
  benefits_title: "Why Organizations Choose Cubicles Services",
  benefits_description:
    "We combine cloud expertise, automation and security best practices to deliver reliable technology solutions that help businesses grow.",
  process_eyebrow: "Our Process",
  process_title: "How We Deliver Successful Projects",
  process_description:
    "Every engagement follows a structured methodology that minimizes risks, improves delivery quality and ensures successful project execution.",
  industries_eyebrow: "Industries",
  industries_title: "Industries We Serve",
  industries_description:
    "We help organizations across multiple industries modernize, automate and scale their technology platforms.",
  cta_title: "Ready to Transform Your Business?",
  cta_description:
    "Partner with Cubicles Services for cloud migration, DevOps automation, application modernization and managed IT solutions.",
  cta_primary_button_text: "Schedule Consultation",
  cta_primary_button_url: "/contact",
  cta_secondary_button_text: "Explore Technologies",
  cta_secondary_button_url: "/technologies",
  seo_title: "Cloud Services | Cubicles Services",
  seo_description:
    "Cloud migration, DevOps engineering, application modernization and managed IT services.",
  show_hero: true,
  show_services: true,
  show_benefits: true,
  show_process: true,
  show_stats: true,
  show_industries: true,
  show_cta: true,
  is_active: true,
}

const requiredStringFields: Array<keyof UpdateAdminServicesPageRequest> = [
  "hero_badge",
  "hero_title",
  "hero_highlight",
  "hero_description",
  "primary_button_text",
  "primary_button_url",
  "secondary_button_text",
  "secondary_button_url",
  "hero_feature_one",
  "hero_feature_two",
  "hero_feature_three",
  "hero_feature_four",
  "services_eyebrow",
  "services_title",
  "services_description",
  "services_empty_title",
  "services_empty_description",
  "service_button_text",
  "benefits_badge",
  "benefits_title",
  "benefits_description",
  "process_eyebrow",
  "process_title",
  "process_description",
  "industries_eyebrow",
  "industries_title",
  "industries_description",
  "cta_title",
  "cta_description",
  "cta_primary_button_text",
  "cta_primary_button_url",
  "cta_secondary_button_text",
  "cta_secondary_button_url",
  "seo_title",
  "seo_description",
]

export default function AdminServicesPage() {
  const [formData, setFormData] =
    useState<UpdateAdminServicesPageRequest>(initialFormData)

  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function updateField<Key extends keyof UpdateAdminServicesPageRequest>(
    field: Key,
    value: UpdateAdminServicesPageRequest[Key]
  ) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }))
  }

  async function loadServicesPage() {
    try {
      setIsLoading(true)
      setHasError(false)

      const response = await getAdminServicesPage()
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

      const payload = trimServicesPageData(formData)
      const updated = await updateAdminServicesPage(payload)
      const { id: _id, ...settings } = updated

      setFormData(settings)
      toast.success("Services page settings updated successfully.")
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
          toast.error("Unable to update Services page settings.")
        }
      } else {
        toast.error("Unable to update Services page settings.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    void loadServicesPage()
  }, [])

  if (isLoading) {
    return <PageLoader message="Loading Services page settings..." />
  }

  if (hasError) {
    return (
      <ErrorState
        title="Unable to Load Services Page"
        message="The Services page settings could not be loaded."
        onRetry={() => {
          void loadServicesPage()
        }}
      />
    )
  }

  const visibleSectionCount = [
    formData.show_hero,
    formData.show_services,
    formData.show_benefits,
    formData.show_process,
    formData.show_stats,
    formData.show_industries,
    formData.show_cta,
  ].filter(Boolean).length

  return (
    <>
      <SEO
        title="Services Page | Cubicles Services Admin"
        description="Manage the public Services page content, visibility and SEO."
      />

      <div className="space-y-6">
        <AdminFormPageHeader
          eyebrow="Content management"
          title="Services Page"
          description="Manage the public Services page hero, section headings, calls to action, visibility controls, and SEO settings."
          backLabel="Services content"
          onBack={() => window.scrollTo({ top: 0, behavior: "smooth" })}
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
              icon={<Sparkles className="size-5" />}
              title="Hero section"
              description="Manage the introduction displayed at the top of the Services page."
            >
              <TextField
                id="services-hero-badge"
                label="Hero Badge"
                value={formData.hero_badge}
                maxLength={255}
                onChange={(value) => updateField("hero_badge", value)}
              />

              <TextField
                id="services-hero-title"
                label="Hero Title"
                value={formData.hero_title}
                maxLength={500}
                onChange={(value) => updateField("hero_title", value)}
              />

              <TextField
                id="services-hero-highlight"
                label="Highlighted Title Text"
                value={formData.hero_highlight}
                maxLength={255}
                onChange={(value) => updateField("hero_highlight", value)}
              />

              <TextAreaField
                id="services-hero-description"
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
            </SectionCard>

            <SectionCard
              icon={<MousePointerClick className="size-5" />}
              title="Hero buttons"
              description="Configure the primary and secondary hero actions."
            >
              <div className="grid gap-5 md:grid-cols-2">
                <TextField
                  id="services-primary-button-text"
                  label="Primary Button Text"
                  value={formData.primary_button_text}
                  maxLength={100}
                  onChange={(value) =>
                    updateField("primary_button_text", value)
                  }
                />

                <TextField
                  id="services-primary-button-url"
                  label="Primary Button URL"
                  value={formData.primary_button_url}
                  maxLength={500}
                  onChange={(value) => updateField("primary_button_url", value)}
                />

                <TextField
                  id="services-secondary-button-text"
                  label="Secondary Button Text"
                  value={formData.secondary_button_text}
                  maxLength={100}
                  onChange={(value) =>
                    updateField("secondary_button_text", value)
                  }
                />

                <TextField
                  id="services-secondary-button-url"
                  label="Secondary Button URL"
                  value={formData.secondary_button_url}
                  maxLength={500}
                  onChange={(value) =>
                    updateField("secondary_button_url", value)
                  }
                />
              </div>
            </SectionCard>

            <SectionCard
              icon={<Blocks className="size-5" />}
              title="Hero feature labels"
              description="Manage the four capability labels displayed beside the hero content."
            >
              <div className="grid gap-5 md:grid-cols-2">
                {[
                  [
                    "hero_feature_one",
                    "Feature One",
                    formData.hero_feature_one,
                  ],
                  [
                    "hero_feature_two",
                    "Feature Two",
                    formData.hero_feature_two,
                  ],
                  [
                    "hero_feature_three",
                    "Feature Three",
                    formData.hero_feature_three,
                  ],
                  [
                    "hero_feature_four",
                    "Feature Four",
                    formData.hero_feature_four,
                  ],
                ].map(([field, label, value], index) => (
                  <TextField
                    key={field}
                    id={`services-feature-${index + 1}`}
                    label={label}
                    value={value}
                    maxLength={150}
                    onChange={(nextValue) =>
                      updateField(
                        field as keyof UpdateAdminServicesPageRequest,
                        nextValue
                      )
                    }
                  />
                ))}
              </div>
            </SectionCard>

            <SectionCard
              icon={<Layers3 className="size-5" />}
              title="Services listing section"
              description="Manage the heading, empty state, and service-card action text."
            >
              <TextField
                id="services-list-eyebrow"
                label="Section Eyebrow"
                value={formData.services_eyebrow}
                maxLength={255}
                onChange={(value) => updateField("services_eyebrow", value)}
              />

              <TextField
                id="services-list-title"
                label="Section Title"
                value={formData.services_title}
                maxLength={500}
                onChange={(value) => updateField("services_title", value)}
              />

              <TextAreaField
                id="services-list-description"
                label="Section Description"
                value={formData.services_description}
                rows={5}
                maxLength={1000}
                onChange={(value) => updateField("services_description", value)}
              />

              <CharacterCount
                current={formData.services_description.length}
                maximum={1000}
              />

              <div className="grid gap-5 md:grid-cols-2">
                <TextField
                  id="services-empty-title"
                  label="Empty State Title"
                  value={formData.services_empty_title}
                  maxLength={255}
                  onChange={(value) =>
                    updateField("services_empty_title", value)
                  }
                />

                <TextField
                  id="services-button-text"
                  label="Service Card Button Text"
                  value={formData.service_button_text}
                  maxLength={100}
                  onChange={(value) =>
                    updateField("service_button_text", value)
                  }
                />
              </div>

              <TextAreaField
                id="services-empty-description"
                label="Empty State Description"
                value={formData.services_empty_description}
                rows={4}
                maxLength={500}
                onChange={(value) =>
                  updateField("services_empty_description", value)
                }
              />
            </SectionCard>

            <SectionCard
              icon={<Sparkles className="size-5" />}
              title="Benefits section"
              description="Manage the heading displayed above the benefit cards."
            >
              <TextField
                id="services-benefits-badge"
                label="Section Badge"
                value={formData.benefits_badge}
                maxLength={255}
                onChange={(value) => updateField("benefits_badge", value)}
              />

              <TextField
                id="services-benefits-title"
                label="Section Title"
                value={formData.benefits_title}
                maxLength={500}
                onChange={(value) => updateField("benefits_title", value)}
              />

              <TextAreaField
                id="services-benefits-description"
                label="Section Description"
                value={formData.benefits_description}
                rows={5}
                maxLength={1000}
                onChange={(value) => updateField("benefits_description", value)}
              />
            </SectionCard>

            <SectionCard
              icon={<Flag className="size-5" />}
              title="Process section"
              description="Manage the heading above the delivery-process steps."
            >
              <TextField
                id="services-process-eyebrow"
                label="Section Eyebrow"
                value={formData.process_eyebrow}
                maxLength={255}
                onChange={(value) => updateField("process_eyebrow", value)}
              />

              <TextField
                id="services-process-title"
                label="Section Title"
                value={formData.process_title}
                maxLength={500}
                onChange={(value) => updateField("process_title", value)}
              />

              <TextAreaField
                id="services-process-description"
                label="Section Description"
                value={formData.process_description}
                rows={5}
                maxLength={1000}
                onChange={(value) => updateField("process_description", value)}
              />
            </SectionCard>

            <SectionCard
              icon={<BriefcaseBusiness className="size-5" />}
              title="Industries section"
              description="Manage the heading above the industry cards."
            >
              <TextField
                id="services-industries-eyebrow"
                label="Section Eyebrow"
                value={formData.industries_eyebrow}
                maxLength={255}
                onChange={(value) => updateField("industries_eyebrow", value)}
              />

              <TextField
                id="services-industries-title"
                label="Section Title"
                value={formData.industries_title}
                maxLength={500}
                onChange={(value) => updateField("industries_title", value)}
              />

              <TextAreaField
                id="services-industries-description"
                label="Section Description"
                value={formData.industries_description}
                rows={5}
                maxLength={1000}
                onChange={(value) =>
                  updateField("industries_description", value)
                }
              />
            </SectionCard>

            <SectionCard
              icon={<MousePointerClick className="size-5" />}
              title="Call to action"
              description="Manage the final conversion section."
            >
              <TextField
                id="services-cta-title"
                label="CTA Title"
                value={formData.cta_title}
                maxLength={500}
                onChange={(value) => updateField("cta_title", value)}
              />

              <TextAreaField
                id="services-cta-description"
                label="CTA Description"
                value={formData.cta_description}
                rows={5}
                maxLength={1000}
                onChange={(value) => updateField("cta_description", value)}
              />

              <div className="grid gap-5 md:grid-cols-2">
                <TextField
                  id="services-cta-primary-text"
                  label="Primary Button Text"
                  value={formData.cta_primary_button_text}
                  maxLength={100}
                  onChange={(value) =>
                    updateField("cta_primary_button_text", value)
                  }
                />

                <TextField
                  id="services-cta-primary-url"
                  label="Primary Button URL"
                  value={formData.cta_primary_button_url}
                  maxLength={500}
                  onChange={(value) =>
                    updateField("cta_primary_button_url", value)
                  }
                />

                <TextField
                  id="services-cta-secondary-text"
                  label="Secondary Button Text"
                  value={formData.cta_secondary_button_text}
                  maxLength={100}
                  onChange={(value) =>
                    updateField("cta_secondary_button_text", value)
                  }
                />

                <TextField
                  id="services-cta-secondary-url"
                  label="Secondary Button URL"
                  value={formData.cta_secondary_button_url}
                  maxLength={500}
                  onChange={(value) =>
                    updateField("cta_secondary_button_url", value)
                  }
                />
              </div>
            </SectionCard>

            <SectionCard
              icon={<Search className="size-5" />}
              title="Search engine optimization"
              description="Metadata used by search engines and social previews."
            >
              <TextField
                id="services-seo-title"
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
                id="services-seo-description"
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
            </SectionCard>
          </div>

          <div className="space-y-6">
            <StickyActionPanel
              title="Save page settings"
              description="Review the content and visibility options before updating the public Services page."
              submitLabel="Save Changes"
              submittingLabel="Saving..."
              isSubmitting={isSubmitting}
              onSubmit={() => {
                void handleSubmit()
              }}
            />

            <FormCard
              title="Page visibility"
              description="Control which sections appear on the public Services page."
            >
              <div className="space-y-3">
                <ToggleField
                  title="Services Page Active"
                  description="Keep enabled so the public page can load these settings."
                  checked={formData.is_active}
                  onChange={(checked) => updateField("is_active", checked)}
                />

                <ToggleField
                  title="Show Hero Section"
                  description="Display the main Services page introduction."
                  checked={formData.show_hero}
                  onChange={(checked) => updateField("show_hero", checked)}
                />

                <ToggleField
                  title="Show Services Listing"
                  description="Display service cards loaded from the Services API."
                  checked={formData.show_services}
                  onChange={(checked) => updateField("show_services", checked)}
                />

                <ToggleField
                  title="Show Benefits"
                  description="Display the Why Choose Us section."
                  checked={formData.show_benefits}
                  onChange={(checked) => updateField("show_benefits", checked)}
                />

                <ToggleField
                  title="Show Process"
                  description="Display the project delivery process."
                  checked={formData.show_process}
                  onChange={(checked) => updateField("show_process", checked)}
                />

                <ToggleField
                  title="Show Statistics"
                  description="Display the Services statistics section."
                  checked={formData.show_stats}
                  onChange={(checked) => updateField("show_stats", checked)}
                />

                <ToggleField
                  title="Show Industries"
                  description="Display the Industries We Serve section."
                  checked={formData.show_industries}
                  onChange={(checked) =>
                    updateField("show_industries", checked)
                  }
                />

                <ToggleField
                  title="Show Call to Action"
                  description="Display the final Services page CTA."
                  checked={formData.show_cta}
                  onChange={(checked) => updateField("show_cta", checked)}
                />
              </div>
            </FormCard>

            <section className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-violet-50 p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm ring-1 ring-blue-100">
                  <Eye className="size-5" />
                </div>

                <div>
                  <h2 className="font-extrabold text-slate-950">
                    Page overview
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {visibleSectionCount} of 7 optional page sections are
                    currently visible.
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600" />

                <div>
                  <h2 className="font-extrabold text-slate-950">
                    Individual services
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Service cards and service-detail content are managed
                    separately from the Services menu in the admin sidebar.
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <h2 className="font-extrabold text-slate-950">
                Static section records
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Benefit cards, process steps, statistics, and industry cards
                still use their existing frontend data. This editor controls
                their headings and visibility.
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  )
}

function trimServicesPageData(
  data: UpdateAdminServicesPageRequest
): UpdateAdminServicesPageRequest {
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
    <label className="flex cursor-pointer items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 transition hover:border-slate-300 hover:bg-slate-50">
      <span>
        <span className="block text-sm font-bold text-slate-950">{title}</span>
        <span className="mt-1 block text-sm leading-6 text-slate-500">
          {description}
        </span>
      </span>

      <span className="relative mt-1 inline-flex shrink-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="peer sr-only"
        />
        <span className="h-6 w-11 rounded-full bg-slate-300 transition peer-checked:bg-blue-600 peer-focus-visible:ring-4 peer-focus-visible:ring-blue-100" />
        <span className="absolute top-1 left-1 size-4 rounded-full bg-white shadow-sm transition peer-checked:translate-x-5" />
      </span>
    </label>
  )
}

const inputClassName =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"

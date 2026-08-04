import { useEffect, useMemo, useState, type ReactNode } from "react"
import axios from "axios"
import {
  CheckCircle2,
  Eye,
  FileText,
  FormInput,
  MessageSquareText,
  Save,
  Search,
  Settings2,
  Sparkles,
} from "lucide-react"
import { toast } from "sonner"

import {
  getAdminContactPage,
  updateAdminContactPage,
  type UpdateAdminContactPageRequest,
} from "@/api/adminContactPageApi"
import AdminFormPageHeader from "@/components/admin/forms/AdminFormPageHeader"
import CharacterCount from "@/components/admin/forms/CharacterCount"
import FormCard from "@/components/admin/forms/FormCard"
import FormField from "@/components/admin/forms/FormField"
import ErrorState from "@/components/common/ErrorState"
import PageLoader from "@/components/common/PageLoader"
import SEO from "@/components/seo/SEO"

const initialFormData: UpdateAdminContactPageRequest = {
  hero_eyebrow: "Contact Us",
  hero_title: "Let's Build Something Great Together",
  hero_description:
    "Whether you're planning a cloud migration, DevOps transformation or application modernization, our experts are ready to help.",
  form_title: "Tell Us About Your Project",
  form_description:
    "Share your requirements and our team will get back to you as soon as possible.",
  full_name_label: "Full Name",
  email_label: "Email",
  company_label: "Company",
  phone_label: "Phone",
  service_label: "Service",
  message_label: "Message",
  service_placeholder: "Select Service",
  submit_button_text: "Send Message",
  submitting_button_text: "Sending...",
  success_message: "Message sent successfully!",
  error_message: "Unable to send message.",
  seo_title: "Contact Us | Cubicles Services",
  seo_description:
    "Contact Cubicles Services for Cloud Migration, DevOps Engineering and Application Modernization.",
  show_breadcrumb: true,
  show_form: true,
  is_active: true,
}

const requiredFields: Array<keyof UpdateAdminContactPageRequest> = [
  "hero_eyebrow",
  "hero_title",
  "hero_description",
  "form_title",
  "form_description",
  "full_name_label",
  "email_label",
  "company_label",
  "phone_label",
  "service_label",
  "message_label",
  "service_placeholder",
  "submit_button_text",
  "submitting_button_text",
  "success_message",
  "error_message",
  "seo_title",
  "seo_description",
]

export default function AdminContactPage() {
  const [formData, setFormData] =
    useState<UpdateAdminContactPageRequest>(initialFormData)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function updateField<Key extends keyof UpdateAdminContactPageRequest>(
    field: Key,
    value: UpdateAdminContactPageRequest[Key]
  ) {
    setFormData((current) => ({ ...current, [field]: value }))
  }

  async function loadContactPage() {
    try {
      setIsLoading(true)
      setHasError(false)
      const response = await getAdminContactPage()
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
    const hasMissingField = requiredFields.some((field) => {
      const value = formData[field]
      return typeof value === "string" && !value.trim()
    })

    if (hasMissingField) {
      toast.error("Please complete all required fields.")
      return
    }

    try {
      setIsSubmitting(true)
      const updated = await updateAdminContactPage({
        hero_eyebrow: formData.hero_eyebrow.trim(),
        hero_title: formData.hero_title.trim(),
        hero_description: formData.hero_description.trim(),
        form_title: formData.form_title.trim(),
        form_description: formData.form_description.trim(),
        full_name_label: formData.full_name_label.trim(),
        email_label: formData.email_label.trim(),
        company_label: formData.company_label.trim(),
        phone_label: formData.phone_label.trim(),
        service_label: formData.service_label.trim(),
        message_label: formData.message_label.trim(),
        service_placeholder: formData.service_placeholder.trim(),
        submit_button_text: formData.submit_button_text.trim(),
        submitting_button_text: formData.submitting_button_text.trim(),
        success_message: formData.success_message.trim(),
        error_message: formData.error_message.trim(),
        seo_title: formData.seo_title.trim(),
        seo_description: formData.seo_description.trim(),
        show_breadcrumb: formData.show_breadcrumb,
        show_form: formData.show_form,
        is_active: formData.is_active,
      })
      const { id: _id, ...settings } = updated
      setFormData(settings)
      toast.success("Contact page settings updated successfully.")
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
          toast.error("Unable to update Contact page settings.")
        }
      } else {
        toast.error("Unable to update Contact page settings.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    void loadContactPage()
  }, [])

  const completedFields = useMemo(
    () =>
      requiredFields.filter((field) => {
        const value = formData[field]
        return typeof value === "string" && Boolean(value.trim())
      }).length,
    [formData]
  )

  const completionPercentage = Math.round(
    (completedFields / requiredFields.length) * 100
  )

  const visibleSections = [formData.show_breadcrumb, formData.show_form].filter(
    Boolean
  ).length

  if (isLoading) {
    return <PageLoader message="Loading Contact page settings..." />
  }

  if (hasError) {
    return (
      <ErrorState
        title="Unable to Load Contact Page"
        message="The Contact page settings could not be loaded."
        onRetry={() => void loadContactPage()}
      />
    )
  }

  return (
    <>
      <SEO
        title="Contact Page | Cubicles Services Admin"
        description="Manage the public Contact page content, form labels and SEO."
      />

      <div className="space-y-6">
        <AdminFormPageHeader
          eyebrow="Content management"
          title="Contact Page"
          description="Manage the Contact page heading, form labels, feedback messages, visibility, and SEO."
          backLabel="Back to Contact Requests"
          onBack={() => window.history.back()}
          submitLabel="Save Changes"
          submittingLabel="Saving..."
          isSubmitting={isSubmitting}
          onSubmit={() => void handleSubmit()}
        />

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            <SectionCard
              icon={<MessageSquareText className="size-5" />}
              title="Page introduction"
              description="The heading displayed above the contact form."
            >
              <TextField
                id="contact-hero-eyebrow"
                label="Eyebrow"
                value={formData.hero_eyebrow}
                maxLength={255}
                disabled={isSubmitting}
                onChange={(value) => updateField("hero_eyebrow", value)}
              />
              <TextAreaField
                id="contact-hero-title"
                label="Page Title"
                value={formData.hero_title}
                rows={3}
                maxLength={500}
                disabled={isSubmitting}
                onChange={(value) => updateField("hero_title", value)}
              />
              <TextAreaField
                id="contact-hero-description"
                label="Page Description"
                value={formData.hero_description}
                rows={5}
                maxLength={1000}
                disabled={isSubmitting}
                onChange={(value) => updateField("hero_description", value)}
              />
            </SectionCard>

            <SectionCard
              icon={<FileText className="size-5" />}
              title="Form introduction"
              description="The heading displayed inside the contact form card."
            >
              <TextField
                id="contact-form-title"
                label="Form Title"
                value={formData.form_title}
                maxLength={255}
                disabled={isSubmitting}
                onChange={(value) => updateField("form_title", value)}
              />
              <TextAreaField
                id="contact-form-description"
                label="Form Description"
                value={formData.form_description}
                rows={4}
                maxLength={500}
                disabled={isSubmitting}
                onChange={(value) => updateField("form_description", value)}
              />
            </SectionCard>

            <SectionCard
              icon={<FormInput className="size-5" />}
              title="Form labels"
              description="Customize labels shown beside each form field."
            >
              <div className="grid gap-5 md:grid-cols-2">
                <TextField
                  id="contact-full-name-label"
                  label="Full Name Label"
                  value={formData.full_name_label}
                  maxLength={100}
                  disabled={isSubmitting}
                  onChange={(value) => updateField("full_name_label", value)}
                />
                <TextField
                  id="contact-email-label"
                  label="Email Label"
                  value={formData.email_label}
                  maxLength={100}
                  disabled={isSubmitting}
                  onChange={(value) => updateField("email_label", value)}
                />
                <TextField
                  id="contact-company-label"
                  label="Company Label"
                  value={formData.company_label}
                  maxLength={100}
                  disabled={isSubmitting}
                  onChange={(value) => updateField("company_label", value)}
                />
                <TextField
                  id="contact-phone-label"
                  label="Phone Label"
                  value={formData.phone_label}
                  maxLength={100}
                  disabled={isSubmitting}
                  onChange={(value) => updateField("phone_label", value)}
                />
                <TextField
                  id="contact-service-label"
                  label="Service Label"
                  value={formData.service_label}
                  maxLength={100}
                  disabled={isSubmitting}
                  onChange={(value) => updateField("service_label", value)}
                />
                <TextField
                  id="contact-message-label"
                  label="Message Label"
                  value={formData.message_label}
                  maxLength={100}
                  disabled={isSubmitting}
                  onChange={(value) => updateField("message_label", value)}
                />
              </div>
              <TextField
                id="contact-service-placeholder"
                label="Service Placeholder"
                value={formData.service_placeholder}
                maxLength={150}
                disabled={isSubmitting}
                onChange={(value) => updateField("service_placeholder", value)}
              />
            </SectionCard>

            <SectionCard
              icon={<MessageSquareText className="size-5" />}
              title="Buttons and notifications"
              description="Customize submit-button text and form feedback."
            >
              <div className="grid gap-5 md:grid-cols-2">
                <TextField
                  id="contact-submit-button"
                  label="Submit Button Text"
                  value={formData.submit_button_text}
                  maxLength={100}
                  disabled={isSubmitting}
                  onChange={(value) => updateField("submit_button_text", value)}
                />
                <TextField
                  id="contact-submitting-button"
                  label="Submitting Button Text"
                  value={formData.submitting_button_text}
                  maxLength={100}
                  disabled={isSubmitting}
                  onChange={(value) =>
                    updateField("submitting_button_text", value)
                  }
                />
              </div>
              <TextField
                id="contact-success-message"
                label="Success Message"
                value={formData.success_message}
                maxLength={255}
                disabled={isSubmitting}
                onChange={(value) => updateField("success_message", value)}
              />
              <TextField
                id="contact-error-message"
                label="Error Message"
                value={formData.error_message}
                maxLength={255}
                disabled={isSubmitting}
                onChange={(value) => updateField("error_message", value)}
              />
            </SectionCard>

            <SectionCard
              icon={<Search className="size-5" />}
              title="Search engine optimization"
              description="Metadata used by search engines and social previews."
            >
              <TextField
                id="contact-seo-title"
                label="SEO Title"
                value={formData.seo_title}
                maxLength={255}
                disabled={isSubmitting}
                onChange={(value) => updateField("seo_title", value)}
              />
              <TextAreaField
                id="contact-seo-description"
                label="SEO Description"
                value={formData.seo_description}
                rows={5}
                maxLength={500}
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
                description="Apply the current Contact page content, labels, messages, and visibility settings."
              >
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => void handleSubmit()}
                  className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-extrabold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Save className="mr-2 size-4" />
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </FormCard>

              <FormCard
                title="Page visibility"
                description="Control the public Contact page and its main elements."
              >
                <div className="space-y-3">
                  <ToggleField
                    title="Contact Page Active"
                    description="Keep enabled so the public Contact page can load these settings."
                    checked={formData.is_active}
                    disabled={isSubmitting}
                    onChange={(checked) => updateField("is_active", checked)}
                  />
                  <ToggleField
                    title="Show Breadcrumb"
                    description="Display Home and Contact navigation above the page heading."
                    checked={formData.show_breadcrumb}
                    disabled={isSubmitting}
                    onChange={(checked) =>
                      updateField("show_breadcrumb", checked)
                    }
                  />
                  <ToggleField
                    title="Show Contact Form"
                    description="Display the enquiry form on the public Contact page."
                    checked={formData.show_form}
                    disabled={isSubmitting}
                    onChange={(checked) => updateField("show_form", checked)}
                  />
                </div>
              </FormCard>

              <CompletionCard
                completedFields={completedFields}
                totalFields={requiredFields.length}
                percentage={completionPercentage}
                visibleSections={visibleSections}
                isActive={formData.is_active}
              />

              <InfoCard
                icon={<Settings2 className="size-5" />}
                title="Contact information"
                description="Company email, telephone number, and address are managed in Site Settings."
                tone="blue"
              />

              <InfoCard
                icon={<Eye className="size-5" />}
                title="Service options"
                description="The service dropdown is populated automatically from active public Services records."
                tone="amber"
              />
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
      <div className="space-y-5">{children}</div>
    </FormCard>
  )
}

type TextFieldProps = {
  id: string
  label: string
  value: string
  maxLength?: number
  disabled?: boolean
  onChange: (value: string) => void
}

function TextField({
  id,
  label,
  value,
  maxLength,
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
  disabled?: boolean
  onChange: (value: string) => void
}

function TextAreaField({
  id,
  label,
  value,
  rows,
  maxLength,
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
      className={`flex items-start gap-3 rounded-2xl border p-4 transition ${checked ? "border-blue-200 bg-blue-50/70" : "border-slate-200 bg-white hover:bg-slate-50"} ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
        className="sr-only"
      />
      <span
        aria-hidden="true"
        className={`relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition ${checked ? "bg-blue-600" : "bg-slate-300"}`}
      >
        <span
          className={`absolute top-1 size-4 rounded-full bg-white shadow-sm transition ${checked ? "left-6" : "left-1"}`}
        />
      </span>
      <span>
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

function CompletionCard({
  completedFields,
  totalFields,
  percentage,
  visibleSections,
  isActive,
}: {
  completedFields: number
  totalFields: number
  percentage: number
  visibleSections: number
  isActive: boolean
}) {
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
          label="Visible elements"
          value={`${visibleSections}/2`}
          icon={<Eye className="size-4" />}
        />
      </div>
      <div
        className={`mt-3 rounded-xl border px-4 py-3 text-sm font-bold ${isActive ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-amber-200 bg-amber-50 text-amber-700"}`}
      >
        {isActive ? "Contact page is active" : "Contact page is inactive"}
      </div>
    </section>
  )
}

function StatusMetric({
  label,
  value,
  icon,
}: {
  label: string
  value: string
  icon: ReactNode
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
  description,
}: {
  title: string
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
          cubiclesservices.com › contact
        </p>
        <p className="mt-1 line-clamp-2 text-lg font-medium text-blue-700">
          {title || "Contact Us | Cubicles Services"}
        </p>
        <p className="mt-1 line-clamp-3 text-sm leading-6 text-slate-600">
          {description ||
            "Add an SEO description to preview how the Contact page may appear in search results."}
        </p>
      </div>
    </section>
  )
}

function InfoCard({
  icon,
  title,
  description,
  tone,
}: {
  icon: ReactNode
  title: string
  description: string
  tone: "blue" | "amber"
}) {
  const classes =
    tone === "blue"
      ? "border-blue-200 bg-gradient-to-br from-blue-50 to-violet-50 text-blue-600 ring-blue-100"
      : "border-amber-200 bg-amber-50 text-amber-600 ring-amber-100"
  return (
    <section
      className={`rounded-2xl border p-5 ${classes.split(" ").slice(0, 2).join(" ")}`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex size-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ${classes.split(" ").slice(2).join(" ")}`}
        >
          {icon}
        </div>
        <div>
          <h2 className="font-extrabold text-slate-950">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
        </div>
      </div>
    </section>
  )
}

const inputClassName =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"

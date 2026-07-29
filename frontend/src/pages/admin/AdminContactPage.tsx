import { useEffect, useState, type ReactNode } from "react"
import axios from "axios"
import {
  Eye,
  FileText,
  FormInput,
  MessageSquareText,
  Save,
  Search,
} from "lucide-react"
import { toast } from "sonner"

import {
  getAdminContactPage,
  updateAdminContactPage,
  type UpdateAdminContactPageRequest,
} from "@/api/adminContactPageApi"
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
    setFormData((current) => ({
      ...current,
      [field]: value,
    }))
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

  if (isLoading) {
    return <PageLoader message="Loading Contact page settings..." />
  }

  if (hasError) {
    return (
      <ErrorState
        title="Unable to Load Contact Page"
        message="The Contact page settings could not be loaded."
        onRetry={() => {
          void loadContactPage()
        }}
      />
    )
  }

  return (
    <>
      <SEO
        title="Contact Page | Cubicles Services Admin"
        description="Manage the public Contact page content, form labels and SEO."
      />

      <section>
        <div className="flex flex-col gap-4 rounded-xl bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold tracking-wider text-blue-600 uppercase">
              Content Management
            </p>

            <h1 className="mt-1 text-2xl font-bold text-slate-900">
              Contact Page
            </h1>

            <p className="mt-1 text-sm text-slate-600">
              Manage the Contact page heading, form labels, messages, visibility
              and SEO.
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
              icon={<MessageSquareText className="h-5 w-5" />}
              title="Page Introduction"
              description="The heading displayed above the contact form."
            >
              <TextField
                id="contact-hero-eyebrow"
                label="Eyebrow"
                value={formData.hero_eyebrow}
                maxLength={255}
                onChange={(value) => updateField("hero_eyebrow", value)}
              />

              <TextAreaField
                id="contact-hero-title"
                label="Page Title"
                value={formData.hero_title}
                rows={3}
                maxLength={500}
                onChange={(value) => updateField("hero_title", value)}
              />

              <TextAreaField
                id="contact-hero-description"
                label="Page Description"
                value={formData.hero_description}
                rows={5}
                maxLength={1000}
                onChange={(value) => updateField("hero_description", value)}
              />

              <CharacterCount
                current={formData.hero_description.length}
                maximum={1000}
              />
            </Panel>

            <Panel
              icon={<FileText className="h-5 w-5" />}
              title="Form Introduction"
              description="The heading displayed inside the contact form card."
            >
              <TextField
                id="contact-form-title"
                label="Form Title"
                value={formData.form_title}
                maxLength={255}
                onChange={(value) => updateField("form_title", value)}
              />

              <TextAreaField
                id="contact-form-description"
                label="Form Description"
                value={formData.form_description}
                rows={4}
                maxLength={500}
                onChange={(value) => updateField("form_description", value)}
              />

              <CharacterCount
                current={formData.form_description.length}
                maximum={500}
              />
            </Panel>

            <Panel
              icon={<FormInput className="h-5 w-5" />}
              title="Form Labels"
              description="Customize labels shown beside each form field."
            >
              <div className="grid gap-5 md:grid-cols-2">
                <TextField
                  id="contact-full-name-label"
                  label="Full Name Label"
                  value={formData.full_name_label}
                  maxLength={100}
                  onChange={(value) => updateField("full_name_label", value)}
                />

                <TextField
                  id="contact-email-label"
                  label="Email Label"
                  value={formData.email_label}
                  maxLength={100}
                  onChange={(value) => updateField("email_label", value)}
                />

                <TextField
                  id="contact-company-label"
                  label="Company Label"
                  value={formData.company_label}
                  maxLength={100}
                  onChange={(value) => updateField("company_label", value)}
                />

                <TextField
                  id="contact-phone-label"
                  label="Phone Label"
                  value={formData.phone_label}
                  maxLength={100}
                  onChange={(value) => updateField("phone_label", value)}
                />

                <TextField
                  id="contact-service-label"
                  label="Service Label"
                  value={formData.service_label}
                  maxLength={100}
                  onChange={(value) => updateField("service_label", value)}
                />

                <TextField
                  id="contact-message-label"
                  label="Message Label"
                  value={formData.message_label}
                  maxLength={100}
                  onChange={(value) => updateField("message_label", value)}
                />
              </div>

              <TextField
                id="contact-service-placeholder"
                label="Service Placeholder"
                value={formData.service_placeholder}
                maxLength={150}
                onChange={(value) => updateField("service_placeholder", value)}
              />
            </Panel>

            <Panel
              icon={<MessageSquareText className="h-5 w-5" />}
              title="Buttons and Notifications"
              description="Customize submit-button text and form feedback."
            >
              <div className="grid gap-5 md:grid-cols-2">
                <TextField
                  id="contact-submit-button"
                  label="Submit Button Text"
                  value={formData.submit_button_text}
                  maxLength={100}
                  onChange={(value) => updateField("submit_button_text", value)}
                />

                <TextField
                  id="contact-submitting-button"
                  label="Submitting Button Text"
                  value={formData.submitting_button_text}
                  maxLength={100}
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
                onChange={(value) => updateField("success_message", value)}
              />

              <TextField
                id="contact-error-message"
                label="Error Message"
                value={formData.error_message}
                maxLength={255}
                onChange={(value) => updateField("error_message", value)}
              />
            </Panel>

            <Panel
              icon={<Search className="h-5 w-5" />}
              title="Search Engine Optimization"
              description="Metadata used by search engines and social previews."
            >
              <TextField
                id="contact-seo-title"
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
                id="contact-seo-description"
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
                    Control the public Contact page.
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <ToggleField
                  title="Contact Page Active"
                  description="Keep enabled so the public Contact page can load these settings."
                  checked={formData.is_active}
                  onChange={(checked) => updateField("is_active", checked)}
                />

                <ToggleField
                  title="Show Breadcrumb"
                  description="Display Home and Contact navigation above the page heading."
                  checked={formData.show_breadcrumb}
                  onChange={(checked) =>
                    updateField("show_breadcrumb", checked)
                  }
                />

                <ToggleField
                  title="Show Contact Form"
                  description="Display the enquiry form on the public Contact page."
                  checked={formData.show_form}
                  onChange={(checked) => updateField("show_form", checked)}
                />
              </div>
            </div>

            <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
              <h2 className="font-bold text-slate-900">Contact Information</h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Company email, telephone number and address are managed in Site
                Settings.
              </p>
            </div>

            <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
              <h2 className="font-bold text-slate-900">Service Options</h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                The service dropdown is populated automatically from active
                public Services records.
              </p>
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

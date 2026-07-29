import { useEffect, useState, type ReactNode } from "react"
import axios from "axios"
import {
  BriefcaseBusiness,
  Eye,
  FileText,
  FormInput,
  Save,
  Search,
  Upload,
} from "lucide-react"
import { toast } from "sonner"

import {
  getAdminCareerPage,
  updateAdminCareerPage,
  type UpdateAdminCareerPageRequest,
} from "@/api/adminCareerPageApi"
import ErrorState from "@/components/common/ErrorState"
import PageLoader from "@/components/common/PageLoader"
import SEO from "@/components/seo/SEO"

const initialFormData: UpdateAdminCareerPageRequest = {
  hero_eyebrow: "Careers",
  hero_title: "Build the Future with Cubicles Services",
  hero_description:
    "Join a team passionate about Cloud, DevOps, Automation and Modern Software Engineering.",

  openings_eyebrow: "Opportunities",
  openings_title: "Current Openings",
  openings_description:
    "Explore opportunities to grow your career while building modern cloud, DevOps and application-engineering solutions.",

  empty_title: "No Current Openings",
  empty_description: "Please check back later for new opportunities.",

  apply_button_text: "Apply Now",

  application_eyebrow: "Join Our Team",
  application_title_prefix: "Apply for",
  application_description:
    "Complete the form and our recruitment team will review your application.",

  full_name_label: "Full Name",
  email_label: "Email Address",
  phone_label: "Phone Number",
  position_label: "Position",
  experience_label: "Experience",
  company_label: "Current Company",
  location_label: "Current Location",
  linkedin_label: "LinkedIn URL",
  resume_label: "Upload Resume",
  cover_letter_label: "Cover Letter",

  resume_upload_title: "Choose resume file",
  resume_upload_description: "PDF, DOC or DOCX up to 5 MB",

  cancel_button_text: "Cancel",
  submit_button_text: "Submit Application",
  submitting_button_text: "Submitting...",

  success_message: "Career application submitted successfully.",
  error_message: "Unable to submit your application.",

  seo_title: "Careers | Cubicles Services",
  seo_description:
    "Join Cubicles Services and build modern cloud solutions with AWS, Azure and DevOps.",

  show_hero: true,
  show_openings: true,
  is_active: true,
}

export default function AdminCareerPage() {
  const [formData, setFormData] =
    useState<UpdateAdminCareerPageRequest>(initialFormData)

  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function updateField<Key extends keyof UpdateAdminCareerPageRequest>(
    field: Key,
    value: UpdateAdminCareerPageRequest[Key]
  ) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }))
  }

  async function loadCareerPage() {
    try {
      setIsLoading(true)
      setHasError(false)

      const response = await getAdminCareerPage()
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
    const requiredFields: Array<keyof UpdateAdminCareerPageRequest> = [
      "hero_eyebrow",
      "hero_title",
      "hero_description",
      "openings_eyebrow",
      "openings_title",
      "openings_description",
      "empty_title",
      "empty_description",
      "apply_button_text",
      "application_eyebrow",
      "application_title_prefix",
      "application_description",
      "full_name_label",
      "email_label",
      "phone_label",
      "position_label",
      "experience_label",
      "company_label",
      "location_label",
      "linkedin_label",
      "resume_label",
      "cover_letter_label",
      "resume_upload_title",
      "resume_upload_description",
      "cancel_button_text",
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

      const updated = await updateAdminCareerPage({
        hero_eyebrow: formData.hero_eyebrow.trim(),
        hero_title: formData.hero_title.trim(),
        hero_description: formData.hero_description.trim(),

        openings_eyebrow: formData.openings_eyebrow.trim(),
        openings_title: formData.openings_title.trim(),
        openings_description: formData.openings_description.trim(),

        empty_title: formData.empty_title.trim(),
        empty_description: formData.empty_description.trim(),

        apply_button_text: formData.apply_button_text.trim(),

        application_eyebrow: formData.application_eyebrow.trim(),
        application_title_prefix: formData.application_title_prefix.trim(),
        application_description: formData.application_description.trim(),

        full_name_label: formData.full_name_label.trim(),
        email_label: formData.email_label.trim(),
        phone_label: formData.phone_label.trim(),
        position_label: formData.position_label.trim(),
        experience_label: formData.experience_label.trim(),
        company_label: formData.company_label.trim(),
        location_label: formData.location_label.trim(),
        linkedin_label: formData.linkedin_label.trim(),
        resume_label: formData.resume_label.trim(),
        cover_letter_label: formData.cover_letter_label.trim(),

        resume_upload_title: formData.resume_upload_title.trim(),
        resume_upload_description: formData.resume_upload_description.trim(),

        cancel_button_text: formData.cancel_button_text.trim(),
        submit_button_text: formData.submit_button_text.trim(),
        submitting_button_text: formData.submitting_button_text.trim(),

        success_message: formData.success_message.trim(),
        error_message: formData.error_message.trim(),

        seo_title: formData.seo_title.trim(),
        seo_description: formData.seo_description.trim(),

        show_hero: formData.show_hero,
        show_openings: formData.show_openings,
        is_active: formData.is_active,
      })

      const { id: _id, ...settings } = updated

      setFormData(settings)
      toast.success("Careers page settings updated successfully.")
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
          toast.error("Unable to update Careers page settings.")
        }
      } else {
        toast.error("Unable to update Careers page settings.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    void loadCareerPage()
  }, [])

  if (isLoading) {
    return <PageLoader message="Loading Careers page settings..." />
  }

  if (hasError) {
    return (
      <ErrorState
        title="Unable to Load Careers Page"
        message="The Careers page settings could not be loaded."
        onRetry={() => {
          void loadCareerPage()
        }}
      />
    )
  }

  return (
    <>
      <SEO
        title="Careers Page | Cubicles Services Admin"
        description="Manage the public Careers page content and application form."
      />

      <section>
        <div className="flex flex-col gap-4 rounded-xl bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold tracking-wider text-blue-600 uppercase">
              Content Management
            </p>

            <h1 className="mt-1 text-2xl font-bold text-slate-900">
              Careers Page
            </h1>

            <p className="mt-1 text-sm text-slate-600">
              Manage Careers page headings, application labels, notifications,
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
              icon={<BriefcaseBusiness className="h-5 w-5" />}
              title="Hero Section"
              description="The introduction displayed at the top of the Careers page."
            >
              <TextField
                id="careers-hero-eyebrow"
                label="Hero Eyebrow"
                value={formData.hero_eyebrow}
                maxLength={255}
                onChange={(value) => updateField("hero_eyebrow", value)}
              />

              <TextAreaField
                id="careers-hero-title"
                label="Hero Title"
                value={formData.hero_title}
                rows={3}
                maxLength={500}
                onChange={(value) => updateField("hero_title", value)}
              />

              <TextAreaField
                id="careers-hero-description"
                label="Hero Description"
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
              icon={<BriefcaseBusiness className="h-5 w-5" />}
              title="Job Openings Section"
              description="The heading shown above available positions."
            >
              <TextField
                id="careers-openings-eyebrow"
                label="Section Eyebrow"
                value={formData.openings_eyebrow}
                maxLength={255}
                onChange={(value) => updateField("openings_eyebrow", value)}
              />

              <TextAreaField
                id="careers-openings-title"
                label="Section Title"
                value={formData.openings_title}
                rows={3}
                maxLength={500}
                onChange={(value) => updateField("openings_title", value)}
              />

              <TextAreaField
                id="careers-openings-description"
                label="Section Description"
                value={formData.openings_description}
                rows={5}
                maxLength={1000}
                onChange={(value) => updateField("openings_description", value)}
              />

              <CharacterCount
                current={formData.openings_description.length}
                maximum={1000}
              />

              <TextField
                id="careers-apply-button"
                label="Apply Button Text"
                value={formData.apply_button_text}
                maxLength={100}
                onChange={(value) => updateField("apply_button_text", value)}
              />
            </Panel>

            <Panel
              icon={<FileText className="h-5 w-5" />}
              title="Empty Openings State"
              description="Content displayed when no job positions are available."
            >
              <TextField
                id="careers-empty-title"
                label="Empty State Title"
                value={formData.empty_title}
                maxLength={255}
                onChange={(value) => updateField("empty_title", value)}
              />

              <TextAreaField
                id="careers-empty-description"
                label="Empty State Description"
                value={formData.empty_description}
                rows={4}
                maxLength={500}
                onChange={(value) => updateField("empty_description", value)}
              />
            </Panel>

            <Panel
              icon={<FormInput className="h-5 w-5" />}
              title="Application Introduction"
              description="The heading displayed at the top of the application modal."
            >
              <TextField
                id="careers-application-eyebrow"
                label="Application Eyebrow"
                value={formData.application_eyebrow}
                maxLength={255}
                onChange={(value) => updateField("application_eyebrow", value)}
              />

              <TextField
                id="careers-application-prefix"
                label="Application Title Prefix"
                value={formData.application_title_prefix}
                maxLength={255}
                onChange={(value) =>
                  updateField("application_title_prefix", value)
                }
              />

              <TextAreaField
                id="careers-application-description"
                label="Application Description"
                value={formData.application_description}
                rows={4}
                maxLength={500}
                onChange={(value) =>
                  updateField("application_description", value)
                }
              />
            </Panel>

            <Panel
              icon={<FormInput className="h-5 w-5" />}
              title="Application Form Labels"
              description="Customize the labels used by the application form."
            >
              <div className="grid gap-5 md:grid-cols-2">
                <TextField
                  id="careers-full-name-label"
                  label="Full Name Label"
                  value={formData.full_name_label}
                  maxLength={100}
                  onChange={(value) => updateField("full_name_label", value)}
                />

                <TextField
                  id="careers-email-label"
                  label="Email Label"
                  value={formData.email_label}
                  maxLength={100}
                  onChange={(value) => updateField("email_label", value)}
                />

                <TextField
                  id="careers-phone-label"
                  label="Phone Label"
                  value={formData.phone_label}
                  maxLength={100}
                  onChange={(value) => updateField("phone_label", value)}
                />

                <TextField
                  id="careers-position-label"
                  label="Position Label"
                  value={formData.position_label}
                  maxLength={100}
                  onChange={(value) => updateField("position_label", value)}
                />

                <TextField
                  id="careers-experience-label"
                  label="Experience Label"
                  value={formData.experience_label}
                  maxLength={100}
                  onChange={(value) => updateField("experience_label", value)}
                />

                <TextField
                  id="careers-company-label"
                  label="Company Label"
                  value={formData.company_label}
                  maxLength={100}
                  onChange={(value) => updateField("company_label", value)}
                />

                <TextField
                  id="careers-location-label"
                  label="Location Label"
                  value={formData.location_label}
                  maxLength={100}
                  onChange={(value) => updateField("location_label", value)}
                />

                <TextField
                  id="careers-linkedin-label"
                  label="LinkedIn Label"
                  value={formData.linkedin_label}
                  maxLength={100}
                  onChange={(value) => updateField("linkedin_label", value)}
                />

                <TextField
                  id="careers-resume-label"
                  label="Resume Label"
                  value={formData.resume_label}
                  maxLength={100}
                  onChange={(value) => updateField("resume_label", value)}
                />

                <TextField
                  id="careers-cover-letter-label"
                  label="Cover Letter Label"
                  value={formData.cover_letter_label}
                  maxLength={100}
                  onChange={(value) => updateField("cover_letter_label", value)}
                />
              </div>
            </Panel>

            <Panel
              icon={<Upload className="h-5 w-5" />}
              title="Resume Upload"
              description="Customize the resume upload-area instructions."
            >
              <TextField
                id="careers-resume-upload-title"
                label="Upload Title"
                value={formData.resume_upload_title}
                maxLength={150}
                onChange={(value) => updateField("resume_upload_title", value)}
              />

              <TextField
                id="careers-resume-upload-description"
                label="Upload Description"
                value={formData.resume_upload_description}
                maxLength={255}
                onChange={(value) =>
                  updateField("resume_upload_description", value)
                }
              />
            </Panel>

            <Panel
              icon={<FileText className="h-5 w-5" />}
              title="Buttons and Notifications"
              description="Manage application buttons and feedback messages."
            >
              <div className="grid gap-5 md:grid-cols-2">
                <TextField
                  id="careers-cancel-button"
                  label="Cancel Button Text"
                  value={formData.cancel_button_text}
                  maxLength={100}
                  onChange={(value) => updateField("cancel_button_text", value)}
                />

                <TextField
                  id="careers-submit-button"
                  label="Submit Button Text"
                  value={formData.submit_button_text}
                  maxLength={100}
                  onChange={(value) => updateField("submit_button_text", value)}
                />

                <TextField
                  id="careers-submitting-button"
                  label="Submitting Button Text"
                  value={formData.submitting_button_text}
                  maxLength={100}
                  onChange={(value) =>
                    updateField("submitting_button_text", value)
                  }
                />
              </div>

              <TextField
                id="careers-success-message"
                label="Success Message"
                value={formData.success_message}
                maxLength={255}
                onChange={(value) => updateField("success_message", value)}
              />

              <TextField
                id="careers-error-message"
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
                id="careers-seo-title"
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
                id="careers-seo-description"
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
                    Control the public Careers page.
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <ToggleField
                  title="Careers Page Active"
                  description="Keep enabled so the public Careers page can load these settings."
                  checked={formData.is_active}
                  onChange={(checked) => updateField("is_active", checked)}
                />

                <ToggleField
                  title="Show Hero Section"
                  description="Display the Careers page introduction."
                  checked={formData.show_hero}
                  onChange={(checked) => updateField("show_hero", checked)}
                />

                <ToggleField
                  title="Show Job Openings"
                  description="Display job listings and application controls."
                  checked={formData.show_openings}
                  onChange={(checked) => updateField("show_openings", checked)}
                />
              </div>
            </div>

            <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
              <h2 className="font-bold text-slate-900">Job Listings</h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                The current job listings are still loaded from the frontend jobs
                data. A dedicated Job Openings manager can replace them in the
                next stage.
              </p>
            </div>

            <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
              <h2 className="font-bold text-slate-900">Career Applications</h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Submitted applications are managed from Career Applications in
                the admin sidebar.
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

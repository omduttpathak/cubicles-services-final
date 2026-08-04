import { useEffect, useMemo, useState, type ReactNode } from "react"
import axios from "axios"
import {
  BriefcaseBusiness,
  CheckCircle2,
  Eye,
  FileText,
  FormInput,
  Save,
  Search,
  Settings2,
  Sparkles,
  Upload,
} from "lucide-react"
import { toast } from "sonner"

import {
  getAdminCareerPage,
  updateAdminCareerPage,
  type UpdateAdminCareerPageRequest,
} from "@/api/adminCareerPageApi"
import AdminFormPageHeader from "@/components/admin/forms/AdminFormPageHeader"
import CharacterCount from "@/components/admin/forms/CharacterCount"
import FormCard from "@/components/admin/forms/FormCard"
import FormField from "@/components/admin/forms/FormField"
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

  const visibleSections = [formData.show_hero, formData.show_openings].filter(
    Boolean
  ).length

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

      <div className="space-y-6">
        <AdminFormPageHeader
          eyebrow="Content management"
          title="Careers Page"
          description="Manage Careers page headings, application labels, notifications, visibility, and SEO."
          backLabel="Back to Job Openings"
          onBack={() => window.history.back()}
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
              description="The introduction displayed at the top of the Careers page."
            >
              <TextField
                id="careers-hero-eyebrow"
                label="Hero Eyebrow"
                value={formData.hero_eyebrow}
                maxLength={255}
                disabled={isSubmitting}
                onChange={(value) => updateField("hero_eyebrow", value)}
              />

              <TextAreaField
                id="careers-hero-title"
                label="Hero Title"
                value={formData.hero_title}
                rows={3}
                maxLength={500}
                disabled={isSubmitting}
                onChange={(value) => updateField("hero_title", value)}
              />

              <TextAreaField
                id="careers-hero-description"
                label="Hero Description"
                value={formData.hero_description}
                rows={5}
                maxLength={1000}
                disabled={isSubmitting}
                onChange={(value) => updateField("hero_description", value)}
              />
            </SectionCard>

            <SectionCard
              icon={<BriefcaseBusiness className="size-5" />}
              title="Job openings section"
              description="The heading shown above available positions."
            >
              <TextField
                id="careers-openings-eyebrow"
                label="Section Eyebrow"
                value={formData.openings_eyebrow}
                maxLength={255}
                disabled={isSubmitting}
                onChange={(value) => updateField("openings_eyebrow", value)}
              />

              <TextAreaField
                id="careers-openings-title"
                label="Section Title"
                value={formData.openings_title}
                rows={3}
                maxLength={500}
                disabled={isSubmitting}
                onChange={(value) => updateField("openings_title", value)}
              />

              <TextAreaField
                id="careers-openings-description"
                label="Section Description"
                value={formData.openings_description}
                rows={5}
                maxLength={1000}
                disabled={isSubmitting}
                onChange={(value) => updateField("openings_description", value)}
              />

              <TextField
                id="careers-apply-button"
                label="Apply Button Text"
                value={formData.apply_button_text}
                maxLength={100}
                disabled={isSubmitting}
                onChange={(value) => updateField("apply_button_text", value)}
              />
            </SectionCard>

            <SectionCard
              icon={<FileText className="size-5" />}
              title="Empty openings state"
              description="Content displayed when no job positions are available."
            >
              <TextField
                id="careers-empty-title"
                label="Empty State Title"
                value={formData.empty_title}
                maxLength={255}
                disabled={isSubmitting}
                onChange={(value) => updateField("empty_title", value)}
              />

              <TextAreaField
                id="careers-empty-description"
                label="Empty State Description"
                value={formData.empty_description}
                rows={4}
                maxLength={500}
                disabled={isSubmitting}
                onChange={(value) => updateField("empty_description", value)}
              />
            </SectionCard>

            <SectionCard
              icon={<FormInput className="size-5" />}
              title="Application introduction"
              description="The heading displayed at the top of the application modal."
            >
              <TextField
                id="careers-application-eyebrow"
                label="Application Eyebrow"
                value={formData.application_eyebrow}
                maxLength={255}
                disabled={isSubmitting}
                onChange={(value) => updateField("application_eyebrow", value)}
              />

              <TextField
                id="careers-application-prefix"
                label="Application Title Prefix"
                value={formData.application_title_prefix}
                maxLength={255}
                disabled={isSubmitting}
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
                disabled={isSubmitting}
                onChange={(value) =>
                  updateField("application_description", value)
                }
              />
            </SectionCard>

            <SectionCard
              icon={<FormInput className="size-5" />}
              title="Application form labels"
              description="Customize the labels used by the application form."
            >
              <div className="grid gap-5 md:grid-cols-2">
                <TextField
                  id="careers-full-name-label"
                  label="Full Name Label"
                  value={formData.full_name_label}
                  maxLength={100}
                  disabled={isSubmitting}
                  onChange={(value) => updateField("full_name_label", value)}
                />

                <TextField
                  id="careers-email-label"
                  label="Email Label"
                  value={formData.email_label}
                  maxLength={100}
                  disabled={isSubmitting}
                  onChange={(value) => updateField("email_label", value)}
                />

                <TextField
                  id="careers-phone-label"
                  label="Phone Label"
                  value={formData.phone_label}
                  maxLength={100}
                  disabled={isSubmitting}
                  onChange={(value) => updateField("phone_label", value)}
                />

                <TextField
                  id="careers-position-label"
                  label="Position Label"
                  value={formData.position_label}
                  maxLength={100}
                  disabled={isSubmitting}
                  onChange={(value) => updateField("position_label", value)}
                />

                <TextField
                  id="careers-experience-label"
                  label="Experience Label"
                  value={formData.experience_label}
                  maxLength={100}
                  disabled={isSubmitting}
                  onChange={(value) => updateField("experience_label", value)}
                />

                <TextField
                  id="careers-company-label"
                  label="Company Label"
                  value={formData.company_label}
                  maxLength={100}
                  disabled={isSubmitting}
                  onChange={(value) => updateField("company_label", value)}
                />

                <TextField
                  id="careers-location-label"
                  label="Location Label"
                  value={formData.location_label}
                  maxLength={100}
                  disabled={isSubmitting}
                  onChange={(value) => updateField("location_label", value)}
                />

                <TextField
                  id="careers-linkedin-label"
                  label="LinkedIn Label"
                  value={formData.linkedin_label}
                  maxLength={100}
                  disabled={isSubmitting}
                  onChange={(value) => updateField("linkedin_label", value)}
                />

                <TextField
                  id="careers-resume-label"
                  label="Resume Label"
                  value={formData.resume_label}
                  maxLength={100}
                  disabled={isSubmitting}
                  onChange={(value) => updateField("resume_label", value)}
                />

                <TextField
                  id="careers-cover-letter-label"
                  label="Cover Letter Label"
                  value={formData.cover_letter_label}
                  maxLength={100}
                  disabled={isSubmitting}
                  onChange={(value) => updateField("cover_letter_label", value)}
                />
              </div>
            </SectionCard>

            <SectionCard
              icon={<Upload className="size-5" />}
              title="Resume upload"
              description="Customize the resume upload-area instructions."
            >
              <TextField
                id="careers-resume-upload-title"
                label="Upload Title"
                value={formData.resume_upload_title}
                maxLength={150}
                disabled={isSubmitting}
                onChange={(value) => updateField("resume_upload_title", value)}
              />

              <TextField
                id="careers-resume-upload-description"
                label="Upload Description"
                value={formData.resume_upload_description}
                maxLength={255}
                disabled={isSubmitting}
                onChange={(value) =>
                  updateField("resume_upload_description", value)
                }
              />
            </SectionCard>

            <SectionCard
              icon={<FileText className="size-5" />}
              title="Buttons and notifications"
              description="Manage application buttons and feedback messages."
            >
              <div className="grid gap-5 md:grid-cols-2">
                <TextField
                  id="careers-cancel-button"
                  label="Cancel Button Text"
                  value={formData.cancel_button_text}
                  maxLength={100}
                  disabled={isSubmitting}
                  onChange={(value) => updateField("cancel_button_text", value)}
                />

                <TextField
                  id="careers-submit-button"
                  label="Submit Button Text"
                  value={formData.submit_button_text}
                  maxLength={100}
                  disabled={isSubmitting}
                  onChange={(value) => updateField("submit_button_text", value)}
                />

                <TextField
                  id="careers-submitting-button"
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
                id="careers-success-message"
                label="Success Message"
                value={formData.success_message}
                maxLength={255}
                disabled={isSubmitting}
                onChange={(value) => updateField("success_message", value)}
              />

              <TextField
                id="careers-error-message"
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
                id="careers-seo-title"
                label="SEO Title"
                value={formData.seo_title}
                maxLength={255}
                disabled={isSubmitting}
                onChange={(value) => updateField("seo_title", value)}
              />

              <TextAreaField
                id="careers-seo-description"
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
                description="Apply the current Careers page content, labels, and visibility settings."
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
                description="Control the public Careers page and its main sections."
              >
                <div className="space-y-3">
                  <ToggleField
                    title="Careers Page Active"
                    description="Keep enabled so the public Careers page can load these settings."
                    checked={formData.is_active}
                    disabled={isSubmitting}
                    onChange={(checked) => updateField("is_active", checked)}
                  />

                  <ToggleField
                    title="Show Hero Section"
                    description="Display the Careers page introduction."
                    checked={formData.show_hero}
                    disabled={isSubmitting}
                    onChange={(checked) => updateField("show_hero", checked)}
                  />

                  <ToggleField
                    title="Show Job Openings"
                    description="Display job listings and application controls."
                    checked={formData.show_openings}
                    disabled={isSubmitting}
                    onChange={(checked) =>
                      updateField("show_openings", checked)
                    }
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

              <section className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-violet-50 p-5">
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm ring-1 ring-blue-100">
                    <Settings2 className="size-5" />
                  </div>

                  <div>
                    <h2 className="font-extrabold text-slate-950">
                      Job listings
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Current job openings are managed from Job Openings in the
                      admin sidebar.
                    </p>
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-amber-600 shadow-sm ring-1 ring-amber-100">
                    <Eye className="size-5" />
                  </div>

                  <div>
                    <h2 className="font-extrabold text-slate-950">
                      Career applications
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Submitted applications are managed from Career
                      Applications in the admin sidebar.
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
        className="sr-only"
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
          label="Visible sections"
          value={`${visibleSections}/2`}
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
        {isActive ? "Careers page is active" : "Careers page is inactive"}
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
          cubiclesservices.com › careers
        </p>

        <p className="mt-1 line-clamp-2 text-lg font-medium text-blue-700">
          {title || "Careers | Cubicles Services"}
        </p>

        <p className="mt-1 line-clamp-3 text-sm leading-6 text-slate-600">
          {description ||
            "Add an SEO description to preview how the Careers page may appear in search results."}
        </p>
      </div>
    </section>
  )
}

const inputClassName =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"

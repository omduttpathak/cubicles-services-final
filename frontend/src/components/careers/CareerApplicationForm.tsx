import { useEffect, useState, type FormEvent, type ReactNode } from "react"
import axios from "axios"
import { FileText, Loader2, Send, Upload, X } from "lucide-react"
import { toast } from "sonner"

import type { CareerPageSettings } from "@/api/careerPageApi"
import {
  submitCareerApplication,
  type CareerApplicationFormData,
} from "@/api/careerApplicationsApi"

type CareerApplicationFormProps = {
  position: string
  defaultExperience?: string
  settings: CareerPageSettings
  isOpen: boolean
  onClose: () => void
}

type CareerApplicationFields = Omit<CareerApplicationFormData, "resume">

const initialFormData: CareerApplicationFields = {
  full_name: "",
  email: "",
  phone: null,
  position: "",
  experience: null,
  current_company: null,
  location: null,
  linkedin_url: null,
  cover_letter: null,
}

const allowedResumeExtensions = [".pdf", ".doc", ".docx"]

const maxResumeSize = 5 * 1024 * 1024

export default function CareerApplicationForm({
  position,
  defaultExperience,
  settings,
  isOpen,
  onClose,
}: CareerApplicationFormProps) {
  const [formData, setFormData] = useState<CareerApplicationFields>({
    ...initialFormData,
    position,
    experience: defaultExperience || null,
  })

  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [fileInputKey, setFileInputKey] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      return
    }

    setFormData((current) => ({
      ...current,
      position,
      experience: current.experience || defaultExperience || null,
    }))
  }, [isOpen, position, defaultExperience])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const originalOverflow = document.body.style.overflow

    document.body.style.overflow = "hidden"

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && !isSubmitting) {
        onClose()
      }
    }

    window.addEventListener("keydown", handleEscape)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen, isSubmitting, onClose])

  function updateField<Key extends keyof CareerApplicationFields>(
    field: Key,
    value: CareerApplicationFields[Key]
  ) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }))
  }

  function resetForm() {
    setFormData({
      ...initialFormData,
      position,
      experience: defaultExperience || null,
    })

    setResumeFile(null)
    setFileInputKey((current) => current + 1)
  }

  function handleResumeChange(file: File | null) {
    if (!file) {
      setResumeFile(null)
      return
    }

    const fileName = file.name.toLowerCase()

    const isAllowedExtension = allowedResumeExtensions.some((extension) =>
      fileName.endsWith(extension)
    )

    if (!isAllowedExtension) {
      setResumeFile(null)
      setFileInputKey((current) => current + 1)

      toast.error("Resume must be a PDF, DOC or DOCX file.")
      return
    }

    if (file.size > maxResumeSize) {
      setResumeFile(null)
      setFileInputKey((current) => current + 1)

      toast.error("Resume file must not exceed 5 MB.")
      return
    }

    setResumeFile(file)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (
      !formData.full_name.trim() ||
      !formData.email.trim() ||
      !formData.position.trim()
    ) {
      toast.error("Please complete your name, email and position.")
      return
    }

    if (!resumeFile) {
      toast.error(`Please ${settings.resume_label.toLowerCase()}.`)
      return
    }

    try {
      setIsSubmitting(true)

      await submitCareerApplication({
        full_name: formData.full_name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone?.trim() || null,
        position: formData.position.trim(),
        experience: formData.experience?.trim() || null,
        current_company: formData.current_company?.trim() || null,
        location: formData.location?.trim() || null,
        linkedin_url: formData.linkedin_url?.trim() || null,
        cover_letter: formData.cover_letter?.trim() || null,
        resume: resumeFile,
      })

      toast.success(settings.success_message)

      resetForm()
      onClose()
    } catch (error) {
      console.error(error)

      if (axios.isAxiosError(error)) {
        const detail = error.response?.data?.detail

        if (typeof detail === "string") {
          toast.error(detail)
        } else if (Array.isArray(detail) && detail.length > 0) {
          toast.error(
            detail[0]?.msg || "Please check your application details."
          )
        } else {
          toast.error(settings.error_message)
        }
      } else {
        toast.error(settings.error_message)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="career-application-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSubmitting) {
          onClose()
        }
      }}
    >
      <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-200 bg-white px-6 py-5">
          <div>
            <p className="font-semibold tracking-wider text-blue-600 uppercase">
              {settings.application_eyebrow}
            </p>

            <h2
              id="career-application-title"
              className="mt-1 text-2xl font-bold text-slate-900"
            >
              {settings.application_title_prefix} {position}
            </h2>

            <p className="mt-1 text-sm text-slate-600">
              {settings.application_description}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close application form"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid gap-5 md:grid-cols-2">
            <FormField
              id="career-full-name"
              label={settings.full_name_label}
              required
            >
              <input
                id="career-full-name"
                type="text"
                required
                maxLength={150}
                autoComplete="name"
                value={formData.full_name}
                onChange={(event) =>
                  updateField("full_name", event.target.value)
                }
                className={inputClassName}
                placeholder="Your full name"
              />
            </FormField>

            <FormField id="career-email" label={settings.email_label} required>
              <input
                id="career-email"
                type="email"
                required
                autoComplete="email"
                value={formData.email}
                onChange={(event) => updateField("email", event.target.value)}
                className={inputClassName}
                placeholder="you@example.com"
              />
            </FormField>

            <FormField id="career-phone" label={settings.phone_label}>
              <input
                id="career-phone"
                type="tel"
                maxLength={30}
                autoComplete="tel"
                value={formData.phone ?? ""}
                onChange={(event) =>
                  updateField("phone", event.target.value || null)
                }
                className={inputClassName}
                placeholder="+91 99999 99999"
              />
            </FormField>

            <FormField
              id="career-position"
              label={settings.position_label}
              required
            >
              <input
                id="career-position"
                type="text"
                required
                readOnly
                value={formData.position}
                className={`${inputClassName} cursor-not-allowed bg-slate-100`}
              />
            </FormField>

            <FormField id="career-experience" label={settings.experience_label}>
              <input
                id="career-experience"
                type="text"
                maxLength={100}
                value={formData.experience ?? ""}
                onChange={(event) =>
                  updateField("experience", event.target.value || null)
                }
                className={inputClassName}
                placeholder="For example, 5 years"
              />
            </FormField>

            <FormField id="career-company" label={settings.company_label}>
              <input
                id="career-company"
                type="text"
                maxLength={150}
                autoComplete="organization"
                value={formData.current_company ?? ""}
                onChange={(event) =>
                  updateField("current_company", event.target.value || null)
                }
                className={inputClassName}
                placeholder="Current employer"
              />
            </FormField>

            <FormField id="career-location" label={settings.location_label}>
              <input
                id="career-location"
                type="text"
                maxLength={150}
                autoComplete="address-level2"
                value={formData.location ?? ""}
                onChange={(event) =>
                  updateField("location", event.target.value || null)
                }
                className={inputClassName}
                placeholder="City, State"
              />
            </FormField>

            <FormField id="career-linkedin" label={settings.linkedin_label}>
              <input
                id="career-linkedin"
                type="url"
                maxLength={500}
                value={formData.linkedin_url ?? ""}
                onChange={(event) =>
                  updateField("linkedin_url", event.target.value || null)
                }
                className={inputClassName}
                placeholder="https://linkedin.com/in/..."
              />
            </FormField>

            <div className="md:col-span-2">
              <FormField
                id="career-resume"
                label={settings.resume_label}
                required
              >
                <label
                  htmlFor="career-resume"
                  className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-center transition hover:border-blue-400 hover:bg-blue-50"
                >
                  <Upload className="h-9 w-9 text-blue-600" />

                  <span className="mt-3 font-semibold text-slate-900">
                    {settings.resume_upload_title}
                  </span>

                  <span className="mt-1 text-sm text-slate-500">
                    {settings.resume_upload_description}
                  </span>
                </label>

                <input
                  key={fileInputKey}
                  id="career-resume"
                  type="file"
                  required
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={(event) =>
                    handleResumeChange(event.target.files?.[0] ?? null)
                  }
                  className="sr-only"
                />

                {resumeFile && (
                  <div className="mt-3 flex items-center justify-between gap-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <FileText className="h-5 w-5 shrink-0 text-green-700" />

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-green-800">
                          {resumeFile.name}
                        </p>

                        <p className="text-xs text-green-700">
                          {formatFileSize(resumeFile.size)}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setResumeFile(null)
                        setFileInputKey((current) => current + 1)
                      }}
                      disabled={isSubmitting}
                      className="shrink-0 text-sm font-semibold text-red-600 transition hover:text-red-700 disabled:opacity-50"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </FormField>
            </div>

            <div className="md:col-span-2">
              <FormField
                id="career-cover-letter"
                label={settings.cover_letter_label}
              >
                <textarea
                  id="career-cover-letter"
                  rows={7}
                  maxLength={5000}
                  value={formData.cover_letter ?? ""}
                  onChange={(event) =>
                    updateField("cover_letter", event.target.value || null)
                  }
                  className={inputClassName}
                  placeholder="Tell us about your experience and why you are interested in this role."
                />

                <p className="mt-1 text-right text-xs text-slate-500">
                  {(formData.cover_letter ?? "").length}/5000
                </p>
              </FormField>
            </div>
          </div>

          <div className="mt-7 flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {settings.cancel_button_text}
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}

              {isSubmitting
                ? settings.submitting_button_text
                : settings.submit_button_text}
            </button>
          </div>
        </form>
      </div>
    </div>
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

function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} bytes`
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const inputClassName =
  "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"

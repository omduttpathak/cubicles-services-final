import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react"
import axios from "axios"
import { Globe2, ImageUp, LoaderCircle, Save, Trash2 } from "lucide-react"
import { toast } from "sonner"

import {
  getAdminSiteSettings,
  updateAdminSiteSettings,
  type SiteSettingsRequest,
} from "@/api/adminSiteSettingsApi"
import { uploadAdminImage } from "@/api/adminUploadsApi"
import ErrorState from "@/components/common/ErrorState"
import PageLoader from "@/components/common/PageLoader"
import SEO from "@/components/seo/SEO"

const initialFormData: SiteSettingsRequest = {
  company_name: "Cubicles Services",
  logo_url: null,
  favicon_url: null,
  contact_email: "info@cubiclesservices.com",
  contact_phone: null,
  address: null,
  footer_description:
    "Cloud migration, application modernization, DevOps, Cybersecurity and managed IT services.",
  copyright_text: "© 2026 Cubicles Services. All rights reserved.",
  linkedin_url: null,
  facebook_url: null,
  twitter_url: null,
  youtube_url: null,
  is_active: true,
}

const acceptedLogoTypes = ".png,.jpg,.jpeg,.webp,.svg"
const acceptedFaviconTypes = ".png,.jpg,.jpeg,.webp,.svg,.ico"

export default function AdminSiteSettings() {
  const [formData, setFormData] = useState<SiteSettingsRequest>(initialFormData)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploadingLogo, setIsUploadingLogo] = useState(false)
  const [isUploadingFavicon, setIsUploadingFavicon] = useState(false)

  const logoInputRef = useRef<HTMLInputElement>(null)
  const faviconInputRef = useRef<HTMLInputElement>(null)

  function updateField<Key extends keyof SiteSettingsRequest>(
    field: Key,
    value: SiteSettingsRequest[Key]
  ) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }))
  }

  async function loadSettings() {
    try {
      setIsLoading(true)
      setHasError(false)

      const response = await getAdminSiteSettings()

      setFormData({
        company_name: response.company_name,
        logo_url: response.logo_url,
        favicon_url: response.favicon_url,
        contact_email: response.contact_email,
        contact_phone: response.contact_phone,
        address: response.address,
        footer_description: response.footer_description,
        copyright_text: response.copyright_text,
        linkedin_url: response.linkedin_url,
        facebook_url: response.facebook_url,
        twitter_url: response.twitter_url,
        youtube_url: response.youtube_url,
        is_active: response.is_active,
      })
    } catch (error) {
      console.error(error)
      setHasError(true)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleImageUpload(
    file: File,
    field: "logo_url" | "favicon_url"
  ) {
    const isLogo = field === "logo_url"

    try {
      if (isLogo) {
        setIsUploadingLogo(true)
      } else {
        setIsUploadingFavicon(true)
      }

      const uploaded = await uploadAdminImage(file)

      updateField(field, uploaded.file_url)

      toast.success(
        isLogo
          ? "Logo uploaded successfully. Save changes to publish it."
          : "Favicon uploaded successfully. Save changes to publish it."
      )
    } catch (error) {
      console.error(error)

      if (axios.isAxiosError(error)) {
        const detail = error.response?.data?.detail

        toast.error(
          typeof detail === "string" ? detail : "Unable to upload the image."
        )
      } else {
        toast.error("Unable to upload the image.")
      }
    } finally {
      if (isLogo) {
        setIsUploadingLogo(false)
      } else {
        setIsUploadingFavicon(false)
      }
    }
  }

  async function handleSubmit() {
    if (
      !formData.company_name.trim() ||
      !formData.contact_email.trim() ||
      !formData.footer_description.trim() ||
      !formData.copyright_text.trim()
    ) {
      toast.error("Please complete all required fields.")
      return
    }

    try {
      setIsSubmitting(true)

      const updated = await updateAdminSiteSettings({
        company_name: formData.company_name.trim(),
        logo_url: formData.logo_url?.trim() || null,
        favicon_url: formData.favicon_url?.trim() || null,
        contact_email: formData.contact_email.trim(),
        contact_phone: formData.contact_phone?.trim() || null,
        address: formData.address?.trim() || null,
        footer_description: formData.footer_description.trim(),
        copyright_text: formData.copyright_text.trim(),
        linkedin_url: formData.linkedin_url?.trim() || null,
        facebook_url: formData.facebook_url?.trim() || null,
        twitter_url: formData.twitter_url?.trim() || null,
        youtube_url: formData.youtube_url?.trim() || null,
        is_active: formData.is_active,
      })

      setFormData({
        company_name: updated.company_name,
        logo_url: updated.logo_url,
        favicon_url: updated.favicon_url,
        contact_email: updated.contact_email,
        contact_phone: updated.contact_phone,
        address: updated.address,
        footer_description: updated.footer_description,
        copyright_text: updated.copyright_text,
        linkedin_url: updated.linkedin_url,
        facebook_url: updated.facebook_url,
        twitter_url: updated.twitter_url,
        youtube_url: updated.youtube_url,
        is_active: updated.is_active,
      })

      toast.success("Site settings updated successfully.")
    } catch (error) {
      console.error(error)

      if (axios.isAxiosError(error)) {
        const detail = error.response?.data?.detail

        toast.error(
          typeof detail === "string"
            ? detail
            : Array.isArray(detail) && detail.length > 0
              ? detail[0]?.msg || "Please check the site settings."
              : "Unable to update site settings."
        )
      } else {
        toast.error("Unable to update site settings.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    void loadSettings()
  }, [])

  if (isLoading) {
    return <PageLoader message="Loading site settings..." />
  }

  if (hasError) {
    return (
      <ErrorState
        title="Unable to Load Site Settings"
        message="The site settings could not be loaded."
        onRetry={() => {
          void loadSettings()
        }}
      />
    )
  }

  return (
    <>
      <SEO
        title="Site Settings | Cubicles Services Admin"
        description="Manage global Cubicles Services website settings."
      />

      <section>
        <div className="flex flex-col gap-4 rounded-xl bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold tracking-wider text-blue-600 uppercase">
              Global Settings
            </p>

            <h1 className="mt-1 text-2xl font-bold text-slate-900">
              Site Settings
            </h1>

            <p className="mt-1 text-sm text-slate-600">
              Manage branding, contact information, footer content and social
              links.
            </p>
          </div>

          <button
            type="button"
            disabled={isSubmitting || isUploadingLogo || isUploadingFavicon}
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
              title="Branding"
              description="Company identity shown in the header and browser."
            >
              <FormField id="company-name" label="Company Name" required>
                <input
                  id="company-name"
                  value={formData.company_name}
                  onChange={(event) =>
                    updateField("company_name", event.target.value)
                  }
                  className={inputClassName}
                />
              </FormField>

              <ImageUploadField
                id="site-logo"
                label="Company Logo"
                value={formData.logo_url}
                accept={acceptedLogoTypes}
                isUploading={isUploadingLogo}
                inputRef={logoInputRef}
                onFileSelected={(file) => {
                  void handleImageUpload(file, "logo_url")
                }}
                onRemove={() => updateField("logo_url", null)}
              />

              <ImageUploadField
                id="site-favicon"
                label="Favicon"
                value={formData.favicon_url}
                accept={acceptedFaviconTypes}
                isUploading={isUploadingFavicon}
                inputRef={faviconInputRef}
                onFileSelected={(file) => {
                  void handleImageUpload(file, "favicon_url")
                }}
                onRemove={() => updateField("favicon_url", null)}
                compactPreview
              />
            </Panel>

            <Panel
              title="Contact Information"
              description="Public contact details shown in the footer."
            >
              <FormField id="contact-email" label="Contact Email" required>
                <input
                  id="contact-email"
                  type="email"
                  value={formData.contact_email}
                  onChange={(event) =>
                    updateField("contact_email", event.target.value)
                  }
                  className={inputClassName}
                />
              </FormField>

              <FormField id="contact-phone" label="Contact Phone">
                <input
                  id="contact-phone"
                  value={formData.contact_phone ?? ""}
                  onChange={(event) =>
                    updateField("contact_phone", event.target.value || null)
                  }
                  className={inputClassName}
                />
              </FormField>

              <FormField id="address" label="Address">
                <textarea
                  id="address"
                  rows={4}
                  value={formData.address ?? ""}
                  onChange={(event) =>
                    updateField("address", event.target.value || null)
                  }
                  className={`${inputClassName} leading-7`}
                />
              </FormField>
            </Panel>

            <Panel
              title="Footer Content"
              description="Text displayed in the public website footer."
            >
              <FormField
                id="footer-description"
                label="Footer Description"
                required
              >
                <textarea
                  id="footer-description"
                  rows={5}
                  value={formData.footer_description}
                  onChange={(event) =>
                    updateField("footer_description", event.target.value)
                  }
                  className={`${inputClassName} leading-7`}
                />
              </FormField>

              <FormField id="copyright" label="Copyright Text" required>
                <input
                  id="copyright"
                  value={formData.copyright_text}
                  onChange={(event) =>
                    updateField("copyright_text", event.target.value)
                  }
                  className={inputClassName}
                />
              </FormField>
            </Panel>

            <Panel
              title="Social Links"
              description="Optional social profiles displayed in the footer."
            >
              <OptionalUrlField
                id="linkedin"
                label="LinkedIn URL"
                value={formData.linkedin_url}
                onChange={(value) => updateField("linkedin_url", value)}
              />

              <OptionalUrlField
                id="facebook"
                label="Facebook URL"
                value={formData.facebook_url}
                onChange={(value) => updateField("facebook_url", value)}
              />

              <OptionalUrlField
                id="twitter"
                label="X / Twitter URL"
                value={formData.twitter_url}
                onChange={(value) => updateField("twitter_url", value)}
              />

              <OptionalUrlField
                id="youtube"
                label="YouTube URL"
                value={formData.youtube_url}
                onChange={(value) => updateField("youtube_url", value)}
              />
            </Panel>
          </div>

          <aside className="space-y-6">
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                  <Globe2 className="h-6 w-6" />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">Public Settings</h2>

                  <p className="text-sm text-slate-500">
                    Control public visibility.
                  </p>
                </div>
              </div>

              <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(event) =>
                    updateField("is_active", event.target.checked)
                  }
                  className="mt-1 h-4 w-4"
                />

                <span>
                  <span className="block font-semibold text-slate-900">
                    Active
                  </span>

                  <span className="mt-1 block text-sm leading-6 text-slate-500">
                    Keep this enabled so the public header and footer can load
                    these settings.
                  </span>
                </span>
              </label>
            </div>

            <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
              <h2 className="font-bold text-slate-900">Upload Guidelines</h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Upload PNG, JPG, JPEG, WebP, SVG or ICO files. Maximum file size
                is 5 MB. Use a transparent PNG, WebP or SVG for the company
                logo.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}

function ImageUploadField({
  id,
  label,
  value,
  accept,
  isUploading,
  inputRef,
  onFileSelected,
  onRemove,
  compactPreview = false,
}: {
  id: string
  label: string
  value: string | null
  accept: string
  isUploading: boolean
  inputRef: RefObject<HTMLInputElement | null>
  onFileSelected: (file: File) => void
  onRemove: () => void
  compactPreview?: boolean
}) {
  return (
    <div>
      <p className="mb-2 block font-medium text-slate-700">{label}</p>

      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0]

          if (file) {
            onFileSelected(file)
          }

          event.target.value = ""
        }}
      />

      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
        {value ? (
          <div className="space-y-4">
            <div
              className={`flex items-center justify-center rounded-lg border border-slate-200 bg-white p-4 ${
                compactPreview ? "min-h-20" : "min-h-32"
              }`}
            >
              <img
                src={value}
                alt={`${label} preview`}
                className={
                  compactPreview
                    ? "max-h-12 max-w-full object-contain"
                    : "max-h-24 max-w-full object-contain"
                }
              />
            </div>

            <p className="text-xs leading-5 break-all text-slate-500">
              {value}
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                disabled={isUploading}
                onClick={() => inputRef.current?.click()}
                className="inline-flex items-center justify-center rounded-lg border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 disabled:opacity-50"
              >
                {isUploading ? (
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <ImageUp className="mr-2 h-4 w-4" />
                )}
                Replace
              </button>

              <button
                type="button"
                disabled={isUploading}
                onClick={onRemove}
                className="inline-flex items-center justify-center rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Remove
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            disabled={isUploading}
            onClick={() => inputRef.current?.click()}
            className="flex w-full flex-col items-center justify-center rounded-lg px-4 py-8 text-center transition hover:bg-white disabled:opacity-50"
          >
            {isUploading ? (
              <LoaderCircle className="h-8 w-8 animate-spin text-blue-600" />
            ) : (
              <ImageUp className="h-8 w-8 text-blue-600" />
            )}

            <span className="mt-3 font-semibold text-slate-900">
              {isUploading ? "Uploading..." : `Upload ${label}`}
            </span>

            <span className="mt-1 text-sm text-slate-500">
              Select an image up to 5 MB
            </span>
          </button>
        )}
      </div>
    </div>
  )
}

function Panel({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
      <div className="mt-6 space-y-5">{children}</div>
    </div>
  )
}

function FormField({
  id,
  label,
  required = false,
  children,
}: {
  id: string
  label: string
  required?: boolean
  children: ReactNode
}) {
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

function OptionalUrlField({
  id,
  label,
  value,
  onChange,
}: {
  id: string
  label: string
  value: string | null
  onChange: (value: string | null) => void
}) {
  return (
    <FormField id={id} label={label}>
      <input
        id={id}
        type="url"
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value || null)}
        className={inputClassName}
      />
    </FormField>
  )
}

const inputClassName =
  "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"

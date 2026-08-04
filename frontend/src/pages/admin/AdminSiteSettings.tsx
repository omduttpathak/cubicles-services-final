import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react"
import axios from "axios"
import {
  Building2,
  CheckCircle2,
  Globe2,
  ImageUp,
  Link2,
  LoaderCircle,
  Mail,
  MapPin,
  Phone,
  Save,
  Settings2,
  Sparkles,
  Trash2,
} from "lucide-react"

import { toast } from "sonner"

import {
  getAdminSiteSettings,
  updateAdminSiteSettings,
  type SiteSettingsRequest,
} from "@/api/adminSiteSettingsApi"
import { uploadAdminImage } from "@/api/adminUploadsApi"
import AdminFormPageHeader from "@/components/admin/forms/AdminFormPageHeader"
import CharacterCount from "@/components/admin/forms/CharacterCount"
import FormCard from "@/components/admin/forms/FormCard"
import FormField from "@/components/admin/forms/FormField"
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

  const completedFields = useMemo(
    () =>
      [
        formData.company_name.trim(),
        formData.contact_email.trim(),
        formData.footer_description.trim(),
        formData.copyright_text.trim(),
      ].filter(Boolean).length,
    [formData]
  )

  const socialCount = useMemo(
    () =>
      [
        formData.linkedin_url,
        formData.facebook_url,
        formData.twitter_url,
        formData.youtube_url,
      ].filter((value) => Boolean(value?.trim())).length,
    [formData]
  )

  const completionPercentage = Math.round((completedFields / 4) * 100)
  const isBusy = isSubmitting || isUploadingLogo || isUploadingFavicon

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

      <div className="space-y-6">
        <AdminFormPageHeader
          eyebrow="Global settings"
          title="Site Settings"
          description="Manage branding, contact information, footer content, social links, and public availability."
          backLabel="Back to Dashboard"
          onBack={() => window.history.back()}
          submitLabel="Save Changes"
          submittingLabel="Saving..."
          isSubmitting={isBusy}
          onSubmit={() => {
            void handleSubmit()
          }}
        />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            label="Brand Assets"
            value={
              [formData.logo_url, formData.favicon_url].filter(Boolean).length
            }
            description="Logo and favicon configured"
            icon={<ImageUp className="size-5" />}
          />

          <SummaryCard
            label="Contact Channels"
            value={
              [formData.contact_email, formData.contact_phone].filter((value) =>
                Boolean(value?.trim())
              ).length
            }
            description="Email and phone availability"
            icon={<Mail className="size-5" />}
            tone="success"
          />

          <SummaryCard
            label="Social Profiles"
            value={socialCount}
            description="Connected social destinations"
            icon={<Globe2 className="size-5" />}
            tone="featured"
          />

          <SummaryCard
            label="Configuration"
            value={completionPercentage}
            suffix="%"
            description="Required fields completed"
            icon={<CheckCircle2 className="size-5" />}
            tone="neutral"
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            <SectionCard
              icon={<Building2 className="size-5" />}
              title="Branding"
              description="Company identity shown in the header and browser."
            >
              <FormField id="company-name" label="Company Name" required>
                <input
                  id="company-name"
                  maxLength={150}
                  value={formData.company_name}
                  onChange={(event) =>
                    updateField("company_name", event.target.value)
                  }
                  className={inputClassName}
                  disabled={isBusy}
                />

                <CharacterCount
                  current={formData.company_name.length}
                  maximum={150}
                />
              </FormField>

              <div className="grid gap-5 lg:grid-cols-2">
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
              </div>
            </SectionCard>

            <SectionCard
              icon={<Mail className="size-5" />}
              title="Contact information"
              description="Public contact details shown in the footer."
            >
              <div className="grid gap-5 md:grid-cols-2">
                <FormField id="contact-email" label="Contact Email" required>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-slate-400" />

                    <input
                      id="contact-email"
                      type="email"
                      maxLength={255}
                      value={formData.contact_email}
                      onChange={(event) =>
                        updateField("contact_email", event.target.value)
                      }
                      className={`${inputClassName} pl-11`}
                      disabled={isBusy}
                    />
                  </div>
                </FormField>

                <FormField id="contact-phone" label="Contact Phone">
                  <div className="relative">
                    <Phone className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-slate-400" />

                    <input
                      id="contact-phone"
                      maxLength={100}
                      value={formData.contact_phone ?? ""}
                      onChange={(event) =>
                        updateField("contact_phone", event.target.value || null)
                      }
                      className={`${inputClassName} pl-11`}
                      disabled={isBusy}
                    />
                  </div>
                </FormField>
              </div>

              <FormField id="address" label="Address">
                <div className="relative">
                  <MapPin className="pointer-events-none absolute top-4 left-4 size-4 text-slate-400" />

                  <textarea
                    id="address"
                    rows={4}
                    maxLength={500}
                    value={formData.address ?? ""}
                    onChange={(event) =>
                      updateField("address", event.target.value || null)
                    }
                    className={`${inputClassName} pl-11 leading-7`}
                    disabled={isBusy}
                  />
                </div>

                <CharacterCount
                  current={(formData.address ?? "").length}
                  maximum={500}
                />
              </FormField>
            </SectionCard>

            <SectionCard
              icon={<Settings2 className="size-5" />}
              title="Footer content"
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
                  maxLength={1000}
                  value={formData.footer_description}
                  onChange={(event) =>
                    updateField("footer_description", event.target.value)
                  }
                  className={`${inputClassName} leading-7`}
                  disabled={isBusy}
                />

                <CharacterCount
                  current={formData.footer_description.length}
                  maximum={1000}
                />
              </FormField>

              <FormField id="copyright" label="Copyright Text" required>
                <input
                  id="copyright"
                  maxLength={255}
                  value={formData.copyright_text}
                  onChange={(event) =>
                    updateField("copyright_text", event.target.value)
                  }
                  className={inputClassName}
                  disabled={isBusy}
                />

                <CharacterCount
                  current={formData.copyright_text.length}
                  maximum={255}
                />
              </FormField>
            </SectionCard>

            <SectionCard
              icon={<Globe2 className="size-5" />}
              title="Social links"
              description="Optional social profiles displayed in the footer."
            >
              <div className="grid gap-5 md:grid-cols-2">
                <OptionalUrlField
                  id="linkedin"
                  label="LinkedIn URL"
                  icon={<Link2 className="size-4" />}
                  value={formData.linkedin_url}
                  disabled={isBusy}
                  onChange={(value) => updateField("linkedin_url", value)}
                />

                <OptionalUrlField
                  id="facebook"
                  label="Facebook URL"
                  icon={<Link2 className="size-4" />}
                  value={formData.facebook_url}
                  disabled={isBusy}
                  onChange={(value) => updateField("facebook_url", value)}
                />

                <OptionalUrlField
                  id="twitter"
                  label="X / Twitter URL"
                  icon={<Link2 className="size-4" />}
                  value={formData.twitter_url}
                  disabled={isBusy}
                  onChange={(value) => updateField("twitter_url", value)}
                />

                <OptionalUrlField
                  id="youtube"
                  label="YouTube URL"
                  icon={<Link2 className="size-4" />}
                  value={formData.youtube_url}
                  disabled={isBusy}
                  onChange={(value) => updateField("youtube_url", value)}
                />
              </div>
            </SectionCard>
          </div>

          <aside className="space-y-6">
            <section className="sticky top-24 space-y-6">
              <FormCard
                title="Save changes"
                description="Publish the latest branding, contact, footer, and social settings."
              >
                <button
                  type="button"
                  disabled={isBusy}
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
                title="Public settings"
                description="Control whether the public header and footer can load these settings."
              >
                <ToggleField
                  title="Site Settings Active"
                  description="Keep enabled so global branding and footer content remain available publicly."
                  checked={formData.is_active}
                  disabled={isBusy}
                  onChange={(checked) => updateField("is_active", checked)}
                />
              </FormCard>

              <CompletionCard
                completedFields={completedFields}
                totalFields={4}
                percentage={completionPercentage}
                socialCount={socialCount}
                isActive={formData.is_active}
              />

              <section className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-violet-50 p-5">
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm ring-1 ring-blue-100">
                    <ImageUp className="size-5" />
                  </div>

                  <div>
                    <h2 className="font-extrabold text-slate-950">
                      Upload guidelines
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Upload PNG, JPG, JPEG, WebP, SVG, or ICO files up to 5 MB.
                      Transparent PNG, WebP, or SVG files work best for logos.
                    </p>
                  </div>
                </div>
              </section>

              <BrandPreview formData={formData} />
            </section>
          </aside>
        </div>
      </div>
    </>
  )
}

function SectionCard({
  icon,
  title,
  description,
  children,
}: {
  icon: ReactNode
  title: string
  description: string
  children: ReactNode
}) {
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
      <p className="mb-2 block text-sm font-bold text-slate-700">{label}</p>

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

      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
        {value ? (
          <div className="space-y-4">
            <div
              className={`flex items-center justify-center rounded-xl border border-slate-200 bg-white p-4 shadow-sm ${
                compactPreview ? "min-h-24" : "min-h-36"
              }`}
            >
              <img
                src={value}
                alt={`${label} preview`}
                className={
                  compactPreview
                    ? "max-h-12 max-w-full object-contain"
                    : "max-h-28 max-w-full object-contain"
                }
              />
            </div>

            <p className="line-clamp-2 text-xs leading-5 break-all text-slate-500">
              {value}
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={isUploading}
                onClick={() => inputRef.current?.click()}
                className="inline-flex h-10 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 px-4 text-sm font-semibold text-blue-700 transition hover:bg-blue-100 disabled:opacity-50"
              >
                {isUploading ? (
                  <LoaderCircle className="mr-2 size-4 animate-spin" />
                ) : (
                  <ImageUp className="mr-2 size-4" />
                )}
                Replace
              </button>

              <button
                type="button"
                disabled={isUploading}
                onClick={onRemove}
                className="inline-flex h-10 items-center justify-center rounded-xl border border-red-200 bg-red-50 px-4 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-50"
              >
                <Trash2 className="mr-2 size-4" />
                Remove
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            disabled={isUploading}
            onClick={() => inputRef.current?.click()}
            className="flex w-full flex-col items-center justify-center rounded-xl px-4 py-10 text-center transition hover:bg-white disabled:opacity-50"
          >
            {isUploading ? (
              <LoaderCircle className="size-8 animate-spin text-blue-600" />
            ) : (
              <ImageUp className="size-8 text-blue-600" />
            )}

            <span className="mt-3 font-extrabold text-slate-950">
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

function OptionalUrlField({
  id,
  label,
  icon,
  value,
  disabled,
  onChange,
}: {
  id: string
  label: string
  icon: ReactNode
  value: string | null
  disabled: boolean
  onChange: (value: string | null) => void
}) {
  return (
    <FormField id={id} label={label}>
      <div className="relative">
        <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-slate-400">
          {icon}
        </span>

        <input
          id={id}
          type="url"
          value={value ?? ""}
          onChange={(event) => onChange(event.target.value || null)}
          className={`${inputClassName} pl-11`}
          disabled={disabled}
          placeholder="https://"
        />
      </div>
    </FormField>
  )
}

function ToggleField({
  title,
  description,
  checked,
  disabled,
  onChange,
}: {
  title: string
  description: string
  checked: boolean
  disabled: boolean
  onChange: (checked: boolean) => void
}) {
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
  socialCount,
  isActive,
}: {
  completedFields: number
  totalFields: number
  percentage: number
  socialCount: number
  isActive: boolean
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-extrabold text-slate-950">
            Configuration readiness
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
        <StatusMetric label="Completion" value={`${percentage}%`} />
        <StatusMetric label="Social links" value={`${socialCount}/4`} />
      </div>

      <div
        className={`mt-3 rounded-xl border px-4 py-3 text-sm font-bold ${
          isActive
            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
            : "border-amber-200 bg-amber-50 text-amber-700"
        }`}
      >
        {isActive ? "Site settings are active" : "Site settings are inactive"}
      </div>
    </section>
  )
}

function StatusMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <p className="text-[11px] font-bold tracking-[0.12em] text-slate-500 uppercase">
        {label}
      </p>

      <p className="mt-2 text-sm font-black text-slate-950">{value}</p>
    </div>
  )
}

function BrandPreview({ formData }: { formData: SiteSettingsRequest }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 text-xs font-extrabold tracking-[0.16em] text-slate-500 uppercase">
        <Sparkles className="size-3.5" />
        Brand preview
      </div>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-950 p-5 text-white">
        <div className="flex items-center gap-3">
          {formData.logo_url ? (
            <div className="flex size-11 items-center justify-center overflow-hidden rounded-xl bg-white p-2">
              <img
                src={formData.logo_url}
                alt="Logo preview"
                className="max-h-full max-w-full object-contain"
              />
            </div>
          ) : (
            <div className="flex size-11 items-center justify-center rounded-xl bg-white/10">
              <Building2 className="size-5" />
            </div>
          )}

          <div className="min-w-0">
            <p className="truncate font-extrabold">
              {formData.company_name || "Company Name"}
            </p>

            <p className="mt-1 truncate text-xs text-slate-400">
              {formData.contact_email || "contact@example.com"}
            </p>
          </div>
        </div>

        <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-300">
          {formData.footer_description ||
            "Your footer description will appear here."}
        </p>
      </div>
    </section>
  )
}

function SummaryCard({
  label,
  value,
  suffix = "",
  description,
  icon,
  tone = "default",
}: {
  label: string
  value: number
  suffix?: string
  description: string
  icon: ReactNode
  tone?: "default" | "success" | "featured" | "neutral"
}) {
  const toneClasses = {
    default: "bg-blue-50 text-blue-700",
    success: "bg-emerald-50 text-emerald-700",
    featured: "bg-violet-50 text-violet-700",
    neutral: "bg-slate-100 text-slate-700",
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>

          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
            {value}
            {suffix}
          </p>

          <p className="mt-2 text-xs leading-5 text-slate-500">{description}</p>
        </div>

        <div className={`rounded-xl p-3 ${toneClasses[tone]}`}>{icon}</div>
      </div>
    </div>
  )
}

const inputClassName =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"

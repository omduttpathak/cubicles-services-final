import { useEffect, useMemo, useState, type ReactNode } from "react"
import axios from "axios"
import {
  BriefcaseBusiness,
  CheckCircle2,
  FileText,
  Globe2,
  ImageIcon,
  Layers3,
  Save,
  Search,
  Settings2,
  Sparkles,
  Trophy,
  Wrench,
} from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"

import {
  getAdminCaseStudyById,
  updateAdminCaseStudy,
  type UpdateAdminCaseStudyRequest,
} from "@/api/adminCaseStudiesApi"
import AdminFormPageHeader from "@/components/admin/forms/AdminFormPageHeader"
import CharacterCount from "@/components/admin/forms/CharacterCount"
import FormCard from "@/components/admin/forms/FormCard"
import FormField from "@/components/admin/forms/FormField"
import ImageUploader from "@/components/admin/ImageUploader"
import RichTextEditor from "@/components/admin/RichTextEditor"
import ErrorState from "@/components/common/ErrorState"
import PageLoader from "@/components/common/PageLoader"
import SEO from "@/components/seo/SEO"

const initialFormData: UpdateAdminCaseStudyRequest = {
  title: "",
  slug: "",
  industry: "",
  service: "",
  summary: "",
  challenge: "",
  solution: "",
  results: [],
  technologies: [],
  image_url: null,
  seo_title: "",
  seo_description: "",
}

function createSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

function splitLines(value: string): string[] {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean)
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

function getValidationMessage(detail: unknown): string {
  if (typeof detail === "string") {
    return detail
  }

  if (!Array.isArray(detail) || detail.length === 0) {
    return "Unable to create the case study."
  }

  return detail
    .map((validationError) => {
      const field = Array.isArray(validationError?.loc)
        ? validationError.loc
            .filter((item: unknown) => item !== "body")
            .join(".")
        : "field"

      const message =
        typeof validationError?.msg === "string"
          ? validationError.msg
          : "Please check this value."

      return `${field}: ${message}`
    })
    .join(" | ")
}

export default function AdminCaseStudyEdit() {
  const { caseStudyId } = useParams<{ caseStudyId: string }>()
  const navigate = useNavigate()
  const parsedCaseStudyId = Number(caseStudyId)

  const [formData, setFormData] =
    useState<UpdateAdminCaseStudyRequest>(initialFormData)
  const [resultsText, setResultsText] = useState("")
  const [technologiesText, setTechnologiesText] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  function updateField<Key extends keyof UpdateAdminCaseStudyRequest>(
    field: Key,
    value: UpdateAdminCaseStudyRequest[Key]
  ) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }))
  }

  async function loadCaseStudy() {
    if (!Number.isInteger(parsedCaseStudyId) || parsedCaseStudyId <= 0) {
      setHasError(true)
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setHasError(false)

      const caseStudy = await getAdminCaseStudyById(parsedCaseStudyId)

      setFormData({
        title: caseStudy.title,
        slug: caseStudy.slug,
        industry: caseStudy.industry,
        service: caseStudy.service,
        summary: caseStudy.summary,
        challenge: caseStudy.challenge,
        solution: caseStudy.solution,
        results: caseStudy.results,
        technologies: caseStudy.technologies,
        image_url: caseStudy.image_url,
        seo_title: caseStudy.seo_title,
        seo_description: caseStudy.seo_description,
      })

      setResultsText(caseStudy.results.join("\n"))
      setTechnologiesText(caseStudy.technologies.join("\n"))
    } catch (error) {
      console.error(error)
      setHasError(true)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSubmit() {
    if (isSubmitting) {
      return
    }

    setFormError(null)

    const results = splitLines(resultsText)
    const technologies = splitLines(technologiesText)

    const title = formData.title.trim()
    const slug = createSlug(formData.slug)
    const industry = formData.industry.trim()
    const service = formData.service.trim()
    const summary = formData.summary.trim()
    const challenge = formData.challenge.trim()
    const solution = formData.solution.trim()
    const seoTitle = formData.seo_title.trim()
    const seoDescription = formData.seo_description.trim()

    const challengeText = getPlainText(challenge)
    const solutionText = getPlainText(solution)

    let validationMessage: string | null = null

    if (title.length < 3) {
      validationMessage = "Title must contain at least 3 characters."
    } else if (slug.length < 3) {
      validationMessage = "Slug must contain at least 3 characters."
    } else if (industry.length < 2) {
      validationMessage = "Industry must contain at least 2 characters."
    } else if (service.length < 2) {
      validationMessage = "Service must contain at least 2 characters."
    } else if (summary.length < 10) {
      validationMessage = "Summary must contain at least 10 characters."
    } else if (challengeText.length < 20) {
      validationMessage =
        "Challenge must contain at least 20 visible characters."
    } else if (solutionText.length < 20) {
      validationMessage =
        "Solution must contain at least 20 visible characters."
    } else if (results.length === 0) {
      validationMessage = "Please enter at least one result."
    } else if (technologies.length === 0) {
      validationMessage = "Please enter at least one technology."
    } else if (seoTitle.length < 3) {
      validationMessage = "SEO title must contain at least 3 characters."
    } else if (seoDescription.length < 10) {
      validationMessage = "SEO description must contain at least 10 characters."
    }

    if (validationMessage) {
      setFormError(validationMessage)
      toast.error(validationMessage)
      window.scrollTo({ top: 0, behavior: "smooth" })
      return
    }

    try {
      setIsSubmitting(true)

      await updateAdminCaseStudy(parsedCaseStudyId, {
        ...formData,
        title,
        slug,
        industry,
        service,
        summary,
        challenge,
        solution,
        results,
        technologies,
        image_url: formData.image_url?.trim() || null,
        seo_title: seoTitle,
        seo_description: seoDescription,
      })

      toast.success("Case study updated successfully.")
      navigate("/admin/case-studies")
    } catch (error) {
      console.error(error)

      let message = "Unable to update the case study."

      if (axios.isAxiosError(error)) {
        message = getValidationMessage(error.response?.data?.detail)
      }

      setFormError(message)
      toast.error(message)
      window.scrollTo({ top: 0, behavior: "smooth" })
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    void loadCaseStudy()
  }, [caseStudyId])

  const requiredChecks = useMemo(
    () => [
      formData.title.trim().length >= 3,
      createSlug(formData.slug).length >= 3,
      formData.industry.trim().length >= 2,
      formData.service.trim().length >= 2,
      formData.summary.trim().length >= 10,
      getPlainText(formData.challenge).length >= 20,
      getPlainText(formData.solution).length >= 20,
      splitLines(resultsText).length > 0,
      splitLines(technologiesText).length > 0,
      formData.seo_title.trim().length >= 3,
      formData.seo_description.trim().length >= 10,
    ],
    [formData, resultsText, technologiesText]
  )

  const completedFields = requiredChecks.filter(Boolean).length
  const completionPercentage = Math.round(
    (completedFields / requiredChecks.length) * 100
  )

  if (isLoading) {
    return <PageLoader message="Loading case study..." />
  }

  if (hasError) {
    return (
      <ErrorState
        title="Unable to Load Case Study"
        message="The case study could not be loaded."
        onRetry={() => {
          void loadCaseStudy()
        }}
      />
    )
  }

  return (
    <>
      <SEO
        title="Edit Case Study | Cubicles Services Admin"
        description="Edit an existing Cubicles Services case study."
      />

      <div className="space-y-6">
        <AdminFormPageHeader
          eyebrow="Case study management"
          title="Edit Case Study"
          description="Update customer outcomes, technical details, media, and search metadata while preserving the current publication status."
          backLabel="Back to Case Studies"
          onBack={() => navigate("/admin/case-studies")}
          submitLabel="Save Changes"
          submittingLabel="Saving..."
          isSubmitting={isSubmitting}
          onSubmit={() => {
            void handleSubmit()
          }}
        />

        {formError && (
          <div
            role="alert"
            className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700 shadow-sm"
          >
            {formError}
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            <SectionCard
              icon={<BriefcaseBusiness className="size-5" />}
              title="Case study overview"
              description="Define the story title, URL, industry, service, and summary."
            >
              <FormField id="case-study-title" label="Title" required>
                <input
                  id="case-study-title"
                  type="text"
                  maxLength={255}
                  value={formData.title}
                  onChange={(event) => updateField("title", event.target.value)}
                  className={inputClassName}
                  placeholder="Enter the case study title"
                  disabled={isSubmitting}
                />
              </FormField>

              <FormField
                id="case-study-slug"
                label="Slug"
                required
                description={`Public URL: /case-studies/${
                  formData.slug || "case-study-slug"
                }`}
              >
                <div className="relative">
                  <Globe2 className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-slate-400" />

                  <input
                    id="case-study-slug"
                    type="text"
                    maxLength={255}
                    value={formData.slug}
                    onChange={(event) =>
                      updateField("slug", createSlug(event.target.value))
                    }
                    className={`${inputClassName} pl-12 font-mono text-sm`}
                    disabled={isSubmitting}
                  />
                </div>
              </FormField>

              <div className="grid gap-5 md:grid-cols-2">
                <FormField id="case-study-industry" label="Industry" required>
                  <input
                    id="case-study-industry"
                    type="text"
                    maxLength={150}
                    value={formData.industry}
                    onChange={(event) =>
                      updateField("industry", event.target.value)
                    }
                    placeholder="Financial Services, Retail..."
                    className={inputClassName}
                    disabled={isSubmitting}
                  />
                </FormField>

                <FormField id="case-study-service" label="Service" required>
                  <input
                    id="case-study-service"
                    type="text"
                    maxLength={150}
                    value={formData.service}
                    onChange={(event) =>
                      updateField("service", event.target.value)
                    }
                    placeholder="Cloud Migration, DevOps Engineering..."
                    className={inputClassName}
                    disabled={isSubmitting}
                  />
                </FormField>
              </div>

              <FormField
                id="case-study-summary"
                label="Summary"
                required
                description="Write a concise overview for listing cards and previews."
              >
                <textarea
                  id="case-study-summary"
                  rows={5}
                  maxLength={500}
                  value={formData.summary}
                  onChange={(event) =>
                    updateField("summary", event.target.value)
                  }
                  className={inputClassName}
                  disabled={isSubmitting}
                />

                <CharacterCount
                  current={formData.summary.length}
                  maximum={500}
                />
              </FormField>
            </SectionCard>

            <SectionCard
              icon={<Layers3 className="size-5" />}
              title="Challenge and solution"
              description="Explain the customer challenge and how Cubicles Services solved it."
            >
              <RichEditorField
                label="Challenge"
                value={formData.challenge}
                placeholder="Describe the customer's business and technical challenge..."
                disabled={isSubmitting}
                onChange={(value) => updateField("challenge", value)}
              />

              <RichEditorField
                label="Solution"
                value={formData.solution}
                placeholder="Describe the solution delivered by Cubicles Services..."
                disabled={isSubmitting}
                onChange={(value) => updateField("solution", value)}
              />
            </SectionCard>

            <SectionCard
              icon={<Trophy className="size-5" />}
              title="Results"
              description="Add measurable outcomes and customer value, one result per line."
            >
              <FormField
                id="case-study-results"
                label="Results"
                required
                description="Each non-empty line becomes one result item."
              >
                <textarea
                  id="case-study-results"
                  rows={7}
                  value={resultsText}
                  onChange={(event) => setResultsText(event.target.value)}
                  placeholder={
                    "Reduced deployment time by 60%\nImproved platform reliability\nLowered infrastructure costs"
                  }
                  className={`${inputClassName} leading-7`}
                  disabled={isSubmitting}
                />
              </FormField>

              <ListPreview
                title="Result preview"
                items={splitLines(resultsText)}
                emptyMessage="Add results above to preview them here."
              />
            </SectionCard>

            <SectionCard
              icon={<Search className="size-5" />}
              title="Search engine optimization"
              description="Control how the case study appears in search results and shared links."
            >
              <FormField id="case-study-seo-title" label="SEO Title" required>
                <input
                  id="case-study-seo-title"
                  type="text"
                  maxLength={255}
                  value={formData.seo_title}
                  onChange={(event) =>
                    updateField("seo_title", event.target.value)
                  }
                  className={inputClassName}
                  disabled={isSubmitting}
                />

                <CharacterCount
                  current={formData.seo_title.length}
                  maximum={255}
                />
              </FormField>

              <FormField
                id="case-study-seo-description"
                label="SEO Description"
                required
              >
                <textarea
                  id="case-study-seo-description"
                  rows={5}
                  maxLength={500}
                  value={formData.seo_description}
                  onChange={(event) =>
                    updateField("seo_description", event.target.value)
                  }
                  className={inputClassName}
                  disabled={isSubmitting}
                />

                <CharacterCount
                  current={formData.seo_description.length}
                  maximum={500}
                />
              </FormField>

              <SearchPreview
                title={formData.seo_title}
                slug={formData.slug}
                description={formData.seo_description}
              />
            </SectionCard>
          </div>

          <aside className="space-y-6">
            <section className="sticky top-24 space-y-6">
              <FormCard
                title="Save changes"
                description="Apply the current content, media, and SEO updates."
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
                title="Technologies"
                description="Update the platforms and tools used, one per line."
              >
                <FormField
                  id="case-study-technologies"
                  label="Technology Stack"
                  required
                  description="Each non-empty line becomes one technology item."
                >
                  <textarea
                    id="case-study-technologies"
                    rows={7}
                    value={technologiesText}
                    onChange={(event) =>
                      setTechnologiesText(event.target.value)
                    }
                    placeholder={"AWS\nKubernetes\nTerraform\nGitHub Actions"}
                    className={`${inputClassName} leading-7`}
                    disabled={isSubmitting}
                  />
                </FormField>

                <ListPreview
                  title="Technology preview"
                  items={splitLines(technologiesText)}
                  emptyMessage="Add technologies above to preview them here."
                />
              </FormCard>

              <FormCard
                title="Featured image"
                description="Update the visual displayed on the public case-study page."
              >
                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm ring-1 ring-slate-200">
                      <ImageIcon className="size-4" />
                    </div>

                    <div>
                      <p className="text-sm font-extrabold text-slate-950">
                        Case-study image
                      </p>
                      <p className="text-xs text-slate-500">
                        PNG, JPG, JPEG, or WebP
                      </p>
                    </div>
                  </div>

                  <ImageUploader
                    label="Featured Image"
                    value={formData.image_url}
                    onChange={(value) => updateField("image_url", value)}
                    accept=".png,.jpg,.jpeg,.webp"
                    helpText="Upload the case study featured image."
                    disabled={isSubmitting}
                  />
                </div>
              </FormCard>

              <CompletionCard
                completedFields={completedFields}
                totalFields={requiredChecks.length}
                percentage={completionPercentage}
              />

              <section className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-violet-50 p-5">
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm ring-1 ring-blue-100">
                    <Settings2 className="size-5" />
                  </div>

                  <div>
                    <h2 className="font-extrabold text-slate-950">
                      Publishing status
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Saving changes does not alter the current published or
                      draft status. Use the controls on the Case Studies
                      management page to change visibility.
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
      <div className="space-y-6">{children}</div>
    </FormCard>
  )
}

type RichEditorFieldProps = {
  label: string
  value: string
  placeholder: string
  disabled: boolean
  onChange: (value: string) => void
}

function RichEditorField({
  label,
  value,
  placeholder,
  disabled,
  onChange,
}: RichEditorFieldProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-slate-700">
        {label}
        <span className="text-red-600"> *</span>
      </label>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white focus-within:border-blue-300 focus-within:ring-4 focus-within:ring-blue-100">
        <RichTextEditor
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
        />
      </div>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        Enter at least 20 visible characters. Use headings, lists, and
        formatting where helpful.
      </p>
    </div>
  )
}

type ListPreviewProps = {
  title: string
  items: string[]
  emptyMessage: string
}

function ListPreview({ title, items, emptyMessage }: ListPreviewProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
      <div className="flex items-center gap-2 text-xs font-extrabold tracking-[0.14em] text-slate-500 uppercase">
        <Wrench className="size-3.5" />
        {title}
      </div>

      {items.length > 0 ? (
        <ul className="mt-4 space-y-2">
          {items.map((item, index) => (
            <li
              key={`${item}-${index}`}
              className="flex items-start gap-3 rounded-xl bg-white px-3 py-2 text-sm text-slate-700 shadow-sm ring-1 ring-slate-200"
            >
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm leading-6 text-slate-500">{emptyMessage}</p>
      )}
    </div>
  )
}

type CompletionCardProps = {
  completedFields: number
  totalFields: number
  percentage: number
}

function CompletionCard({
  completedFields,
  totalFields,
  percentage,
}: CompletionCardProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-extrabold text-slate-950">
            Case-study completion
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

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <FileText className="size-4" />
          Ready for review
        </div>

        <p className="text-sm font-extrabold text-slate-700">{percentage}%</p>
      </div>
    </section>
  )
}

type SearchPreviewProps = {
  title: string
  slug: string
  description: string
}

function SearchPreview({ title, slug, description }: SearchPreviewProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <div className="flex items-center gap-2 text-xs font-extrabold tracking-[0.16em] text-slate-500 uppercase">
        <Sparkles className="size-3.5" />
        Search preview
      </div>

      <div className="mt-4 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
        <p className="truncate text-xs text-emerald-700">
          cubiclesservices.com › case-studies › {slug || "case-study-slug"}
        </p>

        <p className="mt-1 line-clamp-2 text-lg font-medium text-blue-700">
          {title || "Case Study | Cubicles Services"}
        </p>

        <p className="mt-1 line-clamp-3 text-sm leading-6 text-slate-600">
          {description ||
            "Add an SEO description to preview how this case study may appear in search results."}
        </p>
      </div>
    </section>
  )
}

const inputClassName =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"

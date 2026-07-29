import ImageUploader from "@/components/admin/ImageUploader"
import RichTextEditor from "@/components/admin/RichTextEditor"
import { useEffect, useState } from "react"
import axios from "axios"
import { ArrowLeft, Save } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"

import {
  getAdminCaseStudyById,
  updateAdminCaseStudy,
  type UpdateAdminCaseStudyRequest,
} from "@/api/adminCaseStudiesApi"
import ErrorState from "@/components/common/ErrorState"
import PageLoader from "@/components/common/PageLoader"
import SEO from "@/components/seo/SEO"

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

export default function AdminCaseStudyEdit() {
  const { caseStudyId } = useParams<{
    caseStudyId: string
  }>()

  const navigate = useNavigate()

  const parsedCaseStudyId = Number(caseStudyId)

  const [formData, setFormData] = useState<UpdateAdminCaseStudyRequest>({
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
  })

  const [resultsText, setResultsText] = useState("")
  const [technologiesText, setTechnologiesText] = useState("")

  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasError, setHasError] = useState(false)

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
    const results = splitLines(resultsText)
    const technologies = splitLines(technologiesText)

    if (
      !formData.title.trim() ||
      !formData.slug.trim() ||
      !formData.industry.trim() ||
      !formData.service.trim() ||
      !formData.summary.trim() ||
      !formData.challenge.trim() ||
      !formData.solution.trim() ||
      !formData.seo_title.trim() ||
      !formData.seo_description.trim()
    ) {
      toast.error("Please complete all required fields.")
      return
    }

    if (results.length === 0) {
      toast.error("Please enter at least one result.")
      return
    }

    if (technologies.length === 0) {
      toast.error("Please enter at least one technology.")
      return
    }

    try {
      setIsSubmitting(true)

      await updateAdminCaseStudy(parsedCaseStudyId, {
        ...formData,
        slug: createSlug(formData.slug),
        results,
        technologies,
        image_url: formData.image_url?.trim() || null,
      })

      toast.success("Case study updated successfully.")

      navigate("/admin/case-studies")
    } catch (error) {
      console.error(error)

      if (axios.isAxiosError(error)) {
        const detail = error.response?.data?.detail

        toast.error(
          typeof detail === "string"
            ? detail
            : "Unable to update the case study."
        )
      } else {
        toast.error("Unable to update the case study.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    void loadCaseStudy()
  }, [caseStudyId])

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

      <section>
        <div className="flex flex-col gap-4 rounded-xl bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <button
              type="button"
              onClick={() => navigate("/admin/case-studies")}
              className="inline-flex items-center text-sm font-semibold text-blue-600 transition hover:text-blue-700"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Case Studies
            </button>

            <h1 className="mt-3 text-2xl font-bold text-slate-900">
              Edit Case Study
            </h1>

            <p className="mt-1 text-sm text-slate-600">
              Update case-study content, results, technologies and SEO
              information.
            </p>
          </div>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => {
              void handleSubmit()
            }}
            className="inline-flex items-center rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save className="mr-2 h-4 w-4" />

            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">
                Case Study Content
              </h2>

              <div className="mt-6 space-y-5">
                <div>
                  <label
                    htmlFor="case-study-title"
                    className="mb-2 block font-medium text-slate-700"
                  >
                    Title *
                  </label>

                  <input
                    id="case-study-title"
                    type="text"
                    value={formData.title}
                    onChange={(event) =>
                      updateField("title", event.target.value)
                    }
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 transition outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="case-study-slug"
                    className="mb-2 block font-medium text-slate-700"
                  >
                    Slug *
                  </label>

                  <input
                    id="case-study-slug"
                    type="text"
                    value={formData.slug}
                    onChange={(event) =>
                      updateField("slug", createSlug(event.target.value))
                    }
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 font-mono text-sm transition outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                  <p className="mt-2 text-sm text-slate-500">
                    Public URL: /case-studies/
                    {formData.slug}
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="case-study-summary"
                    className="mb-2 block font-medium text-slate-700"
                  >
                    Summary *
                  </label>

                  <textarea
                    id="case-study-summary"
                    rows={4}
                    maxLength={500}
                    value={formData.summary}
                    onChange={(event) =>
                      updateField("summary", event.target.value)
                    }
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 transition outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                  <p className="mt-1 text-right text-xs text-slate-500">
                    {formData.summary.length}/500
                  </p>
                </div>

                <div>
                  <label className="mb-2 block font-medium text-slate-700">
                    Challenge *
                  </label>

                  <RichTextEditor
                    value={formData.challenge}
                    onChange={(value) => updateField("challenge", value)}
                    placeholder="Describe the customer's business and technical challenge..."
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="mb-2 block font-medium text-slate-700">
                    Solution *
                  </label>

                  <RichTextEditor
                    value={formData.solution}
                    onChange={(value) => updateField("solution", value)}
                    placeholder="Describe the solution delivered by Cubicles Services..."
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label
                    htmlFor="case-study-results"
                    className="mb-2 block font-medium text-slate-700"
                  >
                    Results *
                  </label>

                  <textarea
                    id="case-study-results"
                    rows={6}
                    value={resultsText}
                    onChange={(event) => setResultsText(event.target.value)}
                    placeholder="Enter one result per line"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 leading-7 transition outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                  <p className="mt-2 text-sm text-slate-500">
                    Enter each result on a separate line.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">
                Search Engine Optimization
              </h2>

              <div className="mt-6 space-y-5">
                <div>
                  <label
                    htmlFor="case-study-seo-title"
                    className="mb-2 block font-medium text-slate-700"
                  >
                    SEO Title *
                  </label>

                  <input
                    id="case-study-seo-title"
                    type="text"
                    maxLength={255}
                    value={formData.seo_title}
                    onChange={(event) =>
                      updateField("seo_title", event.target.value)
                    }
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 transition outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="case-study-seo-description"
                    className="mb-2 block font-medium text-slate-700"
                  >
                    SEO Description *
                  </label>

                  <textarea
                    id="case-study-seo-description"
                    rows={4}
                    maxLength={500}
                    value={formData.seo_description}
                    onChange={(event) =>
                      updateField("seo_description", event.target.value)
                    }
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 transition outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                  <p className="mt-1 text-right text-xs text-slate-500">
                    {formData.seo_description.length}
                    /500
                  </p>
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">
                Case Study Settings
              </h2>

              <div className="mt-6 space-y-5">
                <div>
                  <label
                    htmlFor="case-study-industry"
                    className="mb-2 block font-medium text-slate-700"
                  >
                    Industry *
                  </label>

                  <input
                    id="case-study-industry"
                    type="text"
                    value={formData.industry}
                    onChange={(event) =>
                      updateField("industry", event.target.value)
                    }
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 transition outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="case-study-service"
                    className="mb-2 block font-medium text-slate-700"
                  >
                    Service *
                  </label>

                  <input
                    id="case-study-service"
                    type="text"
                    value={formData.service}
                    onChange={(event) =>
                      updateField("service", event.target.value)
                    }
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 transition outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="case-study-technologies"
                    className="mb-2 block font-medium text-slate-700"
                  >
                    Technologies *
                  </label>

                  <textarea
                    id="case-study-technologies"
                    rows={6}
                    value={technologiesText}
                    onChange={(event) =>
                      setTechnologiesText(event.target.value)
                    }
                    placeholder="Enter one technology per line"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 leading-7 transition outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                  <p className="mt-2 text-sm text-slate-500">
                    Enter each technology on a separate line.
                  </p>
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
            </div>

            <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
              <h2 className="font-bold text-slate-900">Publishing Status</h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Saving changes does not change the current published or draft
                status. Use the publish controls on the Case Studies management
                page to change visibility.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}

import { useState } from "react"
import axios from "axios"
import { ArrowLeft, Save, Send } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

import {
  createAdminCaseStudy,
  type CreateAdminCaseStudyRequest,
} from "@/api/adminCaseStudiesApi"
import ImageUploader from "@/components/admin/ImageUploader"
import RichTextEditor from "@/components/admin/RichTextEditor"
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

export default function AdminCaseStudyCreate() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState<CreateAdminCaseStudyRequest>({
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
    is_published: false,
    published_at: null,
  })

  const [resultsText, setResultsText] = useState("")
  const [technologiesText, setTechnologiesText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMode, setSubmitMode] = useState<"draft" | "publish" | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  function updateField<Key extends keyof CreateAdminCaseStudyRequest>(
    field: Key,
    value: CreateAdminCaseStudyRequest[Key]
  ) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }))
  }

  function handleTitleChange(value: string) {
    setFormData((current) => ({
      ...current,
      title: value,
      slug: createSlug(value),
      seo_title:
        current.seo_title === "" || current.seo_title === current.title
          ? value
          : current.seo_title,
    }))
  }

  async function submitCaseStudy(publishImmediately: boolean) {
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

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })

      return
    }

    try {
      setIsSubmitting(true)
      setSubmitMode(publishImmediately ? "publish" : "draft")

      const payload: CreateAdminCaseStudyRequest = {
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
        is_published: publishImmediately,
        published_at: publishImmediately ? new Date().toISOString() : null,
      }

      await createAdminCaseStudy(payload)

      toast.success(
        publishImmediately
          ? "Case study published successfully."
          : "Case study saved as draft."
      )

      navigate("/admin/case-studies")
    } catch (error) {
      console.error(error)

      let message = "Unable to create the case study."

      if (axios.isAxiosError(error)) {
        const detail = error.response?.data?.detail

        console.error(
          "Case study validation errors:",
          JSON.stringify(detail, null, 2)
        )

        message = getValidationMessage(detail)
      }

      setFormError(message)
      toast.error(message)

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    } finally {
      setIsSubmitting(false)
      setSubmitMode(null)
    }
  }

  return (
    <>
      <SEO
        title="Create Case Study | Cubicles Services Admin"
        description="Create a new Cubicles Services case study."
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
              Create Case Study
            </h1>

            <p className="mt-1 text-sm text-slate-600">
              Save the case study as a draft or publish it immediately.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => {
                void submitCaseStudy(false)
              }}
              className="inline-flex items-center rounded-lg border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save className="mr-2 h-4 w-4" />
              {isSubmitting && submitMode === "draft"
                ? "Saving Draft..."
                : "Save Draft"}
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => {
                void submitCaseStudy(true)
              }}
              className="inline-flex items-center rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send className="mr-2 h-4 w-4" />
              {isSubmitting && submitMode === "publish"
                ? "Publishing..."
                : "Publish"}
            </button>
          </div>
        </div>

        {formError && (
          <div
            role="alert"
            className="mt-4 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700"
          >
            {formError}
          </div>
        )}

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
                    onChange={(event) => handleTitleChange(event.target.value)}
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
                    {formData.slug || "case-study-slug"}
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
                    placeholder="Financial Services, Retail..."
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
                    placeholder="Cloud Migration, DevOps Engineering..."
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
              <h2 className="font-bold text-slate-900">Publishing</h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Save Draft keeps the case study private. Publish makes it
                immediately available on the public Case Studies page.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}

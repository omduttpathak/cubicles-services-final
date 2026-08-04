import { useEffect, useMemo, useState, type ReactNode } from "react"
import axios from "axios"
import {
  CheckCircle2,
  CircleHelp,
  FileQuestion,
  Pencil,
  Plus,
  Save,
  Search,
  Sparkles,
  Trash2,
  X,
} from "lucide-react"
import { toast } from "sonner"

import {
  createAdminHomepageFaq,
  deleteAdminHomepageFaq,
  getAdminHomepageFaqs,
  updateAdminHomepageFaq,
  type AdminHomepageFaq,
  type HomepageFaqRequest,
} from "@/api/adminHomepageFaqsApi"
import CharacterCount from "@/components/admin/forms/CharacterCount"
import FormCard from "@/components/admin/forms/FormCard"
import FormField from "@/components/admin/forms/FormField"
import ErrorState from "@/components/common/ErrorState"
import PageLoader from "@/components/common/PageLoader"
import SEO from "@/components/seo/SEO"

const initialFormData: HomepageFaqRequest = {
  question: "",
  answer: "",
  display_order: 0,
  is_active: true,
}

export default function AdminHomepageFaqs() {
  const [faqs, setFaqs] = useState<AdminHomepageFaq[]>([])
  const [formData, setFormData] = useState<HomepageFaqRequest>(initialFormData)

  const [searchTerm, setSearchTerm] = useState("")
  const [editingId, setEditingId] = useState<number | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasError, setHasError] = useState(false)

  async function loadFaqs() {
    try {
      setIsLoading(true)
      setHasError(false)

      const response = await getAdminHomepageFaqs()

      setFaqs(sortFaqs(response))
    } catch (error) {
      console.error(error)
      setHasError(true)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadFaqs()
  }, [])

  const filteredFaqs = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase()

    if (!keyword) {
      return faqs
    }

    return faqs.filter((faq) => {
      return (
        faq.question.toLowerCase().includes(keyword) ||
        faq.answer.toLowerCase().includes(keyword)
      )
    })
  }, [faqs, searchTerm])

  const activeCount = useMemo(
    () => faqs.filter((faq) => faq.is_active).length,
    [faqs]
  )

  const inactiveCount = faqs.length - activeCount

  const completionPercentage = useMemo(() => {
    const completed = [formData.question.trim(), formData.answer.trim()].filter(
      Boolean
    ).length

    return Math.round((completed / 2) * 100)
  }, [formData])

  function updateField<Key extends keyof HomepageFaqRequest>(
    field: Key,
    value: HomepageFaqRequest[Key]
  ) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }))
  }

  function resetForm() {
    setFormData(initialFormData)
    setEditingId(null)
  }

  function startEditing(faq: AdminHomepageFaq) {
    setEditingId(faq.id)

    setFormData({
      question: faq.question,
      answer: faq.answer,
      display_order: faq.display_order,
      is_active: faq.is_active,
    })

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  async function handleSubmit() {
    if (!formData.question.trim() || !formData.answer.trim()) {
      toast.error("Please complete all required fields.")
      return
    }

    try {
      setIsSubmitting(true)

      const payload: HomepageFaqRequest = {
        question: formData.question.trim(),
        answer: formData.answer.trim(),
        display_order: formData.display_order,
        is_active: formData.is_active,
      }

      if (editingId !== null) {
        const updated = await updateAdminHomepageFaq(editingId, payload)

        setFaqs((current) =>
          sortFaqs(current.map((faq) => (faq.id === editingId ? updated : faq)))
        )

        toast.success("Homepage FAQ updated successfully.")
      } else {
        const created = await createAdminHomepageFaq(payload)

        setFaqs((current) => sortFaqs([...current, created]))
        toast.success("Homepage FAQ created successfully.")
      }

      resetForm()
    } catch (error) {
      console.error(error)

      if (axios.isAxiosError(error)) {
        const detail = error.response?.data?.detail

        if (typeof detail === "string") {
          toast.error(detail)
        } else if (Array.isArray(detail) && detail.length > 0) {
          toast.error(detail[0]?.msg || "Please check the FAQ details.")
        } else {
          toast.error("Unable to save the homepage FAQ.")
        }
      } else {
        toast.error("Unable to save the homepage FAQ.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete(faq: AdminHomepageFaq) {
    const confirmed = window.confirm(`Delete "${faq.question}" permanently?`)

    if (!confirmed) {
      return
    }

    try {
      setDeletingId(faq.id)

      await deleteAdminHomepageFaq(faq.id)

      setFaqs((current) => current.filter((item) => item.id !== faq.id))

      if (editingId === faq.id) {
        resetForm()
      }

      toast.success("Homepage FAQ deleted successfully.")
    } catch (error) {
      console.error(error)
      toast.error("Unable to delete the homepage FAQ.")
    } finally {
      setDeletingId(null)
    }
  }

  if (isLoading) {
    return <PageLoader message="Loading homepage FAQs..." />
  }

  if (hasError) {
    return (
      <ErrorState
        title="Unable to Load Homepage FAQs"
        message="The homepage FAQs could not be loaded."
        onRetry={() => {
          void loadFaqs()
        }}
      />
    )
  }

  return (
    <>
      <SEO
        title="Homepage FAQs | Cubicles Services Admin"
        description="Manage frequently asked questions shown on the Cubicles Services homepage."
      />

      <section className="space-y-6">
        <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 px-6 py-8 text-white shadow-xl sm:px-8">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.25),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(139,92,246,0.18),transparent_40%)]" />

          <div className="relative max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold tracking-[0.16em] text-blue-200 uppercase backdrop-blur">
              <Sparkles className="size-3.5" />
              Homepage Builder
            </div>

            <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
              Homepage FAQs
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
              Create, update, organize, and control the questions displayed in
              the homepage FAQ section.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <SummaryCard
            label="Total FAQs"
            value={faqs.length}
            description="All homepage questions"
            icon={<CircleHelp className="size-5" />}
          />

          <SummaryCard
            label="Active"
            value={activeCount}
            description="Visible on the homepage"
            icon={<CheckCircle2 className="size-5" />}
            tone="success"
          />

          <SummaryCard
            label="Inactive"
            value={inactiveCount}
            description="Hidden from visitors"
            icon={<FileQuestion className="size-5" />}
            tone="neutral"
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
          <aside className="h-fit xl:sticky xl:top-24">
            <FormCard
              title={editingId === null ? "Add FAQ" : "Edit FAQ"}
              description={
                editingId === null
                  ? "Create a new homepage FAQ."
                  : "Update the selected FAQ."
              }
              action={
                editingId !== null ? (
                  <button
                    type="button"
                    onClick={resetForm}
                    title="Cancel editing"
                    aria-label="Cancel editing"
                    className="inline-flex size-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
                  >
                    <X className="size-4" />
                  </button>
                ) : (
                  <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <CircleHelp className="size-5" />
                  </div>
                )
              }
            >
              <div className="space-y-5">
                <FormField id="faq-question" label="Question" required>
                  <textarea
                    id="faq-question"
                    rows={4}
                    maxLength={500}
                    value={formData.question}
                    onChange={(event) =>
                      updateField("question", event.target.value)
                    }
                    placeholder="Which cloud platforms do you support?"
                    className={`${inputClassName} leading-7`}
                    disabled={isSubmitting}
                  />

                  <CharacterCount
                    current={formData.question.length}
                    maximum={500}
                  />
                </FormField>

                <FormField id="faq-answer" label="Answer" required>
                  <textarea
                    id="faq-answer"
                    rows={8}
                    maxLength={2000}
                    value={formData.answer}
                    onChange={(event) =>
                      updateField("answer", event.target.value)
                    }
                    placeholder="Enter a clear and helpful answer."
                    className={`${inputClassName} leading-7`}
                    disabled={isSubmitting}
                  />

                  <CharacterCount
                    current={formData.answer.length}
                    maximum={2000}
                  />
                </FormField>

                <FormField
                  id="faq-display-order"
                  label="Display Order"
                  description="Lower numbers appear earlier."
                >
                  <input
                    id="faq-display-order"
                    type="number"
                    min={0}
                    value={formData.display_order}
                    onChange={(event) =>
                      updateField(
                        "display_order",
                        Math.max(0, Number(event.target.value))
                      )
                    }
                    className={inputClassName}
                    disabled={isSubmitting}
                  />
                </FormField>

                <ToggleField
                  title="Active"
                  description="Active FAQs appear on the public homepage."
                  checked={formData.is_active}
                  disabled={isSubmitting}
                  onChange={(checked) => updateField("is_active", checked)}
                />

                <CompletionPanel
                  percentage={completionPercentage}
                  isActive={formData.is_active}
                />

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => {
                    void handleSubmit()
                  }}
                  className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-extrabold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {editingId === null ? (
                    <Plus className="mr-2 size-4" />
                  ) : (
                    <Save className="mr-2 size-4" />
                  )}

                  {isSubmitting
                    ? "Saving..."
                    : editingId === null
                      ? "Add FAQ"
                      : "Save Changes"}
                </button>
              </div>
            </FormCard>
          </aside>

          <div className="min-w-0">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-950">
                    Existing FAQs
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {faqs.length} total FAQs
                  </p>
                </div>

                <div className="relative w-full sm:max-w-sm">
                  <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-slate-400" />

                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search FAQs..."
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pr-4 pl-11 text-sm text-slate-900 transition outline-none placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              </div>
            </div>

            {filteredFaqs.length === 0 ? (
              <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
                <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                  <CircleHelp className="size-7" />
                </div>

                <h2 className="mt-5 text-xl font-bold text-slate-950">
                  No FAQs Found
                </h2>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
                  {searchTerm
                    ? "No FAQs match your search."
                    : "Create your first homepage FAQ."}
                </p>
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                {filteredFaqs.map((faq) => (
                  <article
                    key={faq.id}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-6"
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-lg leading-7 font-extrabold text-slate-950">
                            {faq.question}
                          </h3>

                          <StatusBadge isActive={faq.is_active} />
                        </div>

                        <p className="mt-4 line-clamp-4 text-sm leading-7 text-slate-600">
                          {faq.answer}
                        </p>

                        <div className="mt-5 border-t border-slate-100 pt-4">
                          <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 ring-inset">
                            Display order {faq.display_order}
                          </span>
                        </div>
                      </div>

                      <div className="flex shrink-0 gap-2">
                        <button
                          type="button"
                          onClick={() => startEditing(faq)}
                          title="Edit FAQ"
                          aria-label={`Edit ${faq.question}`}
                          className="inline-flex size-10 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 text-blue-700 transition hover:bg-blue-100"
                        >
                          <Pencil className="size-4" />
                        </button>

                        <button
                          type="button"
                          disabled={deletingId === faq.id}
                          onClick={() => {
                            void handleDelete(faq)
                          }}
                          title="Delete FAQ"
                          aria-label={`Delete ${faq.question}`}
                          className="inline-flex size-10 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
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

function CompletionPanel({
  percentage,
  isActive,
}: {
  percentage: number
  isActive: boolean
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-extrabold text-slate-950">
            Form completion
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Question and answer readiness
          </p>
        </div>

        <span className="text-sm font-black text-blue-700">{percentage}%</span>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white">
        <div
          className="h-full rounded-full bg-blue-600 transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div
        className={`mt-4 rounded-xl border px-3 py-2 text-xs font-bold ${
          isActive
            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
            : "border-amber-200 bg-amber-50 text-amber-700"
        }`}
      >
        {isActive ? "FAQ will be visible" : "FAQ will remain hidden"}
      </div>
    </div>
  )
}

function StatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${
        isActive
          ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
          : "bg-red-50 text-red-700 ring-red-200"
      }`}
    >
      <span
        className={`size-1.5 rounded-full ${
          isActive ? "bg-emerald-500" : "bg-red-500"
        }`}
      />

      {isActive ? "Active" : "Inactive"}
    </span>
  )
}

function SummaryCard({
  label,
  value,
  description,
  icon,
  tone = "default",
}: {
  label: string
  value: number
  description: string
  icon: ReactNode
  tone?: "default" | "success" | "neutral"
}) {
  const toneClasses = {
    default: "bg-blue-50 text-blue-700",
    success: "bg-emerald-50 text-emerald-700",
    neutral: "bg-slate-100 text-slate-700",
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>

          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
            {value}
          </p>

          <p className="mt-2 text-xs leading-5 text-slate-500">{description}</p>
        </div>

        <div className={`rounded-xl p-3 ${toneClasses[tone]}`}>{icon}</div>
      </div>
    </div>
  )
}

function sortFaqs(faqs: AdminHomepageFaq[]): AdminHomepageFaq[] {
  return [...faqs].sort(
    (first, second) =>
      first.display_order - second.display_order || first.id - second.id
  )
}

const inputClassName =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"

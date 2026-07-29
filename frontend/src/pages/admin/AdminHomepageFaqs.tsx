import { useEffect, useMemo, useState, type ReactNode } from "react"
import axios from "axios"
import { CircleHelp, Pencil, Plus, Save, Search, Trash2, X } from "lucide-react"
import { toast } from "sonner"

import {
  createAdminHomepageFaq,
  deleteAdminHomepageFaq,
  getAdminHomepageFaqs,
  updateAdminHomepageFaq,
  type AdminHomepageFaq,
  type HomepageFaqRequest,
} from "@/api/adminHomepageFaqsApi"
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

      setFaqs(response)
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
          current
            .map((faq) => (faq.id === editingId ? updated : faq))
            .sort(
              (first, second) =>
                first.display_order - second.display_order ||
                first.id - second.id
            )
        )

        toast.success("Homepage FAQ updated successfully.")
      } else {
        const created = await createAdminHomepageFaq(payload)

        setFaqs((current) =>
          [...current, created].sort(
            (first, second) =>
              first.display_order - second.display_order || first.id - second.id
          )
        )

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

      <section>
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="font-semibold tracking-wider text-blue-600 uppercase">
            Homepage Builder
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            Homepage FAQs
          </h1>

          <p className="mt-1 text-sm text-slate-600">
            Manage the questions displayed in the homepage FAQ section.
          </p>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
          <div className="h-fit rounded-xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {editingId === null ? "Add FAQ" : "Edit FAQ"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {editingId === null
                    ? "Create a new homepage FAQ."
                    : "Update the selected FAQ."}
                </p>
              </div>

              {editingId !== null && (
                <button
                  type="button"
                  onClick={resetForm}
                  title="Cancel editing"
                  aria-label="Cancel editing"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 text-slate-600 transition hover:bg-slate-50"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="mt-6 space-y-5">
              <FormField id="faq-question" label="Question" required>
                <textarea
                  id="faq-question"
                  rows={3}
                  value={formData.question}
                  onChange={(event) =>
                    updateField("question", event.target.value)
                  }
                  placeholder="Which cloud platforms do you support?"
                  className={`${inputClassName} leading-7`}
                />
              </FormField>

              <FormField id="faq-answer" label="Answer" required>
                <textarea
                  id="faq-answer"
                  rows={7}
                  value={formData.answer}
                  onChange={(event) =>
                    updateField("answer", event.target.value)
                  }
                  placeholder="Enter the answer."
                  className={`${inputClassName} leading-7`}
                />
              </FormField>

              <FormField id="faq-display-order" label="Display Order">
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
                />
              </FormField>

              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4">
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

                  <span className="mt-1 block text-sm text-slate-500">
                    Active FAQs appear on the public homepage.
                  </span>
                </span>
              </label>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => {
                  void handleSubmit()
                }}
                className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {editingId === null ? (
                  <Plus className="mr-2 h-4 w-4" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}

                {isSubmitting
                  ? "Saving..."
                  : editingId === null
                    ? "Add FAQ"
                    : "Save Changes"}
              </button>
            </div>
          </div>

          <div>
            <div className="flex flex-col gap-4 rounded-xl bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Existing FAQs
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {faqs.length} total FAQs
                </p>
              </div>

              <div className="relative w-full sm:max-w-sm">
                <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400" />

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search FAQs..."
                  className="w-full rounded-xl border border-slate-300 bg-white py-3 pr-4 pl-12 transition outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {filteredFaqs.length === 0 ? (
              <div className="mt-4 rounded-xl bg-white px-6 py-16 text-center shadow-sm">
                <CircleHelp className="mx-auto h-12 w-12 text-slate-400" />

                <h2 className="mt-5 text-2xl font-bold text-slate-900">
                  No FAQs Found
                </h2>

                <p className="mt-3 text-slate-600">
                  {searchTerm
                    ? "No FAQs match your search."
                    : "Create your first homepage FAQ."}
                </p>
              </div>
            ) : (
              <div className="mt-4 overflow-hidden rounded-xl bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                          FAQ
                        </th>

                        <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                          Order
                        </th>

                        <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                          Status
                        </th>

                        <th className="px-5 py-4 text-right text-sm font-semibold text-slate-700">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {filteredFaqs.map((faq) => (
                        <tr
                          key={faq.id}
                          className="align-top transition hover:bg-slate-50"
                        >
                          <td className="max-w-xl px-5 py-4">
                            <p className="font-semibold text-slate-900">
                              {faq.question}
                            </p>

                            <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                              {faq.answer}
                            </p>
                          </td>

                          <td className="px-5 py-4 text-sm font-semibold text-slate-700">
                            {faq.display_order}
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                faq.is_active
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {faq.is_active ? "Active" : "Inactive"}
                            </span>
                          </td>

                          <td className="px-5 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => startEditing(faq)}
                                title="Edit FAQ"
                                aria-label={`Edit ${faq.question}`}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 text-slate-600 transition hover:bg-slate-50"
                              >
                                <Pencil className="h-4 w-4" />
                              </button>

                              <button
                                type="button"
                                disabled={deletingId === faq.id}
                                onClick={() => {
                                  void handleDelete(faq)
                                }}
                                title="Delete FAQ"
                                aria-label={`Delete ${faq.question}`}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
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

const inputClassName =
  "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"

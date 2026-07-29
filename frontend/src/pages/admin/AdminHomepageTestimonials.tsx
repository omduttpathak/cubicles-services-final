import { useEffect, useMemo, useState, type ReactNode } from "react"
import axios from "axios"
import {
  MessageSquareQuote,
  Pencil,
  Plus,
  Save,
  Search,
  Trash2,
  X,
} from "lucide-react"
import { toast } from "sonner"

import {
  createAdminHomepageTestimonial,
  deleteAdminHomepageTestimonial,
  getAdminHomepageTestimonials,
  updateAdminHomepageTestimonial,
  type AdminHomepageTestimonial,
  type HomepageTestimonialRequest,
} from "@/api/adminHomepageTestimonialsApi"
import ErrorState from "@/components/common/ErrorState"
import PageLoader from "@/components/common/PageLoader"
import SEO from "@/components/seo/SEO"

const initialFormData: HomepageTestimonialRequest = {
  name: "",
  designation: "",
  content: "",
  display_order: 0,
  is_active: true,
}

export default function AdminHomepageTestimonials() {
  const [testimonials, setTestimonials] = useState<AdminHomepageTestimonial[]>(
    []
  )

  const [formData, setFormData] =
    useState<HomepageTestimonialRequest>(initialFormData)

  const [searchTerm, setSearchTerm] = useState("")
  const [editingId, setEditingId] = useState<number | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasError, setHasError] = useState(false)

  async function loadTestimonials() {
    try {
      setIsLoading(true)
      setHasError(false)

      const response = await getAdminHomepageTestimonials()

      setTestimonials(response)
    } catch (error) {
      console.error(error)
      setHasError(true)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadTestimonials()
  }, [])

  const filteredTestimonials = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase()

    if (!keyword) {
      return testimonials
    }

    return testimonials.filter((testimonial) => {
      return (
        testimonial.name.toLowerCase().includes(keyword) ||
        testimonial.designation.toLowerCase().includes(keyword) ||
        testimonial.content.toLowerCase().includes(keyword)
      )
    })
  }, [testimonials, searchTerm])

  function updateField<Key extends keyof HomepageTestimonialRequest>(
    field: Key,
    value: HomepageTestimonialRequest[Key]
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

  function startEditing(testimonial: AdminHomepageTestimonial) {
    setEditingId(testimonial.id)

    setFormData({
      name: testimonial.name,
      designation: testimonial.designation,
      content: testimonial.content,
      display_order: testimonial.display_order,
      is_active: testimonial.is_active,
    })

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  async function handleSubmit() {
    if (
      !formData.name.trim() ||
      !formData.designation.trim() ||
      !formData.content.trim()
    ) {
      toast.error("Please complete all required fields.")
      return
    }

    try {
      setIsSubmitting(true)

      const payload: HomepageTestimonialRequest = {
        name: formData.name.trim(),
        designation: formData.designation.trim(),
        content: formData.content.trim(),
        display_order: formData.display_order,
        is_active: formData.is_active,
      }

      if (editingId !== null) {
        const updated = await updateAdminHomepageTestimonial(editingId, payload)

        setTestimonials((current) =>
          current
            .map((testimonial) =>
              testimonial.id === editingId ? updated : testimonial
            )
            .sort(
              (first, second) =>
                first.display_order - second.display_order ||
                first.id - second.id
            )
        )

        toast.success("Homepage testimonial updated successfully.")
      } else {
        const created = await createAdminHomepageTestimonial(payload)

        setTestimonials((current) =>
          [...current, created].sort(
            (first, second) =>
              first.display_order - second.display_order || first.id - second.id
          )
        )

        toast.success("Homepage testimonial created successfully.")
      }

      resetForm()
    } catch (error) {
      console.error(error)

      if (axios.isAxiosError(error)) {
        const detail = error.response?.data?.detail

        if (typeof detail === "string") {
          toast.error(detail)
        } else if (Array.isArray(detail) && detail.length > 0) {
          toast.error(detail[0]?.msg || "Please check the testimonial details.")
        } else {
          toast.error("Unable to save the homepage testimonial.")
        }
      } else {
        toast.error("Unable to save the homepage testimonial.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete(testimonial: AdminHomepageTestimonial) {
    const confirmed = window.confirm(
      `Delete testimonial from "${testimonial.name}" permanently?`
    )

    if (!confirmed) {
      return
    }

    try {
      setDeletingId(testimonial.id)

      await deleteAdminHomepageTestimonial(testimonial.id)

      setTestimonials((current) =>
        current.filter((item) => item.id !== testimonial.id)
      )

      if (editingId === testimonial.id) {
        resetForm()
      }

      toast.success("Homepage testimonial deleted successfully.")
    } catch (error) {
      console.error(error)

      toast.error("Unable to delete the homepage testimonial.")
    } finally {
      setDeletingId(null)
    }
  }

  if (isLoading) {
    return <PageLoader message="Loading homepage testimonials..." />
  }

  if (hasError) {
    return (
      <ErrorState
        title="Unable to Load Homepage Testimonials"
        message="The homepage testimonials could not be loaded."
        onRetry={() => {
          void loadTestimonials()
        }}
      />
    )
  }

  return (
    <>
      <SEO
        title="Homepage Testimonials | Cubicles Services Admin"
        description="Manage testimonials shown on the Cubicles Services homepage."
      />

      <section>
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="font-semibold tracking-wider text-blue-600 uppercase">
            Homepage Builder
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            Homepage Testimonials
          </h1>

          <p className="mt-1 text-sm text-slate-600">
            Manage the client testimonials displayed on the public homepage.
          </p>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
          <div className="h-fit rounded-xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {editingId === null ? "Add Testimonial" : "Edit Testimonial"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {editingId === null
                    ? "Create a new client testimonial."
                    : "Update the selected testimonial."}
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
              <FormField id="testimonial-name" label="Client Name" required>
                <input
                  id="testimonial-name"
                  type="text"
                  maxLength={150}
                  value={formData.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  placeholder="Michael Johnson"
                  className={inputClassName}
                />
              </FormField>

              <FormField
                id="testimonial-designation"
                label="Designation"
                required
              >
                <input
                  id="testimonial-designation"
                  type="text"
                  maxLength={200}
                  value={formData.designation}
                  onChange={(event) =>
                    updateField("designation", event.target.value)
                  }
                  placeholder="CTO, FinTech Solutions"
                  className={inputClassName}
                />
              </FormField>

              <FormField id="testimonial-content" label="Testimonial" required>
                <textarea
                  id="testimonial-content"
                  rows={7}
                  value={formData.content}
                  onChange={(event) =>
                    updateField("content", event.target.value)
                  }
                  placeholder="Enter the client testimonial."
                  className={`${inputClassName} leading-7`}
                />
              </FormField>

              <FormField id="testimonial-display-order" label="Display Order">
                <input
                  id="testimonial-display-order"
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
                    Active testimonials appear on the public homepage.
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
                    ? "Add Testimonial"
                    : "Save Changes"}
              </button>
            </div>
          </div>

          <div>
            <div className="flex flex-col gap-4 rounded-xl bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Existing Testimonials
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {testimonials.length} total testimonials
                </p>
              </div>

              <div className="relative w-full sm:max-w-sm">
                <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400" />

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search testimonials..."
                  className="w-full rounded-xl border border-slate-300 bg-white py-3 pr-4 pl-12 transition outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {filteredTestimonials.length === 0 ? (
              <div className="mt-4 rounded-xl bg-white px-6 py-16 text-center shadow-sm">
                <MessageSquareQuote className="mx-auto h-12 w-12 text-slate-400" />

                <h2 className="mt-5 text-2xl font-bold text-slate-900">
                  No Testimonials Found
                </h2>

                <p className="mt-3 text-slate-600">
                  {searchTerm
                    ? "No testimonials match your search."
                    : "Create your first homepage testimonial."}
                </p>
              </div>
            ) : (
              <div className="mt-4 overflow-hidden rounded-xl bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                          Testimonial
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
                      {filteredTestimonials.map((testimonial) => (
                        <tr
                          key={testimonial.id}
                          className="align-top transition hover:bg-slate-50"
                        >
                          <td className="max-w-xl px-5 py-4">
                            <p className="font-semibold text-slate-900">
                              {testimonial.name}
                            </p>

                            <p className="mt-1 text-sm font-medium text-blue-600">
                              {testimonial.designation}
                            </p>

                            <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                              “{testimonial.content}”
                            </p>
                          </td>

                          <td className="px-5 py-4 text-sm font-semibold text-slate-700">
                            {testimonial.display_order}
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                testimonial.is_active
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {testimonial.is_active ? "Active" : "Inactive"}
                            </span>
                          </td>

                          <td className="px-5 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => startEditing(testimonial)}
                                title="Edit testimonial"
                                aria-label={`Edit testimonial from ${testimonial.name}`}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 text-slate-600 transition hover:bg-slate-50"
                              >
                                <Pencil className="h-4 w-4" />
                              </button>

                              <button
                                type="button"
                                disabled={deletingId === testimonial.id}
                                onClick={() => {
                                  void handleDelete(testimonial)
                                }}
                                title="Delete testimonial"
                                aria-label={`Delete testimonial from ${testimonial.name}`}
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

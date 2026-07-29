import { useEffect, useMemo, useState } from "react"
import axios from "axios"
import {
  HeartHandshake,
  Pencil,
  Plus,
  Save,
  Search,
  Trash2,
  X,
} from "lucide-react"
import { toast } from "sonner"

import {
  createAdminAboutValue,
  deleteAdminAboutValue,
  getAdminAboutValues,
  updateAdminAboutValue,
  type AboutValueRequest,
  type AdminAboutValue,
} from "@/api/adminAboutValuesApi"
import ErrorState from "@/components/common/ErrorState"
import PageLoader from "@/components/common/PageLoader"
import SEO from "@/components/seo/SEO"

const initialFormData: AboutValueRequest = {
  title: "",
  description: "",
  display_order: 0,
  is_active: true,
}

export default function AdminAboutValues() {
  const [values, setValues] = useState<AdminAboutValue[]>([])

  const [formData, setFormData] = useState<AboutValueRequest>(initialFormData)

  const [searchTerm, setSearchTerm] = useState("")
  const [editingId, setEditingId] = useState<number | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasError, setHasError] = useState(false)

  async function loadValues() {
    try {
      setIsLoading(true)
      setHasError(false)

      const response = await getAdminAboutValues()

      setValues(
        [...response].sort(
          (first, second) =>
            first.display_order - second.display_order || first.id - second.id
        )
      )
    } catch (error) {
      console.error(error)
      setHasError(true)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadValues()
  }, [])

  const filteredValues = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase()

    if (!keyword) {
      return values
    }

    return values.filter((value) => {
      return (
        value.title.toLowerCase().includes(keyword) ||
        value.description.toLowerCase().includes(keyword)
      )
    })
  }, [values, searchTerm])

  function updateField<Key extends keyof AboutValueRequest>(
    field: Key,
    value: AboutValueRequest[Key]
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

  function startEditing(value: AdminAboutValue) {
    setEditingId(value.id)

    setFormData({
      title: value.title,
      description: value.description,
      display_order: value.display_order,
      is_active: value.is_active,
    })

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  async function handleSubmit() {
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error("Please enter the value title and description.")
      return
    }

    try {
      setIsSubmitting(true)

      const payload: AboutValueRequest = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        display_order: formData.display_order,
        is_active: formData.is_active,
      }

      if (editingId !== null) {
        const updated = await updateAdminAboutValue(editingId, payload)

        setValues((currentValues) =>
          currentValues
            .map((value) => (value.id === editingId ? updated : value))
            .sort(
              (first, second) =>
                first.display_order - second.display_order ||
                first.id - second.id
            )
        )

        toast.success("About value updated successfully.")
      } else {
        const created = await createAdminAboutValue(payload)

        setValues((currentValues) =>
          [...currentValues, created].sort(
            (first, second) =>
              first.display_order - second.display_order || first.id - second.id
          )
        )

        toast.success("About value created successfully.")
      }

      resetForm()
    } catch (error) {
      console.error(error)

      if (axios.isAxiosError(error)) {
        const detail = error.response?.data?.detail

        if (typeof detail === "string") {
          toast.error(detail)
        } else if (Array.isArray(detail) && detail.length > 0) {
          toast.error(detail[0]?.msg || "Please check the About value details.")
        } else {
          toast.error("Unable to save the About value.")
        }
      } else {
        toast.error("Unable to save the About value.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete(value: AdminAboutValue) {
    const confirmed = window.confirm(`Delete "${value.title}" permanently?`)

    if (!confirmed) {
      return
    }

    try {
      setDeletingId(value.id)

      await deleteAdminAboutValue(value.id)

      setValues((currentValues) =>
        currentValues.filter((currentValue) => currentValue.id !== value.id)
      )

      if (editingId === value.id) {
        resetForm()
      }

      toast.success("About value deleted successfully.")
    } catch (error) {
      console.error(error)
      toast.error("Unable to delete the About value.")
    } finally {
      setDeletingId(null)
    }
  }

  if (isLoading) {
    return <PageLoader message="Loading About values..." />
  }

  if (hasError) {
    return (
      <ErrorState
        title="Unable to Load About Values"
        message="The About page values could not be loaded."
        onRetry={() => {
          void loadValues()
        }}
      />
    )
  }

  return (
    <>
      <SEO
        title="About Values | Cubicles Services Admin"
        description="Manage company values displayed on the Cubicles Services About page."
      />

      <section>
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="font-semibold tracking-wider text-blue-600 uppercase">
            About Page
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            About Values
          </h1>

          <p className="mt-1 text-sm text-slate-600">
            Manage the company values displayed on the public About page.
          </p>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[400px_minmax(0,1fr)]">
          <div className="h-fit rounded-xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {editingId === null ? "Add Value" : "Edit Value"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {editingId === null
                    ? "Create a new company value."
                    : "Update the selected company value."}
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
              <FormField id="about-value-title" label="Title" required>
                <input
                  id="about-value-title"
                  type="text"
                  maxLength={150}
                  value={formData.title}
                  onChange={(event) => updateField("title", event.target.value)}
                  placeholder="Innovation"
                  className={inputClassName}
                />
              </FormField>

              <FormField
                id="about-value-description"
                label="Description"
                required
              >
                <textarea
                  id="about-value-description"
                  rows={7}
                  maxLength={500}
                  value={formData.description}
                  onChange={(event) =>
                    updateField("description", event.target.value)
                  }
                  placeholder="Describe this company value."
                  className={`${inputClassName} leading-7`}
                />

                <p className="mt-1 text-right text-xs text-slate-500">
                  {formData.description.length}/500
                </p>
              </FormField>

              <FormField id="about-value-display-order" label="Display Order">
                <input
                  id="about-value-display-order"
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

                  <span className="mt-1 block text-sm leading-6 text-slate-500">
                    Active values appear on the public About page.
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
                    ? "Add Value"
                    : "Save Changes"}
              </button>
            </div>
          </div>

          <div>
            <div className="flex flex-col gap-4 rounded-xl bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Existing Values
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {values.length} total values
                </p>
              </div>

              <div className="relative w-full sm:max-w-sm">
                <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400" />

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search values..."
                  className="w-full rounded-xl border border-slate-300 bg-white py-3 pr-4 pl-12 transition outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {filteredValues.length === 0 ? (
              <div className="mt-4 rounded-xl bg-white px-6 py-16 text-center shadow-sm">
                <HeartHandshake className="mx-auto h-12 w-12 text-slate-400" />

                <h2 className="mt-5 text-2xl font-bold text-slate-900">
                  No Values Found
                </h2>

                <p className="mt-3 text-slate-600">
                  {searchTerm
                    ? "No values match your search."
                    : "Create your first company value."}
                </p>
              </div>
            ) : (
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {filteredValues.map((value) => (
                  <article
                    key={value.id}
                    className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h3 className="text-xl font-bold text-slate-900">
                          {value.title}
                        </h3>

                        <p className="mt-3 leading-7 text-slate-600">
                          {value.description}
                        </p>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                          value.is_active
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {value.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                      <p className="text-sm font-medium text-slate-500">
                        Position {value.display_order}
                      </p>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => startEditing(value)}
                          title="Edit value"
                          aria-label={`Edit ${value.title}`}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 text-slate-600 transition hover:bg-slate-50"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          disabled={deletingId === value.id}
                          onClick={() => {
                            void handleDelete(value)
                          }}
                          title="Delete value"
                          aria-label={`Delete ${value.title}`}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Trash2 className="h-4 w-4" />
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

type FormFieldProps = {
  id: string
  label: string
  required?: boolean
  children: React.ReactNode
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

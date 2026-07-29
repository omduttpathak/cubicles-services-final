import { useEffect, useMemo, useState, type ReactNode } from "react"
import axios from "axios"
import { Building2, Pencil, Plus, Save, Search, Trash2, X } from "lucide-react"
import { toast } from "sonner"

import {
  createAdminHomepageIndustry,
  deleteAdminHomepageIndustry,
  getAdminHomepageIndustries,
  updateAdminHomepageIndustry,
  type AdminHomepageIndustry,
  type HomepageIndustryRequest,
} from "@/api/adminHomepageIndustriesApi"
import ErrorState from "@/components/common/ErrorState"
import PageLoader from "@/components/common/PageLoader"
import SEO from "@/components/seo/SEO"

const initialFormData: HomepageIndustryRequest = {
  title: "",
  description: "",
  icon: "",
  display_order: 0,
  is_active: true,
}

export default function AdminHomepageIndustries() {
  const [industries, setIndustries] = useState<AdminHomepageIndustry[]>([])

  const [formData, setFormData] =
    useState<HomepageIndustryRequest>(initialFormData)

  const [searchTerm, setSearchTerm] = useState("")
  const [editingId, setEditingId] = useState<number | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasError, setHasError] = useState(false)

  async function loadIndustries() {
    try {
      setIsLoading(true)
      setHasError(false)

      const response = await getAdminHomepageIndustries()

      setIndustries(response)
    } catch (error) {
      console.error(error)
      setHasError(true)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadIndustries()
  }, [])

  const filteredIndustries = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase()

    if (!keyword) {
      return industries
    }

    return industries.filter((industry) => {
      return (
        industry.title.toLowerCase().includes(keyword) ||
        industry.description.toLowerCase().includes(keyword) ||
        industry.icon.toLowerCase().includes(keyword)
      )
    })
  }, [industries, searchTerm])

  function updateField<Key extends keyof HomepageIndustryRequest>(
    field: Key,
    value: HomepageIndustryRequest[Key]
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

  function startEditing(industry: AdminHomepageIndustry) {
    setEditingId(industry.id)

    setFormData({
      title: industry.title,
      description: industry.description,
      icon: industry.icon,
      display_order: industry.display_order,
      is_active: industry.is_active,
    })

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  async function handleSubmit() {
    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.icon.trim()
    ) {
      toast.error("Please complete all required fields.")
      return
    }

    try {
      setIsSubmitting(true)

      const payload: HomepageIndustryRequest = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        icon: formData.icon.trim(),
        display_order: formData.display_order,
        is_active: formData.is_active,
      }

      if (editingId !== null) {
        const updated = await updateAdminHomepageIndustry(editingId, payload)

        setIndustries((current) =>
          current
            .map((industry) => (industry.id === editingId ? updated : industry))
            .sort(
              (first, second) =>
                first.display_order - second.display_order ||
                first.id - second.id
            )
        )

        toast.success("Homepage industry updated successfully.")
      } else {
        const created = await createAdminHomepageIndustry(payload)

        setIndustries((current) =>
          [...current, created].sort(
            (first, second) =>
              first.display_order - second.display_order || first.id - second.id
          )
        )

        toast.success("Homepage industry created successfully.")
      }

      resetForm()
    } catch (error) {
      console.error(error)

      if (axios.isAxiosError(error)) {
        const detail = error.response?.data?.detail

        if (typeof detail === "string") {
          toast.error(detail)
        } else if (Array.isArray(detail) && detail.length > 0) {
          toast.error(detail[0]?.msg || "Please check the industry details.")
        } else {
          toast.error("Unable to save the homepage industry.")
        }
      } else {
        toast.error("Unable to save the homepage industry.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete(industry: AdminHomepageIndustry) {
    const confirmed = window.confirm(`Delete "${industry.title}" permanently?`)

    if (!confirmed) {
      return
    }

    try {
      setDeletingId(industry.id)

      await deleteAdminHomepageIndustry(industry.id)

      setIndustries((current) =>
        current.filter((item) => item.id !== industry.id)
      )

      if (editingId === industry.id) {
        resetForm()
      }

      toast.success("Homepage industry deleted successfully.")
    } catch (error) {
      console.error(error)

      toast.error("Unable to delete the homepage industry.")
    } finally {
      setDeletingId(null)
    }
  }

  if (isLoading) {
    return <PageLoader message="Loading homepage industries..." />
  }

  if (hasError) {
    return (
      <ErrorState
        title="Unable to Load Homepage Industries"
        message="The homepage industries could not be loaded."
        onRetry={() => {
          void loadIndustries()
        }}
      />
    )
  }

  return (
    <>
      <SEO
        title="Homepage Industries | Cubicles Services Admin"
        description="Manage the industries shown on the Cubicles Services homepage."
      />

      <section>
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="font-semibold tracking-wider text-blue-600 uppercase">
            Homepage Builder
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            Homepage Industries
          </h1>

          <p className="mt-1 text-sm text-slate-600">
            Manage the cards displayed in the Industries We Serve section.
          </p>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[400px_minmax(0,1fr)]">
          <div className="h-fit rounded-xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {editingId === null ? "Add Industry" : "Edit Industry"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {editingId === null
                    ? "Create a new industry card."
                    : "Update the selected industry."}
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
              <FormField id="industry-title" label="Title" required>
                <input
                  id="industry-title"
                  type="text"
                  maxLength={150}
                  value={formData.title}
                  onChange={(event) => updateField("title", event.target.value)}
                  placeholder="Healthcare"
                  className={inputClassName}
                />
              </FormField>

              <FormField id="industry-description" label="Description" required>
                <textarea
                  id="industry-description"
                  rows={5}
                  value={formData.description}
                  onChange={(event) =>
                    updateField("description", event.target.value)
                  }
                  placeholder="Describe the solutions delivered for this industry."
                  className={`${inputClassName} leading-7`}
                />
              </FormField>

              <FormField id="industry-icon" label="Icon Name" required>
                <input
                  id="industry-icon"
                  type="text"
                  maxLength={80}
                  value={formData.icon}
                  onChange={(event) => updateField("icon", event.target.value)}
                  placeholder="heart-pulse"
                  className={`${inputClassName} font-mono text-sm`}
                />

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Examples: heart-pulse, landmark, shopping-cart, factory,
                  radio, building-2.
                </p>
              </FormField>

              <FormField id="industry-display-order" label="Display Order">
                <input
                  id="industry-display-order"
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
                    Active industries appear on the public homepage.
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
                    ? "Add Industry"
                    : "Save Changes"}
              </button>
            </div>
          </div>

          <div>
            <div className="flex flex-col gap-4 rounded-xl bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Existing Industries
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {industries.length} total industries
                </p>
              </div>

              <div className="relative w-full sm:max-w-sm">
                <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400" />

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search industries..."
                  className="w-full rounded-xl border border-slate-300 bg-white py-3 pr-4 pl-12 transition outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {filteredIndustries.length === 0 ? (
              <div className="mt-4 rounded-xl bg-white px-6 py-16 text-center shadow-sm">
                <Building2 className="mx-auto h-12 w-12 text-slate-400" />

                <h2 className="mt-5 text-2xl font-bold text-slate-900">
                  No Industries Found
                </h2>

                <p className="mt-3 text-slate-600">
                  {searchTerm
                    ? "No industries match your search."
                    : "Create your first homepage industry."}
                </p>
              </div>
            ) : (
              <div className="mt-4 overflow-hidden rounded-xl bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                          Industry
                        </th>

                        <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                          Icon
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
                      {filteredIndustries.map((industry) => (
                        <tr
                          key={industry.id}
                          className="align-top transition hover:bg-slate-50"
                        >
                          <td className="max-w-lg px-5 py-4">
                            <p className="font-semibold text-slate-900">
                              {industry.title}
                            </p>

                            <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
                              {industry.description}
                            </p>
                          </td>

                          <td className="px-5 py-4">
                            <span className="inline-flex rounded-lg bg-blue-50 px-3 py-2 font-mono text-xs font-semibold text-blue-700">
                              {industry.icon}
                            </span>
                          </td>

                          <td className="px-5 py-4 text-sm font-semibold text-slate-700">
                            {industry.display_order}
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                industry.is_active
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {industry.is_active ? "Active" : "Inactive"}
                            </span>
                          </td>

                          <td className="px-5 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => startEditing(industry)}
                                title="Edit industry"
                                aria-label={`Edit ${industry.title}`}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 text-slate-600 transition hover:bg-slate-50"
                              >
                                <Pencil className="h-4 w-4" />
                              </button>

                              <button
                                type="button"
                                disabled={deletingId === industry.id}
                                onClick={() => {
                                  void handleDelete(industry)
                                }}
                                title="Delete industry"
                                aria-label={`Delete ${industry.title}`}
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

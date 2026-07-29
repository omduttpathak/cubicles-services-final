import { useEffect, useMemo, useState, type ReactNode } from "react"
import axios from "axios"
import { BadgeCheck, Pencil, Plus, Save, Search, Trash2, X } from "lucide-react"
import { toast } from "sonner"

import {
  createAdminHomepageBenefit,
  deleteAdminHomepageBenefit,
  getAdminHomepageBenefits,
  updateAdminHomepageBenefit,
  type AdminHomepageBenefit,
  type HomepageBenefitRequest,
} from "@/api/adminHomepageBenefitsApi"
import ErrorState from "@/components/common/ErrorState"
import PageLoader from "@/components/common/PageLoader"
import SEO from "@/components/seo/SEO"

const initialFormData: HomepageBenefitRequest = {
  title: "",
  description: "",
  icon: "",
  display_order: 0,
  is_active: true,
}

export default function AdminHomepageBenefits() {
  const [benefits, setBenefits] = useState<AdminHomepageBenefit[]>([])
  const [formData, setFormData] =
    useState<HomepageBenefitRequest>(initialFormData)
  const [searchTerm, setSearchTerm] = useState("")
  const [editingId, setEditingId] = useState<number | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasError, setHasError] = useState(false)

  async function loadBenefits() {
    try {
      setIsLoading(true)
      setHasError(false)
      setBenefits(await getAdminHomepageBenefits())
    } catch (error) {
      console.error(error)
      setHasError(true)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadBenefits()
  }, [])

  const filteredBenefits = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase()

    if (!keyword) return benefits

    return benefits.filter((benefit) =>
      [benefit.title, benefit.description, benefit.icon].some((value) =>
        value.toLowerCase().includes(keyword)
      )
    )
  }, [benefits, searchTerm])

  function updateField<Key extends keyof HomepageBenefitRequest>(
    field: Key,
    value: HomepageBenefitRequest[Key]
  ) {
    setFormData((current) => ({ ...current, [field]: value }))
  }

  function resetForm() {
    setFormData(initialFormData)
    setEditingId(null)
  }

  function startEditing(benefit: AdminHomepageBenefit) {
    setEditingId(benefit.id)
    setFormData({
      title: benefit.title,
      description: benefit.description,
      icon: benefit.icon,
      display_order: benefit.display_order,
      is_active: benefit.is_active,
    })
    window.scrollTo({ top: 0, behavior: "smooth" })
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

    const payload: HomepageBenefitRequest = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      icon: formData.icon.trim(),
      display_order: formData.display_order,
      is_active: formData.is_active,
    }

    try {
      setIsSubmitting(true)

      if (editingId !== null) {
        const updated = await updateAdminHomepageBenefit(editingId, payload)
        setBenefits((current) =>
          current
            .map((benefit) => (benefit.id === editingId ? updated : benefit))
            .sort(
              (first, second) =>
                first.display_order - second.display_order ||
                first.id - second.id
            )
        )
        toast.success("Homepage benefit updated successfully.")
      } else {
        const created = await createAdminHomepageBenefit(payload)
        setBenefits((current) =>
          [...current, created].sort(
            (first, second) =>
              first.display_order - second.display_order || first.id - second.id
          )
        )
        toast.success("Homepage benefit created successfully.")
      }

      resetForm()
    } catch (error) {
      console.error(error)

      if (axios.isAxiosError(error)) {
        const detail = error.response?.data?.detail
        if (typeof detail === "string") {
          toast.error(detail)
        } else if (Array.isArray(detail) && detail.length > 0) {
          toast.error(detail[0]?.msg || "Please check the benefit details.")
        } else {
          toast.error("Unable to save the homepage benefit.")
        }
      } else {
        toast.error("Unable to save the homepage benefit.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete(benefit: AdminHomepageBenefit) {
    if (!window.confirm(`Delete "${benefit.title}" permanently?`)) return

    try {
      setDeletingId(benefit.id)
      await deleteAdminHomepageBenefit(benefit.id)
      setBenefits((current) => current.filter((item) => item.id !== benefit.id))
      if (editingId === benefit.id) resetForm()
      toast.success("Homepage benefit deleted successfully.")
    } catch (error) {
      console.error(error)
      toast.error("Unable to delete the homepage benefit.")
    } finally {
      setDeletingId(null)
    }
  }

  if (isLoading) {
    return <PageLoader message="Loading homepage benefits..." />
  }

  if (hasError) {
    return (
      <ErrorState
        title="Unable to Load Homepage Benefits"
        message="The homepage benefits could not be loaded."
        onRetry={() => void loadBenefits()}
      />
    )
  }

  return (
    <>
      <SEO
        title="Homepage Benefits | Cubicles Services Admin"
        description="Manage the Why Choose Us cards shown on the Cubicles Services homepage."
      />

      <section>
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="font-semibold tracking-wider text-blue-600 uppercase">
            Homepage Builder
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            Homepage Benefits
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Manage the cards displayed in the Why Choose Cubicles Services
            section.
          </p>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[400px_minmax(0,1fr)]">
          <div className="h-fit rounded-xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {editingId === null ? "Add Benefit" : "Edit Benefit"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {editingId === null
                    ? "Create a new Why Choose Us card."
                    : "Update the selected benefit."}
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
              <FormField id="benefit-title" label="Title" required>
                <input
                  id="benefit-title"
                  type="text"
                  maxLength={150}
                  value={formData.title}
                  onChange={(event) => updateField("title", event.target.value)}
                  placeholder="Cloud Expertise"
                  className={inputClassName}
                />
              </FormField>

              <FormField id="benefit-description" label="Description" required>
                <textarea
                  id="benefit-description"
                  rows={5}
                  value={formData.description}
                  onChange={(event) =>
                    updateField("description", event.target.value)
                  }
                  placeholder="Describe why customers should choose Cubicles Services."
                  className={`${inputClassName} leading-7`}
                />
              </FormField>

              <FormField id="benefit-icon" label="Icon Name" required>
                <input
                  id="benefit-icon"
                  type="text"
                  maxLength={80}
                  value={formData.icon}
                  onChange={(event) => updateField("icon", event.target.value)}
                  placeholder="cloud"
                  className={`${inputClassName} font-mono text-sm`}
                />
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Examples: cloud, settings, shield-check, rocket, trending-up,
                  clock.
                </p>
              </FormField>

              <FormField id="benefit-display-order" label="Display Order">
                <input
                  id="benefit-display-order"
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
                    Active benefits appear on the public homepage.
                  </span>
                </span>
              </label>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => void handleSubmit()}
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
                    ? "Add Benefit"
                    : "Save Changes"}
              </button>
            </div>
          </div>

          <div>
            <div className="flex flex-col gap-4 rounded-xl bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Existing Benefits
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {benefits.length} total benefits
                </p>
              </div>

              <div className="relative w-full sm:max-w-sm">
                <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search benefits..."
                  className="w-full rounded-xl border border-slate-300 bg-white py-3 pr-4 pl-12 transition outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {filteredBenefits.length === 0 ? (
              <div className="mt-4 rounded-xl bg-white px-6 py-16 text-center shadow-sm">
                <BadgeCheck className="mx-auto h-12 w-12 text-slate-400" />
                <h2 className="mt-5 text-2xl font-bold text-slate-900">
                  No Benefits Found
                </h2>
                <p className="mt-3 text-slate-600">
                  {searchTerm
                    ? "No benefits match your search."
                    : "Create your first homepage benefit."}
                </p>
              </div>
            ) : (
              <div className="mt-4 overflow-hidden rounded-xl bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                          Benefit
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
                      {filteredBenefits.map((benefit) => (
                        <tr
                          key={benefit.id}
                          className="align-top transition hover:bg-slate-50"
                        >
                          <td className="max-w-lg px-5 py-4">
                            <p className="font-semibold text-slate-900">
                              {benefit.title}
                            </p>
                            <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
                              {benefit.description}
                            </p>
                          </td>
                          <td className="px-5 py-4">
                            <span className="inline-flex rounded-lg bg-blue-50 px-3 py-2 font-mono text-xs font-semibold text-blue-700">
                              {benefit.icon}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-sm font-semibold text-slate-700">
                            {benefit.display_order}
                          </td>
                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                benefit.is_active
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {benefit.is_active ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => startEditing(benefit)}
                                title="Edit benefit"
                                aria-label={`Edit ${benefit.title}`}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 text-slate-600 transition hover:bg-slate-50"
                              >
                                <Pencil className="h-4 w-4" />
                              </button>

                              <button
                                type="button"
                                disabled={deletingId === benefit.id}
                                onClick={() => void handleDelete(benefit)}
                                title="Delete benefit"
                                aria-label={`Delete ${benefit.title}`}
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

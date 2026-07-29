import { useEffect, useMemo, useState } from "react"
import axios from "axios"
import { BarChart3, Pencil, Plus, Save, Search, Trash2, X } from "lucide-react"
import { toast } from "sonner"

import {
  createAdminAboutStat,
  deleteAdminAboutStat,
  getAdminAboutStats,
  updateAdminAboutStat,
  type AboutStatRequest,
  type AdminAboutStat,
} from "@/api/adminAboutStatsApi"
import ErrorState from "@/components/common/ErrorState"
import PageLoader from "@/components/common/PageLoader"
import SEO from "@/components/seo/SEO"

const initialFormData: AboutStatRequest = {
  value: "",
  label: "",
  display_order: 0,
  is_active: true,
}

export default function AdminAboutStats() {
  const [stats, setStats] = useState<AdminAboutStat[]>([])
  const [formData, setFormData] = useState<AboutStatRequest>(initialFormData)

  const [searchTerm, setSearchTerm] = useState("")
  const [editingId, setEditingId] = useState<number | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasError, setHasError] = useState(false)

  async function loadStats() {
    try {
      setIsLoading(true)
      setHasError(false)

      const response = await getAdminAboutStats()

      setStats(
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
    void loadStats()
  }, [])

  const filteredStats = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase()

    if (!keyword) {
      return stats
    }

    return stats.filter((stat) => {
      return (
        stat.value.toLowerCase().includes(keyword) ||
        stat.label.toLowerCase().includes(keyword)
      )
    })
  }, [stats, searchTerm])

  function updateField<Key extends keyof AboutStatRequest>(
    field: Key,
    value: AboutStatRequest[Key]
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

  function startEditing(stat: AdminAboutStat) {
    setEditingId(stat.id)

    setFormData({
      value: stat.value,
      label: stat.label,
      display_order: stat.display_order,
      is_active: stat.is_active,
    })

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  async function handleSubmit() {
    if (!formData.value.trim() || !formData.label.trim()) {
      toast.error("Please enter the statistic value and label.")
      return
    }

    try {
      setIsSubmitting(true)

      const payload: AboutStatRequest = {
        value: formData.value.trim(),
        label: formData.label.trim(),
        display_order: formData.display_order,
        is_active: formData.is_active,
      }

      if (editingId !== null) {
        const updated = await updateAdminAboutStat(editingId, payload)

        setStats((currentStats) =>
          currentStats
            .map((stat) => (stat.id === editingId ? updated : stat))
            .sort(
              (first, second) =>
                first.display_order - second.display_order ||
                first.id - second.id
            )
        )

        toast.success("About statistic updated successfully.")
      } else {
        const created = await createAdminAboutStat(payload)

        setStats((currentStats) =>
          [...currentStats, created].sort(
            (first, second) =>
              first.display_order - second.display_order || first.id - second.id
          )
        )

        toast.success("About statistic created successfully.")
      }

      resetForm()
    } catch (error) {
      console.error(error)

      if (axios.isAxiosError(error)) {
        const detail = error.response?.data?.detail

        if (typeof detail === "string") {
          toast.error(detail)
        } else if (Array.isArray(detail) && detail.length > 0) {
          toast.error(
            detail[0]?.msg || "Please check the About statistic details."
          )
        } else {
          toast.error("Unable to save the About statistic.")
        }
      } else {
        toast.error("Unable to save the About statistic.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete(stat: AdminAboutStat) {
    const confirmed = window.confirm(`Delete "${stat.label}" permanently?`)

    if (!confirmed) {
      return
    }

    try {
      setDeletingId(stat.id)

      await deleteAdminAboutStat(stat.id)

      setStats((currentStats) =>
        currentStats.filter((currentStat) => currentStat.id !== stat.id)
      )

      if (editingId === stat.id) {
        resetForm()
      }

      toast.success("About statistic deleted successfully.")
    } catch (error) {
      console.error(error)
      toast.error("Unable to delete the About statistic.")
    } finally {
      setDeletingId(null)
    }
  }

  if (isLoading) {
    return <PageLoader message="Loading About statistics..." />
  }

  if (hasError) {
    return (
      <ErrorState
        title="Unable to Load About Statistics"
        message="The About page statistics could not be loaded."
        onRetry={() => {
          void loadStats()
        }}
      />
    )
  }

  return (
    <>
      <SEO
        title="About Statistics | Cubicles Services Admin"
        description="Manage company statistics displayed on the Cubicles Services About page."
      />

      <section>
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="font-semibold tracking-wider text-blue-600 uppercase">
            About Page
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            About Statistics
          </h1>

          <p className="mt-1 text-sm text-slate-600">
            Manage the company statistics displayed in the About page overview
            section.
          </p>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
          <div className="h-fit rounded-xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {editingId === null ? "Add Statistic" : "Edit Statistic"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {editingId === null
                    ? "Create a new About page statistic."
                    : "Update the selected statistic."}
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
              <FormField id="about-stat-value" label="Value" required>
                <input
                  id="about-stat-value"
                  type="text"
                  maxLength={50}
                  value={formData.value}
                  onChange={(event) => updateField("value", event.target.value)}
                  placeholder="150+"
                  className={inputClassName}
                />
              </FormField>

              <FormField id="about-stat-label" label="Label" required>
                <input
                  id="about-stat-label"
                  type="text"
                  maxLength={150}
                  value={formData.label}
                  onChange={(event) => updateField("label", event.target.value)}
                  placeholder="Projects Delivered"
                  className={inputClassName}
                />
              </FormField>

              <FormField id="about-stat-display-order" label="Display Order">
                <input
                  id="about-stat-display-order"
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
                    Active statistics appear on the public About page.
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
                    ? "Add Statistic"
                    : "Save Changes"}
              </button>
            </div>
          </div>

          <div>
            <div className="flex flex-col gap-4 rounded-xl bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Existing Statistics
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {stats.length} total statistics
                </p>
              </div>

              <div className="relative w-full sm:max-w-sm">
                <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400" />

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search statistics..."
                  className="w-full rounded-xl border border-slate-300 bg-white py-3 pr-4 pl-12 transition outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {filteredStats.length === 0 ? (
              <div className="mt-4 rounded-xl bg-white px-6 py-16 text-center shadow-sm">
                <BarChart3 className="mx-auto h-12 w-12 text-slate-400" />

                <h2 className="mt-5 text-2xl font-bold text-slate-900">
                  No Statistics Found
                </h2>

                <p className="mt-3 text-slate-600">
                  {searchTerm
                    ? "No statistics match your search."
                    : "Create your first About page statistic."}
                </p>
              </div>
            ) : (
              <div className="mt-4 overflow-hidden rounded-xl bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                          Statistic
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
                      {filteredStats.map((stat) => (
                        <tr
                          key={stat.id}
                          className="transition hover:bg-slate-50"
                        >
                          <td className="px-5 py-4">
                            <p className="text-2xl font-bold text-blue-600">
                              {stat.value}
                            </p>

                            <p className="mt-1 font-medium text-slate-700">
                              {stat.label}
                            </p>
                          </td>

                          <td className="px-5 py-4 text-sm font-semibold text-slate-700">
                            {stat.display_order}
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                stat.is_active
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {stat.is_active ? "Active" : "Inactive"}
                            </span>
                          </td>

                          <td className="px-5 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => startEditing(stat)}
                                title="Edit statistic"
                                aria-label={`Edit ${stat.label}`}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 text-slate-600 transition hover:bg-slate-50"
                              >
                                <Pencil className="h-4 w-4" />
                              </button>

                              <button
                                type="button"
                                disabled={deletingId === stat.id}
                                onClick={() => {
                                  void handleDelete(stat)
                                }}
                                title="Delete statistic"
                                aria-label={`Delete ${stat.label}`}
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

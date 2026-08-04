import { useEffect, useMemo, useState, type ReactNode } from "react"
import axios from "axios"
import {
  BarChart3,
  CheckCircle2,
  Pencil,
  Plus,
  Save,
  Search,
  Sparkles,
  Trash2,
  TrendingUp,
  X,
} from "lucide-react"
import { toast } from "sonner"

import {
  createAdminHomepageStat,
  deleteAdminHomepageStat,
  getAdminHomepageStats,
  updateAdminHomepageStat,
  type AdminHomepageStat,
  type HomepageStatRequest,
} from "@/api/adminHomepageStatsApi"
import CharacterCount from "@/components/admin/forms/CharacterCount"
import FormCard from "@/components/admin/forms/FormCard"
import FormField from "@/components/admin/forms/FormField"
import ErrorState from "@/components/common/ErrorState"
import PageLoader from "@/components/common/PageLoader"
import SEO from "@/components/seo/SEO"

const initialFormData: HomepageStatRequest = {
  value: "",
  title: "",
  display_order: 0,
  is_active: true,
}

export default function AdminHomepageStats() {
  const [stats, setStats] = useState<AdminHomepageStat[]>([])
  const [formData, setFormData] = useState<HomepageStatRequest>(initialFormData)

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

      const response = await getAdminHomepageStats()
      setStats(sortStats(response))
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
        stat.title.toLowerCase().includes(keyword)
      )
    })
  }, [stats, searchTerm])

  const activeCount = useMemo(
    () => stats.filter((stat) => stat.is_active).length,
    [stats]
  )

  const inactiveCount = stats.length - activeCount

  const completionPercentage = useMemo(() => {
    const completed = [formData.value.trim(), formData.title.trim()].filter(
      Boolean
    ).length

    return Math.round((completed / 2) * 100)
  }, [formData])

  function updateField<Key extends keyof HomepageStatRequest>(
    field: Key,
    value: HomepageStatRequest[Key]
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

  function startEditing(stat: AdminHomepageStat) {
    setEditingId(stat.id)

    setFormData({
      value: stat.value,
      title: stat.title,
      display_order: stat.display_order,
      is_active: stat.is_active,
    })

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  async function handleSubmit() {
    if (!formData.value.trim() || !formData.title.trim()) {
      toast.error("Please enter the statistic value and title.")
      return
    }

    try {
      setIsSubmitting(true)

      const payload: HomepageStatRequest = {
        value: formData.value.trim(),
        title: formData.title.trim(),
        display_order: formData.display_order,
        is_active: formData.is_active,
      }

      if (editingId !== null) {
        const updated = await updateAdminHomepageStat(editingId, payload)

        setStats((currentStats) =>
          sortStats(
            currentStats.map((stat) => (stat.id === editingId ? updated : stat))
          )
        )

        toast.success("Homepage statistic updated successfully.")
      } else {
        const created = await createAdminHomepageStat(payload)

        setStats((currentStats) => sortStats([...currentStats, created]))
        toast.success("Homepage statistic created successfully.")
      }

      resetForm()
    } catch (error) {
      console.error(error)

      if (axios.isAxiosError(error)) {
        const detail = error.response?.data?.detail

        if (typeof detail === "string") {
          toast.error(detail)
        } else if (Array.isArray(detail) && detail.length > 0) {
          toast.error(detail[0]?.msg || "Please check the statistic details.")
        } else {
          toast.error("Unable to save the homepage statistic.")
        }
      } else {
        toast.error("Unable to save the homepage statistic.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete(stat: AdminHomepageStat) {
    const confirmed = window.confirm(`Delete "${stat.title}" permanently?`)

    if (!confirmed) {
      return
    }

    try {
      setDeletingId(stat.id)

      await deleteAdminHomepageStat(stat.id)

      setStats((currentStats) =>
        currentStats.filter((currentStat) => currentStat.id !== stat.id)
      )

      if (editingId === stat.id) {
        resetForm()
      }

      toast.success("Homepage statistic deleted successfully.")
    } catch (error) {
      console.error(error)
      toast.error("Unable to delete the homepage statistic.")
    } finally {
      setDeletingId(null)
    }
  }

  if (isLoading) {
    return <PageLoader message="Loading homepage statistics..." />
  }

  if (hasError) {
    return (
      <ErrorState
        title="Unable to Load Homepage Statistics"
        message="The homepage statistics could not be loaded."
        onRetry={() => {
          void loadStats()
        }}
      />
    )
  }

  return (
    <>
      <SEO
        title="Homepage Statistics | Cubicles Services Admin"
        description="Manage homepage statistics displayed on the Cubicles Services website."
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
              Homepage Statistics
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
              Create, update, organize, and control the impact numbers shown on
              the public homepage.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <SummaryCard
            label="Total Statistics"
            value={stats.length}
            description="All homepage impact numbers"
            icon={<BarChart3 className="size-5" />}
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
            icon={<TrendingUp className="size-5" />}
            tone="neutral"
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[400px_minmax(0,1fr)]">
          <aside className="h-fit xl:sticky xl:top-24">
            <FormCard
              title={editingId === null ? "Add Statistic" : "Edit Statistic"}
              description={
                editingId === null
                  ? "Create a new homepage statistic."
                  : "Update the selected statistic."
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
                    <BarChart3 className="size-5" />
                  </div>
                )
              }
            >
              <div className="space-y-5">
                <FormField id="stat-value" label="Value" required>
                  <input
                    id="stat-value"
                    type="text"
                    maxLength={50}
                    value={formData.value}
                    onChange={(event) =>
                      updateField("value", event.target.value)
                    }
                    placeholder="150+"
                    className={inputClassName}
                    disabled={isSubmitting}
                  />

                  <CharacterCount
                    current={formData.value.length}
                    maximum={50}
                  />
                </FormField>

                <FormField id="stat-title" label="Title" required>
                  <input
                    id="stat-title"
                    type="text"
                    maxLength={150}
                    value={formData.title}
                    onChange={(event) =>
                      updateField("title", event.target.value)
                    }
                    placeholder="Projects Delivered"
                    className={inputClassName}
                    disabled={isSubmitting}
                  />

                  <CharacterCount
                    current={formData.title.length}
                    maximum={150}
                  />
                </FormField>

                <FormField
                  id="stat-display-order"
                  label="Display Order"
                  description="Lower numbers appear earlier."
                >
                  <input
                    id="stat-display-order"
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
                  description="Active statistics appear on the public homepage."
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
                      ? "Add Statistic"
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
                    Existing Statistics
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {stats.length} total statistics
                  </p>
                </div>

                <div className="relative w-full sm:max-w-sm">
                  <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-slate-400" />

                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search statistics..."
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pr-4 pl-11 text-sm text-slate-900 transition outline-none placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              </div>
            </div>

            {filteredStats.length === 0 ? (
              <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
                <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                  <BarChart3 className="size-7" />
                </div>

                <h2 className="mt-5 text-xl font-bold text-slate-950">
                  No Statistics Found
                </h2>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
                  {searchTerm
                    ? "No statistics match your search."
                    : "Create your first homepage statistic."}
                </p>
              </div>
            ) : (
              <div className="mt-4 grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
                {filteredStats.map((stat) => (
                  <article
                    key={stat.id}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-violet-50 text-indigo-700 ring-1 ring-indigo-100 ring-inset">
                        <BarChart3 className="size-6" />
                      </div>

                      <StatusBadge isActive={stat.is_active} />
                    </div>

                    <p className="mt-5 text-4xl font-black tracking-tight text-blue-600">
                      {stat.value}
                    </p>

                    <p className="mt-2 text-sm leading-6 font-semibold text-slate-700">
                      {stat.title}
                    </p>

                    <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 ring-inset">
                        Order {stat.display_order}
                      </span>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => startEditing(stat)}
                          title="Edit statistic"
                          aria-label={`Edit ${stat.title}`}
                          className="inline-flex size-10 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 text-blue-700 transition hover:bg-blue-100"
                        >
                          <Pencil className="size-4" />
                        </button>

                        <button
                          type="button"
                          disabled={deletingId === stat.id}
                          onClick={() => {
                            void handleDelete(stat)
                          }}
                          title="Delete statistic"
                          aria-label={`Delete ${stat.title}`}
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
            Value and title readiness
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
        {isActive
          ? "Statistic will be visible"
          : "Statistic will remain hidden"}
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

function sortStats(stats: AdminHomepageStat[]): AdminHomepageStat[] {
  return [...stats].sort(
    (first, second) =>
      first.display_order - second.display_order || first.id - second.id
  )
}

const inputClassName =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"

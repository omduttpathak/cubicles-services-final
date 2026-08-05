import { useEffect, useMemo, useState, type ReactNode } from "react"
import {
  ArrowLeft,
  ArrowRight,
  Cpu,
  Eye,
  Filter,
  Pencil,
  Plus,
  Search,
  Sparkles,
  Tags,
  Trash2,
  X,
} from "lucide-react"
import { Link } from "react-router-dom"
import { toast } from "sonner"

import {
  deleteAdminTechnology,
  getAdminTechnologies,
  type AdminTechnology,
} from "@/api/adminTechnologiesApi"
import ErrorState from "@/components/common/ErrorState"
import PageLoader from "@/components/common/PageLoader"
import SEO from "@/components/seo/SEO"
import { resolveMediaUrl } from "@/utils/mediaUrl"

const technologiesPerPage = 8

export default function AdminTechnologies() {
  const [technologies, setTechnologies] = useState<AdminTechnology[]>([])

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedFeatured, setSelectedFeatured] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)

  const [deletingId, setDeletingId] = useState<number | null>(null)

  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  async function loadTechnologies() {
    try {
      setIsLoading(true)
      setHasError(false)

      const response = await getAdminTechnologies()

      setTechnologies(response)
    } catch (error) {
      console.error(error)
      setHasError(true)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDelete(technology: AdminTechnology) {
    const confirmed = window.confirm(
      `Delete "${technology.name}" permanently?\n\nThis technology will also disappear from the public website.`
    )

    if (!confirmed) {
      return
    }

    try {
      setDeletingId(technology.id)

      await deleteAdminTechnology(technology.id)

      setTechnologies((currentTechnologies) =>
        currentTechnologies.filter(
          (currentTechnology) => currentTechnology.id !== technology.id
        )
      )

      toast.success("Technology deleted successfully.")
    } catch (error) {
      console.error(error)
      toast.error("Unable to delete the technology.")
    } finally {
      setDeletingId(null)
    }
  }

  useEffect(() => {
    void loadTechnologies()
  }, [])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedStatus, selectedFeatured])

  const activeCount = useMemo(
    () => technologies.filter((technology) => technology.is_active).length,
    [technologies]
  )

  const featuredCount = useMemo(
    () => technologies.filter((technology) => technology.is_featured).length,
    [technologies]
  )

  const categoryCount = useMemo(
    () =>
      new Set(
        technologies
          .map((technology) => technology.category.trim())
          .filter(Boolean)
      ).size,
    [technologies]
  )

  const filteredTechnologies = useMemo(() => {
    const keyword = searchTerm.toLowerCase().trim()

    return technologies.filter((technology) => {
      const descriptionPreview = getDescriptionPreview(
        technology.description
      ).toLowerCase()

      const matchesSearch =
        !keyword ||
        technology.name.toLowerCase().includes(keyword) ||
        technology.slug.toLowerCase().includes(keyword) ||
        technology.category.toLowerCase().includes(keyword) ||
        descriptionPreview.includes(keyword)

      const matchesStatus =
        selectedStatus === "all" ||
        (selectedStatus === "active" && technology.is_active) ||
        (selectedStatus === "inactive" && !technology.is_active)

      const matchesFeatured =
        selectedFeatured === "all" ||
        (selectedFeatured === "featured" && technology.is_featured) ||
        (selectedFeatured === "standard" && !technology.is_featured)

      return matchesSearch && matchesStatus && matchesFeatured
    })
  }, [technologies, searchTerm, selectedStatus, selectedFeatured])

  const totalPages = Math.max(
    1,
    Math.ceil(filteredTechnologies.length / technologiesPerPage)
  )

  const safeCurrentPage = Math.min(currentPage, totalPages)
  const startIndex = (safeCurrentPage - 1) * technologiesPerPage

  const paginatedTechnologies = filteredTechnologies.slice(
    startIndex,
    startIndex + technologiesPerPage
  )

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  function clearFilters() {
    setSearchTerm("")
    setSelectedStatus("all")
    setSelectedFeatured("all")
  }

  const hasFilters =
    Boolean(searchTerm) ||
    selectedStatus !== "all" ||
    selectedFeatured !== "all"

  if (isLoading) {
    return <PageLoader message="Loading technologies..." />
  }

  if (hasError) {
    return (
      <ErrorState
        title="Unable to Load Technologies"
        message="The technology records could not be loaded."
        onRetry={() => {
          void loadTechnologies()
        }}
      />
    )
  }

  return (
    <>
      <SEO
        title="Manage Technologies | Cubicles Services Admin"
        description="Manage Cubicles Services technologies."
      />

      <section className="space-y-6">
        <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 px-6 py-8 text-white shadow-xl sm:px-8">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.24),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(139,92,246,0.18),transparent_40%)]" />

          <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold tracking-[0.16em] text-blue-200 uppercase backdrop-blur">
                <Sparkles className="size-3.5" />
                Content Management
              </div>

              <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
                Technologies
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                Review and manage the technology capabilities displayed across
                the public website.
              </p>
            </div>

            <Link
              to="/admin/technologies/create"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-100"
            >
              <Plus className="size-4" />
              Create Technology
            </Link>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total Technologies"
            value={technologies.length}
            description="All technology records"
            icon={<Cpu className="size-5" />}
          />

          <StatCard
            label="Active"
            value={activeCount}
            description="Visible on the website"
            icon={<Eye className="size-5" />}
            tone="success"
          />

          <StatCard
            label="Featured"
            value={featuredCount}
            description="Highlighted capabilities"
            icon={<Sparkles className="size-5" />}
            tone="featured"
          />

          <StatCard
            label="Categories"
            value={categoryCount}
            description="Unique technology groups"
            icon={<Tags className="size-5" />}
            tone="neutral"
          />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-slate-100 p-2.5 text-slate-600">
                <Filter className="size-4" />
              </div>

              <div>
                <h2 className="text-sm font-bold text-slate-950">
                  Filter technologies
                </h2>

                <p className="text-xs leading-5 text-slate-500">
                  Search by content or narrow results by status and type.
                </p>
              </div>
            </div>

            <p className="text-xs font-semibold text-slate-500">
              {filteredTechnologies.length} result
              {filteredTechnologies.length === 1 ? "" : "s"}
            </p>
          </div>

          <div className="mt-4 grid gap-3 xl:grid-cols-[minmax(0,1fr)_220px_220px_auto]">
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search technologies..."
                className={inputClassName}
              />
            </div>

            <select
              value={selectedStatus}
              onChange={(event) => setSelectedStatus(event.target.value)}
              className={selectClassName}
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <select
              value={selectedFeatured}
              onChange={(event) => setSelectedFeatured(event.target.value)}
              className={selectClassName}
            >
              <option value="all">All Types</option>
              <option value="featured">Featured</option>
              <option value="standard">Standard</option>
            </select>

            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                <X className="size-4" />
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {filteredTechnologies.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
              <Cpu className="size-7" />
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-950">
              No Technologies Found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
              {hasFilters
                ? "No technologies match the selected filters."
                : "Technology records will appear here."}
            </p>

            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:block">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50/80">
                    <tr>
                      <TableHeading>Technology</TableHeading>
                      <TableHeading>Category</TableHeading>
                      <TableHeading>Order</TableHeading>
                      <TableHeading>Type</TableHeading>
                      <TableHeading>Status</TableHeading>
                      <TableHeading align="right">Actions</TableHeading>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {paginatedTechnologies.map((technology) => (
                      <tr
                        key={technology.id}
                        className="align-top transition hover:bg-slate-50/80"
                      >
                        <td className="max-w-xl px-6 py-5">
                          <div className="flex items-start gap-4">
                            <TechnologyVisual technology={technology} />

                            <div className="min-w-0">
                              <p className="font-semibold text-slate-950">
                                {technology.name}
                              </p>

                              <p className="mt-1 truncate text-xs text-slate-500">
                                /technologies/{technology.slug}
                              </p>

                              <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
                                {getDescriptionPreview(technology.description)}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 ring-inset">
                            {technology.category}
                          </span>
                        </td>

                        <td className="px-6 py-5 text-sm font-semibold text-slate-700">
                          {technology.display_order}
                        </td>

                        <td className="px-6 py-5">
                          <TypeBadge isFeatured={technology.is_featured} />
                        </td>

                        <td className="px-6 py-5">
                          <StatusBadge isActive={technology.is_active} />
                        </td>

                        <td className="px-6 py-5 text-right">
                          <div className="flex justify-end gap-2">
                            <Link
                              to={`/admin/technologies/${technology.id}/edit`}
                              title="Edit technology"
                              aria-label={`Edit ${technology.name}`}
                              className={actionButtonClassName}
                            >
                              <Pencil className="size-4" />
                            </Link>

                            {technology.is_active && (
                              <Link
                                to={`/technologies/${technology.slug}`}
                                target="_blank"
                                rel="noreferrer"
                                title="View public technology"
                                aria-label={`View ${technology.name}`}
                                className="inline-flex size-9 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-blue-700 transition hover:bg-blue-100"
                              >
                                <Eye className="size-4" />
                              </Link>
                            )}

                            <button
                              type="button"
                              disabled={deletingId === technology.id}
                              onClick={() => {
                                void handleDelete(technology)
                              }}
                              title="Delete technology"
                              aria-label={`Delete ${technology.name}`}
                              className="inline-flex size-9 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid gap-4 lg:hidden">
              {paginatedTechnologies.map((technology) => (
                <article
                  key={technology.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start gap-4">
                    <TechnologyVisual technology={technology} />

                    <div className="min-w-0 flex-1">
                      <h2 className="font-semibold text-slate-950">
                        {technology.name}
                      </h2>

                      <p className="mt-1 truncate text-xs text-slate-500">
                        /technologies/{technology.slug}
                      </p>

                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                        {getDescriptionPreview(technology.description)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3 border-y border-slate-100 py-4">
                    <DetailItem label="Category" value={technology.category} />

                    <DetailItem
                      label="Display order"
                      value={String(technology.display_order)}
                    />

                    <div>
                      <p className="text-xs font-medium text-slate-500">Type</p>
                      <div className="mt-2">
                        <TypeBadge isFeatured={technology.is_featured} />
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-slate-500">
                        Status
                      </p>
                      <div className="mt-2">
                        <StatusBadge isActive={technology.is_active} />
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
                    <Link
                      to={`/admin/technologies/${technology.id}/edit`}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      <Pencil className="size-4" />
                      Edit
                    </Link>

                    {technology.is_active && (
                      <Link
                        to={`/technologies/${technology.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-50 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                      >
                        <Eye className="size-4" />
                        View
                      </Link>
                    )}

                    <button
                      type="button"
                      disabled={deletingId === technology.id}
                      onClick={() => {
                        void handleDelete(technology)
                      }}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Trash2 className="size-4" />
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-600">
                Showing{" "}
                <span className="font-semibold text-slate-950">
                  {startIndex + 1}
                </span>{" "}
                to{" "}
                <span className="font-semibold text-slate-950">
                  {Math.min(
                    startIndex + technologiesPerPage,
                    filteredTechnologies.length
                  )}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-950">
                  {filteredTechnologies.length}
                </span>{" "}
                technologies
              </p>

              <div className="flex items-center justify-between gap-3 sm:justify-end">
                <button
                  type="button"
                  disabled={safeCurrentPage === 1}
                  onClick={() => setCurrentPage((page) => page - 1)}
                  className={paginationButtonClassName}
                >
                  <ArrowLeft className="size-4" />
                  Previous
                </button>

                <span className="text-sm font-medium whitespace-nowrap text-slate-600">
                  Page {safeCurrentPage} of {totalPages}
                </span>

                <button
                  type="button"
                  disabled={safeCurrentPage === totalPages}
                  onClick={() => setCurrentPage((page) => page + 1)}
                  className={paginationButtonClassName}
                >
                  Next
                  <ArrowRight className="size-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </>
  )
}

function TechnologyVisual({ technology }: { technology: AdminTechnology }) {
  if (technology.logo_url) {
    return (
      <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <img
          src={resolveMediaUrl(technology.logo_url) ?? undefined}
          alt={`${technology.name} logo`}
          className="size-9 object-contain"
        />
      </div>
    )
  }

  return (
    <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-violet-50 px-2 text-center font-mono text-[10px] font-bold text-indigo-700 ring-1 ring-indigo-100 ring-inset">
      {technology.icon || "TECH"}
    </div>
  )
}

function getDescriptionPreview(value: string): string {
  const textarea = document.createElement("textarea")

  textarea.innerHTML = value
  const decodedOnce = textarea.value

  textarea.innerHTML = decodedOnce
  const decodedTwice = textarea.value

  return decodedTwice
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

type StatCardProps = {
  label: string
  value: number
  description: string
  icon: ReactNode
  tone?: "default" | "success" | "featured" | "neutral"
}

function StatCard({
  label,
  value,
  description,
  icon,
  tone = "default",
}: StatCardProps) {
  const toneClasses = {
    default: "bg-blue-50 text-blue-700",
    success: "bg-emerald-50 text-emerald-700",
    featured: "bg-violet-50 text-violet-700",
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

function TypeBadge({ isFeatured }: { isFeatured: boolean }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${
        isFeatured
          ? "bg-violet-50 text-violet-700 ring-violet-200"
          : "bg-slate-100 text-slate-600 ring-slate-200"
      }`}
    >
      {isFeatured ? "Featured" : "Standard"}
    </span>
  )
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-800">{value}</p>
    </div>
  )
}

function TableHeading({
  children,
  align = "left",
}: {
  children: ReactNode
  align?: "left" | "right"
}) {
  return (
    <th
      className={`px-6 py-4 text-xs font-semibold tracking-wider text-slate-500 uppercase ${
        align === "right" ? "text-right" : "text-left"
      }`}
    >
      {children}
    </th>
  )
}

const inputClassName =
  "h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pr-4 pl-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"

const selectClassName =
  "h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"

const actionButtonClassName =
  "inline-flex size-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950"

const paginationButtonClassName =
  "inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"

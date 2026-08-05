import { useEffect, useMemo, useState } from "react"
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Eye,
  FileText,
  Filter,
  Globe2,
  Pencil,
  Plus,
  Search,
  Sparkles,
  Trash2,
  Undo2,
} from "lucide-react"
import { Link } from "react-router-dom"
import { toast } from "sonner"

import {
  deleteAdminCaseStudy,
  getAdminCaseStudies,
  updateAdminCaseStudyPublishStatus,
  type AdminCaseStudy,
} from "@/api/adminCaseStudiesApi"
import ErrorState from "@/components/common/ErrorState"
import PageLoader from "@/components/common/PageLoader"
import SEO from "@/components/seo/SEO"

const caseStudiesPerPage = 5

function formatPublishedDate(value: string | null | undefined) {
  if (!value) {
    return "Not published"
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return "Not published"
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

function StatusBadge({ isPublished }: { isPublished: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
        isPublished
          ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 ring-inset"
          : "bg-amber-50 text-amber-700 ring-1 ring-amber-200 ring-inset"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          isPublished ? "bg-emerald-500" : "bg-amber-500"
        }`}
      />
      {isPublished ? "Published" : "Draft"}
    </span>
  )
}

export default function AdminCaseStudies() {
  const [caseStudies, setCaseStudies] = useState<AdminCaseStudy[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [updatingId, setUpdatingId] = useState<number | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  async function loadCaseStudies() {
    try {
      setIsLoading(true)
      setHasError(false)
      const response = await getAdminCaseStudies()
      setCaseStudies(response)
    } catch (error) {
      console.error(error)
      setHasError(true)
    } finally {
      setIsLoading(false)
    }
  }

  async function handlePublishStatus(caseStudy: AdminCaseStudy) {
    const nextStatus = !caseStudy.is_published
    const confirmed = window.confirm(
      nextStatus
        ? `Publish "${caseStudy.title}"?`
        : `Unpublish "${caseStudy.title}"?`
    )

    if (!confirmed) return

    try {
      setUpdatingId(caseStudy.id)
      const updatedCaseStudy = await updateAdminCaseStudyPublishStatus(
        caseStudy.id,
        nextStatus
      )

      setCaseStudies((currentCaseStudies) =>
        currentCaseStudies.map((currentCaseStudy) =>
          currentCaseStudy.id === caseStudy.id
            ? updatedCaseStudy
            : currentCaseStudy
        )
      )

      toast.success(
        nextStatus
          ? "Case study published successfully."
          : "Case study unpublished successfully."
      )
    } catch (error) {
      console.error(error)
      toast.error("Unable to update case-study status.")
    } finally {
      setUpdatingId(null)
    }
  }

  async function handleDelete(caseStudy: AdminCaseStudy) {
    const confirmed = window.confirm(`Delete "${caseStudy.title}" permanently?`)
    if (!confirmed) return

    try {
      setDeletingId(caseStudy.id)
      await deleteAdminCaseStudy(caseStudy.id)
      setCaseStudies((currentCaseStudies) =>
        currentCaseStudies.filter(
          (currentCaseStudy) => currentCaseStudy.id !== caseStudy.id
        )
      )
      toast.success("Case study deleted successfully.")
    } catch (error) {
      console.error(error)
      toast.error("Unable to delete the case study.")
    } finally {
      setDeletingId(null)
    }
  }

  useEffect(() => {
    void loadCaseStudies()
  }, [])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedStatus])

  const publishedCount = useMemo(
    () => caseStudies.filter((caseStudy) => caseStudy.is_published).length,
    [caseStudies]
  )
  const draftCount = caseStudies.length - publishedCount

  const filteredCaseStudies = useMemo(() => {
    const keyword = searchTerm.toLowerCase().trim()

    return caseStudies.filter((caseStudy) => {
      const matchesSearch =
        !keyword ||
        caseStudy.title.toLowerCase().includes(keyword) ||
        caseStudy.slug.toLowerCase().includes(keyword) ||
        caseStudy.industry.toLowerCase().includes(keyword) ||
        caseStudy.service.toLowerCase().includes(keyword)

      const matchesStatus =
        selectedStatus === "all" ||
        (selectedStatus === "published" && caseStudy.is_published) ||
        (selectedStatus === "draft" && !caseStudy.is_published)

      return matchesSearch && matchesStatus
    })
  }, [caseStudies, searchTerm, selectedStatus])

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCaseStudies.length / caseStudiesPerPage)
  )
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const startIndex = (safeCurrentPage - 1) * caseStudiesPerPage
  const paginatedCaseStudies = filteredCaseStudies.slice(
    startIndex,
    startIndex + caseStudiesPerPage
  )

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages)
  }, [currentPage, totalPages])

  if (isLoading) return <PageLoader message="Loading case studies..." />

  if (hasError) {
    return (
      <ErrorState
        title="Unable to Load Case Studies"
        message="The case-study records could not be loaded."
        onRetry={() => void loadCaseStudies()}
      />
    )
  }

  return (
    <>
      <SEO
        title="Manage Case Studies | Cubicles Services Admin"
        description="Manage Cubicles Services case studies."
      />

      <section className="space-y-6">
        <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 px-6 py-7 text-white shadow-xl sm:px-8 sm:py-9">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.24),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.18),transparent_38%)]" />
          <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold tracking-[0.16em] text-sky-200 uppercase backdrop-blur">
                <Sparkles className="h-3.5 w-3.5" />
                Content Management
              </div>
              <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
                Case Studies
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                Manage customer success stories, publish new results, and keep
                your case-study library accurate and ready for visitors.
              </p>
            </div>

            <Link
              to="/admin/case-studies/create"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-slate-100"
            >
              <Plus className="h-4 w-4" />
              Create Case Study
            </Link>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              label: "Total Case Studies",
              value: caseStudies.length,
              note: "All customer stories in the CMS",
              icon: BriefcaseBusiness,
              iconClass: "bg-slate-100 text-slate-700",
            },
            {
              label: "Published",
              value: publishedCount,
              note: "Visible on the public website",
              icon: CheckCircle2,
              iconClass: "bg-emerald-50 text-emerald-700",
            },
            {
              label: "Drafts",
              value: draftCount,
              note: "Waiting for review or publishing",
              icon: FileText,
              iconClass: "bg-amber-50 text-amber-700",
            },
          ].map(({ label, value, note, icon: Icon, iconClass }) => (
            <div
              key={label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">{label}</p>
                  <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                    {value}
                  </p>
                  <p className="mt-2 text-xs text-slate-500">{note}</p>
                </div>
                <div className={`rounded-xl p-3 ${iconClass}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
                <Filter className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  Filter case studies
                </h2>
                <p className="text-xs text-slate-500">
                  Search by content or narrow results by status.
                </p>
              </div>
            </div>
            <p className="text-xs font-medium text-slate-500">
              {filteredCaseStudies.length} result
              {filteredCaseStudies.length === 1 ? "" : "s"}
            </p>
          </div>

          <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px_auto]">
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by title, slug, industry or service..."
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pr-4 pl-11 text-sm text-slate-900 transition outline-none placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <select
              value={selectedStatus}
              onChange={(event) => setSelectedStatus(event.target.value)}
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-700 transition outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
            >
              <option value="all">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>

            {(searchTerm || selectedStatus !== "all") && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("")
                  setSelectedStatus("all")
                }}
                className="h-12 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {filteredCaseStudies.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
              <BriefcaseBusiness className="h-7 w-7" />
            </div>
            <h2 className="mt-5 text-xl font-bold text-slate-950">
              No Case Studies Found
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
              No case studies match the selected filters. Try changing your
              search or clearing the current status filter.
            </p>
            {(searchTerm || selectedStatus !== "all") && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("")
                  setSelectedStatus("all")
                }}
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
                      {[
                        "Case Study",
                        "Industry",
                        "Service",
                        "Published",
                        "Status",
                        "Actions",
                      ].map((heading) => (
                        <th
                          key={heading}
                          className={`px-6 py-4 text-xs font-semibold tracking-wider text-slate-500 uppercase ${
                            heading === "Actions" ? "text-right" : "text-left"
                          }`}
                        >
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {paginatedCaseStudies.map((caseStudy) => (
                      <tr
                        key={caseStudy.id}
                        className="transition hover:bg-slate-50/80"
                      >
                        <td className="max-w-md px-6 py-5">
                          <p className="font-semibold text-slate-950">
                            {caseStudy.title}
                          </p>
                          <p className="mt-1 truncate text-xs text-slate-500">
                            /case-studies/{caseStudy.slug}
                          </p>
                        </td>
                        <td className="px-6 py-5 text-sm text-slate-700">
                          {caseStudy.industry}
                        </td>
                        <td className="px-6 py-5 text-sm text-slate-700">
                          {caseStudy.service}
                        </td>
                        <td className="px-6 py-5 text-sm whitespace-nowrap text-slate-600">
                          {formatPublishedDate(caseStudy.published_at)}
                        </td>
                        <td className="px-6 py-5">
                          <StatusBadge isPublished={caseStudy.is_published} />
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex justify-end gap-2">
                            <Link
                              to={`/admin/case-studies/${caseStudy.id}/edit`}
                              title="Edit case study"
                              aria-label={`Edit ${caseStudy.title}`}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950"
                            >
                              <Pencil className="h-4 w-4" />
                            </Link>

                            {caseStudy.is_published && (
                              <Link
                                to={`/case-studies/${caseStudy.slug}`}
                                target="_blank"
                                rel="noreferrer"
                                title="View public case study"
                                aria-label={`View ${caseStudy.title}`}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-blue-700 transition hover:bg-blue-100"
                              >
                                <Eye className="h-4 w-4" />
                              </Link>
                            )}

                            <button
                              type="button"
                              disabled={updatingId === caseStudy.id}
                              onClick={() =>
                                void handlePublishStatus(caseStudy)
                              }
                              title={
                                caseStudy.is_published
                                  ? "Unpublish case study"
                                  : "Publish case study"
                              }
                              className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border transition disabled:cursor-not-allowed disabled:opacity-50 ${
                                caseStudy.is_published
                                  ? "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
                                  : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                              }`}
                            >
                              {caseStudy.is_published ? (
                                <Undo2 className="h-4 w-4" />
                              ) : (
                                <Globe2 className="h-4 w-4" />
                              )}
                            </button>

                            <button
                              type="button"
                              disabled={deletingId === caseStudy.id}
                              onClick={() => void handleDelete(caseStudy)}
                              title="Delete case study"
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
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

            <div className="grid gap-4 lg:hidden">
              {paginatedCaseStudies.map((caseStudy) => (
                <article
                  key={caseStudy.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h2 className="font-semibold text-slate-950">
                        {caseStudy.title}
                      </h2>
                      <p className="mt-1 truncate text-xs text-slate-500">
                        /case-studies/{caseStudy.slug}
                      </p>
                    </div>
                    <StatusBadge isPublished={caseStudy.is_published} />
                  </div>

                  <dl className="mt-5 grid gap-4 border-y border-slate-100 py-4 sm:grid-cols-3">
                    <div>
                      <dt className="text-xs font-medium text-slate-500">
                        Industry
                      </dt>
                      <dd className="mt-1 text-sm font-semibold text-slate-800">
                        {caseStudy.industry}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium text-slate-500">
                        Service
                      </dt>
                      <dd className="mt-1 text-sm font-semibold text-slate-800">
                        {caseStudy.service}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium text-slate-500">
                        Published
                      </dt>
                      <dd className="mt-1 text-sm font-semibold text-slate-800">
                        {formatPublishedDate(caseStudy.published_at)}
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
                    <Link
                      to={`/admin/case-studies/${caseStudy.id}/edit`}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      <Pencil className="h-4 w-4" />
                      Edit
                    </Link>
                    {caseStudy.is_published && (
                      <Link
                        to={`/case-studies/${caseStudy.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-50 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </Link>
                    )}
                    <button
                      type="button"
                      disabled={updatingId === caseStudy.id}
                      onClick={() => void handlePublishStatus(caseStudy)}
                      className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg border text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                        caseStudy.is_published
                          ? "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
                          : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      }`}
                    >
                      {caseStudy.is_published ? (
                        <>
                          <Undo2 className="h-4 w-4" />
                          Unpublish
                        </>
                      ) : (
                        <>
                          <Globe2 className="h-4 w-4" />
                          Publish
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      disabled={deletingId === caseStudy.id}
                      onClick={() => void handleDelete(caseStudy)}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
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
                    startIndex + caseStudiesPerPage,
                    filteredCaseStudies.length
                  )}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-950">
                  {filteredCaseStudies.length}
                </span>{" "}
                case studies
              </p>

              <div className="flex items-center justify-between gap-3 sm:justify-end">
                <button
                  type="button"
                  disabled={safeCurrentPage === 1}
                  onClick={() => setCurrentPage((page) => page - 1)}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </button>
                <span className="text-sm font-medium whitespace-nowrap text-slate-600">
                  Page {safeCurrentPage} of {totalPages}
                </span>
                <button
                  type="button"
                  disabled={safeCurrentPage === totalPages}
                  onClick={() => setCurrentPage((page) => page + 1)}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </>
  )
}

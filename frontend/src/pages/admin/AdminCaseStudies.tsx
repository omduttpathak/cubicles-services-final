import { useEffect, useMemo, useState } from "react"
import {
  BriefcaseBusiness,
  Eye,
  Globe2,
  Pencil,
  Plus,
  Search,
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

export default function AdminCaseStudies() {
  const [caseStudies, setCaseStudies] = useState<AdminCaseStudy[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [updatingId, setUpdatingId] = useState<number | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const caseStudiesPerPage = 5

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

    if (!confirmed) {
      return
    }

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

    if (!confirmed) {
      return
    }

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
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  if (isLoading) {
    return <PageLoader message="Loading case studies..." />
  }

  if (hasError) {
    return (
      <ErrorState
        title="Unable to Load Case Studies"
        message="The case-study records could not be loaded."
        onRetry={() => {
          void loadCaseStudies()
        }}
      />
    )
  }

  return (
    <>
      <SEO
        title="Manage Case Studies | Cubicles Services Admin"
        description="Manage Cubicles Services case studies."
      />

      <section>
        <div className="flex flex-col gap-4 rounded-xl bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold tracking-wider text-blue-600 uppercase">
              Content Management
            </p>

            <h1 className="mt-1 text-2xl font-bold text-slate-900">
              Case Studies
            </h1>

            <p className="mt-1 text-sm text-slate-600">
              Review published case studies and draft customer-success content.
            </p>
          </div>

          <Link
            to="/admin/case-studies/create"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Case Study
          </Link>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Total Case Studies
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {caseStudies.length}
            </p>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Published</p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {caseStudies.filter((caseStudy) => caseStudy.is_published).length}
            </p>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Drafts</p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {
                caseStudies.filter((caseStudy) => !caseStudy.is_published)
                  .length
              }
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by title, industry or service..."
              className="w-full rounded-xl border border-slate-300 bg-white py-3 pr-4 pl-12 transition outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <select
            value={selectedStatus}
            onChange={(event) => setSelectedStatus(event.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-700 transition outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 lg:max-w-xs"
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
              className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Clear Filters
            </button>
          )}
        </div>

        {filteredCaseStudies.length === 0 ? (
          <div className="mt-6 rounded-xl bg-white px-6 py-16 text-center shadow-sm">
            <BriefcaseBusiness className="mx-auto h-12 w-12 text-slate-400" />

            <h2 className="mt-5 text-2xl font-bold text-slate-900">
              No Case Studies Found
            </h2>

            <p className="mt-3 text-slate-600">
              No case studies match the selected filters.
            </p>
          </div>
        ) : (
          <>
            <div className="mt-6 overflow-hidden rounded-xl bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                        Case Study
                      </th>

                      <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                        Industry
                      </th>

                      <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                        Service
                      </th>

                      <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                        Published
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
                    {paginatedCaseStudies.map((caseStudy) => (
                      <tr
                        key={caseStudy.id}
                        className="transition hover:bg-slate-50"
                      >
                        <td className="max-w-md px-5 py-4">
                          <p className="font-semibold text-slate-900">
                            {caseStudy.title}
                          </p>

                          <p className="mt-1 truncate text-sm text-slate-500">
                            /case-studies/
                            {caseStudy.slug}
                          </p>
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-700">
                          {caseStudy.industry}
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-700">
                          {caseStudy.service}
                        </td>

                        <td className="px-5 py-4 text-sm whitespace-nowrap text-slate-600">
                          {new Date(caseStudy.published_at).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                              caseStudy.is_published
                                ? "bg-green-100 text-green-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {caseStudy.is_published ? "Published" : "Draft"}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Link
                              to={`/admin/case-studies/${caseStudy.id}/edit`}
                              title="Edit case study"
                              aria-label={`Edit ${caseStudy.title}`}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 text-slate-600 transition hover:bg-slate-50"
                            >
                              <Pencil className="h-4 w-4" />
                            </Link>

                            {caseStudy.is_published && (
                              <Link
                                to={`/case-studies/${caseStudy.slug}`}
                                target="_blank"
                                title="View public case study"
                                aria-label={`View ${caseStudy.title}`}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-blue-200 text-blue-600 transition hover:bg-blue-50"
                              >
                                <Eye className="h-4 w-4" />
                              </Link>
                            )}

                            <button
                              type="button"
                              disabled={updatingId === caseStudy.id}
                              onClick={() => {
                                void handlePublishStatus(caseStudy)
                              }}
                              title={
                                caseStudy.is_published
                                  ? "Unpublish case study"
                                  : "Publish case study"
                              }
                              aria-label={
                                caseStudy.is_published
                                  ? `Unpublish ${caseStudy.title}`
                                  : `Publish ${caseStudy.title}`
                              }
                              className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border transition disabled:cursor-not-allowed disabled:opacity-50 ${
                                caseStudy.is_published
                                  ? "border-amber-200 text-amber-600 hover:bg-amber-50"
                                  : "border-green-200 text-green-600 hover:bg-green-50"
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
                              onClick={() => {
                                void handleDelete(caseStudy)
                              }}
                              title="Delete case study"
                              aria-label={`Delete ${caseStudy.title}`}
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

            <div className="mt-5 flex flex-col gap-4 rounded-xl bg-white px-5 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-600">
                Showing{" "}
                <span className="font-semibold text-slate-900">
                  {startIndex + 1}
                </span>{" "}
                to{" "}
                <span className="font-semibold text-slate-900">
                  {Math.min(
                    startIndex + caseStudiesPerPage,
                    filteredCaseStudies.length
                  )}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-900">
                  {filteredCaseStudies.length}
                </span>{" "}
                case studies
              </p>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  disabled={safeCurrentPage === 1}
                  onClick={() => setCurrentPage((page) => page - 1)}
                  className="rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>

                <span className="text-sm font-medium text-slate-700">
                  Page {safeCurrentPage} of {totalPages}
                </span>

                <button
                  type="button"
                  disabled={safeCurrentPage === totalPages}
                  onClick={() => setCurrentPage((page) => page + 1)}
                  className="rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </>
  )
}

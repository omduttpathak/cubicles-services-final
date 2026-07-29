import { useEffect, useMemo, useState } from "react"
import {
  Briefcase,
  ExternalLink,
  Eye,
  FileText,
  Search,
  Trash2,
  UserRound,
} from "lucide-react"
import { toast } from "sonner"

import {
  deleteCareerApplication,
  getAdminCareerApplicationById,
  getAdminCareerApplications,
  updateCareerApplicationStatus,
  type AdminCareerApplication,
  type CareerApplicationStatus,
} from "@/api/adminCareerApplicationsApi"
import CareerApplicationDetailsModal from "@/components/admin/CareerApplicationDetailsModal"
import ErrorState from "@/components/common/ErrorState"
import PageLoader from "@/components/common/PageLoader"
import SEO from "@/components/seo/SEO"
import { getApiAssetUrl } from "@/utils/apiAssetUrl"

const statusClasses: Record<CareerApplicationStatus, string> = {
  new: "bg-blue-100 text-blue-700",
  reviewing: "bg-amber-100 text-amber-700",
  shortlisted: "bg-purple-100 text-purple-700",
  rejected: "bg-red-100 text-red-700",
  hired: "bg-green-100 text-green-700",
}

export default function AdminCareerApplications() {
  const [applications, setApplications] = useState<AdminCareerApplication[]>([])

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)

  const [selectedApplication, setSelectedApplication] =
    useState<AdminCareerApplication | null>(null)

  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  const [loadingDetailsId, setLoadingDetailsId] = useState<number | null>(null)

  const [updatingId, setUpdatingId] = useState<number | null>(null)

  const [deletingId, setDeletingId] = useState<number | null>(null)

  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const applicationsPerPage = 5

  async function loadApplications() {
    try {
      setIsLoading(true)
      setHasError(false)

      const response = await getAdminCareerApplications()

      setApplications(response)
    } catch (error) {
      console.error(error)
      setHasError(true)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleStatusChange(
    application: AdminCareerApplication,
    newStatus: CareerApplicationStatus
  ) {
    if (application.status === newStatus) {
      return
    }

    try {
      setUpdatingId(application.id)

      const updatedApplication = await updateCareerApplicationStatus(
        application.id,
        newStatus
      )

      setApplications((currentApplications) =>
        currentApplications.map((currentApplication) =>
          currentApplication.id === application.id
            ? updatedApplication
            : currentApplication
        )
      )

      setSelectedApplication((current) =>
        current?.id === application.id ? updatedApplication : current
      )

      toast.success("Application status updated successfully.")
    } catch (error) {
      console.error(error)

      toast.error("Unable to update application status.")
    } finally {
      setUpdatingId(null)
    }
  }

  async function handleView(applicationId: number) {
    try {
      setLoadingDetailsId(applicationId)

      const application = await getAdminCareerApplicationById(applicationId)

      setSelectedApplication(application)
      setIsDetailsOpen(true)
    } catch (error) {
      console.error(error)

      toast.error("Unable to load candidate details.")
    } finally {
      setLoadingDetailsId(null)
    }
  }

  async function handleDelete(application: AdminCareerApplication) {
    const confirmed = window.confirm(
      `Delete the application from "${application.full_name}" permanently?`
    )

    if (!confirmed) {
      return
    }

    try {
      setDeletingId(application.id)

      await deleteCareerApplication(application.id)

      setApplications((currentApplications) =>
        currentApplications.filter(
          (currentApplication) => currentApplication.id !== application.id
        )
      )

      if (selectedApplication?.id === application.id) {
        setIsDetailsOpen(false)
        setSelectedApplication(null)
      }

      toast.success("Career application deleted successfully.")
    } catch (error) {
      console.error(error)

      toast.error("Unable to delete the career application.")
    } finally {
      setDeletingId(null)
    }
  }

  function closeDetailsModal() {
    setIsDetailsOpen(false)
    setSelectedApplication(null)
  }

  useEffect(() => {
    void loadApplications()
  }, [])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedStatus])

  const filteredApplications = useMemo(() => {
    const keyword = searchTerm.toLowerCase().trim()

    return applications.filter((application) => {
      const matchesSearch =
        !keyword ||
        application.full_name.toLowerCase().includes(keyword) ||
        application.email.toLowerCase().includes(keyword) ||
        application.position.toLowerCase().includes(keyword) ||
        (application.current_company ?? "").toLowerCase().includes(keyword) ||
        (application.location ?? "").toLowerCase().includes(keyword)

      const matchesStatus =
        selectedStatus === "all" || application.status === selectedStatus

      return matchesSearch && matchesStatus
    })
  }, [applications, searchTerm, selectedStatus])

  const totalPages = Math.max(
    1,
    Math.ceil(filteredApplications.length / applicationsPerPage)
  )

  const safeCurrentPage = Math.min(currentPage, totalPages)

  const startIndex = (safeCurrentPage - 1) * applicationsPerPage

  const paginatedApplications = filteredApplications.slice(
    startIndex,
    startIndex + applicationsPerPage
  )

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  if (isLoading) {
    return <PageLoader message="Loading career applications..." />
  }

  if (hasError) {
    return (
      <ErrorState
        title="Unable to Load Applications"
        message="The career applications could not be loaded."
        onRetry={() => {
          void loadApplications()
        }}
      />
    )
  }

  return (
    <>
      <SEO
        title="Career Applications | Cubicles Services Admin"
        description="Review career applications submitted to Cubicles Services."
      />

      <section>
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="font-semibold tracking-wider text-blue-600 uppercase">
            Recruitment
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            Career Applications
          </h1>

          <p className="mt-1 text-sm text-slate-600">
            Review candidates who have applied through the website.
          </p>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Applications" value={applications.length} />

          <StatCard
            label="New"
            value={
              applications.filter((application) => application.status === "new")
                .length
            }
          />

          <StatCard
            label="Shortlisted"
            value={
              applications.filter(
                (application) => application.status === "shortlisted"
              ).length
            }
          />

          <StatCard
            label="Hired"
            value={
              applications.filter(
                (application) => application.status === "hired"
              ).length
            }
          />
        </div>

        <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by candidate, email or position..."
              className="w-full rounded-xl border border-slate-300 bg-white py-3 pr-4 pl-12 transition outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <select
            value={selectedStatus}
            onChange={(event) => setSelectedStatus(event.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-700 transition outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 lg:max-w-xs"
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="reviewing">Reviewing</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="rejected">Rejected</option>
            <option value="hired">Hired</option>
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

        {filteredApplications.length === 0 ? (
          <div className="mt-6 rounded-xl bg-white px-6 py-16 text-center shadow-sm">
            <UserRound className="mx-auto h-12 w-12 text-slate-400" />

            <h2 className="mt-5 text-2xl font-bold text-slate-900">
              No Applications Found
            </h2>

            <p className="mt-3 text-slate-600">
              {searchTerm || selectedStatus !== "all"
                ? "No candidates match the selected filters."
                : "Submitted career applications will appear here."}
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
                        Candidate
                      </th>

                      <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                        Position
                      </th>

                      <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                        Experience
                      </th>

                      <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                        Location
                      </th>

                      <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                        Applied
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
                    {paginatedApplications.map((application) => (
                      <tr
                        key={application.id}
                        className="align-top transition hover:bg-slate-50"
                      >
                        <td className="px-5 py-4">
                          <p className="font-semibold text-slate-900">
                            {application.full_name}
                          </p>

                          <a
                            href={`mailto:${application.email}`}
                            className="mt-1 block text-sm font-medium text-blue-600 hover:underline"
                          >
                            {application.email}
                          </a>

                          <p className="mt-1 text-sm text-slate-500">
                            {application.phone || "No phone provided"}
                          </p>

                          <p className="mt-1 text-sm text-slate-500">
                            {application.current_company ||
                              "No current company"}
                          </p>
                        </td>

                        <td className="px-5 py-4 text-sm font-medium text-slate-700">
                          {application.position}
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-600">
                          {application.experience || "Not provided"}
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-600">
                          {application.location || "Not provided"}
                        </td>

                        <td className="px-5 py-4 text-sm whitespace-nowrap text-slate-600">
                          {new Date(application.created_at).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </td>

                        <td className="px-5 py-4">
                          <select
                            value={application.status}
                            disabled={updatingId === application.id}
                            onChange={(event) => {
                              void handleStatusChange(
                                application,
                                event.target.value as CareerApplicationStatus
                              )
                            }}
                            aria-label={`Change status for ${application.full_name}`}
                            className={`rounded-lg border border-transparent px-3 py-2 text-sm font-semibold transition outline-none focus:border-blue-400 disabled:cursor-not-allowed disabled:opacity-50 ${
                              statusClasses[application.status]
                            }`}
                          >
                            <option value="new">New</option>

                            <option value="reviewing">Reviewing</option>

                            <option value="shortlisted">Shortlisted</option>

                            <option value="rejected">Rejected</option>

                            <option value="hired">Hired</option>
                          </select>
                        </td>

                        <td className="px-5 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              disabled={loadingDetailsId === application.id}
                              onClick={() => {
                                void handleView(application.id)
                              }}
                              title="View candidate details"
                              aria-label={`View details for ${application.full_name}`}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <Eye className="h-4 w-4" />
                            </button>

                            {application.linkedin_url && (
                              <a
                                href={application.linkedin_url}
                                target="_blank"
                                rel="noreferrer"
                                title="Open LinkedIn profile"
                                aria-label={`Open ${application.full_name} LinkedIn profile`}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-blue-200 text-blue-600 transition hover:bg-blue-50"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            )}

                            {application.resume_url && (
                              <a
                                href={
                                  getApiAssetUrl(application.resume_url) ??
                                  undefined
                                }
                                target="_blank"
                                rel="noreferrer"
                                title="Open résumé"
                                aria-label={`Open ${application.full_name} résumé`}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-green-200 text-green-600 transition hover:bg-green-50"
                              >
                                <FileText className="h-4 w-4" />
                              </a>
                            )}

                            <button
                              type="button"
                              disabled={deletingId === application.id}
                              onClick={() => {
                                void handleDelete(application)
                              }}
                              title="Delete application"
                              aria-label={`Delete application from ${application.full_name}`}
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
                    startIndex + applicationsPerPage,
                    filteredApplications.length
                  )}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-900">
                  {filteredApplications.length}
                </span>{" "}
                applications
              </p>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  disabled={safeCurrentPage === 1}
                  onClick={() => setCurrentPage((page) => page - 1)}
                  className="rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
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
                  className="rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </section>

      <CareerApplicationDetailsModal
        application={selectedApplication}
        isOpen={isDetailsOpen}
        onClose={closeDetailsModal}
      />
    </>
  )
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>

          <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
        </div>

        <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
          <Briefcase className="h-6 w-6" />
        </div>
      </div>
    </div>
  )
}

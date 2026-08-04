import { useEffect, useMemo, useState, type ReactNode } from "react"
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  ExternalLink,
  Eye,
  FileText,
  Filter,
  Mail,
  Search,
  Sparkles,
  Trash2,
  UserRound,
  X,
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

const applicationsPerPage = 5

const statusClasses: Record<CareerApplicationStatus, string> = {
  new: "bg-blue-50 text-blue-700 ring-blue-200",
  reviewing: "bg-amber-50 text-amber-700 ring-amber-200",
  shortlisted: "bg-violet-50 text-violet-700 ring-violet-200",
  rejected: "bg-red-50 text-red-700 ring-red-200",
  hired: "bg-emerald-50 text-emerald-700 ring-emerald-200",
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

  function clearFilters() {
    setSearchTerm("")
    setSelectedStatus("all")
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

  const totalApplications = applications.length
  const newCount = applications.filter(
    (application) => application.status === "new"
  ).length
  const shortlistedCount = applications.filter(
    (application) => application.status === "shortlisted"
  ).length
  const hiredCount = applications.filter(
    (application) => application.status === "hired"
  ).length

  const hasFilters = Boolean(searchTerm) || selectedStatus !== "all"

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

      <section className="space-y-6">
        <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 px-6 py-8 text-white shadow-xl sm:px-8">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.25),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(139,92,246,0.18),transparent_40%)]" />

          <div className="relative max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold tracking-[0.16em] text-blue-200 uppercase backdrop-blur">
              <Sparkles className="size-3.5" />
              Recruitment
            </div>

            <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
              Career Applications
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
              Review, organize, and update candidates who have applied through
              the public website.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total Applications"
            value={totalApplications}
            description="All submitted candidates"
            icon={<Briefcase className="size-5" />}
          />

          <StatCard
            label="New"
            value={newCount}
            description="Awaiting initial review"
            icon={<UserRound className="size-5" />}
            tone="info"
          />

          <StatCard
            label="Shortlisted"
            value={shortlistedCount}
            description="Moved forward for evaluation"
            icon={<Eye className="size-5" />}
            tone="featured"
          />

          <StatCard
            label="Hired"
            value={hiredCount}
            description="Successfully selected candidates"
            icon={<FileText className="size-5" />}
            tone="success"
          />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-slate-100 p-2.5 text-slate-600">
                <Filter className="size-4" />
              </div>

              <div>
                <h2 className="text-sm font-bold text-slate-950">
                  Filter applications
                </h2>

                <p className="text-xs leading-5 text-slate-500">
                  Search by candidate details or narrow results by status.
                </p>
              </div>
            </div>

            <p className="text-xs font-semibold text-slate-500">
              {filteredApplications.length} result
              {filteredApplications.length === 1 ? "" : "s"}
            </p>
          </div>

          <div className="mt-4 grid gap-3 xl:grid-cols-[minmax(0,1fr)_240px_auto]">
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by candidate, email or position..."
                className={inputClassName}
              />
            </div>

            <select
              value={selectedStatus}
              onChange={(event) => setSelectedStatus(event.target.value)}
              className={selectClassName}
            >
              <option value="all">All Statuses</option>
              <option value="new">New</option>
              <option value="reviewing">Reviewing</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="rejected">Rejected</option>
              <option value="hired">Hired</option>
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

        {filteredApplications.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
              <UserRound className="size-7" />
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-950">
              No Applications Found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
              {hasFilters
                ? "No candidates match the selected filters."
                : "Submitted career applications will appear here."}
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
            <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm xl:block">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50/80">
                    <tr>
                      <TableHeading>Candidate</TableHeading>
                      <TableHeading>Position</TableHeading>
                      <TableHeading>Experience</TableHeading>
                      <TableHeading>Location</TableHeading>
                      <TableHeading>Applied</TableHeading>
                      <TableHeading>Status</TableHeading>
                      <TableHeading align="right">Actions</TableHeading>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {paginatedApplications.map((application) => (
                      <tr
                        key={application.id}
                        className="align-top transition hover:bg-slate-50/80"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-start gap-4">
                            <CandidateAvatar name={application.full_name} />

                            <div className="min-w-0">
                              <p className="font-semibold text-slate-950">
                                {application.full_name}
                              </p>

                              <a
                                href={`mailto:${application.email}`}
                                className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:underline"
                              >
                                <Mail className="size-3.5" />
                                {application.email}
                              </a>

                              <p className="mt-1 text-xs text-slate-500">
                                {application.phone || "No phone provided"}
                              </p>

                              <p className="mt-1 text-xs text-slate-500">
                                {application.current_company ||
                                  "No current company"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-5 text-sm font-semibold text-slate-800">
                          {application.position}
                        </td>

                        <td className="px-6 py-5 text-sm text-slate-600">
                          {application.experience || "Not provided"}
                        </td>

                        <td className="px-6 py-5 text-sm text-slate-600">
                          {application.location || "Not provided"}
                        </td>

                        <td className="px-6 py-5 text-sm whitespace-nowrap text-slate-600">
                          {formatDate(application.created_at)}
                        </td>

                        <td className="px-6 py-5">
                          <StatusSelect
                            application={application}
                            disabled={updatingId === application.id}
                            onChange={(newStatus) => {
                              void handleStatusChange(application, newStatus)
                            }}
                          />
                        </td>

                        <td className="px-6 py-5 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              disabled={loadingDetailsId === application.id}
                              onClick={() => {
                                void handleView(application.id)
                              }}
                              title="View candidate details"
                              aria-label={`View details for ${application.full_name}`}
                              className={actionButtonClassName}
                            >
                              <Eye className="size-4" />
                            </button>

                            {application.linkedin_url && (
                              <a
                                href={application.linkedin_url}
                                target="_blank"
                                rel="noreferrer"
                                title="Open LinkedIn profile"
                                aria-label={`Open ${application.full_name} LinkedIn profile`}
                                className="inline-flex size-9 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-blue-700 transition hover:bg-blue-100"
                              >
                                <ExternalLink className="size-4" />
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
                                className="inline-flex size-9 items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 transition hover:bg-emerald-100"
                              >
                                <FileText className="size-4" />
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

            <div className="grid gap-4 xl:hidden">
              {paginatedApplications.map((application) => (
                <article
                  key={application.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start gap-4">
                    <CandidateAvatar name={application.full_name} />

                    <div className="min-w-0 flex-1">
                      <h2 className="font-semibold text-slate-950">
                        {application.full_name}
                      </h2>

                      <a
                        href={`mailto:${application.email}`}
                        className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium break-all text-blue-600 hover:underline"
                      >
                        <Mail className="size-3.5 shrink-0" />
                        {application.email}
                      </a>

                      <p className="mt-1 text-xs text-slate-500">
                        {application.current_company || "No current company"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3 border-y border-slate-100 py-4">
                    <DetailItem label="Position" value={application.position} />

                    <DetailItem
                      label="Experience"
                      value={application.experience || "Not provided"}
                    />

                    <DetailItem
                      label="Location"
                      value={application.location || "Not provided"}
                    />

                    <DetailItem
                      label="Applied"
                      value={formatDate(application.created_at)}
                    />
                  </div>

                  <div className="mt-5">
                    <p className="mb-2 text-xs font-medium text-slate-500">
                      Status
                    </p>

                    <StatusSelect
                      application={application}
                      disabled={updatingId === application.id}
                      onChange={(newStatus) => {
                        void handleStatusChange(application, newStatus)
                      }}
                    />
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
                    <button
                      type="button"
                      disabled={loadingDetailsId === application.id}
                      onClick={() => {
                        void handleView(application.id)
                      }}
                      className={mobileActionClassName}
                    >
                      <Eye className="size-4" />
                      View
                    </button>

                    {application.linkedin_url && (
                      <a
                        href={application.linkedin_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-50 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                      >
                        <ExternalLink className="size-4" />
                        LinkedIn
                      </a>
                    )}

                    {application.resume_url && (
                      <a
                        href={
                          getApiAssetUrl(application.resume_url) ?? undefined
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
                      >
                        <FileText className="size-4" />
                        Résumé
                      </a>
                    )}

                    <button
                      type="button"
                      disabled={deletingId === application.id}
                      onClick={() => {
                        void handleDelete(application)
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
                    startIndex + applicationsPerPage,
                    filteredApplications.length
                  )}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-950">
                  {filteredApplications.length}
                </span>{" "}
                applications
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

      <CareerApplicationDetailsModal
        application={selectedApplication}
        isOpen={isDetailsOpen}
        onClose={closeDetailsModal}
      />
    </>
  )
}

function CandidateAvatar({ name }: { name: string }) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("")

  return (
    <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-violet-50 text-sm font-black text-indigo-700 ring-1 ring-indigo-100 ring-inset">
      {initials || "CA"}
    </div>
  )
}

function StatusSelect({
  application,
  disabled,
  onChange,
}: {
  application: AdminCareerApplication
  disabled: boolean
  onChange: (status: CareerApplicationStatus) => void
}) {
  return (
    <select
      value={application.status}
      disabled={disabled}
      onChange={(event) =>
        onChange(event.target.value as CareerApplicationStatus)
      }
      aria-label={`Change status for ${application.full_name}`}
      className={`rounded-xl border border-transparent px-3 py-2 text-sm font-semibold ring-1 transition outline-none ring-inset focus:border-blue-400 disabled:cursor-not-allowed disabled:opacity-50 ${
        statusClasses[application.status]
      }`}
    >
      <option value="new">New</option>
      <option value="reviewing">Reviewing</option>
      <option value="shortlisted">Shortlisted</option>
      <option value="rejected">Rejected</option>
      <option value="hired">Hired</option>
    </select>
  )
}

function StatCard({
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
  tone?: "default" | "info" | "featured" | "success"
}) {
  const toneClasses = {
    default: "bg-slate-100 text-slate-700",
    info: "bg-blue-50 text-blue-700",
    featured: "bg-violet-50 text-violet-700",
    success: "bg-emerald-50 text-emerald-700",
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

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

const inputClassName =
  "h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pr-4 pl-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"

const selectClassName =
  "h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"

const actionButtonClassName =
  "inline-flex size-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"

const mobileActionClassName =
  "inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"

const paginationButtonClassName =
  "inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"

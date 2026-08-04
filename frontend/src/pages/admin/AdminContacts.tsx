import { useEffect, useMemo, useState, type ReactNode } from "react"
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Download,
  Eye,
  Mail,
  MessageSquareText,
  RefreshCw,
  Search,
  Sparkles,
  Trash2,
  X,
} from "lucide-react"
import { toast } from "sonner"

import {
  deleteAdminContact,
  getAdminContacts,
  getAdminDashboardStats,
  markAdminContactAsRead,
  type AdminContact,
  type AdminDashboardStats,
} from "@/api/adminApi"
import AdminStats from "@/components/admin/AdminStats"
import ContactDetailsModal from "@/components/admin/ContactDetailsModal"
import ErrorState from "@/components/common/ErrorState"
import PageLoader from "@/components/common/PageLoader"
import SEO from "@/components/seo/SEO"
import { exportContactsToCSV } from "@/utils/exportContacts"

const contactsPerPage = 5

export default function AdminContacts() {
  const [contacts, setContacts] = useState<AdminContact[]>([])
  const [dashboardStats, setDashboardStats] =
    useState<AdminDashboardStats | null>(null)

  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedService, setSelectedService] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)

  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [selectedContact, setSelectedContact] = useState<AdminContact | null>(
    null
  )

  async function loadContacts(options?: { refresh?: boolean }) {
    try {
      if (options?.refresh) {
        setIsRefreshing(true)
      } else {
        setIsLoading(true)
      }

      setHasError(false)

      const [contactsResponse, statsResponse] = await Promise.all([
        getAdminContacts(),
        getAdminDashboardStats(),
      ])

      setContacts(contactsResponse)
      setDashboardStats(statsResponse)
    } catch (error) {
      console.error(error)
      setHasError(true)
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  async function handleView(contact: AdminContact) {
    setSelectedContact(contact)

    if (contact.is_read) {
      return
    }

    try {
      await markAdminContactAsRead(contact.id)

      const updatedContact = {
        ...contact,
        is_read: true,
      }

      setContacts((currentContacts) =>
        currentContacts.map((currentContact) =>
          currentContact.id === contact.id ? updatedContact : currentContact
        )
      )

      setSelectedContact(updatedContact)

      const updatedStats = await getAdminDashboardStats()
      setDashboardStats(updatedStats)
    } catch (error) {
      console.error(error)
      toast.error("Unable to update the contact status.")
    }
  }

  async function handleDelete(contact: AdminContact) {
    const confirmed = window.confirm(
      `Delete the contact request from ${contact.full_name}?`
    )

    if (!confirmed) {
      return
    }

    try {
      setDeletingId(contact.id)

      await deleteAdminContact(contact.id)

      setContacts((currentContacts) =>
        currentContacts.filter(
          (currentContact) => currentContact.id !== contact.id
        )
      )

      if (selectedContact?.id === contact.id) {
        setSelectedContact(null)
      }

      const updatedStats = await getAdminDashboardStats()
      setDashboardStats(updatedStats)

      toast.success("Contact request deleted successfully.")
    } catch (error) {
      console.error(error)
      toast.error("Unable to delete contact request.")
    } finally {
      setDeletingId(null)
    }
  }

  function clearFilters() {
    setSearchTerm("")
    setSelectedService("all")
  }

  useEffect(() => {
    void loadContacts()
  }, [])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedService])

  const filteredContacts = useMemo(() => {
    const keyword = searchTerm.toLowerCase().trim()

    return contacts.filter((contact) => {
      const matchesSearch =
        !keyword ||
        contact.full_name.toLowerCase().includes(keyword) ||
        contact.email.toLowerCase().includes(keyword) ||
        (contact.company ?? "").toLowerCase().includes(keyword) ||
        (contact.phone ?? "").toLowerCase().includes(keyword) ||
        (contact.service ?? "").toLowerCase().includes(keyword) ||
        contact.message.toLowerCase().includes(keyword)

      const matchesService =
        selectedService === "all" || contact.service === selectedService

      return matchesSearch && matchesService
    })
  }, [contacts, searchTerm, selectedService])

  const serviceOptions = useMemo(
    () =>
      Array.from(
        new Set(
          contacts
            .map((contact) => contact.service?.trim())
            .filter((value): value is string => Boolean(value))
        )
      ).sort((first, second) => first.localeCompare(second)),
    [contacts]
  )

  const unreadCount = useMemo(
    () => contacts.filter((contact) => !contact.is_read).length,
    [contacts]
  )

  const totalPages = Math.max(
    1,
    Math.ceil(filteredContacts.length / contactsPerPage)
  )

  const safeCurrentPage = Math.min(currentPage, totalPages)
  const startIndex = (safeCurrentPage - 1) * contactsPerPage

  const paginatedContacts = filteredContacts.slice(
    startIndex,
    startIndex + contactsPerPage
  )

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const hasFilters = Boolean(searchTerm) || selectedService !== "all"

  if (isLoading) {
    return <PageLoader message="Loading contact requests..." />
  }

  if (hasError) {
    return (
      <ErrorState
        title="Unable to Load Contacts"
        message="The contact requests could not be loaded."
        onRetry={() => {
          void loadContacts()
        }}
      />
    )
  }

  return (
    <>
      <SEO
        title="Contact Requests | Cubicles Services Admin"
        description="Manage contact requests submitted to Cubicles Services."
      />

      <section className="space-y-6">
        <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 px-6 py-8 text-white shadow-xl sm:px-8">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.25),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(139,92,246,0.18),transparent_40%)]" />

          <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold tracking-[0.16em] text-blue-200 uppercase backdrop-blur">
                <Sparkles className="size-3.5" />
                Enquiry Management
              </div>

              <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
                Contact Requests
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                Review, organize, export, and respond to enquiries submitted
                through the public website.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                disabled={isRefreshing}
                onClick={() => {
                  void loadContacts({ refresh: true })
                }}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RefreshCw
                  className={`size-4 ${isRefreshing ? "animate-spin" : ""}`}
                />
                {isRefreshing ? "Refreshing..." : "Refresh"}
              </button>

              <button
                type="button"
                disabled={filteredContacts.length === 0}
                onClick={() => {
                  exportContactsToCSV(filteredContacts)

                  if (filteredContacts.length > 0) {
                    toast.success("Contacts exported successfully.")
                  }
                }}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Download className="size-4" />
                Export CSV
              </button>
            </div>
          </div>
        </div>

        {dashboardStats && <AdminStats stats={dashboardStats} />}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            label="Total Requests"
            value={contacts.length}
            description="All submitted enquiries"
            icon={<Mail className="size-5" />}
          />

          <SummaryCard
            label="Unread"
            value={unreadCount}
            description="Awaiting review"
            icon={<MessageSquareText className="size-5" />}
            tone="info"
          />

          <SummaryCard
            label="Read"
            value={contacts.length - unreadCount}
            description="Already opened"
            icon={<Eye className="size-5" />}
            tone="success"
          />

          <SummaryCard
            label="Services"
            value={serviceOptions.length}
            description="Distinct enquiry categories"
            icon={<Building2 className="size-5" />}
            tone="neutral"
          />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-950">
                Filter contact requests
              </h2>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Search request content or narrow results by service.
              </p>
            </div>

            <p className="text-xs font-semibold text-slate-500">
              {filteredContacts.length} result
              {filteredContacts.length === 1 ? "" : "s"}
            </p>
          </div>

          <div className="mt-4 grid gap-3 xl:grid-cols-[minmax(0,1fr)_260px_auto]">
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by name, email, company..."
                className={inputClassName}
              />
            </div>

            <select
              value={selectedService}
              onChange={(event) => setSelectedService(event.target.value)}
              className={selectClassName}
            >
              <option value="all">All Services</option>

              {serviceOptions.map((service) => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
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

        {filteredContacts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
              <Mail className="size-7" />
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-950">
              No Contact Requests
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
              {hasFilters
                ? "No contact requests match the selected filters."
                : "New website enquiries will appear here."}
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
                      <TableHeading>Name</TableHeading>
                      <TableHeading>Contact</TableHeading>
                      <TableHeading>Service</TableHeading>
                      <TableHeading>Message</TableHeading>
                      <TableHeading>Submitted</TableHeading>
                      <TableHeading>Status</TableHeading>
                      <TableHeading align="right">Actions</TableHeading>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {paginatedContacts.map((contact) => {
                      const submittedDate = formatSubmittedDate(
                        contact.created_at
                      )

                      return (
                        <tr
                          key={contact.id}
                          className="align-top transition hover:bg-slate-50/80"
                        >
                          <td className="px-6 py-5">
                            <div className="flex items-start gap-4">
                              <ContactAvatar name={contact.full_name} />

                              <div className="min-w-0">
                                <p className="font-semibold text-slate-950">
                                  {contact.full_name}
                                </p>

                                <p className="mt-1 text-xs text-slate-500">
                                  {contact.company || "No company"}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-5">
                            <a
                              href={`mailto:${contact.email}`}
                              className="block max-w-[240px] truncate text-sm font-medium text-blue-600 hover:underline"
                            >
                              {contact.email}
                            </a>

                            <p className="mt-1 text-xs text-slate-500">
                              {contact.phone || "No phone"}
                            </p>
                          </td>

                          <td className="px-6 py-5 text-sm text-slate-700">
                            <span className="inline-flex max-w-[180px] rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 ring-inset">
                              <span className="truncate">
                                {contact.service || "Not specified"}
                              </span>
                            </span>
                          </td>

                          <td className="max-w-sm px-6 py-5 text-sm leading-6 text-slate-600">
                            <p className="line-clamp-2">{contact.message}</p>
                          </td>

                          <td className="px-6 py-5 text-sm text-slate-600">
                            <p className="font-medium whitespace-nowrap">
                              {submittedDate.date}
                            </p>

                            <p className="mt-1 text-xs whitespace-nowrap text-slate-500">
                              {submittedDate.time}
                            </p>
                          </td>

                          <td className="px-6 py-5">
                            <ReadStatusBadge isRead={contact.is_read} />
                          </td>

                          <td className="px-6 py-5 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                title="View contact"
                                aria-label={`View ${contact.full_name}`}
                                onClick={() => {
                                  void handleView(contact)
                                }}
                                className="inline-flex size-9 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-blue-700 transition hover:bg-blue-100"
                              >
                                <Eye className="size-4" />
                              </button>

                              <button
                                type="button"
                                title="Delete contact"
                                aria-label={`Delete ${contact.full_name}`}
                                disabled={deletingId === contact.id}
                                onClick={() => {
                                  void handleDelete(contact)
                                }}
                                className="inline-flex size-9 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <Trash2 className="size-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid gap-4 xl:hidden">
              {paginatedContacts.map((contact) => {
                const submittedDate = formatSubmittedDate(contact.created_at)

                return (
                  <article
                    key={contact.id}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-start gap-4">
                      <ContactAvatar name={contact.full_name} />

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="font-semibold text-slate-950">
                            {contact.full_name}
                          </h2>

                          <ReadStatusBadge isRead={contact.is_read} />
                        </div>

                        <p className="mt-1 text-xs text-slate-500">
                          {contact.company || "No company"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-3 border-y border-slate-100 py-4 sm:grid-cols-2">
                      <DetailItem label="Email" value={contact.email} />
                      <DetailItem
                        label="Phone"
                        value={contact.phone || "No phone"}
                      />
                      <DetailItem
                        label="Service"
                        value={contact.service || "Not specified"}
                      />
                      <DetailItem
                        label="Submitted"
                        value={`${submittedDate.date}, ${submittedDate.time}`}
                      />
                    </div>

                    <div className="mt-5">
                      <p className="text-xs font-medium text-slate-500">
                        Message
                      </p>

                      <p className="mt-2 line-clamp-4 text-sm leading-6 text-slate-600">
                        {contact.message}
                      </p>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          void handleView(contact)
                        }}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-50 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                      >
                        <Eye className="size-4" />
                        View
                      </button>

                      <button
                        type="button"
                        disabled={deletingId === contact.id}
                        onClick={() => {
                          void handleDelete(contact)
                        }}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Trash2 className="size-4" />
                        Delete
                      </button>
                    </div>
                  </article>
                )
              })}
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
                    startIndex + contactsPerPage,
                    filteredContacts.length
                  )}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-950">
                  {filteredContacts.length}
                </span>{" "}
                requests
              </p>

              <div className="flex items-center justify-between gap-3 sm:justify-end">
                <button
                  type="button"
                  disabled={safeCurrentPage === 1}
                  onClick={() => {
                    setCurrentPage((page) => page - 1)
                  }}
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
                  onClick={() => {
                    setCurrentPage((page) => page + 1)
                  }}
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

      {selectedContact && (
        <ContactDetailsModal
          contact={selectedContact}
          onClose={() => setSelectedContact(null)}
        />
      )}
    </>
  )
}

function ContactAvatar({ name }: { name: string }) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("")

  return (
    <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-violet-50 text-sm font-black text-indigo-700 ring-1 ring-indigo-100 ring-inset">
      {initials || "CR"}
    </div>
  )
}

function ReadStatusBadge({ isRead }: { isRead: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${
        isRead
          ? "bg-slate-100 text-slate-600 ring-slate-200"
          : "bg-blue-50 text-blue-700 ring-blue-200"
      }`}
    >
      <span
        className={`size-1.5 rounded-full ${
          isRead ? "bg-slate-400" : "bg-blue-500"
        }`}
      />

      {isRead ? "Read" : "New"}
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
  tone?: "default" | "info" | "success" | "neutral"
}) {
  const toneClasses = {
    default: "bg-violet-50 text-violet-700",
    info: "bg-blue-50 text-blue-700",
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

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold break-words text-slate-800">
        {value}
      </p>
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

function formatSubmittedDate(value: string) {
  const date = new Date(value)

  return {
    date: date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    time: date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  }
}

const inputClassName =
  "h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pr-4 pl-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"

const selectClassName =
  "h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"

const paginationButtonClassName =
  "inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"

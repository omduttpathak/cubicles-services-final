import { useEffect, useMemo, useState } from "react"
import { Download, Eye, Mail, RefreshCw, Search, Trash2 } from "lucide-react"
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

export default function AdminContacts() {
  const [contacts, setContacts] = useState<AdminContact[]>([])
  const [dashboardStats, setDashboardStats] =
    useState<AdminDashboardStats | null>(null)

  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedService, setSelectedService] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [selectedContact, setSelectedContact] = useState<AdminContact | null>(
    null
  )

  const contactsPerPage = 5

  async function loadContacts() {
    try {
      setIsLoading(true)
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
    }
  }

  async function handleView(contact: AdminContact) {
    setSelectedContact(contact)

    if (contact.is_read) {
      return
    }

    try {
      await markAdminContactAsRead(contact.id)

      setContacts((currentContacts) =>
        currentContacts.map((currentContact) =>
          currentContact.id === contact.id
            ? {
                ...currentContact,
                is_read: true,
              }
            : currentContact
        )
      )

      setSelectedContact({
        ...contact,
        is_read: true,
      })

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

      <section>
        <div>
          <div className="flex flex-col gap-4 rounded-xl bg-white p-5 shadow-sm xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="font-semibold tracking-wider text-blue-600 uppercase">
                Admin Dashboard
              </p>

              <h1 className="mt-1 text-2xl font-bold text-slate-900">
                Contact Requests
              </h1>

              <p className="mt-1 text-sm text-slate-600">
                Review enquiries submitted through the website.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  void loadContacts()
                }}
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
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
                className="inline-flex items-center justify-center rounded-lg bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </button>
            </div>
          </div>

          <div className="mt-4">
            {dashboardStats && <AdminStats stats={dashboardStats} />}
          </div>

          <div className="mt-4 mb-4 flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative w-full max-w-md">
              <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by name, email, company..."
                className="w-full rounded-xl border border-slate-300 bg-white py-3 pr-4 pl-12 transition outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <select
              value={selectedService}
              onChange={(event) => setSelectedService(event.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-700 transition outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 lg:max-w-xs"
            >
              <option value="all">All Services</option>
              <option value="Cloud Migration">Cloud Migration</option>
              <option value="DevOps Engineering">DevOps Engineering</option>
              <option value="Application Modernization">
                Application Modernization
              </option>
              <option value="Managed IT Services">Managed IT Services</option>
              <option value="DevOps">DevOps</option>
            </select>

            {(searchTerm || selectedService !== "all") && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("")
                  setSelectedService("all")
                }}
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Clear Filters
              </button>
            )}
          </div>

          {filteredContacts.length === 0 ? (
            <div className="mt-8 rounded-2xl bg-white px-6 py-16 text-center shadow-sm">
              <Mail className="mx-auto h-12 w-12 text-slate-400" />

              <h2 className="mt-5 text-2xl font-bold text-slate-900">
                No Contact Requests
              </h2>

              <p className="mt-3 text-slate-600">
                {searchTerm || selectedService !== "all"
                  ? "No contact requests match the selected filters."
                  : "New website enquiries will appear here."}
              </p>
            </div>
          ) : (
            <>
              <div className="mt-4 overflow-hidden rounded-xl bg-white shadow-sm">
                <div className="overflow-hidden">
                  <table className="w-full table-fixed divide-y divide-slate-200">
                    <thead className="sticky top-0 z-10 bg-slate-50">
                      <tr>
                        <th className="w-[15%] px-4 py-3 text-left text-sm font-semibold text-slate-700">
                          Name
                        </th>

                        <th className="w-[19%] px-4 py-3 text-left text-sm font-semibold text-slate-700">
                          Contact
                        </th>

                        <th className="w-[13%] px-4 py-3 text-left text-sm font-semibold text-slate-700">
                          Service
                        </th>

                        <th className="w-[18%] px-4 py-3 text-left text-sm font-semibold text-slate-700">
                          Message
                        </th>

                        <th className="w-[13%] px-4 py-3 text-left text-sm font-semibold text-slate-700">
                          Submitted
                        </th>

                        <th className="w-[8%] px-4 py-3 text-left text-sm font-semibold text-slate-700">
                          Status
                        </th>

                        <th className="w-[14%] px-4 py-3 text-right text-sm font-semibold text-slate-700">
                          Actions
                        </th>
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
                            className="align-top transition hover:bg-slate-50"
                          >
                            <td className="px-4 py-3">
                              <p
                                title={contact.full_name}
                                className="truncate font-semibold text-slate-900"
                              >
                                {contact.full_name}
                              </p>

                              <p
                                title={contact.company || "No company"}
                                className="mt-1 truncate text-xs text-slate-500"
                              >
                                {contact.company || "No company"}
                              </p>
                            </td>

                            <td className="px-4 py-3 text-sm text-slate-700">
                              <a
                                href={`mailto:${contact.email}`}
                                title={contact.email}
                                className="block truncate font-medium text-blue-600 hover:underline"
                              >
                                {contact.email}
                              </a>

                              <p className="mt-1 truncate text-xs text-slate-500">
                                {contact.phone || "No phone"}
                              </p>
                            </td>

                            <td className="px-4 py-3 text-sm text-slate-700">
                              <p
                                title={contact.service || "Not specified"}
                                className="line-clamp-2"
                              >
                                {contact.service || "Not specified"}
                              </p>
                            </td>

                            <td className="px-4 py-3 text-sm leading-6 text-slate-600">
                              <p
                                title={contact.message}
                                className="line-clamp-2"
                              >
                                {contact.message}
                              </p>
                            </td>

                            <td className="px-4 py-3 text-sm text-slate-600">
                              <p className="font-medium whitespace-nowrap">
                                {submittedDate.date}
                              </p>

                              <p className="mt-1 text-xs whitespace-nowrap text-slate-500">
                                {submittedDate.time}
                              </p>
                            </td>

                            <td className="px-4 py-3">
                              <span
                                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                                  contact.is_read
                                    ? "bg-slate-100 text-slate-600"
                                    : "bg-blue-100 text-blue-700"
                                }`}
                              >
                                {contact.is_read ? "Read" : "New"}
                              </span>
                            </td>

                            <td className="px-4 py-3 text-right">
                              <div className="flex justify-end gap-2">
                                <button
                                  type="button"
                                  title="View contact"
                                  aria-label={`View ${contact.full_name}`}
                                  onClick={() => {
                                    void handleView(contact)
                                  }}
                                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-blue-200 text-blue-600 transition hover:bg-blue-50"
                                >
                                  <Eye className="h-4 w-4" />
                                </button>

                                <button
                                  type="button"
                                  title="Delete contact"
                                  aria-label={`Delete ${contact.full_name}`}
                                  disabled={deletingId === contact.id}
                                  onClick={() => {
                                    void handleDelete(contact)
                                  }}
                                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  <Trash2 className="h-4 w-4" />
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

              <div className="mt-6 flex flex-col gap-4 rounded-2xl bg-white px-6 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-600">
                  Showing{" "}
                  <span className="font-semibold text-slate-900">
                    {startIndex + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-semibold text-slate-900">
                    {Math.min(
                      startIndex + contactsPerPage,
                      filteredContacts.length
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-slate-900">
                    {filteredContacts.length}
                  </span>{" "}
                  requests
                </p>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    disabled={safeCurrentPage === 1}
                    onClick={() => {
                      setCurrentPage((page) => page - 1)
                    }}
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
                    onClick={() => {
                      setCurrentPage((page) => page + 1)
                    }}
                    className="rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
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

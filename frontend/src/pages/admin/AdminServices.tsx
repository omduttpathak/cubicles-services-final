import { useEffect, useMemo, useState } from "react"
import {
  ArrowUpRight,
  Eye,
  Pencil,
  Plus,
  Search,
  Settings2,
  Sparkles,
  Trash2,
  Wrench,
  X,
} from "lucide-react"
import { Link } from "react-router-dom"
import { toast } from "sonner"

import {
  deleteAdminService,
  getAdminServices,
  type AdminService,
} from "@/api/adminServicesApi"
import ErrorState from "@/components/common/ErrorState"
import PageLoader from "@/components/common/PageLoader"
import SEO from "@/components/seo/SEO"

export default function AdminServices() {
  const [services, setServices] = useState<AdminService[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  async function loadServices() {
    try {
      setIsLoading(true)
      setHasError(false)

      const response = await getAdminServices()

      setServices(response)
    } catch (error) {
      console.error(error)
      setHasError(true)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDelete(service: AdminService) {
    const confirmed = window.confirm(
      `Delete "${service.title}" permanently?\n\nThis service will also disappear from the public website.`
    )

    if (!confirmed) {
      return
    }

    try {
      setDeletingId(service.id)

      await deleteAdminService(service.id)

      setServices((currentServices) =>
        currentServices.filter(
          (currentService) => currentService.id !== service.id
        )
      )

      toast.success("Service deleted successfully.")
    } catch (error) {
      console.error(error)
      toast.error("Unable to delete the service.")
    } finally {
      setDeletingId(null)
    }
  }

  useEffect(() => {
    void loadServices()
  }, [])

  const filteredServices = useMemo(() => {
    const keyword = searchTerm.toLowerCase().trim()

    if (!keyword) {
      return services
    }

    return services.filter((service) => {
      return (
        service.title.toLowerCase().includes(keyword) ||
        service.slug.toLowerCase().includes(keyword) ||
        service.short_description.toLowerCase().includes(keyword) ||
        service.highlights.some((highlight) =>
          highlight.toLowerCase().includes(keyword)
        )
      )
    })
  }, [services, searchTerm])

  const totalHighlights = useMemo(
    () =>
      services.reduce((total, service) => total + service.highlights.length, 0),
    [services]
  )

  const averageHighlights =
    services.length > 0 ? Math.round(totalHighlights / services.length) : 0

  if (isLoading) {
    return <PageLoader message="Loading services..." />
  }

  if (hasError) {
    return (
      <ErrorState
        title="Unable to Load Services"
        message="The service records could not be loaded."
        onRetry={() => {
          void loadServices()
        }}
      />
    )
  }

  return (
    <>
      <SEO
        title="Manage Services | Cubicles Services Admin"
        description="Manage Cubicles Services website services."
      />

      <div className="space-y-6">
        <section className="relative overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-950 px-6 py-8 shadow-[0_24px_80px_rgb(15_23_42/0.18)] sm:px-8 lg:px-10 lg:py-10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.24),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(124,58,237,0.22),transparent_38%)]"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.12) 1px, transparent 1px)",
              backgroundSize: "56px 56px",
            }}
          />

          <div className="relative flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-xs font-bold tracking-[0.16em] text-blue-200 uppercase">
                <Sparkles className="size-4" />
                Content management
              </div>

              <h1 className="mt-5 text-3xl font-extrabold tracking-[-0.04em] text-white sm:text-4xl">
                Services
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                Review, update, and publish the services displayed across the
                Cubicles Services website.
              </p>
            </div>

            <Link
              to="/admin/services/create"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-white bg-white px-5 text-sm font-bold text-slate-950 shadow-lg transition duration-300 hover:-translate-y-0.5 hover:bg-slate-100"
            >
              <Plus className="mr-2 size-4" />
              Create Service
            </Link>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total Services"
            value={services.length}
            helper="Published service records"
            icon={<Wrench className="size-6" />}
            iconClassName="bg-blue-50 text-blue-600"
          />

          <StatCard
            label="Total Highlights"
            value={totalHighlights}
            helper="Combined service benefits"
            icon={<Settings2 className="size-6" />}
            iconClassName="bg-violet-50 text-violet-600"
          />

          <StatCard
            label="Average Highlights"
            value={averageHighlights}
            helper="Per service"
            icon={<Sparkles className="size-6" />}
            iconClassName="bg-emerald-50 text-emerald-600"
          />

          <StatCard
            label="Search Results"
            value={filteredServices.length}
            helper={
              searchTerm ? "Matching current search" : "All services visible"
            }
            icon={<Search className="size-6" />}
            iconClassName="bg-amber-50 text-amber-600"
          />
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_12px_34px_rgb(15_23_42/0.05)]">
          <div className="flex flex-col gap-4 border-b border-slate-200/80 px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-extrabold tracking-[-0.02em] text-slate-950">
                Service directory
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Search, review, edit, preview, or remove service records.
              </p>
            </div>

            <div className="relative w-full lg:max-w-md">
              <Search className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-slate-400" />

              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search services, slugs, descriptions..."
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pr-12 pl-12 text-sm text-slate-900 transition outline-none placeholder:text-slate-400 focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />

              {searchTerm ? (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  aria-label="Clear service search"
                  className="absolute top-1/2 right-3 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
                >
                  <X className="size-4" />
                </button>
              ) : null}
            </div>
          </div>

          {filteredServices.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex size-16 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-400">
                <Wrench className="size-7" />
              </div>

              <h2 className="mt-5 text-2xl font-extrabold tracking-[-0.03em] text-slate-950">
                No Services Found
              </h2>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
                {searchTerm
                  ? "No services match your current search. Try another title, slug, description, or highlight."
                  : "Service records will appear here after they are created."}
              </p>

              {searchTerm ? (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="mt-6 inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                >
                  Clear Search
                </button>
              ) : (
                <Link
                  to="/admin/services/create"
                  className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                >
                  <Plus className="mr-2 size-4" />
                  Create First Service
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="hidden overflow-x-auto lg:block">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50/80">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold tracking-[0.12em] text-slate-500 uppercase">
                        Service
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-bold tracking-[0.12em] text-slate-500 uppercase">
                        Icon
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-bold tracking-[0.12em] text-slate-500 uppercase">
                        Highlights
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-bold tracking-[0.12em] text-slate-500 uppercase">
                        Hero Title
                      </th>

                      <th className="px-6 py-4 text-right text-xs font-bold tracking-[0.12em] text-slate-500 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {filteredServices.map((service) => (
                      <tr
                        key={service.id}
                        className="group align-top transition hover:bg-slate-50/80"
                      >
                        <td className="max-w-md px-6 py-5">
                          <div className="flex gap-4">
                            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-violet-50 text-blue-600 ring-1 ring-blue-100">
                              <Wrench className="size-5" />
                            </div>

                            <div className="min-w-0">
                              <p className="font-bold text-slate-950 transition group-hover:text-blue-700">
                                {service.title}
                              </p>

                              <p className="mt-1 truncate font-mono text-xs text-slate-400">
                                /services/{service.slug}
                              </p>

                              <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
                                {service.short_description}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <span className="inline-flex rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 font-mono text-xs font-bold text-blue-700">
                            {service.icon}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700">
                            {service.highlights.length} items
                          </span>
                        </td>

                        <td className="max-w-xs px-6 py-5">
                          <p className="line-clamp-2 text-sm leading-6 text-slate-600">
                            {service.hero_title}
                          </p>
                        </td>

                        <td className="px-6 py-5 text-right">
                          <ActionButtons
                            service={service}
                            deletingId={deletingId}
                            onDelete={handleDelete}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="divide-y divide-slate-100 lg:hidden">
                {filteredServices.map((service) => (
                  <article key={service.id} className="p-5 sm:p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-violet-50 text-blue-600 ring-1 ring-blue-100">
                        <Wrench className="size-5" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="font-extrabold text-slate-950">
                          {service.title}
                        </h3>

                        <p className="mt-1 truncate font-mono text-xs text-slate-400">
                          /services/{service.slug}
                        </p>
                      </div>
                    </div>

                    <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">
                      {service.short_description}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="inline-flex rounded-lg border border-blue-100 bg-blue-50 px-3 py-1.5 font-mono text-xs font-bold text-blue-700">
                        {service.icon}
                      </span>

                      <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700">
                        {service.highlights.length} highlights
                      </span>
                    </div>

                    <div className="mt-5 flex items-center justify-end border-t border-slate-100 pt-4">
                      <ActionButtons
                        service={service}
                        deletingId={deletingId}
                        onDelete={handleDelete}
                      />
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </section>
      </div>
    </>
  )
}

type StatCardProps = {
  label: string
  value: number
  helper: string
  icon: React.ReactNode
  iconClassName: string
}

function StatCard({
  label,
  value,
  helper,
  icon,
  iconClassName,
}: StatCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_12px_34px_rgb(15_23_42/0.05)] transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_22px_50px_rgb(15_23_42/0.09)]">
      <div className="flex items-start justify-between gap-4">
        <div
          className={`flex size-12 items-center justify-center rounded-2xl ${iconClassName}`}
        >
          {icon}
        </div>

        <ArrowUpRight className="size-4 text-slate-300 transition group-hover:text-blue-500" />
      </div>

      <p className="mt-5 text-sm font-semibold text-slate-500">{label}</p>
      <p className="mt-1 text-3xl font-extrabold tracking-[-0.04em] text-slate-950">
        {value}
      </p>
      <p className="mt-2 text-xs leading-5 text-slate-500">{helper}</p>
    </div>
  )
}

type ActionButtonsProps = {
  service: AdminService
  deletingId: number | null
  onDelete: (service: AdminService) => Promise<void>
}

function ActionButtons({ service, deletingId, onDelete }: ActionButtonsProps) {
  return (
    <div className="inline-flex items-center gap-2">
      <Link
        to={`/admin/services/${service.id}/edit`}
        title="Edit service"
        aria-label={`Edit ${service.title}`}
        className="inline-flex size-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
      >
        <Pencil className="size-4" />
      </Link>

      <Link
        to={`/services/${service.slug}`}
        target="_blank"
        rel="noreferrer"
        title="View public service"
        aria-label={`View ${service.title}`}
        className="inline-flex size-10 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 text-blue-600 shadow-sm transition hover:border-blue-300 hover:bg-blue-100 hover:text-blue-700"
      >
        <Eye className="size-4" />
      </Link>

      <button
        type="button"
        disabled={deletingId === service.id}
        onClick={() => {
          void onDelete(service)
        }}
        title="Delete service"
        aria-label={`Delete ${service.title}`}
        className="inline-flex size-10 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-600 shadow-sm transition hover:border-red-300 hover:bg-red-100 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Trash2 className="size-4" />
      </button>
    </div>
  )
}

import { useEffect, useMemo, useState, type ReactNode } from "react"
import { Cpu, Eye, Pencil, Plus, Search, Sparkles, Trash2 } from "lucide-react"
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

export default function AdminTechnologies() {
  const [technologies, setTechnologies] = useState<AdminTechnology[]>([])

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedFeatured, setSelectedFeatured] = useState("all")

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

      <section>
        <div className="flex flex-col gap-4 rounded-xl bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold tracking-wider text-blue-600 uppercase">
              Content Management
            </p>

            <h1 className="mt-1 text-2xl font-bold text-slate-900">
              Technologies
            </h1>

            <p className="mt-1 text-sm text-slate-600">
              Review and manage technology capabilities displayed across the
              public website.
            </p>
          </div>

          <Link
            to="/admin/technologies/create"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Technology
          </Link>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Technologies"
            value={technologies.length}
            icon={<Cpu className="h-6 w-6" />}
          />

          <StatCard
            label="Active"
            value={
              technologies.filter((technology) => technology.is_active).length
            }
            icon={<Cpu className="h-6 w-6" />}
          />

          <StatCard
            label="Featured"
            value={
              technologies.filter((technology) => technology.is_featured).length
            }
            icon={<Sparkles className="h-6 w-6" />}
          />

          <StatCard
            label="Categories"
            value={
              new Set(technologies.map((technology) => technology.category))
                .size
            }
            icon={<Cpu className="h-6 w-6" />}
          />
        </div>

        <div className="mt-4 flex flex-col gap-3 xl:flex-row xl:items-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search technologies..."
              className="w-full rounded-xl border border-slate-300 bg-white py-3 pr-4 pl-12 transition outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <select
            value={selectedStatus}
            onChange={(event) => setSelectedStatus(event.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-700 transition outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 xl:max-w-xs"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <select
            value={selectedFeatured}
            onChange={(event) => setSelectedFeatured(event.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-700 transition outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 xl:max-w-xs"
          >
            <option value="all">All Types</option>
            <option value="featured">Featured</option>
            <option value="standard">Standard</option>
          </select>

          {(searchTerm ||
            selectedStatus !== "all" ||
            selectedFeatured !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm("")
                setSelectedStatus("all")
                setSelectedFeatured("all")
              }}
              className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Clear Filters
            </button>
          )}
        </div>

        {filteredTechnologies.length === 0 ? (
          <div className="mt-6 rounded-xl bg-white px-6 py-16 text-center shadow-sm">
            <Cpu className="mx-auto h-12 w-12 text-slate-400" />

            <h2 className="mt-5 text-2xl font-bold text-slate-900">
              No Technologies Found
            </h2>

            <p className="mt-3 text-slate-600">
              {searchTerm ||
              selectedStatus !== "all" ||
              selectedFeatured !== "all"
                ? "No technologies match the selected filters."
                : "Technology records will appear here."}
            </p>
          </div>
        ) : (
          <div className="mt-6 overflow-hidden rounded-xl bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                      Technology
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                      Category
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                      Order
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                      Featured
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
                  {filteredTechnologies.map((technology) => (
                    <tr
                      key={technology.id}
                      className="align-top transition hover:bg-slate-50"
                    >
                      <td className="max-w-md px-5 py-4">
                        <div className="flex items-start gap-3">
                          <TechnologyVisual technology={technology} />

                          <div className="min-w-0">
                            <p className="font-semibold text-slate-900">
                              {technology.name}
                            </p>

                            <p className="mt-1 text-sm break-all text-slate-500">
                              /technologies/{technology.slug}
                            </p>

                            <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">
                              {getDescriptionPreview(technology.description)}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                          {technology.category}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-sm font-semibold text-slate-700">
                        {technology.display_order}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            technology.is_featured
                              ? "bg-purple-100 text-purple-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {technology.is_featured ? "Featured" : "Standard"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            technology.is_active
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {technology.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Link
                            to={`/admin/technologies/${technology.id}/edit`}
                            title="Edit technology"
                            aria-label={`Edit ${technology.name}`}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 text-slate-600 transition hover:bg-slate-50"
                          >
                            <Pencil className="h-4 w-4" />
                          </Link>

                          {technology.is_active && (
                            <Link
                              to={`/technologies/${technology.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              title="View public technology"
                              aria-label={`View ${technology.name}`}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-blue-200 text-blue-600 transition hover:bg-blue-50"
                            >
                              <Eye className="h-4 w-4" />
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
      </section>
    </>
  )
}

function TechnologyVisual({ technology }: { technology: AdminTechnology }) {
  if (technology.logo_url) {
    return (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white">
        <img
          src={technology.logo_url}
          alt={`${technology.name} logo`}
          className="h-8 w-8 object-contain"
        />
      </div>
    )
  }

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 px-2 text-center font-mono text-[10px] font-bold text-blue-700">
      {technology.icon}
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
  icon: ReactNode
}

function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <div className="rounded-xl bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>

          <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
        </div>

        <div className="rounded-xl bg-blue-50 p-3 text-blue-600">{icon}</div>
      </div>
    </div>
  )
}

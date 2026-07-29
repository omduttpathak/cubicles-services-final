import { useEffect, useMemo, useState } from "react"
import {
  BookOpen,
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
  deleteAdminBlog,
  getAdminBlogs,
  updateAdminBlogPublishStatus,
  type AdminBlog,
} from "@/api/adminBlogsApi"

import ErrorState from "@/components/common/ErrorState"
import PageLoader from "@/components/common/PageLoader"
import SEO from "@/components/seo/SEO"

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState<AdminBlog[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [updatingId, setUpdatingId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const blogsPerPage = 5

  async function loadBlogs() {
    try {
      setIsLoading(true)
      setHasError(false)

      const response = await getAdminBlogs()

      setBlogs(response)
    } catch (error) {
      console.error(error)
      setHasError(true)
    } finally {
      setIsLoading(false)
    }
  }

  async function handlePublishStatus(blog: AdminBlog) {
    const nextStatus = !blog.is_published

    const confirmed = window.confirm(
      nextStatus ? `Publish "${blog.title}"?` : `Unpublish "${blog.title}"?`
    )

    if (!confirmed) {
      return
    }

    try {
      setUpdatingId(blog.id)

      const updatedBlog = await updateAdminBlogPublishStatus(
        blog.id,
        nextStatus
      )

      setBlogs((currentBlogs) =>
        currentBlogs.map((currentBlog) =>
          currentBlog.id === blog.id ? updatedBlog : currentBlog
        )
      )

      toast.success(
        nextStatus
          ? "Blog published successfully."
          : "Blog unpublished successfully."
      )
    } catch (error) {
      console.error(error)
      toast.error("Unable to update blog status.")
    } finally {
      setUpdatingId(null)
    }
  }

  async function handleDelete(blogId: number) {
    const confirmed = window.confirm("Delete this blog permanently?")

    if (!confirmed) {
      return
    }

    try {
      await deleteAdminBlog(blogId)

      toast.success("Blog deleted successfully.")

      await loadBlogs()
    } catch (error) {
      console.error(error)

      toast.error("Unable to delete blog.")
    }
  }

  useEffect(() => {
    void loadBlogs()
  }, [])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedStatus])

  const filteredBlogs = useMemo(() => {
    const keyword = searchTerm.toLowerCase().trim()

    return blogs.filter((blog) => {
      const matchesSearch =
        !keyword ||
        blog.title.toLowerCase().includes(keyword) ||
        blog.slug.toLowerCase().includes(keyword) ||
        blog.category.toLowerCase().includes(keyword) ||
        blog.author.toLowerCase().includes(keyword)

      const matchesStatus =
        selectedStatus === "all" ||
        (selectedStatus === "published" && blog.is_published) ||
        (selectedStatus === "draft" && !blog.is_published)

      return matchesSearch && matchesStatus
    })
  }, [blogs, searchTerm, selectedStatus])

  const totalPages = Math.max(1, Math.ceil(filteredBlogs.length / blogsPerPage))

  const safeCurrentPage = Math.min(currentPage, totalPages)

  const startIndex = (safeCurrentPage - 1) * blogsPerPage

  const paginatedBlogs = filteredBlogs.slice(
    startIndex,
    startIndex + blogsPerPage
  )

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  if (isLoading) {
    return <PageLoader message="Loading blogs..." />
  }

  if (hasError) {
    return (
      <ErrorState
        title="Unable to Load Blogs"
        message="The blog records could not be loaded."
        onRetry={() => {
          void loadBlogs()
        }}
      />
    )
  }

  return (
    <>
      <SEO
        title="Manage Blogs | Cubicles Services Admin"
        description="Manage Cubicles Services blog articles."
      />

      <section>
        <div className="flex flex-col gap-4 rounded-xl bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold tracking-wider text-blue-600 uppercase">
              Content Management
            </p>

            <h1 className="mt-1 text-2xl font-bold text-slate-900">Blogs</h1>

            <p className="mt-1 text-sm text-slate-600">
              Review published articles and draft content.
            </p>
          </div>

          <Link
            to="/admin/blogs/create"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Blog
          </Link>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Total Articles</p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {blogs.length}
            </p>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Published</p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {blogs.filter((blog) => blog.is_published).length}
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
              placeholder="Search by title, category or author..."
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

        {filteredBlogs.length === 0 ? (
          <div className="mt-6 rounded-xl bg-white px-6 py-16 text-center shadow-sm">
            <BookOpen className="mx-auto h-12 w-12 text-slate-400" />

            <h2 className="mt-5 text-2xl font-bold text-slate-900">
              No Blogs Found
            </h2>

            <p className="mt-3 text-slate-600">
              No articles match the selected filters.
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
                        Article
                      </th>

                      <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                        Category
                      </th>

                      <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                        Author
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
                    {paginatedBlogs.map((blog) => (
                      <tr
                        key={blog.id}
                        className="transition hover:bg-slate-50"
                      >
                        <td className="max-w-md px-5 py-4">
                          <p className="font-semibold text-slate-900">
                            {blog.title}
                          </p>

                          <p className="mt-1 truncate text-sm text-slate-500">
                            /blogs/{blog.slug}
                          </p>
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-700">
                          {blog.category}
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-700">
                          {blog.author}
                        </td>

                        <td className="px-5 py-4 text-sm whitespace-nowrap text-slate-600">
                          {new Date(blog.published_at).toLocaleDateString(
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
                              blog.is_published
                                ? "bg-green-100 text-green-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {blog.is_published ? "Published" : "Draft"}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Link
                              to={`/admin/blogs/${blog.id}/edit`}
                              title="Edit article"
                              aria-label={`Edit ${blog.title}`}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 text-slate-600 transition hover:bg-slate-50"
                            >
                              <Pencil className="h-4 w-4" />
                            </Link>

                            {blog.is_published && (
                              <Link
                                to={`/blogs/${blog.slug}`}
                                target="_blank"
                                title="View public article"
                                aria-label={`View ${blog.title}`}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-blue-200 text-blue-600 transition hover:bg-blue-50"
                              >
                                <Eye className="h-4 w-4" />
                              </Link>
                            )}

                            <button
                              type="button"
                              disabled={updatingId === blog.id}
                              onClick={() => {
                                void handlePublishStatus(blog)
                              }}
                              title={
                                blog.is_published
                                  ? "Unpublish article"
                                  : "Publish article"
                              }
                              aria-label={
                                blog.is_published
                                  ? `Unpublish ${blog.title}`
                                  : `Publish ${blog.title}`
                              }
                              className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border transition disabled:cursor-not-allowed disabled:opacity-50 ${
                                blog.is_published
                                  ? "border-amber-200 text-amber-600 hover:bg-amber-50"
                                  : "border-green-200 text-green-600 hover:bg-green-50"
                              }`}
                            >
                              {blog.is_published ? (
                                <Undo2 className="h-4 w-4" />
                              ) : (
                                <Globe2 className="h-4 w-4" />
                              )}
                            </button>

                            <button
                              type="button"
                              title="Delete"
                              onClick={() => {
                                void handleDelete(blog.id)
                              }}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 text-red-600 transition hover:bg-red-50"
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
                  {Math.min(startIndex + blogsPerPage, filteredBlogs.length)}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-900">
                  {filteredBlogs.length}
                </span>{" "}
                articles
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
    </>
  )
}

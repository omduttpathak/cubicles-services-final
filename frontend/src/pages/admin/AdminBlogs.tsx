import { useEffect, useMemo, useState } from "react"
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileText,
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

const BLOGS_PER_PAGE = 5

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState<AdminBlog[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [updatingId, setUpdatingId] = useState<number | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

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

  async function handleDelete(blog: AdminBlog) {
    const confirmed = window.confirm(
      `Delete "${blog.title}" permanently? This action cannot be undone.`
    )

    if (!confirmed) {
      return
    }

    try {
      setDeletingId(blog.id)
      await deleteAdminBlog(blog.id)

      setBlogs((currentBlogs) =>
        currentBlogs.filter((currentBlog) => currentBlog.id !== blog.id)
      )

      toast.success("Blog deleted successfully.")
    } catch (error) {
      console.error(error)
      toast.error("Unable to delete blog.")
    } finally {
      setDeletingId(null)
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

  const totalPages = Math.max(
    1,
    Math.ceil(filteredBlogs.length / BLOGS_PER_PAGE)
  )

  const safeCurrentPage = Math.min(currentPage, totalPages)
  const startIndex = (safeCurrentPage - 1) * BLOGS_PER_PAGE

  const paginatedBlogs = filteredBlogs.slice(
    startIndex,
    startIndex + BLOGS_PER_PAGE
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

  const publishedCount = blogs.filter((blog) => blog.is_published).length
  const draftCount = blogs.length - publishedCount
  const hasActiveFilters = Boolean(searchTerm) || selectedStatus !== "all"

  return (
    <>
      <SEO
        title="Manage Blogs | Cubicles Services Admin"
        description="Manage Cubicles Services blog articles."
      />

      <div className="space-y-6">
        <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 px-6 py-7 shadow-xl shadow-slate-200/70 sm:px-8 sm:py-9">
          <div className="absolute -top-24 -right-20 size-64 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute -bottom-28 left-1/3 size-64 rounded-full bg-violet-500/20 blur-3xl" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold tracking-[0.18em] text-blue-200 uppercase">
                <BookOpen className="size-3.5" />
                Content management
              </div>

              <h1 className="mt-5 text-3xl font-black tracking-tight text-white sm:text-4xl">
                Blog Management
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                Create, review, publish, and maintain thought-leadership content
                for the Cubicles Services website.
              </p>
            </div>

            <Link
              to="/admin/blogs/create"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-white px-5 text-sm font-extrabold text-slate-950 shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-50"
            >
              <Plus className="mr-2 size-4" />
              Create Blog
            </Link>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Total Articles"
            value={blogs.length}
            description="All blog records"
            icon={<BookOpen className="size-5" />}
          />

          <MetricCard
            label="Published"
            value={publishedCount}
            description="Visible on the website"
            icon={<Globe2 className="size-5" />}
          />

          <MetricCard
            label="Drafts"
            value={draftCount}
            description="Awaiting publication"
            icon={<FileText className="size-5" />}
          />

          <MetricCard
            label="Filtered Results"
            value={filteredBlogs.length}
            description={
              hasActiveFilters
                ? "Matching current filters"
                : "No filters active"
            }
            icon={<Search className="size-5" />}
          />
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-slate-400" />

              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search title, slug, category, or author..."
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pr-4 pl-12 text-sm text-slate-900 transition outline-none placeholder:text-slate-400 focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <select
              value={selectedStatus}
              onChange={(event) => setSelectedStatus(event.target.value)}
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-700 transition outline-none focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100 lg:w-56"
            >
              <option value="all">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("")
                  setSelectedStatus("all")
                }}
                className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                Clear Filters
              </button>
            )}
          </div>
        </section>

        {filteredBlogs.length === 0 ? (
          <section className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
              <BookOpen className="size-7" />
            </div>

            <h2 className="mt-5 text-2xl font-black tracking-tight text-slate-950">
              No Blogs Found
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-600">
              No articles match your current search or status filter.
            </p>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("")
                  setSelectedStatus("all")
                }}
                className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-slate-950 px-5 text-sm font-bold text-white transition hover:bg-slate-800"
              >
                Reset Filters
              </button>
            )}
          </section>
        ) : (
          <>
            <section className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:block">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="border-b border-slate-200 bg-slate-50/80">
                    <tr>
                      <TableHeading>Article</TableHeading>
                      <TableHeading>Category</TableHeading>
                      <TableHeading>Author</TableHeading>
                      <TableHeading>Published</TableHeading>
                      <TableHeading>Status</TableHeading>
                      <TableHeading align="right">Actions</TableHeading>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {paginatedBlogs.map((blog) => (
                      <tr
                        key={blog.id}
                        className="group transition hover:bg-blue-50/30"
                      >
                        <td className="max-w-md px-5 py-5">
                          <p className="font-extrabold text-slate-950">
                            {blog.title}
                          </p>
                          <p className="mt-1 truncate font-mono text-xs text-slate-500">
                            /blogs/{blog.slug}
                          </p>
                        </td>

                        <td className="px-5 py-5">
                          <span className="inline-flex rounded-full bg-violet-50 px-3 py-1 text-xs font-bold text-violet-700 ring-1 ring-violet-200 ring-inset">
                            {blog.category}
                          </span>
                        </td>

                        <td className="px-5 py-5 text-sm font-medium text-slate-700">
                          {blog.author}
                        </td>

                        <td className="px-5 py-5 text-sm whitespace-nowrap text-slate-600">
                          {formatDate(blog.published_at)}
                        </td>

                        <td className="px-5 py-5">
                          <PublicationBadge isPublished={blog.is_published} />
                        </td>

                        <td className="px-5 py-5">
                          <BlogActions
                            blog={blog}
                            updatingId={updatingId}
                            deletingId={deletingId}
                            onPublishStatus={handlePublishStatus}
                            onDelete={handleDelete}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="grid gap-4 lg:hidden">
              {paginatedBlogs.map((blog) => (
                <article
                  key={blog.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <PublicationBadge isPublished={blog.is_published} />

                      <h2 className="mt-3 text-lg leading-7 font-black text-slate-950">
                        {blog.title}
                      </h2>

                      <p className="mt-1 truncate font-mono text-xs text-slate-500">
                        /blogs/{blog.slug}
                      </p>
                    </div>

                    <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                      <BookOpen className="size-5" />
                    </div>
                  </div>

                  <dl className="mt-5 grid grid-cols-2 gap-4 rounded-2xl bg-slate-50 p-4">
                    <div>
                      <dt className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                        Category
                      </dt>
                      <dd className="mt-1 text-sm font-bold text-slate-800">
                        {blog.category}
                      </dd>
                    </div>

                    <div>
                      <dt className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                        Author
                      </dt>
                      <dd className="mt-1 text-sm font-bold text-slate-800">
                        {blog.author}
                      </dd>
                    </div>

                    <div className="col-span-2">
                      <dt className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                        Published date
                      </dt>
                      <dd className="mt-1 text-sm font-bold text-slate-800">
                        {formatDate(blog.published_at)}
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-5 border-t border-slate-100 pt-4">
                    <BlogActions
                      blog={blog}
                      updatingId={updatingId}
                      deletingId={deletingId}
                      onPublishStatus={handlePublishStatus}
                      onDelete={handleDelete}
                      mobile
                    />
                  </div>
                </article>
              ))}
            </section>

            <Pagination
              currentPage={safeCurrentPage}
              totalPages={totalPages}
              startIndex={startIndex}
              pageSize={BLOGS_PER_PAGE}
              totalItems={filteredBlogs.length}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>
    </>
  )
}

type MetricCardProps = {
  label: string
  value: number
  description: string
  icon: React.ReactNode
}

function MetricCard({ label, value, description, icon }: MetricCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-black tracking-tight text-slate-950">
            {value}
          </p>
          <p className="mt-1 text-xs font-medium text-slate-500">
            {description}
          </p>
        </div>

        <div className="flex size-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
          {icon}
        </div>
      </div>
    </article>
  )
}

function TableHeading({
  children,
  align = "left",
}: {
  children: React.ReactNode
  align?: "left" | "right"
}) {
  return (
    <th
      className={`px-5 py-4 text-xs font-extrabold tracking-[0.14em] text-slate-500 uppercase ${
        align === "right" ? "text-right" : "text-left"
      }`}
    >
      {children}
    </th>
  )
}

function PublicationBadge({ isPublished }: { isPublished: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-extrabold ring-1 ring-inset ${
        isPublished
          ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
          : "bg-amber-50 text-amber-700 ring-amber-200"
      }`}
    >
      <span
        className={`size-1.5 rounded-full ${
          isPublished ? "bg-emerald-500" : "bg-amber-500"
        }`}
      />
      {isPublished ? "Published" : "Draft"}
    </span>
  )
}

type BlogActionsProps = {
  blog: AdminBlog
  updatingId: number | null
  deletingId: number | null
  onPublishStatus: (blog: AdminBlog) => Promise<void>
  onDelete: (blog: AdminBlog) => Promise<void>
  mobile?: boolean
}

function BlogActions({
  blog,
  updatingId,
  deletingId,
  onPublishStatus,
  onDelete,
  mobile = false,
}: BlogActionsProps) {
  const isUpdating = updatingId === blog.id
  const isDeleting = deletingId === blog.id

  return (
    <div className={`flex gap-2 ${mobile ? "flex-wrap" : "justify-end"}`}>
      <Link
        to={`/admin/blogs/${blog.id}/edit`}
        title="Edit article"
        aria-label={`Edit ${blog.title}`}
        className={actionButtonClassName}
      >
        <Pencil className="size-4" />
        {mobile && <span>Edit</span>}
      </Link>

      {blog.is_published && (
        <Link
          to={`/blogs/${blog.slug}`}
          target="_blank"
          rel="noreferrer"
          title="View public article"
          aria-label={`View ${blog.title}`}
          className={`${actionButtonClassName} border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100`}
        >
          <Eye className="size-4" />
          {mobile && <span>View</span>}
        </Link>
      )}

      <button
        type="button"
        disabled={isUpdating || isDeleting}
        onClick={() => {
          void onPublishStatus(blog)
        }}
        title={blog.is_published ? "Unpublish article" : "Publish article"}
        aria-label={
          blog.is_published
            ? `Unpublish ${blog.title}`
            : `Publish ${blog.title}`
        }
        className={`${actionButtonClassName} ${
          blog.is_published
            ? "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
            : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
        }`}
      >
        {blog.is_published ? (
          <Undo2 className="size-4" />
        ) : (
          <Globe2 className="size-4" />
        )}
        {mobile && <span>{blog.is_published ? "Unpublish" : "Publish"}</span>}
      </button>

      <button
        type="button"
        disabled={isUpdating || isDeleting}
        title="Delete article"
        aria-label={`Delete ${blog.title}`}
        onClick={() => {
          void onDelete(blog)
        }}
        className={`${actionButtonClassName} border-red-200 bg-red-50 text-red-700 hover:bg-red-100`}
      >
        <Trash2 className="size-4" />
        {mobile && <span>{isDeleting ? "Deleting..." : "Delete"}</span>}
      </button>
    </div>
  )
}

type PaginationProps = {
  currentPage: number
  totalPages: number
  startIndex: number
  pageSize: number
  totalItems: number
  onPageChange: React.Dispatch<React.SetStateAction<number>>
}

function Pagination({
  currentPage,
  totalPages,
  startIndex,
  pageSize,
  totalItems,
  onPageChange,
}: PaginationProps) {
  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-slate-600">
        Showing{" "}
        <span className="font-extrabold text-slate-950">{startIndex + 1}</span>{" "}
        to{" "}
        <span className="font-extrabold text-slate-950">
          {Math.min(startIndex + pageSize, totalItems)}
        </span>{" "}
        of <span className="font-extrabold text-slate-950">{totalItems}</span>{" "}
        articles
      </p>

      <div className="flex items-center justify-between gap-3 sm:justify-end">
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() => onPageChange((page) => page - 1)}
          className={paginationButtonClassName}
        >
          <ChevronLeft className="size-4" />
          Previous
        </button>

        <span className="text-sm font-bold whitespace-nowrap text-slate-700">
          Page {currentPage} of {totalPages}
        </span>

        <button
          type="button"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange((page) => page + 1)}
          className={paginationButtonClassName}
        >
          Next
          <ChevronRight className="size-4" />
        </button>
      </div>
    </section>
  )
}

function formatDate(value: string | null | undefined): string {
  if (!value) {
    return "Not scheduled"
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return "Invalid date"
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

const actionButtonClassName =
  "inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"

const paginationButtonClassName =
  "inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"

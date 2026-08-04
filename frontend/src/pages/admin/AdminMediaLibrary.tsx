import { useEffect, useMemo, useState, type ReactNode } from "react"
import axios from "axios"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Copy,
  Eye,
  FileImage,
  HardDrive,
  ImagePlus,
  LockKeyhole,
  Search,
  Sparkles,
  Trash2,
  X,
} from "lucide-react"
import { toast } from "sonner"

import {
  deleteAdminMedia,
  getAdminMedia,
  type AdminMediaItem,
} from "@/api/adminMediaApi"
import { uploadAdminImage } from "@/api/adminUploadsApi"
import ErrorState from "@/components/common/ErrorState"
import PageLoader from "@/components/common/PageLoader"
import SEO from "@/components/seo/SEO"

const itemsPerPage = 12

export default function AdminMediaLibrary() {
  const [mediaItems, setMediaItems] = useState<AdminMediaItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedExtension, setSelectedExtension] = useState("all")
  const [selectedUsage, setSelectedUsage] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)

  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const [deletingFilename, setDeletingFilename] = useState<string | null>(null)
  const [copiedFilename, setCopiedFilename] = useState<string | null>(null)
  const [previewItem, setPreviewItem] = useState<AdminMediaItem | null>(null)

  async function loadMedia() {
    try {
      setIsLoading(true)
      setHasError(false)

      setMediaItems(await getAdminMedia())
    } catch (error) {
      console.error(error)
      setHasError(true)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadMedia()
  }, [])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedExtension, selectedUsage])

  const availableExtensions = useMemo(
    () => Array.from(new Set(mediaItems.map((item) => item.extension))).sort(),
    [mediaItems]
  )

  const filteredItems = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase()

    return mediaItems.filter((item) => {
      const matchesSearch =
        !keyword ||
        item.filename.toLowerCase().includes(keyword) ||
        item.usage.some((usage) => usage.label.toLowerCase().includes(keyword))

      const matchesExtension =
        selectedExtension === "all" || item.extension === selectedExtension

      const matchesUsage =
        selectedUsage === "all" ||
        (selectedUsage === "used" && item.is_used) ||
        (selectedUsage === "unused" && !item.is_used)

      return matchesSearch && matchesExtension && matchesUsage
    })
  }, [mediaItems, searchTerm, selectedExtension, selectedUsage])

  const usedCount = useMemo(
    () => mediaItems.filter((item) => item.is_used).length,
    [mediaItems]
  )

  const unusedCount = mediaItems.length - usedCount

  const totalSize = useMemo(
    () => mediaItems.reduce((total, item) => total + item.size_bytes, 0),
    [mediaItems]
  )

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / itemsPerPage))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const startIndex = (safeCurrentPage - 1) * itemsPerPage

  const paginatedItems = filteredItems.slice(
    startIndex,
    startIndex + itemsPerPage
  )

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  async function handleUpload(file: File) {
    try {
      setIsUploading(true)

      await uploadAdminImage(file)
      toast.success("Image uploaded successfully.")

      await loadMedia()
    } catch (error) {
      console.error(error)

      if (axios.isAxiosError(error)) {
        const detail = error.response?.data?.detail

        toast.error(
          typeof detail === "string" ? detail : "Unable to upload the image."
        )
      } else {
        toast.error("Unable to upload the image.")
      }
    } finally {
      setIsUploading(false)
    }
  }

  async function handleCopy(item: AdminMediaItem) {
    try {
      await navigator.clipboard.writeText(item.file_url)

      setCopiedFilename(item.filename)
      toast.success("Media URL copied to clipboard.")

      window.setTimeout(() => {
        setCopiedFilename(null)
      }, 1800)
    } catch (error) {
      console.error(error)
      toast.error("Unable to copy the media URL.")
    }
  }

  async function handleDelete(item: AdminMediaItem) {
    if (item.is_used) {
      toast.error(
        "This media file is currently in use. Remove or replace its references first."
      )
      return
    }

    const confirmed = window.confirm(`Delete "${item.filename}" permanently?`)

    if (!confirmed) {
      return
    }

    try {
      setDeletingFilename(item.filename)

      await deleteAdminMedia(item.filename)

      setMediaItems((current) =>
        current.filter((media) => media.filename !== item.filename)
      )

      if (previewItem?.filename === item.filename) {
        setPreviewItem(null)
      }

      toast.success("Media file deleted successfully.")
    } catch (error) {
      console.error(error)

      if (axios.isAxiosError(error)) {
        const detail = error.response?.data?.detail

        toast.error(
          typeof detail === "string"
            ? detail
            : "Unable to delete the media file."
        )
      } else {
        toast.error("Unable to delete the media file.")
      }
    } finally {
      setDeletingFilename(null)
    }
  }

  function clearFilters() {
    setSearchTerm("")
    setSelectedExtension("all")
    setSelectedUsage("all")
  }

  const hasFilters =
    Boolean(searchTerm) ||
    selectedExtension !== "all" ||
    selectedUsage !== "all"

  if (isLoading) {
    return <PageLoader message="Loading media library..." />
  }

  if (hasError) {
    return (
      <ErrorState
        title="Unable to Load Media Library"
        message="The uploaded media files could not be loaded."
        onRetry={() => {
          void loadMedia()
        }}
      />
    )
  }

  return (
    <>
      <SEO
        title="Media Library | Cubicles Services Admin"
        description="Manage uploaded Cubicles Services media files."
      />

      <section className="space-y-6">
        <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 px-6 py-8 text-white shadow-xl sm:px-8">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.25),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(139,92,246,0.18),transparent_40%)]" />

          <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold tracking-[0.16em] text-blue-200 uppercase backdrop-blur">
                <Sparkles className="size-3.5" />
                Content Assets
              </div>

              <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
                Media Library
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                Upload, preview, search, reuse, copy, and safely remove website
                images from one organized workspace.
              </p>
            </div>

            <label
              className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg transition ${
                isUploading
                  ? "cursor-not-allowed opacity-60"
                  : "cursor-pointer hover:-translate-y-0.5 hover:bg-slate-100"
              }`}
            >
              <ImagePlus className="size-4" />
              {isUploading ? "Uploading..." : "Upload Image"}

              <input
                type="file"
                accept=".png,.jpg,.jpeg,.webp,.svg,.ico"
                disabled={isUploading}
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0]

                  if (file) {
                    void handleUpload(file)
                  }

                  event.target.value = ""
                }}
              />
            </label>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            label="Total Files"
            value={mediaItems.length}
            description="All uploaded assets"
            icon={<FileImage className="size-5" />}
          />

          <SummaryCard
            label="In Use"
            value={usedCount}
            description="Referenced by website content"
            icon={<LockKeyhole className="size-5" />}
            tone="warning"
          />

          <SummaryCard
            label="Unused"
            value={unusedCount}
            description="Available for safe cleanup"
            icon={<Trash2 className="size-5" />}
            tone="success"
          />

          <SummaryCard
            label="Total Size"
            value={formatFileSize(totalSize)}
            description="Combined storage usage"
            icon={<HardDrive className="size-5" />}
            tone="neutral"
          />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-950">
                Filter media assets
              </h2>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Search by filename or usage, then narrow results by file type
                and usage status.
              </p>
            </div>

            <p className="text-xs font-semibold text-slate-500">
              {filteredItems.length} result
              {filteredItems.length === 1 ? "" : "s"}
            </p>
          </div>

          <div className="mt-4 grid gap-3 2xl:grid-cols-[minmax(0,1fr)_220px_220px_auto]">
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search filename or usage..."
                className={inputClassName}
              />
            </div>

            <select
              value={selectedExtension}
              onChange={(event) => setSelectedExtension(event.target.value)}
              className={selectClassName}
            >
              <option value="all">All File Types</option>

              {availableExtensions.map((extension) => (
                <option key={extension} value={extension}>
                  {extension.toUpperCase()}
                </option>
              ))}
            </select>

            <select
              value={selectedUsage}
              onChange={(event) => setSelectedUsage(event.target.value)}
              className={selectClassName}
            >
              <option value="all">All Usage</option>
              <option value="used">In Use</option>
              <option value="unused">Unused</option>
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

        {filteredItems.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
              <FileImage className="size-7" />
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-950">
              No Media Found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
              {hasFilters
                ? "No media files match the selected filters."
                : "Upload your first image to begin building the media library."}
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
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {paginatedItems.map((item) => (
                <MediaCard
                  key={item.filename}
                  item={item}
                  copied={copiedFilename === item.filename}
                  deleting={deletingFilename === item.filename}
                  onPreview={() => setPreviewItem(item)}
                  onCopy={() => {
                    void handleCopy(item)
                  }}
                  onDelete={() => {
                    void handleDelete(item)
                  }}
                />
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
                  {Math.min(startIndex + itemsPerPage, filteredItems.length)}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-950">
                  {filteredItems.length}
                </span>{" "}
                files
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

      {previewItem && (
        <MediaPreviewModal
          item={previewItem}
          copied={copiedFilename === previewItem.filename}
          deleting={deletingFilename === previewItem.filename}
          onClose={() => setPreviewItem(null)}
          onCopy={() => {
            void handleCopy(previewItem)
          }}
          onDelete={() => {
            void handleDelete(previewItem)
          }}
        />
      )}
    </>
  )
}

function MediaCard({
  item,
  copied,
  deleting,
  onPreview,
  onCopy,
  onDelete,
}: {
  item: AdminMediaItem
  copied: boolean
  deleting: boolean
  onPreview: () => void
  onCopy: () => void
  onDelete: () => void
}) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <button
        type="button"
        onClick={onPreview}
        className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden bg-slate-100"
      >
        <img
          src={item.file_url}
          alt={item.filename}
          className="h-full w-full object-contain p-4 transition duration-300 group-hover:scale-[1.02]"
        />

        <UsageBadge isUsed={item.is_used} />

        <span className="absolute inset-0 flex items-center justify-center bg-slate-950/0 opacity-0 transition group-hover:bg-slate-950/20 group-hover:opacity-100">
          <span className="flex size-11 items-center justify-center rounded-xl bg-white text-slate-700 shadow-lg">
            <Eye className="size-5" />
          </span>
        </span>
      </button>

      <div className="p-4">
        <p className="truncate font-extrabold text-slate-950">
          {item.filename}
        </p>

        <div className="mt-2 flex items-center justify-between gap-3 text-xs text-slate-500">
          <span>{formatFileSize(item.size_bytes)}</span>
          <span>{formatDate(item.created_at)}</span>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 ring-inset">
            {item.extension.toUpperCase()}
          </span>

          <span className="text-xs font-semibold text-slate-500">
            {item.usage.length} reference
            {item.usage.length === 1 ? "" : "s"}
          </span>
        </div>

        {item.usage.length > 0 && (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3">
            <p className="text-xs font-extrabold text-amber-900">Used by</p>

            <ul className="mt-2 space-y-1 text-xs leading-5 text-amber-700">
              {item.usage.slice(0, 3).map((usage) => (
                <li
                  key={`${usage.type}-${usage.id}`}
                  className="truncate"
                  title={usage.label}
                >
                  {usage.label}
                </li>
              ))}

              {item.usage.length > 3 && (
                <li className="font-semibold">+{item.usage.length - 3} more</li>
              )}
            </ul>
          </div>
        )}

        <div className="mt-4 grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={onPreview}
            title="Preview image"
            className={secondaryActionClassName}
          >
            <Eye className="size-4" />
          </button>

          <button
            type="button"
            onClick={onCopy}
            title="Copy media URL"
            className="inline-flex h-10 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 text-blue-700 transition hover:bg-blue-100"
          >
            {copied ? (
              <Check className="size-4" />
            ) : (
              <Copy className="size-4" />
            )}
          </button>

          <button
            type="button"
            disabled={item.is_used || deleting}
            onClick={onDelete}
            title={
              item.is_used
                ? "This file is currently in use"
                : "Delete media file"
            }
            className={`inline-flex h-10 items-center justify-center rounded-xl border transition disabled:cursor-not-allowed ${
              item.is_used
                ? "border-slate-200 bg-slate-50 text-slate-400"
                : "border-red-200 bg-red-50 text-red-700 hover:bg-red-100 disabled:opacity-50"
            }`}
          >
            {item.is_used ? (
              <LockKeyhole className="size-4" />
            ) : (
              <Trash2 className="size-4" />
            )}
          </button>
        </div>
      </div>
    </article>
  )
}

function MediaPreviewModal({
  item,
  copied,
  deleting,
  onClose,
  onCopy,
  onDelete,
}: {
  item: AdminMediaItem
  copied: boolean
  deleting: boolean
  onClose: () => void
  onCopy: () => void
  onDelete: () => void
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Media preview"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
    >
      <div className="max-h-[92vh] w-full max-w-5xl overflow-auto rounded-3xl bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-slate-200 bg-white/95 px-5 py-4 backdrop-blur">
          <div className="min-w-0">
            <h2 className="truncate font-extrabold text-slate-950">
              {item.filename}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {formatFileSize(item.size_bytes)} · {item.extension.toUpperCase()}{" "}
              · {formatDate(item.created_at)}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close media preview"
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="flex min-h-[420px] items-center justify-center bg-slate-100 p-6">
          <img
            src={item.file_url}
            alt={item.filename}
            className="max-h-[65vh] max-w-full object-contain"
          />
        </div>

        <div className="space-y-4 border-t border-slate-200 px-5 py-5">
          <div className="flex flex-wrap items-center gap-3">
            <UsageBadge isUsed={item.is_used} />

            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 ring-inset">
              {item.usage.length} reference
              {item.usage.length === 1 ? "" : "s"}
            </span>
          </div>

          {item.usage.length > 0 && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <h3 className="font-extrabold text-amber-900">
                This file is currently in use
              </h3>

              <ul className="mt-3 grid gap-2 text-sm text-amber-800 sm:grid-cols-2">
                {item.usage.map((usage) => (
                  <li
                    key={`${usage.type}-${usage.id}`}
                    className="rounded-xl bg-white/60 px-3 py-2"
                  >
                    {usage.label}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-bold tracking-[0.12em] text-slate-500 uppercase">
              Media URL
            </p>

            <p className="mt-2 text-sm leading-6 break-all text-slate-700">
              {item.file_url}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            {!item.is_used && (
              <button
                type="button"
                disabled={deleting}
                onClick={onDelete}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Trash2 className="size-4" />
                {deleting ? "Deleting..." : "Delete File"}
              </button>
            )}

            <button
              type="button"
              onClick={onCopy}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              {copied ? (
                <Check className="size-4" />
              ) : (
                <Copy className="size-4" />
              )}
              {copied ? "Copied" : "Copy URL"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function UsageBadge({ isUsed }: { isUsed: boolean }) {
  return (
    <span
      className={`absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold shadow-sm ring-1 ring-inset ${
        isUsed
          ? "bg-amber-50 text-amber-700 ring-amber-200"
          : "bg-emerald-50 text-emerald-700 ring-emerald-200"
      }`}
    >
      <span
        className={`size-1.5 rounded-full ${
          isUsed ? "bg-amber-500" : "bg-emerald-500"
        }`}
      />
      {isUsed ? "In Use" : "Unused"}
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
  value: string | number
  description: string
  icon: ReactNode
  tone?: "default" | "warning" | "success" | "neutral"
}) {
  const toneClasses = {
    default: "bg-blue-50 text-blue-700",
    warning: "bg-amber-50 text-amber-700",
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

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

function formatFileSize(sizeBytes: number): string {
  if (sizeBytes < 1024) {
    return `${sizeBytes} B`
  }

  const kilobytes = sizeBytes / 1024

  if (kilobytes < 1024) {
    return `${kilobytes.toFixed(1)} KB`
  }

  return `${(kilobytes / 1024).toFixed(1)} MB`
}

const inputClassName =
  "h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pr-4 pl-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"

const selectClassName =
  "h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"

const paginationButtonClassName =
  "inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"

const secondaryActionClassName =
  "inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"

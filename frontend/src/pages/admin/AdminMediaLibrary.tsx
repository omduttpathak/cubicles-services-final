import { useEffect, useMemo, useState } from "react"
import axios from "axios"
import {
  Check,
  Copy,
  Eye,
  FileImage,
  ImagePlus,
  LockKeyhole,
  Search,
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
      toast.error("Unable to upload the image.")
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

  const usedCount = mediaItems.filter((item) => item.is_used).length
  const unusedCount = mediaItems.length - usedCount

  return (
    <>
      <SEO
        title="Media Library | Cubicles Services Admin"
        description="Manage uploaded Cubicles Services media files."
      />

      <section>
        <div className="flex flex-col gap-4 rounded-xl bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold tracking-wider text-blue-600 uppercase">
              Content Assets
            </p>

            <h1 className="mt-1 text-2xl font-bold text-slate-900">
              Media Library
            </h1>

            <p className="mt-1 text-sm text-slate-600">
              Upload, preview, reuse and safely remove website images.
            </p>
          </div>

          <label className="inline-flex cursor-pointer items-center justify-center rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700">
            <ImagePlus className="mr-2 h-4 w-4" />
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

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Files" value={mediaItems.length} />
          <StatCard label="In Use" value={usedCount} />
          <StatCard label="Unused" value={unusedCount} />
          <StatCard
            label="Total Size"
            value={formatFileSize(
              mediaItems.reduce((total, item) => total + item.size_bytes, 0)
            )}
          />
        </div>

        <div className="mt-4 flex flex-col gap-3 xl:flex-row xl:items-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search filename or usage..."
              className="w-full rounded-xl border border-slate-300 bg-white py-3 pr-4 pl-12 transition outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <select
            value={selectedExtension}
            onChange={(event) => setSelectedExtension(event.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-700 transition outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 xl:max-w-xs"
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
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-700 transition outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 xl:max-w-xs"
          >
            <option value="all">All Usage</option>
            <option value="used">In Use</option>
            <option value="unused">Unused</option>
          </select>

          {(searchTerm ||
            selectedExtension !== "all" ||
            selectedUsage !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm("")
                setSelectedExtension("all")
                setSelectedUsage("all")
              }}
              className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Clear Filters
            </button>
          )}
        </div>

        {filteredItems.length === 0 ? (
          <div className="mt-6 rounded-xl bg-white px-6 py-16 text-center shadow-sm">
            <FileImage className="mx-auto h-12 w-12 text-slate-400" />

            <h2 className="mt-5 text-2xl font-bold text-slate-900">
              No Media Found
            </h2>

            <p className="mt-3 text-slate-600">
              No media files match the selected filters.
            </p>
          </div>
        ) : (
          <>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {paginatedItems.map((item) => (
                <article
                  key={item.filename}
                  className="overflow-hidden rounded-xl bg-white shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() => setPreviewItem(item)}
                    className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden bg-slate-100"
                  >
                    <img
                      src={item.file_url}
                      alt={item.filename}
                      className="h-full w-full object-contain p-4"
                    />

                    <span
                      className={`absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-semibold ${
                        item.is_used
                          ? "bg-amber-100 text-amber-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {item.is_used ? "In Use" : "Unused"}
                    </span>
                  </button>

                  <div className="p-4">
                    <p className="truncate font-semibold text-slate-900">
                      {item.filename}
                    </p>

                    <div className="mt-2 flex items-center justify-between gap-3 text-xs text-slate-500">
                      <span>{formatFileSize(item.size_bytes)}</span>

                      <span>
                        {new Date(item.created_at).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    {item.usage.length > 0 && (
                      <div className="mt-3 rounded-lg bg-amber-50 p-3">
                        <p className="text-xs font-semibold text-amber-800">
                          Used by
                        </p>

                        <ul className="mt-1 space-y-1 text-xs text-amber-700">
                          {item.usage.slice(0, 3).map((usage) => (
                            <li key={`${usage.type}-${usage.id}`}>
                              {usage.label}
                            </li>
                          ))}

                          {item.usage.length > 3 && (
                            <li>+{item.usage.length - 3} more</li>
                          )}
                        </ul>
                      </div>
                    )}

                    <div className="mt-4 grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setPreviewItem(item)}
                        title="Preview image"
                        className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-3 py-2 text-slate-600 transition hover:bg-slate-50"
                      >
                        <Eye className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          void handleCopy(item)
                        }}
                        title="Copy media URL"
                        className="inline-flex items-center justify-center rounded-lg border border-blue-200 px-3 py-2 text-blue-600 transition hover:bg-blue-50"
                      >
                        {copiedFilename === item.filename ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>

                      <button
                        type="button"
                        disabled={
                          item.is_used || deletingFilename === item.filename
                        }
                        onClick={() => {
                          void handleDelete(item)
                        }}
                        title={
                          item.is_used
                            ? "This file is currently in use"
                            : "Delete media file"
                        }
                        className={`inline-flex items-center justify-center rounded-lg border px-3 py-2 transition disabled:cursor-not-allowed ${
                          item.is_used
                            ? "border-slate-200 text-slate-400"
                            : "border-red-200 text-red-600 hover:bg-red-50"
                        }`}
                      >
                        {item.is_used ? (
                          <LockKeyhole className="h-4 w-4" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-5 flex flex-col gap-4 rounded-xl bg-white px-5 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-600">
                Showing{" "}
                <span className="font-semibold text-slate-900">
                  {startIndex + 1}
                </span>{" "}
                to{" "}
                <span className="font-semibold text-slate-900">
                  {Math.min(startIndex + itemsPerPage, filteredItems.length)}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-900">
                  {filteredItems.length}
                </span>{" "}
                files
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

      {previewItem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Media preview"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 p-4"
        >
          <div className="max-h-[92vh] w-full max-w-5xl overflow-auto rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4">
              <div className="min-w-0">
                <h2 className="truncate font-bold text-slate-900">
                  {previewItem.filename}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {formatFileSize(previewItem.size_bytes)}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setPreviewItem(null)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 text-slate-600 transition hover:bg-slate-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex min-h-[420px] items-center justify-center bg-slate-100 p-6">
              <img
                src={previewItem.file_url}
                alt={previewItem.filename}
                className="max-h-[65vh] max-w-full object-contain"
              />
            </div>

            <div className="space-y-4 border-t border-slate-200 px-5 py-4">
              {previewItem.usage.length > 0 && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <h3 className="font-semibold text-amber-900">
                    This file is currently in use
                  </h3>

                  <ul className="mt-2 space-y-1 text-sm text-amber-800">
                    {previewItem.usage.map((usage) => (
                      <li key={`${usage.type}-${usage.id}`}>{usage.label}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm break-all text-slate-500">
                  {previewItem.file_url}
                </p>

                <button
                  type="button"
                  onClick={() => {
                    void handleCopy(previewItem)
                  }}
                  className="inline-flex shrink-0 items-center justify-center rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy URL
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
    </div>
  )
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

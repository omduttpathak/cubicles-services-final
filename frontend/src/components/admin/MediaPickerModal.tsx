import { useEffect, useMemo, useState } from "react"
import { Check, FileImage, Search, X } from "lucide-react"

import { getAdminMedia, type AdminMediaItem } from "@/api/adminMediaApi"
import ErrorState from "@/components/common/ErrorState"
import PageLoader from "@/components/common/PageLoader"
import { resolveMediaUrl } from "@/utils/mediaUrl"

type MediaPickerModalProps = {
  isOpen: boolean
  selectedUrl: string | null
  onSelect: (url: string) => void
  onClose: () => void
}

export default function MediaPickerModal({
  isOpen,
  selectedUrl,
  onSelect,
  onClose,
}: MediaPickerModalProps) {
  const [mediaItems, setMediaItems] = useState<AdminMediaItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedExtension, setSelectedExtension] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

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
    if (isOpen) {
      void loadMedia()
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) {
      setSearchTerm("")
      setSelectedExtension("all")
    }
  }, [isOpen])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
    }
  }, [isOpen, onClose])

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

      return matchesSearch && matchesExtension
    })
  }, [mediaItems, searchTerm, selectedExtension])

  if (!isOpen) {
    return null
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Choose image from media library"
      className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/75 p-4"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) {
          onClose()
        }
      }}
    >
      <div className="flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Choose From Media Library
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Select an existing image instead of uploading a duplicate.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close media picker"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 text-slate-600 transition hover:bg-slate-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col gap-3 border-b border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row sm:items-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search filename or usage..."
              autoFocus
              className="w-full rounded-xl border border-slate-300 bg-white py-3 pr-4 pl-12 transition outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <select
            value={selectedExtension}
            onChange={(event) => setSelectedExtension(event.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-700 transition outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:max-w-xs"
          >
            <option value="all">All File Types</option>

            {availableExtensions.map((extension) => (
              <option key={extension} value={extension}>
                {extension.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          {isLoading ? (
            <PageLoader message="Loading media library..." />
          ) : hasError ? (
            <ErrorState
              title="Unable to Load Media Library"
              message="The uploaded images could not be loaded."
              onRetry={() => {
                void loadMedia()
              }}
            />
          ) : filteredItems.length === 0 ? (
            <div className="py-16 text-center">
              <FileImage className="mx-auto h-12 w-12 text-slate-400" />

              <h3 className="mt-4 text-xl font-bold text-slate-900">
                No Images Found
              </h3>

              <p className="mt-2 text-slate-500">
                No media files match the selected filters.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredItems.map((item) => {
                const isSelected = item.file_url === selectedUrl

                return (
                  <button
                    key={item.filename}
                    type="button"
                    onClick={() => {
                      onSelect(item.file_url)
                      onClose()
                    }}
                    className={`overflow-hidden rounded-xl border bg-white text-left transition hover:-translate-y-0.5 hover:shadow-md ${
                      isSelected
                        ? "border-blue-500 ring-2 ring-blue-100"
                        : "border-slate-200"
                    }`}
                  >
                    <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-slate-100">
                      <img
                        src={resolveMediaUrl(item.file_url) ?? undefined}
                        alt={item.filename}
                        className="h-full w-full object-contain p-3"
                      />

                      {isSelected && (
                        <span className="absolute top-3 right-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white">
                          <Check className="h-4 w-4" />
                        </span>
                      )}

                      {item.is_used && (
                        <span className="absolute top-3 left-3 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
                          In Use
                        </span>
                      )}
                    </div>

                    <div className="p-3">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {item.filename}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {formatFileSize(item.size_bytes)}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <div className="border-t border-slate-200 px-5 py-4 text-sm text-slate-500">
          {filteredItems.length} image{filteredItems.length === 1 ? "" : "s"}{" "}
          available
        </div>
      </div>
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

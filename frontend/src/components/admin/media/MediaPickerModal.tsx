import { useCallback, useEffect, useMemo, useState } from "react"
import { FileImage, LoaderCircle, X } from "lucide-react"

import { getAdminMedia, type AdminMediaItem } from "@/api/adminMediaApi"
import MediaGrid from "@/components/admin/media/MediaGrid"
import MediaSearch from "@/components/admin/media/MediaSearch"

type MediaPickerModalProps = {
  isOpen: boolean
  selectedUrl?: string | null
  title?: string
  description?: string
  onSelect: (item: AdminMediaItem) => void
  onClose: () => void
}

export default function MediaPickerModal({
  isOpen,
  selectedUrl = null,
  title = "Choose From Media Library",
  description = "Select an existing image from your media library.",
  onSelect,
  onClose,
}: MediaPickerModalProps) {
  const [mediaItems, setMediaItems] = useState<AdminMediaItem[]>([])
  const [selectedItem, setSelectedItem] = useState<AdminMediaItem | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedExtension, setSelectedExtension] = useState("all")
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)

  const loadMedia = useCallback(async () => {
    try {
      setIsLoading(true)
      setHasError(false)

      const response = await getAdminMedia()

      setMediaItems(response)

      const currentSelection =
        response.find((item) => item.file_url === selectedUrl) ?? null

      setSelectedItem(currentSelection)
    } catch (error) {
      console.error(error)
      setHasError(true)
    } finally {
      setIsLoading(false)
    }
  }, [selectedUrl])

  useEffect(() => {
    if (isOpen) {
      void loadMedia()
    }
  }, [isOpen, loadMedia])
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm("")
      setSelectedExtension("all")
      setSelectedItem(null)
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
      aria-label={title}
      className="fixed inset-0 z-[130] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) {
          onClose()
        }
      }}
    >
      <div className="flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        <header className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-5 sm:px-6">
          <div>
            <h2 className="text-xl font-extrabold text-slate-950">{title}</h2>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              {description}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close media picker"
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
          >
            <X className="size-5" />
          </button>
        </header>

        <div className="grid gap-3 border-b border-slate-200 bg-slate-50 px-5 py-4 sm:grid-cols-[minmax(0,1fr)_220px] sm:px-6">
          <MediaSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />

          <select
            value={selectedExtension}
            onChange={(event) => setSelectedExtension(event.target.value)}
            className="h-12 rounded-xl border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 transition outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          >
            <option value="all">All File Types</option>

            {availableExtensions.map((extension) => (
              <option key={extension} value={extension}>
                {extension.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6">
          {isLoading ? (
            <div className="flex min-h-80 flex-col items-center justify-center">
              <LoaderCircle className="size-9 animate-spin text-blue-600" />

              <p className="mt-4 text-sm font-semibold text-slate-600">
                Loading media library...
              </p>
            </div>
          ) : hasError ? (
            <div className="flex min-h-80 flex-col items-center justify-center text-center">
              <FileImage className="size-12 text-slate-400" />

              <h3 className="mt-4 text-xl font-bold text-slate-950">
                Unable to Load Media
              </h3>

              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                The media library could not be loaded. Please try again.
              </p>

              <button
                type="button"
                onClick={() => {
                  void loadMedia()
                }}
                className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Try Again
              </button>
            </div>
          ) : (
            <MediaGrid
              items={filteredItems}
              selected={selectedItem}
              onSelect={setSelectedItem}
            />
          )}
        </div>

        <footer className="flex flex-col gap-3 border-t border-slate-200 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-sm text-slate-500">
            {filteredItems.length} image
            {filteredItems.length === 1 ? "" : "s"} available
          </p>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={!selectedItem}
              onClick={() => {
                if (!selectedItem) {
                  return
                }

                onSelect(selectedItem)
                onClose()
              }}
              className="inline-flex h-11 items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Select Image
            </button>
          </div>
        </footer>
      </div>
    </div>
  )
}

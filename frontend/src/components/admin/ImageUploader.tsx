import { useRef, useState, type ChangeEvent } from "react"
import axios from "axios"
import { ImageUp, Images, LoaderCircle, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { uploadAdminImage } from "@/api/adminUploadsApi"
import MediaPickerModal from "@/components/admin/MediaPickerModal"
import { resolveMediaUrl } from "@/utils/mediaUrl"

type ImageUploaderProps = {
  label: string
  value: string | null
  onChange: (value: string | null) => void
  accept?: string
  helpText?: string
  compactPreview?: boolean
  disabled?: boolean
}

export default function ImageUploader({
  label,
  value,
  onChange,
  accept = ".png,.jpg,.jpeg,.webp,.svg,.ico",
  helpText = "Select an image up to 5 MB.",
  compactPreview = false,
  disabled = false,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const [isUploading, setIsUploading] = useState(false)

  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false)

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    event.target.value = ""

    if (!file) {
      return
    }

    try {
      setIsUploading(true)

      const uploaded = await uploadAdminImage(file)

      onChange(uploaded.file_url)

      toast.success(`${label} uploaded successfully.`)
    } catch (error) {
      console.error(error)

      if (axios.isAxiosError(error)) {
        const detail = error.response?.data?.detail

        toast.error(
          typeof detail === "string"
            ? detail
            : `Unable to upload ${label.toLowerCase()}.`
        )
      } else {
        toast.error(`Unable to upload ${label.toLowerCase()}.`)
      }
    } finally {
      setIsUploading(false)
    }
  }

  const isDisabled = disabled || isUploading

  return (
    <div>
      <p className="mb-2 block font-medium text-slate-700">{label}</p>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        disabled={isDisabled}
        onChange={(event) => {
          void handleFileChange(event)
        }}
        className="hidden"
      />

      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
        {value ? (
          <div className="space-y-4">
            <div
              className={`flex items-center justify-center rounded-lg border border-slate-200 bg-white p-4 ${
                compactPreview ? "min-h-20" : "min-h-32"
              }`}
            >
              <img
                src={resolveMediaUrl(value) ?? undefined}
                alt={`${label} preview`}
                className={
                  compactPreview
                    ? "max-h-12 max-w-full object-contain"
                    : "max-h-24 max-w-full object-contain"
                }
              />
            </div>

            <p className="text-xs leading-5 break-all text-slate-500">
              {value}
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                disabled={isDisabled}
                onClick={() => inputRef.current?.click()}
                className="inline-flex items-center justify-center rounded-lg border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isUploading ? (
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <ImageUp className="mr-2 h-4 w-4" />
                )}
                Upload Replacement
              </button>

              <button
                type="button"
                disabled={isDisabled}
                onClick={() => setIsMediaPickerOpen(true)}
                className="inline-flex items-center justify-center rounded-lg border border-violet-200 bg-white px-4 py-2 text-sm font-semibold text-violet-700 transition hover:bg-violet-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Images className="mr-2 h-4 w-4" />
                Choose Existing
              </button>

              <button
                type="button"
                disabled={isDisabled}
                onClick={() => onChange(null)}
                className="inline-flex items-center justify-center rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Remove
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              disabled={isDisabled}
              onClick={() => inputRef.current?.click()}
              className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-8 text-center transition hover:border-blue-300 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isUploading ? (
                <LoaderCircle className="h-8 w-8 animate-spin text-blue-600" />
              ) : (
                <ImageUp className="h-8 w-8 text-blue-600" />
              )}

              <span className="mt-3 font-semibold text-slate-900">
                {isUploading ? "Uploading..." : "Upload New Image"}
              </span>

              <span className="mt-1 text-sm text-slate-500">{helpText}</span>
            </button>

            <button
              type="button"
              disabled={isDisabled}
              onClick={() => setIsMediaPickerOpen(true)}
              className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-8 text-center transition hover:border-violet-300 hover:bg-violet-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Images className="h-8 w-8 text-violet-600" />

              <span className="mt-3 font-semibold text-slate-900">
                Choose Existing Image
              </span>

              <span className="mt-1 text-sm text-slate-500">
                Reuse an image from the Media Library.
              </span>
            </button>
          </div>
        )}
      </div>

      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        selectedUrl={value}
        onSelect={(url) => {
          onChange(url)

          toast.success(`${label} selected from Media Library.`)
        }}
        onClose={() => setIsMediaPickerOpen(false)}
      />
    </div>
  )
}

import { Check, LockKeyhole } from "lucide-react"

import type { AdminMediaItem } from "@/api/adminMediaApi"
import { resolveMediaUrl } from "@/utils/mediaUrl"

type MediaCardProps = {
  item: AdminMediaItem
  isSelected?: boolean
  onSelect: (item: AdminMediaItem) => void
}

export default function MediaCard({
  item,
  isSelected = false,
  onSelect,
}: MediaCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(item)}
      aria-label={`Select ${item.filename}`}
      aria-pressed={isSelected}
      className={`group overflow-hidden rounded-2xl border bg-white text-left transition hover:-translate-y-0.5 hover:shadow-lg ${
        isSelected ? "border-blue-500 ring-2 ring-blue-100" : "border-slate-200"
      }`}
    >
      <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-slate-100">
        <img
          src={resolveMediaUrl(item.file_url) ?? undefined}
          alt={item.filename}
          className="h-full w-full object-contain p-4 transition duration-300 group-hover:scale-[1.03]"
        />

        {isSelected && (
          <span className="absolute top-3 right-3 inline-flex size-9 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg">
            <Check className="size-4" />
          </span>
        )}

        {item.is_used && (
          <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 shadow-sm ring-1 ring-amber-200 ring-inset">
            <LockKeyhole className="size-3" />
            In Use
          </span>
        )}
      </div>

      <div className="p-4">
        <p className="truncate font-bold text-slate-950" title={item.filename}>
          {item.filename}
        </p>

        <div className="mt-2 flex items-center justify-between gap-3 text-xs text-slate-500">
          <span>{formatFileSize(item.size_bytes)}</span>

          <span className="rounded-full bg-slate-100 px-2.5 py-1 font-semibold text-slate-700 ring-1 ring-slate-200 ring-inset">
            {item.extension.toUpperCase()}
          </span>
        </div>

        <p className="mt-3 text-xs text-slate-500">
          {item.usage.length} reference
          {item.usage.length === 1 ? "" : "s"}
        </p>
      </div>
    </button>
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

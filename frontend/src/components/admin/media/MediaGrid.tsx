import type { AdminMediaItem } from "@/api/adminMediaApi"

import MediaCard from "./MediaCard"

type MediaGridProps = {
  items: AdminMediaItem[]
  selected?: AdminMediaItem | null
  onSelect: (item: AdminMediaItem) => void
}

export default function MediaGrid({
  items,
  selected,
  onSelect,
}: MediaGridProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center">
        <p className="text-lg font-semibold text-slate-700">No media found</p>

        <p className="mt-2 text-sm text-slate-500">
          Upload an image or adjust your search filters.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <MediaCard
          key={item.filename}
          item={item}
          isSelected={selected?.filename === item.filename}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}

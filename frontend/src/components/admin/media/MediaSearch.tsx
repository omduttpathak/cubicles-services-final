import { Search, X } from "lucide-react"

type MediaSearchProps = {
  searchTerm: string
  onSearchChange: (value: string) => void
}

export default function MediaSearch({
  searchTerm,
  onSearchChange,
}: MediaSearchProps) {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-slate-400" />

      <input
        type="text"
        value={searchTerm}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search images..."
        className="h-12 w-full rounded-xl border border-slate-300 bg-white pr-11 pl-11 text-sm transition outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
      />

      {searchTerm && (
        <button
          type="button"
          onClick={() => onSearchChange("")}
          className="absolute top-1/2 right-3 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100"
          aria-label="Clear search"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  )
}

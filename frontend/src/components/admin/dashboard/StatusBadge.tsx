export default function StatusBadge({ isPublished }: { isPublished: boolean }) {
  return (
    <span
      className={[
        "shrink-0 rounded-full border px-2.5 py-1 text-xs font-bold",
        isPublished
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-amber-200 bg-amber-50 text-amber-700",
      ].join(" ")}
    >
      {isPublished ? "Published" : "Draft"}
    </span>
  )
}

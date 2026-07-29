export default function DateValue({ value }: { value: string }) {
  return (
    <p className="shrink-0 text-xs font-medium text-slate-400">
      {new Date(value).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })}
    </p>
  )
}

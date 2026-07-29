type ProgressItem = {
  label: string
  value: number
  total: number
}

export default function ProgressCard({ items }: { items: ProgressItem[] }) {
  return (
    <div className="space-y-6 p-5 sm:p-6">
      {items.map((item) => {
        const percentage =
          item.total > 0 ? Math.round((item.value / item.total) * 100) : 0

        return (
          <div key={item.label}>
            <div className="flex items-center justify-between gap-4 text-sm">
              <span className="font-semibold text-slate-700">{item.label}</span>
              <span className="font-bold text-slate-950">
                {item.value} / {item.total}
              </span>
            </div>

            <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-600 to-violet-600 transition-all duration-700"
                style={{ width: `${percentage}%` }}
              />
            </div>

            <p className="mt-2 text-xs font-medium text-slate-400">
              {percentage}% of total
            </p>
          </div>
        )
      })}
    </div>
  )
}

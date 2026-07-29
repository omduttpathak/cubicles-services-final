import type { ReactNode } from "react"

export function ActivityList({ children }: { children: ReactNode }) {
  return <div className="divide-y divide-slate-100">{children}</div>
}

type ActivityItemProps = {
  title: string
  meta: string
  badge?: ReactNode
  date: ReactNode
  onClick: () => void
}

export function ActivityItem({
  title,
  meta,
  badge,
  date,
  onClick,
}: ActivityItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-slate-50/80 sm:px-6"
    >
      <div className="min-w-0">
        <div className="flex min-w-0 items-center gap-3">
          <p className="truncate font-semibold text-slate-900 transition group-hover:text-blue-700">
            {title}
          </p>
          {badge}
        </div>

        <p className="mt-1 truncate text-sm text-slate-500">{meta}</p>
      </div>

      {date}
    </button>
  )
}

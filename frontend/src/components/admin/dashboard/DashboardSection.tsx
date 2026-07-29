import { ArrowRight } from "lucide-react"
import type { ReactNode } from "react"

type DashboardSectionProps = {
  title: string
  description: string
  onViewAll: () => void
  children: ReactNode
}

export default function DashboardSection({
  title,
  description,
  onViewAll,
  children,
}: DashboardSectionProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_12px_34px_rgb(15_23_42/0.05)]">
      <div className="flex items-start justify-between gap-4 border-b border-slate-200/80 px-5 py-5 sm:items-center sm:px-6">
        <div>
          <h2 className="text-lg font-extrabold tracking-[-0.02em] text-slate-950">
            {title}
          </h2>
          <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
        </div>

        <button
          type="button"
          onClick={onViewAll}
          className="group inline-flex shrink-0 items-center rounded-xl px-3 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 hover:text-blue-700"
        >
          View all
          <ArrowRight className="ml-2 size-4 transition group-hover:translate-x-0.5" />
        </button>
      </div>

      {children}
    </section>
  )
}

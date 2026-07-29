import { ArrowUpRight } from "lucide-react"
import type { ReactNode } from "react"

type KPICardProps = {
  label: string
  value: number
  helper: string
  icon: ReactNode
  iconClassName: string
  onClick: () => void
}

export default function KPICard({
  label,
  value,
  helper,
  icon,
  iconClassName,
  onClick,
}: KPICardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 text-left shadow-[0_12px_34px_rgb(15_23_42/0.06)] transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_22px_50px_rgb(15_23_42/0.10)]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/60 to-transparent opacity-0 transition group-hover:opacity-100"
      />

      <div className="flex items-start justify-between gap-4">
        <div
          className={`flex size-12 shrink-0 items-center justify-center rounded-2xl ${iconClassName}`}
        >
          {icon}
        </div>

        <span className="flex size-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-400 transition group-hover:border-blue-200 group-hover:bg-blue-50 group-hover:text-blue-600">
          <ArrowUpRight className="size-4" />
        </span>
      </div>

      <p className="mt-5 text-sm font-semibold text-slate-500">{label}</p>
      <p className="mt-1 text-3xl font-extrabold tracking-[-0.04em] text-slate-950">
        {value}
      </p>
      <p className="mt-2 truncate text-xs leading-5 text-slate-500">{helper}</p>
    </button>
  )
}

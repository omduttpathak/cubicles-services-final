import type { ReactNode } from "react"

type EmptyStateProps = {
  icon: ReactNode
  title: string
  message: string
}

export default function EmptyState({ icon, title, message }: EmptyStateProps) {
  return (
    <div className="px-6 py-14 text-center">
      <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-400">
        {icon}
      </div>
      <h3 className="mt-5 text-lg font-bold text-slate-950">{title}</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
        {message}
      </p>
    </div>
  )
}

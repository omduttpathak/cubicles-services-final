import { Save } from "lucide-react"
import type { ReactNode } from "react"

type StickyActionPanelProps = {
  title: string
  description: string
  submitLabel: string
  submittingLabel: string
  isSubmitting: boolean
  onSubmit: () => void
  secondaryAction?: ReactNode
}

export default function StickyActionPanel({
  title,
  description,
  submitLabel,
  submittingLabel,
  isSubmitting,
  onSubmit,
  secondaryAction,
}: StickyActionPanelProps) {
  return (
    <aside className="space-y-4 xl:sticky xl:top-28">
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_12px_34px_rgb(15_23_42/0.05)]">
        <h2 className="text-lg font-extrabold tracking-[-0.02em] text-slate-950">
          {title}
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>

        <button
          type="button"
          disabled={isSubmitting}
          onClick={onSubmit}
          className="mt-5 inline-flex h-12 w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 text-sm font-bold text-white shadow-[0_14px_30px_rgb(37_99_235/0.22)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgb(37_99_235/0.28)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save className="mr-2 size-4" />
          {isSubmitting ? submittingLabel : submitLabel}
        </button>

        {secondaryAction ? (
          <div className="mt-3">{secondaryAction}</div>
        ) : null}
      </div>
    </aside>
  )
}

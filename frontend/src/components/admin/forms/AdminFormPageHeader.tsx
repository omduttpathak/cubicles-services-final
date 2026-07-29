import { ArrowLeft, Save, Sparkles } from "lucide-react"

type AdminFormPageHeaderProps = {
  eyebrow: string
  title: string
  description: string
  backLabel: string
  onBack: () => void
  submitLabel: string
  submittingLabel: string
  isSubmitting: boolean
  onSubmit: () => void
}

export default function AdminFormPageHeader({
  eyebrow,
  title,
  description,
  backLabel,
  onBack,
  submitLabel,
  submittingLabel,
  isSubmitting,
  onSubmit,
}: AdminFormPageHeaderProps) {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-950 px-6 py-8 shadow-[0_24px_80px_rgb(15_23_42/0.18)] sm:px-8 lg:px-10 lg:py-10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.24),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(124,58,237,0.22),transparent_38%)]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.12) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      <div className="relative">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center text-sm font-semibold text-slate-300 transition hover:text-white"
        >
          <ArrowLeft className="mr-2 size-4" />
          {backLabel}
        </button>

        <div className="mt-6 flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-blue-200">
              <Sparkles className="size-4" />
              {eyebrow}
            </div>

            <h1 className="mt-5 text-3xl font-extrabold tracking-[-0.04em] text-white sm:text-4xl">
              {title}
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              {description}
            </p>
          </div>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={onSubmit}
            className="inline-flex h-12 items-center justify-center rounded-xl border border-white bg-white px-5 text-sm font-bold text-slate-950 shadow-lg transition duration-300 hover:-translate-y-0.5 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save className="mr-2 size-4" />
            {isSubmitting ? submittingLabel : submitLabel}
          </button>
        </div>
      </div>
    </section>
  )
}

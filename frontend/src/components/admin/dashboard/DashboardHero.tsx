import { Plus, Sparkles } from "lucide-react"

type QuickAction = {
  label: string
  onClick: () => void
}

type DashboardHeroProps = {
  title: string
  description: string
  actions: QuickAction[]
}

export default function DashboardHero({
  title,
  description,
  actions,
}: DashboardHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-950 px-6 py-8 shadow-[0_24px_80px_rgb(15_23_42/0.18)] sm:px-8 lg:px-10 lg:py-10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.24),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(124,58,237,0.20),transparent_38%)]"
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

      <div className="relative flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-xs font-bold tracking-[0.16em] text-blue-200 uppercase">
            <Sparkles className="size-4" />
            Administration overview
          </div>

          <h2 className="mt-5 text-3xl font-extrabold tracking-[-0.04em] text-white sm:text-4xl">
            {title}
          </h2>

          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            {description}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {actions.map((action, index) => (
            <button
              key={action.label}
              type="button"
              onClick={action.onClick}
              className={[
                "inline-flex h-11 items-center justify-center rounded-xl border px-4 text-sm font-semibold shadow-sm transition duration-300",
                index === 0
                  ? "border-white bg-white text-slate-950 hover:-translate-y-0.5 hover:bg-slate-100"
                  : "border-white/15 bg-white/10 text-white backdrop-blur-xl hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/15",
              ].join(" ")}
            >
              <Plus className="mr-2 size-4" />
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

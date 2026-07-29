import type { ReactNode } from "react"

type FormCardProps = {
  title: string
  description?: string
  action?: ReactNode
  children: ReactNode
}

export default function FormCard({
  title,
  description,
  action,
  children,
}: FormCardProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_12px_34px_rgb(15_23_42/0.05)]">
      <div className="flex flex-col gap-4 border-b border-slate-200/80 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <h2 className="text-lg font-extrabold tracking-[-0.02em] text-slate-950">
            {title}
          </h2>

          {description ? (
            <p className="mt-1 text-sm leading-6 text-slate-500">
              {description}
            </p>
          ) : null}
        </div>

        {action}
      </div>

      <div className="p-5 sm:p-6">{children}</div>
    </section>
  )
}

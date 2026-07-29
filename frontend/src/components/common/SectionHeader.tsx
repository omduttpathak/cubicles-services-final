import { cn } from "@/lib/utils"

type SectionHeaderProps = {
  badge?: string
  eyebrow?: string
  title: string
  description: string
  center?: boolean
  className?: string
}

export default function SectionHeader({
  badge,
  eyebrow,
  title,
  description,
  center = true,
  className,
}: SectionHeaderProps) {
  const label = badge ?? eyebrow

  return (
    <div
      className={cn(
        "mb-14 max-w-3xl",
        center && "mx-auto text-center",
        className
      )}
    >
      {label && (
        <span className="font-semibold tracking-wider text-blue-600 uppercase">
          {label}
        </span>
      )}

      <h2 className="mt-3 text-4xl font-bold text-slate-900">{title}</h2>

      <p className="mt-5 text-lg leading-8 text-slate-600">{description}</p>
    </div>
  )
}

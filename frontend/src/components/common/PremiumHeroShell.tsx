import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

type PremiumHeroShellProps = {
  children: ReactNode
  className?: string
  contentClassName?: string
}

export default function PremiumHeroShell({
  children,
  className,
  contentClassName,
}: PremiumHeroShellProps) {
  return (
    <section
      className={cn(
        "section-dark noise-overlay relative isolate overflow-hidden",
        className
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="animate-pulse-soft absolute -top-40 -left-32 h-[34rem] w-[34rem] rounded-full bg-blue-500/20 blur-[120px]" />

        <div className="animate-pulse-soft absolute top-10 -right-40 h-[38rem] w-[38rem] rounded-full bg-violet-500/20 blur-[130px]" />

        <div className="absolute right-[24%] -bottom-64 h-[30rem] w-[30rem] rounded-full bg-cyan-400/10 blur-[120px]" />

        <div className="absolute top-1/2 left-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/8 blur-[130px]" />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.17]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.055) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage:
            "linear-gradient(to bottom, rgba(0,0,0,0.85), transparent 92%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, rgba(0,0,0,0.85), transparent 92%)",
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-300/60 to-transparent"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-950/40 to-transparent"
      />

      <div
        className={cn("relative z-10 container mx-auto px-6", contentClassName)}
      >
        {children}
      </div>
    </section>
  )
}

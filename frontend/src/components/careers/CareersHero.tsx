import { motion } from "framer-motion"
import { BriefcaseBusiness, CheckCircle2, Sparkles, Users } from "lucide-react"

type CareersHeroProps = {
  eyebrow: string
  title: string
  description: string
}

const highlights = [
  {
    icon: Users,
    label: "Collaborative teams",
  },
  {
    icon: BriefcaseBusiness,
    label: "Meaningful projects",
  },
  {
    icon: CheckCircle2,
    label: "Continuous growth",
  },
]

export default function CareersHero({
  eyebrow,
  title,
  description,
}: CareersHeroProps) {
  return (
    <section className="relative overflow-hidden bg-slate-950 py-24 text-white sm:py-28 lg:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-56 -left-56 size-[38rem] rounded-full bg-blue-500/15 blur-[170px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-56 bottom-0 size-[38rem] rounded-full bg-violet-500/15 blur-[170px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 size-[24rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/5 blur-[140px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)",
          backgroundSize: "76px 76px",
          maskImage:
            "linear-gradient(to bottom, transparent, black 14%, black 86%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, black 14%, black 86%, transparent)",
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent"
      />

      <div className="relative container mx-auto px-6">
        <motion.div
          initial={{
            opacity: 0,
            y: 24,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.65,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mx-auto max-w-5xl text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-300 backdrop-blur-sm">
            <Sparkles className="size-4" />
            {eyebrow}
          </div>

          <h1 className="mx-auto mt-8 max-w-5xl text-5xl leading-[1.08] font-extrabold tracking-[-0.04em] sm:text-6xl lg:text-7xl">
            {title}
          </h1>

          <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-slate-300 sm:text-xl">
            {description}
          </p>

          <motion.div
            initial={{
              opacity: 0,
              y: 18,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.2,
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-12 flex flex-wrap items-center justify-center gap-3"
          >
            {highlights.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2.5 text-sm font-medium text-slate-200 backdrop-blur-sm"
              >
                <Icon className="size-4 text-blue-400" />
                {label}
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

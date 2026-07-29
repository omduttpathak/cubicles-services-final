import { motion } from "framer-motion"
import { ArrowRight, Code2, Cpu, Layers3, Sparkles } from "lucide-react"

type TechnologiesHeroProps = {
  badge: string
  title: string
  description: string
}

const technologies = [
  "AWS",
  "Azure",
  "Docker",
  "Kubernetes",
  "Terraform",
  "React",
  "TypeScript",
  "Python",
]

export default function TechnologiesHero({
  badge,
  title,
  description,
}: TechnologiesHeroProps) {
  return (
    <section className="relative overflow-hidden bg-white py-24 sm:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-56 -left-56 size-[38rem] rounded-full bg-blue-100/70 blur-[160px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-56 bottom-0 size-[38rem] rounded-full bg-violet-100/60 blur-[170px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(148,163,184,.14) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,.14) 1px, transparent 1px)",
          backgroundSize: "76px 76px",
          maskImage:
            "linear-gradient(to bottom, transparent, black 14%, black 86%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, black 14%, black 86%, transparent)",
        }}
      />

      <div className="relative container mx-auto px-6">
        <div className="grid items-center gap-16 lg:grid-cols-[1.15fr_0.85fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
              <Sparkles className="size-4" />
              {badge}
            </div>

            <h1 className="mt-7 text-5xl leading-tight font-extrabold tracking-[-0.04em] text-slate-950 lg:text-6xl">
              {title}
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600">
              {description}
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              {technologies.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-blue-200 hover:text-blue-700"
                >
                  {item}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.15,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative"
          >
            <div className="rounded-[2rem] border border-slate-200 bg-slate-950 p-8 shadow-[0_30px_90px_rgb(15_23_42/0.18)]">
              <div className="flex items-center justify-between">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-300">
                  <Cpu className="size-7" />
                </div>

                <Layers3 className="size-7 text-slate-600" />
              </div>

              <h3 className="mt-8 text-3xl font-bold text-white">
                Modern Technology Stack
              </h3>

              <p className="mt-4 leading-7 text-slate-300">
                We combine cloud platforms, DevOps automation, modern
                application frameworks, containers, and infrastructure as code
                to build secure and scalable enterprise solutions.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  "Cloud Platforms",
                  "Application Engineering",
                  "DevOps Automation",
                  "Security & Operations",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.05] px-5 py-4"
                  >
                    <div className="flex items-center gap-3">
                      <Code2 className="size-5 text-blue-300" />
                      <span className="font-medium text-white">{item}</span>
                    </div>

                    <ArrowRight className="size-4 text-blue-300" />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

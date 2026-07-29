import { motion } from "framer-motion"
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  CloudCog,
  Code2,
  Compass,
  Rocket,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react"

import type { ServicesPageSettings } from "@/api/servicesPageApi"
import { processSteps } from "@/data/process"

type ProcessSectionProps = {
  settings: ServicesPageSettings
}

const stepIcons = [
  Search,
  Compass,
  CloudCog,
  Code2,
  ShieldCheck,
  Rocket,
  ClipboardCheck,
]

const containerAnimation = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
}

const stepAnimation = {
  hidden: {
    opacity: 0,
    y: 28,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
}

export default function ProcessSection({ settings }: ProcessSectionProps) {
  return (
    <section className="relative overflow-hidden bg-white py-24 sm:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-52 -left-52 size-[36rem] rounded-full bg-blue-100/60 blur-[150px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-56 bottom-0 size-[38rem] rounded-full bg-cyan-100/50 blur-[160px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(148,163,184,0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.14) 1px, transparent 1px)",
          backgroundSize: "78px 78px",
          maskImage:
            "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
        }}
      />

      <div className="relative container mx-auto max-w-7xl px-6">
        <motion.div
          initial={{
            opacity: 0,
            y: 24,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.25,
          }}
          transition={{
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
            <Sparkles className="size-4" />
            {settings.process_eyebrow}
          </div>

          <h2 className="mt-6 text-4xl leading-tight font-extrabold tracking-[-0.035em] text-slate-950 sm:text-5xl">
            {settings.process_title}
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            {settings.process_description}
          </p>
        </motion.div>

        <motion.div
          variants={containerAnimation}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.08,
          }}
          className="relative mt-16"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-14 right-[8%] left-[8%] hidden h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent lg:block"
          />

          <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {processSteps.map((item, index) => {
              const Icon = stepIcons[index % stepIcons.length] ?? ClipboardCheck

              return (
                <motion.article
                  key={item.step}
                  variants={stepAnimation}
                  className="group relative overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white p-7 shadow-sm transition duration-500 hover:-translate-y-2 hover:border-blue-200 hover:shadow-[0_25px_70px_rgb(15_23_42/0.12)] sm:p-8"
                >
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-20 -right-16 size-44 rounded-full bg-blue-100/70 opacity-0 blur-3xl transition duration-500 group-hover:opacity-100"
                  />

                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-blue-300/60 to-transparent opacity-0 transition duration-500 group-hover:opacity-100"
                  />

                  <div className="relative">
                    <div className="flex items-start justify-between gap-5">
                      <div className="relative">
                        <div className="flex size-14 items-center justify-center rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-100 text-blue-700 shadow-sm transition duration-300 group-hover:scale-105 group-hover:shadow-md">
                          <Icon className="size-7" />
                        </div>

                        <span className="absolute -right-2 -bottom-2 flex size-7 items-center justify-center rounded-full border-2 border-white bg-blue-600 text-[0.65rem] font-bold text-white shadow-sm">
                          {item.step}
                        </span>
                      </div>

                      <span className="text-sm font-semibold tracking-[0.14em] text-slate-400 uppercase">
                        Step {item.step}
                      </span>
                    </div>

                    <h3 className="mt-8 text-xl font-bold tracking-[-0.02em] text-slate-950 sm:text-2xl">
                      {item.title}
                    </h3>

                    <p className="mt-4 leading-7 text-slate-600">
                      {item.description}
                    </p>

                    <div className="mt-7 flex items-center gap-2 border-t border-slate-100 pt-5 text-sm font-medium text-slate-500">
                      <CheckCircle2 className="size-4 text-emerald-500" />
                      Structured delivery stage
                    </div>
                  </div>
                </motion.article>
              )
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{
            opacity: 0,
            y: 26,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.2,
          }}
          transition={{
            duration: 0.65,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative mt-16 overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-950 px-7 py-9 text-white shadow-[0_28px_90px_rgb(15_23_42/0.2)] sm:px-9 lg:px-10"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-36 -right-20 size-80 rounded-full bg-blue-500/20 blur-[110px]"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-40 -left-24 size-80 rounded-full bg-violet-500/15 blur-[120px]"
          />

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold text-blue-300">
                End-to-end execution
              </p>

              <h3 className="mt-3 text-3xl leading-tight font-bold tracking-[-0.03em] sm:text-4xl">
                A practical process from discovery to continuous improvement
              </h3>

              <p className="mt-5 leading-8 text-slate-300">
                Every engagement combines clear planning, collaborative
                engineering, secure implementation, and measurable operational
                outcomes.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.055] px-5 py-4 backdrop-blur-sm">
              <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
                <CheckCircle2 className="size-5" />
              </div>

              <div>
                <p className="text-xs font-semibold tracking-[0.14em] text-slate-500 uppercase">
                  Delivery outcome
                </p>

                <p className="mt-1 flex items-center gap-2 font-semibold text-white">
                  Predictable, secure execution
                  <ArrowRight className="size-4 text-blue-300" />
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

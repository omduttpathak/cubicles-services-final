import { motion } from "framer-motion"
import {
  ArrowUpRight,
  CheckCircle2,
  CloudCog,
  Code2,
  Layers3,
  ShieldCheck,
} from "lucide-react"

import type { AboutStat } from "@/api/aboutApi"

type CompanyOverviewProps = {
  eyebrow: string
  title: string
  descriptionOne: string
  descriptionTwo: string
  stats: AboutStat[]
}

const strengths = [
  {
    icon: CloudCog,
    title: "Cloud-first thinking",
    description:
      "Architecture and modernization strategies designed for secure, scalable growth.",
  },
  {
    icon: Code2,
    title: "Engineering excellence",
    description:
      "Practical software delivery powered by automation, quality, and modern practices.",
  },
  {
    icon: ShieldCheck,
    title: "Built for resilience",
    description:
      "Reliable solutions focused on security, performance, and long-term operational value.",
  },
]

const containerAnimation = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemAnimation = {
  hidden: {
    opacity: 0,
    y: 24,
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

export default function CompanyOverview({
  eyebrow,
  title,
  descriptionOne,
  descriptionTwo,
  stats,
}: CompanyOverviewProps) {
  return (
    <section className="relative overflow-hidden bg-white py-24 sm:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-44 -right-48 size-[34rem] rounded-full bg-blue-100/70 blur-[130px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-52 -left-52 size-[36rem] rounded-full bg-violet-100/60 blur-[140px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.22]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(148,163,184,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.12) 1px, transparent 1px)",
          backgroundSize: "76px 76px",
          maskImage:
            "linear-gradient(to bottom, transparent, black 18%, black 82%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, black 18%, black 82%, transparent)",
        }}
      />

      <div className="relative container mx-auto px-6">
        <div className="grid items-start gap-14 lg:grid-cols-12 lg:gap-16">
          <motion.div
            initial={{
              opacity: 0,
              x: -28,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: 0.65,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="lg:col-span-6"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
              <Layers3 className="size-4" />
              {eyebrow}
            </div>

            <h2 className="mt-6 max-w-3xl text-4xl leading-tight font-extrabold tracking-[-0.035em] text-slate-950 sm:text-5xl">
              {title}
            </h2>

            <div className="mt-7 space-y-5">
              <p className="text-base leading-8 text-slate-600 sm:text-lg">
                {descriptionOne}
              </p>

              <p className="text-base leading-8 text-slate-600 sm:text-lg">
                {descriptionTwo}
              </p>
            </div>

            <div className="mt-9 space-y-4">
              {strengths.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="group flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg"
                >
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700 transition duration-300 group-hover:bg-blue-100">
                    <Icon className="size-5" />
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-950">{title}</h3>

                    <p className="mt-1.5 text-sm leading-6 text-slate-600">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-9 flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-800">
              <CheckCircle2 className="size-5 shrink-0 text-emerald-600" />
              Focused on measurable business outcomes, not just technology
              implementation.
            </div>
          </motion.div>

          <motion.div
            variants={containerAnimation}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.15,
            }}
            className="lg:col-span-6"
          >
            <motion.div
              variants={itemAnimation}
              className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950 p-7 shadow-[0_30px_90px_rgb(15_23_42/0.16)] sm:p-8"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-28 -right-24 size-72 rounded-full bg-blue-500/20 blur-[100px]"
              />

              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-32 -left-28 size-72 rounded-full bg-violet-500/15 blur-[110px]"
              />

              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-16 top-0 h-px bg-gradient-to-r from-transparent via-blue-300/70 to-transparent"
              />

              <div className="relative">
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <p className="text-sm font-semibold text-blue-300">
                      Company at a glance
                    </p>

                    <h3 className="mt-2 text-2xl font-bold tracking-[-0.025em] text-white">
                      Built to help businesses modernize with confidence
                    </h3>
                  </div>

                  <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-blue-300">
                    <CloudCog className="size-6" />
                  </div>
                </div>

                {stats.length > 0 ? (
                  <div className="mt-8 grid grid-cols-2 gap-4">
                    {stats.map((stat, index) => (
                      <motion.div
                        key={stat.id}
                        variants={itemAnimation}
                        className={
                          index === 0
                            ? "group relative col-span-2 overflow-hidden rounded-2xl border border-blue-300/15 bg-blue-400/10 p-6 backdrop-blur-sm"
                            : "group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.055] p-5 backdrop-blur-sm"
                        }
                      >
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute -top-12 -right-10 size-28 rounded-full bg-blue-400/10 blur-2xl transition duration-500 group-hover:bg-blue-400/20"
                        />

                        <div className="relative">
                          <p
                            className={
                              index === 0
                                ? "text-4xl font-extrabold tracking-[-0.035em] text-white sm:text-5xl"
                                : "text-3xl font-bold tracking-[-0.03em] text-white"
                            }
                          >
                            {stat.value}
                          </p>

                          <p className="mt-2 text-sm leading-6 text-slate-400">
                            {stat.label}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.055] px-6 py-12 text-center">
                    <p className="text-sm font-medium text-slate-400">
                      Company statistics will appear here when published.
                    </p>
                  </div>
                )}

                <div className="mt-6 flex items-center justify-between gap-5 rounded-2xl border border-white/10 bg-slate-900/70 px-5 py-4">
                  <div>
                    <p className="text-xs font-semibold tracking-[0.14em] text-slate-500 uppercase">
                      Delivery mindset
                    </p>

                    <p className="mt-1 font-semibold text-slate-200">
                      Strategy aligned with execution
                    </p>
                  </div>

                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-blue-300">
                    <ArrowUpRight className="size-5" />
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

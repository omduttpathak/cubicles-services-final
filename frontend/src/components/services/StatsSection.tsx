import { motion } from "framer-motion"
import {
  Activity,
  Award,
  BarChart3,
  CheckCircle2,
  Globe2,
  ShieldCheck,
} from "lucide-react"

import { stats } from "@/data/stats"

const icons = [Activity, Globe2, ShieldCheck, Award, BarChart3, CheckCircle2]

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

export default function StatsSection() {
  return (
    <section className="relative overflow-hidden bg-slate-950 py-24 sm:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-52 left-1/2 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-blue-500/15 blur-[150px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      <div className="relative container mx-auto px-6">
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.6,
          }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="text-sm font-semibold tracking-[0.18em] text-blue-300 uppercase">
            Trusted Engineering Partner
          </p>

          <h2 className="mt-5 text-4xl font-extrabold tracking-[-0.03em] text-white sm:text-5xl">
            Numbers that reflect real delivery experience
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-400">
            We focus on measurable outcomes through cloud modernization,
            automation, secure engineering, and long-term operational support.
          </p>
        </motion.div>

        <motion.div
          variants={containerAnimation}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.2,
          }}
          className="mt-16 grid gap-7 md:grid-cols-2 xl:grid-cols-4"
        >
          {stats.map((item, index) => {
            const Icon = icons[index % icons.length]

            return (
              <motion.div
                key={item.id}
                variants={itemAnimation}
                className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-sm transition duration-500 hover:-translate-y-2 hover:border-blue-400/30 hover:bg-white/[0.06]"
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-blue-500/10 opacity-0 blur-3xl transition duration-500 group-hover:opacity-100"
                />

                <div className="relative">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-blue-500/10 text-blue-300">
                    <Icon className="h-7 w-7" />
                  </div>

                  <h3 className="mt-8 text-5xl font-extrabold tracking-tight text-white">
                    {item.value}
                  </h3>

                  <p className="mt-4 text-lg leading-7 font-medium text-slate-300">
                    {item.title}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

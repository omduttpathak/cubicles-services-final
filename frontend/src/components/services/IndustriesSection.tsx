import { motion } from "framer-motion"
import {
  ArrowUpRight,
  Building2,
  Factory,
  Hospital,
  Landmark,
  RadioTower,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
} from "lucide-react"

import type { ServicesPageSettings } from "@/api/servicesPageApi"
import { industries } from "@/data/industries"

const iconMap = {
  hospital: Hospital,
  landmark: Landmark,
  "shopping-cart": ShoppingCart,
  factory: Factory,
  tower: RadioTower,
  building: Building2,
}

const containerAnimation = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const cardAnimation = {
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

type IndustriesSectionProps = {
  settings: ServicesPageSettings
}

export default function IndustriesSection({
  settings,
}: IndustriesSectionProps) {
  return (
    <section className="relative overflow-hidden bg-slate-50 py-24 sm:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-56 -left-56 size-[36rem] rounded-full bg-blue-100/70 blur-[150px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-56 -bottom-56 size-[38rem] rounded-full bg-cyan-100/60 blur-[160px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(148,163,184,0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.14) 1px, transparent 1px)",
          backgroundSize: "76px 76px",
          maskImage:
            "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
        }}
      />

      <div className="relative container mx-auto px-6">
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
            {settings.industries_eyebrow}
          </div>

          <h2 className="mt-6 text-4xl font-extrabold tracking-[-0.035em] text-slate-950 sm:text-5xl">
            {settings.industries_title}
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            {settings.industries_description}
          </p>
        </motion.div>

        <motion.div
          variants={containerAnimation}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.1,
          }}
          className="mt-16 grid gap-7 md:grid-cols-2 xl:grid-cols-3"
        >
          {industries.map((industry, index) => {
            const Icon =
              iconMap[industry.icon as keyof typeof iconMap] ?? Building2

            return (
              <motion.article
                key={industry.title}
                variants={cardAnimation}
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

                <div className="relative flex h-full flex-col">
                  <div className="flex items-start justify-between">
                    <div className="flex size-14 items-center justify-center rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-100 text-blue-700 shadow-sm transition duration-300 group-hover:scale-105">
                      <Icon className="size-7" />
                    </div>

                    <span className="flex size-9 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-xs font-bold text-slate-400 transition duration-300 group-hover:border-blue-200 group-hover:bg-blue-50 group-hover:text-blue-700">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <h3 className="mt-7 text-2xl font-bold tracking-[-0.02em] text-slate-950">
                    {industry.title}
                  </h3>

                  <p className="mt-4 flex-1 leading-7 text-slate-600">
                    {industry.description}
                  </p>

                  <div className="mt-7 flex items-center justify-between border-t border-slate-100 pt-5">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                      <ShieldCheck className="size-4 text-emerald-500" />
                      Industry expertise
                    </div>

                    <ArrowUpRight className="size-5 text-slate-300 transition duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-blue-600" />
                  </div>
                </div>
              </motion.article>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

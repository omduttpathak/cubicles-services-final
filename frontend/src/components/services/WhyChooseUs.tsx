import { motion } from "framer-motion"
import {
  ArrowUpRight,
  CheckCircle2,
  Cloud,
  Layers,
  LifeBuoy,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Workflow,
} from "lucide-react"

import type { ServicesPageSettings } from "@/api/servicesPageApi"
import SectionHeader from "@/components/common/SectionHeader"
import { whyChooseUs } from "@/data/whyChooseUs"

const icons = [Cloud, Workflow, ShieldCheck, TrendingUp, Layers, LifeBuoy]

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

type WhyChooseUsProps = {
  settings: ServicesPageSettings
}

export default function WhyChooseUs({ settings }: WhyChooseUsProps) {
  return (
    <section className="relative overflow-hidden bg-slate-50 py-24 sm:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-52 -right-52 size-[36rem] rounded-full bg-blue-100/70 blur-[150px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-56 -left-52 size-[38rem] rounded-full bg-violet-100/60 blur-[160px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(148,163,184,0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.14) 1px, transparent 1px)",
          backgroundSize: "78px 78px",
          maskImage:
            "linear-gradient(to bottom, transparent, black 14%, black 86%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, black 14%, black 86%, transparent)",
        }}
      />

      <div className="relative container mx-auto px-6">
        <SectionHeader
          badge={settings.benefits_badge}
          title={settings.benefits_title}
          description={settings.benefits_description}
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.12,
          }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.09,
              },
            },
          }}
          className="mt-16 grid gap-7 md:grid-cols-2 xl:grid-cols-3"
        >
          {whyChooseUs.map((item, index) => {
            const Icon = icons[index] ?? ShieldCheck

            return (
              <motion.article
                key={item.title}
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
                  <div className="flex items-start justify-between gap-5">
                    <div className="flex size-14 items-center justify-center rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-100 text-blue-700 shadow-sm transition duration-300 group-hover:scale-105 group-hover:shadow-md">
                      <Icon className="size-7" />
                    </div>

                    <span className="flex size-9 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-xs font-bold text-slate-400 transition duration-300 group-hover:border-blue-200 group-hover:bg-blue-50 group-hover:text-blue-700">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <h3 className="mt-7 text-xl font-bold tracking-[-0.02em] text-slate-950 sm:text-2xl">
                    {item.title}
                  </h3>

                  <p className="mt-4 flex-1 leading-7 text-slate-600">
                    {item.description}
                  </p>

                  <div className="mt-7 flex items-center justify-between border-t border-slate-100 pt-5">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                      <CheckCircle2 className="size-4 text-emerald-500" />
                      Delivery advantage
                    </div>

                    <ArrowUpRight className="size-5 text-slate-300 transition duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-blue-600" />
                  </div>
                </div>
              </motion.article>
            )
          })}
        </motion.div>

        <motion.div
          initial={{
            opacity: 0,
            y: 28,
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

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-20 top-0 h-px bg-gradient-to-r from-transparent via-blue-300/70 to-transparent"
          />

          <div className="relative grid gap-8 lg:grid-cols-[1.25fr_1fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-blue-200">
                <Sparkles className="size-4" />
                Engineering partnership
              </div>

              <h3 className="mt-5 max-w-2xl text-3xl leading-tight font-bold tracking-[-0.03em] sm:text-4xl">
                More than delivery. A partner for long-term transformation.
              </h3>

              <p className="mt-5 max-w-2xl leading-8 text-slate-300">
                We combine cloud expertise, automation, security, and managed
                support to help organizations modernize confidently and operate
                reliably as their business evolves.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <TrustPoint label="Architecture" value="Designed for scale" />

              <TrustPoint label="Security" value="Integrated by default" />

              <TrustPoint label="Delivery" value="Automation-led" />

              <TrustPoint label="Support" value="Proactive and reliable" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function TrustPoint({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.055] p-5 backdrop-blur-sm">
      <p className="text-xs font-semibold tracking-[0.14em] text-slate-500 uppercase">
        {label}
      </p>

      <p className="mt-2 font-semibold text-white">{value}</p>
    </div>
  )
}

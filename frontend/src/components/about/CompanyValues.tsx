import { motion } from "framer-motion"
import {
  ArrowUpRight,
  CheckCircle2,
  Gem,
  HeartHandshake,
  Lightbulb,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react"

import type { AboutValue } from "@/api/aboutApi"
import SectionHeader from "@/components/common/SectionHeader"

type CompanyValuesProps = {
  eyebrow: string
  title: string
  description: string
  values: AboutValue[]
}

const icons = [Gem, HeartHandshake, Lightbulb, ShieldCheck, Users, Sparkles]

export default function CompanyValues({
  eyebrow,
  title,
  description,
  values,
}: CompanyValuesProps) {
  if (values.length === 0) {
    return null
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50 py-24 sm:py-28">
      <div
        aria-hidden="true"
        className="absolute top-0 -left-48 h-[30rem] w-[30rem] rounded-full bg-blue-100/60 blur-[140px]"
      />

      <div
        aria-hidden="true"
        className="absolute -right-56 bottom-0 h-[34rem] w-[34rem] rounded-full bg-violet-100/60 blur-[160px]"
      />

      <div className="relative container mx-auto px-6">
        <SectionHeader
          eyebrow={eyebrow}
          title={title}
          description={description}
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.15,
          }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.08,
              },
            },
          }}
          className="mt-16 grid gap-7 md:grid-cols-2 xl:grid-cols-3"
        >
          {values.map((value, index) => {
            const Icon = icons[index % icons.length]

            return (
              <motion.article
                key={value.id}
                variants={{
                  hidden: {
                    opacity: 0,
                    y: 30,
                  },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 0.55,
                      ease: [0.22, 1, 0.36, 1],
                    },
                  },
                }}
                className="group relative overflow-hidden rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-2xl"
              >
                <div
                  aria-hidden="true"
                  className="absolute -top-16 -right-16 h-36 w-36 rounded-full bg-blue-100 opacity-0 blur-3xl transition duration-500 group-hover:opacity-100"
                />

                <div className="relative">
                  <div className="flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 text-blue-700 transition duration-300 group-hover:scale-110">
                      <Icon className="h-6 w-6" />
                    </div>

                    <ArrowUpRight className="h-5 w-5 text-slate-300 transition duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-blue-600" />
                  </div>

                  <h3 className="mt-7 text-2xl font-bold tracking-tight text-slate-900">
                    {value.title}
                  </h3>

                  <p className="mt-4 leading-8 text-slate-600">
                    {value.description}
                  </p>

                  <div className="mt-8 flex items-center gap-2 border-t border-slate-100 pt-5 text-sm font-medium text-slate-500">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    Core company value
                  </div>
                </div>
              </motion.article>
            )
          })}
        </motion.div>

        <motion.div
          initial={{
            opacity: 0,
            y: 25,
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
          className="mt-20 overflow-hidden rounded-[32px] border border-slate-200 bg-slate-950 p-10 text-white shadow-[0_30px_90px_rgb(15_23_42/0.18)]"
        >
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-blue-200">
                <Sparkles className="h-4 w-4" />
                What drives us
              </div>

              <h3 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
                Values that shape every partnership we build
              </h3>

              <p className="mt-5 leading-8 text-slate-300">
                Every engagement is guided by transparency, engineering
                excellence, continuous innovation, and a commitment to helping
                organizations achieve sustainable digital transformation.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm text-slate-400">Commitment</p>
                <p className="mt-2 font-semibold text-white">
                  Long-term partnerships
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm text-slate-400">Approach</p>
                <p className="mt-2 font-semibold text-white">
                  Customer-first delivery
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm text-slate-400">Quality</p>
                <p className="mt-2 font-semibold text-white">
                  Enterprise standards
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm text-slate-400">Goal</p>
                <p className="mt-2 font-semibold text-white">
                  Deliver measurable value
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

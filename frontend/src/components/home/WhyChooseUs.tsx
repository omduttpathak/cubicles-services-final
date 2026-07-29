import { useEffect, useMemo, useState, type ComponentType } from "react"
import { motion } from "framer-motion"
import {
  CheckCircle2,
  Clock,
  Cloud,
  Rocket,
  Settings,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react"

import {
  getHomepageBenefits,
  type HomepageBenefit,
} from "@/api/homepageBenefitsApi"

const fallbackBenefits: HomepageBenefit[] = [
  {
    id: 1,
    title: "Cloud Expertise",
    description:
      "AWS and Azure expertise to design, migrate and optimize enterprise workloads.",
    icon: "cloud",
    display_order: 1,
    is_active: true,
  },
]

const iconMap: Record<
  string,
  ComponentType<{ className?: string; size?: number }>
> = {
  cloud: Cloud,
  settings: Settings,
  "shield-check": ShieldCheck,
  shield: ShieldCheck,
  rocket: Rocket,
  "trending-up": TrendingUp,
  trending: TrendingUp,
  clock: Clock,
}

const cardThemes = [
  {
    iconContainer: "border-blue-300/15 bg-blue-400/10 text-blue-300",
    glow: "bg-blue-500/12",
    number: "text-blue-300/70",
  },
  {
    iconContainer: "border-violet-300/15 bg-violet-400/10 text-violet-300",
    glow: "bg-violet-500/12",
    number: "text-violet-300/70",
  },
  {
    iconContainer: "border-emerald-300/15 bg-emerald-400/10 text-emerald-300",
    glow: "bg-emerald-500/12",
    number: "text-emerald-300/70",
  },
  {
    iconContainer: "border-cyan-300/15 bg-cyan-400/10 text-cyan-300",
    glow: "bg-cyan-500/12",
    number: "text-cyan-300/70",
  },
  {
    iconContainer: "border-amber-300/15 bg-amber-400/10 text-amber-300",
    glow: "bg-amber-500/10",
    number: "text-amber-300/70",
  },
  {
    iconContainer: "border-fuchsia-300/15 bg-fuchsia-400/10 text-fuchsia-300",
    glow: "bg-fuchsia-500/12",
    number: "text-fuchsia-300/70",
  },
]

type WhyChooseUsProps = {
  title: string
  description: string
}

export default function WhyChooseUs({ title, description }: WhyChooseUsProps) {
  const [benefits, setBenefits] = useState<HomepageBenefit[]>(fallbackBenefits)

  useEffect(() => {
    async function loadBenefits() {
      try {
        const response = await getHomepageBenefits()

        if (response.length > 0) {
          setBenefits(response)
        }
      } catch (error) {
        console.error("Unable to load homepage benefits:", error)
      }
    }

    void loadBenefits()
  }, [])

  const displayedBenefits = useMemo(() => {
    return [...benefits]
      .filter((benefit) => benefit.is_active)
      .sort((first, second) => first.display_order - second.display_order)
  }, [benefits])

  return (
    <section className="relative overflow-hidden bg-slate-950 py-24 text-white sm:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-48 -left-48 h-[34rem] w-[34rem] rounded-full bg-blue-600/15 blur-[130px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-52 -bottom-52 h-[38rem] w-[38rem] rounded-full bg-violet-600/14 blur-[140px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage:
            "linear-gradient(to bottom, transparent, black 18%, black 82%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, black 18%, black 82%, transparent)",
        }}
      />

      <div className="relative container mx-auto px-6">
        <div className="grid gap-14 lg:grid-cols-[0.82fr_1.18fr] lg:items-start lg:gap-16 xl:gap-24">
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
              amount: 0.3,
            }}
            transition={{
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="lg:sticky lg:top-32"
          >
            <div className="eyebrow-badge-dark">
              <Sparkles className="size-4 text-blue-300" />

              <span>Why Choose Us</span>
            </div>

            <h2 className="mt-6 max-w-xl text-4xl leading-tight font-extrabold tracking-[-0.035em] text-white sm:text-5xl">
              {title}
            </h2>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
              {description}
            </p>

            <div className="mt-8 h-px max-w-md bg-gradient-to-r from-blue-400/60 via-violet-400/35 to-transparent" />

            <div className="mt-8 flex items-center gap-4">
              <div className="flex -space-x-2">
                <span className="flex size-9 items-center justify-center rounded-full border-2 border-slate-950 bg-blue-500 text-xs font-bold text-white">
                  AWS
                </span>

                <span className="flex size-9 items-center justify-center rounded-full border-2 border-slate-950 bg-indigo-500 text-xs font-bold text-white">
                  AZ
                </span>

                <span className="flex size-9 items-center justify-center rounded-full border-2 border-slate-950 bg-violet-500 text-xs font-bold text-white">
                  K8
                </span>
              </div>

              <p className="text-sm leading-6 text-slate-400">
                Cloud, DevOps and application engineering expertise
              </p>
            </div>
          </motion.div>

          {displayedBenefits.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-16 text-center backdrop-blur-xl">
              <div className="mx-auto flex size-16 items-center justify-center rounded-2xl border border-blue-300/15 bg-blue-400/10 text-blue-300">
                <CheckCircle2 className="size-8" />
              </div>

              <h3 className="mt-6 text-2xl font-bold text-white">
                Benefits Coming Soon
              </h3>

              <p className="mx-auto mt-3 max-w-lg text-slate-400">
                More information about our capabilities will appear here soon.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {displayedBenefits.map((benefit, index) => {
                const Icon = iconMap[benefit.icon.toLowerCase()] ?? CheckCircle2

                const theme = cardThemes[index % cardThemes.length]

                return (
                  <motion.article
                    key={benefit.id}
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
                      duration: 0.5,
                      delay: (index % 6) * 0.07,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="group relative min-h-64 overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-6 shadow-[inset_0_1px_0_rgb(255_255_255/0.06),0_20px_55px_rgb(2_6_23/0.24)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-white/18 hover:bg-white/[0.075] sm:p-7"
                  >
                    <div
                      aria-hidden="true"
                      className={`pointer-events-none absolute -top-20 -right-20 h-48 w-48 rounded-full ${theme.glow} opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100`}
                    />

                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
                    />

                    <div className="relative flex h-full flex-col">
                      <div className="flex items-start justify-between gap-4">
                        <div
                          className={`flex size-12 items-center justify-center rounded-2xl border shadow-[inset_0_1px_0_rgb(255_255_255/0.08)] ${theme.iconContainer}`}
                        >
                          <Icon className="size-6" />
                        </div>

                        <span
                          className={`text-sm font-semibold tracking-[0.16em] ${theme.number}`}
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>

                      <h3 className="mt-7 text-xl font-semibold tracking-tight text-white sm:text-2xl">
                        {benefit.title}
                      </h3>

                      <p className="mt-4 leading-7 text-slate-300">
                        {benefit.description}
                      </p>

                      <div className="mt-auto pt-7">
                        <div className="h-px bg-gradient-to-r from-white/12 to-transparent" />
                      </div>
                    </div>
                  </motion.article>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

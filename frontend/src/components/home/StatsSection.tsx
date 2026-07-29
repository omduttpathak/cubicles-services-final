import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import {
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  CloudCog,
  ShieldCheck,
} from "lucide-react"

import { getHomepageStats, type HomepageStat } from "@/api/homepageStatsApi"

const fallbackStats: HomepageStat[] = [
  {
    id: 1,
    value: "150+",
    title: "Projects Delivered",
    display_order: 1,
    is_active: true,
  },
]

const statIcons = [BarChart3, CloudCog, ShieldCheck, CheckCircle2]

type StatsSectionProps = {
  title: string
  description: string
}

export default function StatsSection({
  title,
  description,
}: StatsSectionProps) {
  const [stats, setStats] = useState<HomepageStat[]>(fallbackStats)

  useEffect(() => {
    async function loadStats() {
      try {
        const response = await getHomepageStats()

        if (response.length > 0) {
          setStats(response)
        }
      } catch (error) {
        console.error("Unable to load homepage statistics:", error)
      }
    }

    void loadStats()
  }, [])

  const displayedStats = useMemo(() => {
    return [...stats]
      .filter((item) => item.is_active)
      .sort((first, second) => first.display_order - second.display_order)
      .slice(0, 4)
  }, [stats])

  return (
    <section className="relative overflow-hidden bg-slate-950 py-20 text-white sm:py-24 lg:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -left-40 h-[30rem] w-[30rem] rounded-full bg-blue-600/18 blur-[130px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-48 -bottom-48 h-[34rem] w-[34rem] rounded-full bg-violet-600/16 blur-[140px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.1]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage:
            "linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)",
        }}
      />

      <div className="relative container mx-auto px-6">
        <div className="grid gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:items-end lg:gap-16 xl:gap-24">
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
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-300/15 bg-blue-400/10 px-3.5 py-1.5 text-sm font-semibold text-blue-200">
              <BarChart3 className="size-4" />
              Our Impact
            </div>

            <h2 className="mt-6 max-w-xl text-4xl leading-tight font-extrabold tracking-[-0.035em] text-white sm:text-5xl">
              {title}
            </h2>

            <p className="mt-6 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
              {description}
            </p>

            <div className="mt-8 flex items-center gap-3 text-sm font-medium text-slate-400">
              <span className="flex size-9 items-center justify-center rounded-full border border-emerald-300/15 bg-emerald-400/10 text-emerald-300">
                <ArrowUpRight className="size-4" />
              </span>
              Measurable outcomes across cloud and digital engineering
            </div>
          </motion.div>

          {displayedStats.length === 0 ? (
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
                amount: 0.3,
              }}
              transition={{
                duration: 0.55,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="rounded-[2rem] border border-white/10 bg-white/[0.055] px-6 py-14 text-center backdrop-blur-xl"
            >
              <div className="mx-auto flex size-16 items-center justify-center rounded-2xl border border-blue-300/15 bg-blue-400/10 text-blue-300">
                <BarChart3 className="size-8" />
              </div>

              <h3 className="mt-6 text-2xl font-bold text-white">
                Impact Metrics Coming Soon
              </h3>

              <p className="mx-auto mt-3 max-w-xl leading-7 text-slate-400">
                Our latest delivery and transformation metrics will appear here
                when published.
              </p>
            </motion.div>
          ) : (
            <div
              className={
                displayedStats.length === 1
                  ? "grid gap-4"
                  : "grid gap-4 sm:grid-cols-2"
              }
            >
              {displayedStats.map((item, index) => {
                const Icon = statIcons[index % statIcons.length]

                return (
                  <motion.article
                    key={item.id}
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
                      delay: index * 0.08,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className={
                      displayedStats.length === 1
                        ? "group relative min-h-64 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.055] p-8 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.075] sm:p-10"
                        : "group relative min-h-56 overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.055] p-7 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.075]"
                    }
                  >
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute -top-24 -right-20 h-48 w-48 rounded-full bg-blue-500/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
                    />

                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
                    />

                    <div className="relative flex h-full flex-col">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex size-11 items-center justify-center rounded-2xl border border-blue-300/15 bg-blue-400/10 text-blue-300">
                          <Icon className="size-5" />
                        </div>

                        <span className="text-xs font-semibold tracking-[0.18em] text-slate-500">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>

                      <div className="mt-auto pt-8">
                        <p
                          className={
                            displayedStats.length === 1
                              ? "text-6xl font-extrabold tracking-[-0.05em] text-white sm:text-7xl"
                              : "text-5xl font-extrabold tracking-[-0.045em] text-white sm:text-6xl"
                          }
                        >
                          {item.value}
                        </p>

                        <p className="mt-4 text-base leading-7 font-medium text-slate-300 sm:text-lg">
                          {item.title}
                        </p>
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

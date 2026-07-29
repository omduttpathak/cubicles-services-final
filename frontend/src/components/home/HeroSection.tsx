import { motion } from "framer-motion"
import {
  ArrowRight,
  Check,
  Cloud,
  ServerCog,
  ShieldCheck,
  Sparkles,
} from "lucide-react"
import { Link } from "react-router-dom"

import PremiumHeroShell from "@/components/common/PremiumHeroShell"
import { Button } from "@/components/ui/button"

type HeroSectionProps = {
  badge: string
  title: string
  description: string
  primaryButtonText: string
  primaryButtonUrl: string
  secondaryButtonText: string
  secondaryButtonUrl: string
}

const capabilities = [
  {
    icon: Cloud,
    title: "Cloud Migration",
    description:
      "AWS and Azure migration strategies designed for reliability, security and performance.",
    glowClassName: "from-blue-500/20 to-cyan-400/5",
    iconBackgroundClassName: "bg-blue-400/10",
    iconBorderClassName: "border-blue-300/15",
    iconTextClassName: "text-blue-300",
  },
  {
    icon: ServerCog,
    title: "DevOps Automation",
    description:
      "CI/CD pipelines, Kubernetes and infrastructure automation built for faster delivery.",
    glowClassName: "from-emerald-500/18 to-cyan-400/5",
    iconBackgroundClassName: "bg-emerald-400/10",
    iconBorderClassName: "border-emerald-300/15",
    iconTextClassName: "text-emerald-300",
  },
  {
    icon: ShieldCheck,
    title: "Secure Modernization",
    description:
      "Transform legacy applications into scalable, secure cloud-native platforms.",
    glowClassName: "from-violet-500/20 to-fuchsia-400/5",
    iconBackgroundClassName: "bg-violet-400/10",
    iconBorderClassName: "border-violet-300/15",
    iconTextClassName: "text-violet-300",
  },
]

const trustPoints = [
  "Cloud-native engineering",
  "Security-first delivery",
  "Scalable architecture",
]

export default function HeroSection({
  badge,
  title,
  description,
  primaryButtonText,
  primaryButtonUrl,
  secondaryButtonText,
  secondaryButtonUrl,
}: HeroSectionProps) {
  return (
    <PremiumHeroShell contentClassName="py-16 sm:py-20 lg:py-24">
      <div className="grid items-center gap-14 lg:grid-cols-[1fr_0.92fr] lg:gap-14 xl:gap-20">
        <motion.div
          initial={{
            opacity: 0,
            y: 28,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.65,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-16 -left-16 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl"
          />

          <div className="eyebrow-badge-dark relative mb-6 px-3.5 py-1.5 text-xs sm:text-sm">
            <Sparkles className="size-4 text-blue-300" />

            <span>{badge}</span>

            <span className="relative ml-1 flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-cyan-300 opacity-50" />

              <span className="relative inline-flex size-2 rounded-full bg-cyan-300" />
            </span>
          </div>

          <h1 className="max-w-[46rem] text-4xl leading-[1.08] font-extrabold tracking-[-0.035em] text-white sm:text-5xl lg:text-[3.35rem] xl:text-[3.8rem]">
            {title}
          </h1>

          <div className="mt-6 h-px max-w-xl bg-gradient-to-r from-blue-400/60 via-violet-400/35 to-transparent" />

          <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
            {description}
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
            <Button asChild size="lg" className="group w-full sm:w-auto">
              <Link to={primaryButtonUrl}>
                <span>{primaryButtonText}</span>

                <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full border-white/16 bg-white/6 text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.08)] hover:border-white/28 hover:bg-white/12 hover:text-white sm:w-auto"
            >
              <Link to={secondaryButtonUrl}>{secondaryButtonText}</Link>
            </Button>
          </div>

          <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
            {trustPoints.map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 text-sm font-medium text-slate-300"
              >
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full border border-emerald-300/20 bg-emerald-400/10 text-emerald-300">
                  <Check className="size-3" />
                </span>

                <span>{item}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{
            opacity: 0,
            x: 40,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.75,
            delay: 0.08,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative mx-auto w-full max-w-lg"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-10 rounded-[3rem] bg-gradient-to-br from-blue-500/12 via-violet-500/10 to-cyan-400/8 blur-3xl"
          />

          <div className="glass-panel relative overflow-hidden rounded-[2rem] p-4 shadow-[0_35px_100px_rgb(2_6_23/0.5)] sm:p-5">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-16 top-0 h-px bg-gradient-to-r from-transparent via-blue-300/80 to-transparent"
            />

            <div className="px-1 pt-1 pb-5 sm:px-2">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-base font-semibold tracking-tight text-white">
                    Modernization Platform
                  </p>

                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    Cloud, DevOps and application engineering
                  </p>
                </div>

                <div className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full border border-emerald-300/15 bg-emerald-400/8 px-3 py-1.5 text-xs font-medium text-emerald-300">
                  <span className="size-1.5 rounded-full bg-emerald-300 shadow-[0_0_12px_rgb(110_231_183/0.9)]" />
                  Enterprise ready
                </div>
              </div>

              <div className="mt-5 h-px bg-gradient-to-r from-white/5 via-white/15 to-white/5" />
            </div>

            <div className="grid gap-3">
              {capabilities.map((capability, index) => {
                const Icon = capability.icon

                return (
                  <motion.div
                    key={capability.title}
                    initial={{
                      opacity: 0,
                      y: 22,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.55,
                      delay: 0.18 + index * 0.1,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="group premium-card-dark relative min-h-[138px] overflow-hidden rounded-2xl p-5"
                  >
                    <div
                      aria-hidden="true"
                      className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${capability.glowClassName} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
                    />

                    <div className="relative flex h-full items-start gap-4">
                      <div
                        className={`flex size-11 shrink-0 items-center justify-center rounded-xl border ${capability.iconBorderClassName} ${capability.iconBackgroundClassName} ${capability.iconTextClassName} shadow-[inset_0_1px_0_rgb(255_255_255/0.08)]`}
                      >
                        <Icon className="size-5" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <h3 className="text-lg font-semibold tracking-tight text-white">
                            {capability.title}
                          </h3>

                          <ArrowRight className="size-4 shrink-0 text-slate-500 transition duration-300 group-hover:translate-x-1 group-hover:text-blue-300" />
                        </div>

                        <p className="mt-2 text-sm leading-6 text-slate-300 sm:text-base sm:leading-7">
                          {capability.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2">
              <MetricCard value="AWS" label="Cloud" />
              <MetricCard value="Azure" label="Cloud" />
              <MetricCard value="24/7" label="Support" />
            </div>
          </div>
        </motion.div>
      </div>
    </PremiumHeroShell>
  )
}

function MetricCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl border border-white/8 bg-white/4 px-2 py-3 text-center backdrop-blur-sm sm:px-3">
      <p className="text-sm font-bold text-white sm:text-base">{value}</p>

      <p className="mt-0.5 text-[0.65rem] font-medium tracking-[0.12em] text-slate-500 uppercase">
        {label}
      </p>
    </div>
  )
}

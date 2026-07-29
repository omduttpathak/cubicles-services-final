import { motion } from "framer-motion"
import {
  ArrowRight,
  CheckCircle2,
  CloudCog,
  Code2,
  Cpu,
  ShieldCheck,
  Sparkles,
} from "lucide-react"
import { Link } from "react-router-dom"

import type { ServicesPageSettings } from "@/api/servicesPageApi"
import { Button } from "@/components/ui/button"

type HeroSectionProps = {
  settings: ServicesPageSettings
}

export default function HeroSection({ settings }: HeroSectionProps) {
  const features = [
    {
      icon: CloudCog,
      title: settings.hero_feature_one,
    },
    {
      icon: Code2,
      title: settings.hero_feature_two,
    },
    {
      icon: Cpu,
      title: settings.hero_feature_three,
    },
    {
      icon: ShieldCheck,
      title: settings.hero_feature_four,
    },
  ]

  return (
    <section className="relative isolate overflow-hidden bg-slate-950 text-white">
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(148,163,184,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.08) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage:
            "linear-gradient(to bottom, black 15%, black 75%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 15%, black 75%, transparent)",
        }}
      />

      <div
        aria-hidden="true"
        className="absolute -top-36 -left-44 h-[34rem] w-[34rem] rounded-full bg-blue-600/20 blur-[140px]"
      />

      <div
        aria-hidden="true"
        className="absolute top-12 right-[-10rem] h-[36rem] w-[36rem] rounded-full bg-violet-600/15 blur-[150px]"
      />

      <div
        aria-hidden="true"
        className="absolute bottom-[-14rem] left-1/2 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[150px]"
      />

      <div className="relative container mx-auto px-6">
        <div className="grid min-h-[44rem] items-center gap-14 py-24 lg:grid-cols-12 lg:py-28 xl:min-h-[47rem]">
          <motion.div
            initial={{
              opacity: 0,
              x: -28,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="lg:col-span-7"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-300/15 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-200 backdrop-blur-xl">
              <Sparkles className="h-4 w-4" />
              {settings.hero_badge}
            </div>

            <h1 className="mt-7 max-w-4xl text-4xl leading-[1.05] font-extrabold tracking-[-0.045em] sm:text-5xl md:text-6xl lg:text-[4.25rem]">
              {settings.hero_title}

              <span className="block bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">
                {settings.hero_highlight}
              </span>
            </h1>

            <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-300 sm:text-xl sm:leading-9">
              {settings.hero_description}
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Button asChild size="lg" className="group rounded-xl px-7">
                <Link to={settings.primary_button_url}>
                  {settings.primary_button_text}

                  <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-xl border-white/20 bg-white/5 text-white backdrop-blur-md hover:bg-white hover:text-slate-900"
              >
                <Link to={settings.secondary_button_url}>
                  {settings.secondary_button_text}
                </Link>
              </Button>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4">
              {features.map(({ title }) => (
                <div key={title} className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-5 w-5 text-blue-400" />

                  <span className="text-sm font-medium text-slate-300">
                    {title}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{
              opacity: 0,
              x: 32,
              scale: 0.98,
            }}
            animate={{
              opacity: 1,
              x: 0,
              scale: 1,
            }}
            transition={{
              duration: 0.75,
              delay: 0.12,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative lg:col-span-5"
          >
            <div
              aria-hidden="true"
              className="absolute inset-8 rounded-full bg-blue-500/20 blur-3xl"
            />

            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.06] p-7 shadow-[0_35px_100px_rgb(0_0_0/0.35)] backdrop-blur-xl sm:p-8">
              <div
                aria-hidden="true"
                className="absolute inset-x-16 top-0 h-px bg-gradient-to-r from-transparent via-blue-300/70 to-transparent"
              />

              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-blue-300">
                    What we deliver
                  </p>

                  <h2 className="mt-2 text-2xl font-bold tracking-[-0.025em]">
                    Enterprise technology services
                  </h2>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-300/15 bg-blue-500/10 text-blue-300">
                  <CloudCog className="h-6 w-6" />
                </div>
              </div>

              <div className="mt-8 space-y-4">
                {features.map(({ icon: Icon, title }) => (
                  <FeatureCard key={title} icon={Icon} title={title} />
                ))}
              </div>

              <div className="mt-7 rounded-2xl border border-white/10 bg-slate-950/45 px-5 py-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold tracking-[0.14em] text-slate-500 uppercase">
                      Delivery model
                    </p>

                    <p className="mt-1 font-semibold text-slate-200">
                      Strategy • Engineering • Automation
                    </p>
                  </div>

                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-blue-300">
                    <CheckCircle2 className="h-5 w-5" />
                  </span>
                </div>
              </div>
            </div>

            <motion.div
              animate={{
                y: [0, -8, 0],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              className="absolute -right-6 -bottom-8 hidden rounded-2xl border border-white/10 bg-slate-900/90 p-4 shadow-2xl backdrop-blur-xl lg:block"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-300">
                  <CheckCircle2 className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-xs text-slate-400">Enterprise delivery</p>

                  <p className="mt-0.5 text-sm font-semibold text-white">
                    Secure. Scalable. Reliable.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent"
      />
    </section>
  )
}

type FeatureCardProps = {
  icon: React.ComponentType<{
    className?: string
  }>
  title: string
}

function FeatureCard({ icon: Icon, title }: FeatureCardProps) {
  return (
    <div className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.05] p-4 transition duration-300 hover:border-blue-300/20 hover:bg-white/[0.08]">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] text-blue-300 transition duration-300 group-hover:bg-blue-500/10">
        <Icon className="h-5 w-5" />
      </div>

      <div className="flex-1">
        <h3 className="font-semibold text-white">{title}</h3>

        <p className="mt-1 text-sm leading-6 text-slate-400">
          Enterprise-grade engineering delivered using modern cloud-native
          practices.
        </p>
      </div>
    </div>
  )
}

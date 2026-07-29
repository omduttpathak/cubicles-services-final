import { motion } from "framer-motion"
import {
  ArrowDown,
  Building2,
  CheckCircle2,
  CloudCog,
  Sparkles,
} from "lucide-react"

type AboutHeroProps = {
  badge: string
  title: string
  description: string
}

const capabilities = [
  "Cloud transformation",
  "Application modernization",
  "DevOps engineering",
]

export default function AboutHero({
  badge,
  title,
  description,
}: AboutHeroProps) {
  function scrollToNextSection() {
    const currentSection = document.getElementById("about-hero")
    const nextSection = currentSection?.nextElementSibling

    nextSection?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }

  return (
    <section
      id="about-hero"
      className="relative isolate overflow-hidden bg-slate-950 text-white"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(148,163,184,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.08) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage:
            "linear-gradient(to bottom, black 10%, black 72%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 10%, black 72%, transparent)",
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-48 -left-40 size-[36rem] rounded-full bg-blue-600/20 blur-[130px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-20 -right-56 size-[42rem] rounded-full bg-violet-600/15 blur-[150px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-18rem] left-1/2 size-[40rem] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[150px]"
      />

      <div className="relative container mx-auto px-6">
        <div className="grid min-h-[43rem] items-center gap-14 py-24 lg:grid-cols-12 lg:py-28 xl:min-h-[47rem]">
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
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-300/15 bg-blue-400/10 px-4 py-2 text-sm font-semibold text-blue-200 backdrop-blur-md">
              <Sparkles className="size-4" />
              {badge}
            </div>

            <h1 className="mt-7 max-w-4xl text-4xl leading-[1.08] font-extrabold tracking-[-0.045em] text-white sm:text-5xl md:text-6xl lg:text-[4.25rem]">
              {title}
            </h1>

            <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-300 sm:text-xl sm:leading-9">
              {description}
            </p>

            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-4">
              {capabilities.map((capability) => (
                <div
                  key={capability}
                  className="flex items-center gap-2.5 text-sm font-medium text-slate-300"
                >
                  <CheckCircle2 className="size-5 shrink-0 text-blue-400" />
                  {capability}
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={scrollToNextSection}
                className="group inline-flex items-center justify-center rounded-xl bg-blue-600 px-7 py-3.5 font-semibold text-white shadow-lg shadow-blue-950/30 transition duration-300 hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-xl hover:shadow-blue-900/30"
              >
                Discover Our Story
                <ArrowDown className="ml-2 size-4 transition-transform duration-300 group-hover:translate-y-1" />
              </button>

              <div className="flex items-center gap-3 px-1 text-sm text-slate-400">
                <span className="flex -space-x-2">
                  <span className="flex size-9 items-center justify-center rounded-full border-2 border-slate-950 bg-blue-500 text-xs font-bold text-white">
                    AWS
                  </span>

                  <span className="flex size-9 items-center justify-center rounded-full border-2 border-slate-950 bg-sky-500 text-xs font-bold text-white">
                    AZ
                  </span>

                  <span className="flex size-9 items-center justify-center rounded-full border-2 border-slate-950 bg-violet-500 text-xs font-bold text-white">
                    K8
                  </span>
                </span>

                <span>Modern technology expertise</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{
              opacity: 0,
              x: 30,
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

            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.065] p-6 shadow-[0_35px_100px_rgb(0_0_0/0.35)] backdrop-blur-xl sm:p-8">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-16 top-0 h-px bg-gradient-to-r from-transparent via-blue-300/70 to-transparent"
              />

              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="text-sm font-semibold text-blue-300">
                    Our Purpose
                  </p>

                  <h2 className="mt-2 text-2xl font-bold tracking-[-0.025em] text-white">
                    Engineering meaningful transformation
                  </h2>
                </div>

                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-blue-300/15 bg-blue-400/10 text-blue-300">
                  <CloudCog className="size-6" />
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <PurposeCard
                  icon={Building2}
                  title="Enterprise Focus"
                  description="Solutions designed around real business challenges, growth, and operational resilience."
                />

                <PurposeCard
                  icon={CloudCog}
                  title="Technology Excellence"
                  description="Secure, scalable cloud and application engineering built with modern practices."
                />

                <PurposeCard
                  icon={Sparkles}
                  title="Lasting Impact"
                  description="Transformation that delivers measurable value beyond the initial implementation."
                />
              </div>

              <div className="mt-7 rounded-2xl border border-white/10 bg-slate-950/45 px-5 py-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold tracking-[0.14em] text-slate-500 uppercase">
                      Our approach
                    </p>

                    <p className="mt-1 font-semibold text-slate-200">
                      Strategy. Engineering. Partnership.
                    </p>
                  </div>

                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-blue-300">
                    <CheckCircle2 className="size-5" />
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
              className="absolute -right-3 -bottom-7 hidden rounded-2xl border border-white/10 bg-slate-900/90 p-4 shadow-2xl backdrop-blur-xl sm:block lg:-right-8"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
                  <CheckCircle2 className="size-5" />
                </div>

                <div>
                  <p className="text-xs text-slate-400">Delivery principle</p>

                  <p className="mt-0.5 text-sm font-semibold text-white">
                    Built for long-term value
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

function PurposeCard({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Building2
  title: string
  description: string
}) {
  return (
    <div className="group flex gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.045] p-4 transition duration-300 hover:border-blue-300/15 hover:bg-white/[0.075]">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.065] text-blue-300 transition duration-300 group-hover:bg-blue-400/10">
        <Icon className="size-5" />
      </div>

      <div>
        <h3 className="font-semibold text-white">{title}</h3>

        <p className="mt-1.5 text-sm leading-6 text-slate-400">{description}</p>
      </div>
    </div>
  )
}

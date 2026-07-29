import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import {
  ArrowRight,
  Check,
  Cloud,
  RefreshCw,
  Server,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react"

import { getServices, type Service } from "@/api/servicesApi"
import ErrorState from "@/components/common/ErrorState"
import PageLoader from "@/components/common/PageLoader"
import { Button } from "@/components/ui/button"

const iconMap = {
  cloud: Cloud,
  workflow: Workflow,
  refresh: RefreshCw,
  shield: ShieldCheck,
}

const cardThemes = [
  {
    iconClassName:
      "border-blue-200/70 bg-gradient-to-br from-blue-100 to-cyan-50 text-blue-600",
    glowClassName: "bg-blue-500/12",
    lineClassName: "from-blue-500 via-cyan-400 to-transparent",
    highlightClassName: "border-blue-100 bg-blue-50/70 text-blue-950",
    checkClassName: "bg-blue-100 text-blue-600",
    linkClassName: "text-blue-600 group-hover/card:text-blue-700",
  },
  {
    iconClassName:
      "border-violet-200/70 bg-gradient-to-br from-violet-100 to-fuchsia-50 text-violet-600",
    glowClassName: "bg-violet-500/12",
    lineClassName: "from-violet-500 via-fuchsia-400 to-transparent",
    highlightClassName: "border-violet-100 bg-violet-50/70 text-violet-950",
    checkClassName: "bg-violet-100 text-violet-600",
    linkClassName: "text-violet-600 group-hover/card:text-violet-700",
  },
  {
    iconClassName:
      "border-emerald-200/70 bg-gradient-to-br from-emerald-100 to-cyan-50 text-emerald-600",
    glowClassName: "bg-emerald-500/12",
    lineClassName: "from-emerald-500 via-cyan-400 to-transparent",
    highlightClassName: "border-emerald-100 bg-emerald-50/70 text-emerald-950",
    checkClassName: "bg-emerald-100 text-emerald-600",
    linkClassName: "text-emerald-600 group-hover/card:text-emerald-700",
  },
  {
    iconClassName:
      "border-indigo-200/70 bg-gradient-to-br from-indigo-100 to-blue-50 text-indigo-600",
    glowClassName: "bg-indigo-500/12",
    lineClassName: "from-indigo-500 via-blue-400 to-transparent",
    highlightClassName: "border-indigo-100 bg-indigo-50/70 text-indigo-950",
    checkClassName: "bg-indigo-100 text-indigo-600",
    linkClassName: "text-indigo-600 group-hover/card:text-indigo-700",
  },
]

type ServicesSectionProps = {
  title: string
  description: string
}

export default function ServicesSection({
  title,
  description,
}: ServicesSectionProps) {
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  async function loadServices() {
    try {
      setIsLoading(true)
      setHasError(false)

      setServices(await getServices())
    } catch (error) {
      console.error(error)
      setHasError(true)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadServices()
  }, [])

  if (isLoading) {
    return <PageLoader message="Loading services..." />
  }

  if (hasError) {
    return (
      <ErrorState
        title="Unable to Load Services"
        message="Our services could not be loaded."
        onRetry={() => {
          void loadServices()
        }}
      />
    )
  }

  return (
    <section className="section-surface-muted relative overflow-hidden py-24 sm:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -left-40 h-[30rem] w-[30rem] rounded-full bg-blue-500/8 blur-[120px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -bottom-48 h-[34rem] w-[34rem] rounded-full bg-violet-500/8 blur-[130px]"
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
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <div className="eyebrow-badge">
            <Sparkles className="size-4" />

            <span>Our Services</span>
          </div>

          <h2 className="mt-6 text-4xl leading-tight font-extrabold tracking-[-0.035em] text-slate-950 sm:text-5xl lg:text-6xl">
            {title}
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
            {description}
          </p>
        </motion.div>

        {services.length === 0 ? (
          <div className="glass-panel-light mx-auto max-w-3xl rounded-3xl px-6 py-16 text-center">
            <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-violet-100 text-indigo-600">
              <Server className="size-8" />
            </div>

            <h3 className="mt-6 text-2xl font-bold text-slate-950">
              No Services Available
            </h3>

            <p className="mt-3 text-slate-600">
              Service information will appear here when available.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {services.map((service, index) => {
              const Icon =
                iconMap[service.icon as keyof typeof iconMap] ?? Server

              const theme = cardThemes[index % cardThemes.length]

              return (
                <motion.article
                  key={service.id}
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
                    amount: 0.16,
                  }}
                  transition={{
                    duration: 0.55,
                    delay: (index % 4) * 0.08,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="group/card premium-card relative isolate overflow-hidden rounded-[1.75rem] p-7 sm:p-8"
                >
                  <div
                    aria-hidden="true"
                    className={`pointer-events-none absolute -top-28 -right-24 h-64 w-64 rounded-full ${theme.glowClassName} opacity-0 blur-3xl transition-opacity duration-500 group-hover/card:opacity-100`}
                  />

                  <div
                    aria-hidden="true"
                    className={`absolute inset-x-8 top-0 h-px bg-gradient-to-r ${theme.lineClassName} opacity-70`}
                  />

                  <div className="relative">
                    <div className="flex items-start justify-between gap-5">
                      <div
                        className={`flex size-15 shrink-0 items-center justify-center rounded-2xl border shadow-[inset_0_1px_0_rgb(255_255_255/0.9),0_10px_26px_rgb(15_23_42/0.08)] transition duration-300 group-hover/card:scale-105 ${theme.iconClassName}`}
                      >
                        <Icon className="size-7" />
                      </div>

                      <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white/80 text-slate-400 shadow-sm transition-all duration-300 group-hover/card:border-blue-200 group-hover/card:bg-blue-50 group-hover/card:text-blue-600">
                        <ArrowRight className="size-4 transition-transform duration-300 group-hover/card:translate-x-0.5" />
                      </span>
                    </div>

                    <h3 className="mt-7 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                      {service.title}
                    </h3>

                    <p className="mt-4 max-w-2xl leading-7 text-slate-600">
                      {service.shortDescription}
                    </p>

                    {service.highlights.length > 0 && (
                      <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                        {service.highlights.map((highlight) => (
                          <li
                            key={highlight}
                            className={`flex items-start gap-3 rounded-xl border px-3.5 py-3 text-sm font-medium ${theme.highlightClassName}`}
                          >
                            <span
                              className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full ${theme.checkClassName}`}
                            >
                              <Check className="size-3" />
                            </span>

                            <span className="leading-5">{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="mt-8 border-t border-slate-200/80 pt-6">
                      <Link
                        to={`/services/${service.slug}`}
                        className={`inline-flex items-center gap-2 font-semibold transition ${theme.linkClassName}`}
                        aria-label={`Learn more about ${service.title}`}
                      >
                        <span>Learn More</span>

                        <ArrowRight className="size-4 transition-transform duration-300 group-hover/card:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              )
            })}
          </div>
        )}

        {services.length > 0 && (
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
              duration: 0.5,
              delay: 0.12,
            }}
            className="mt-14 flex justify-center"
          >
            <Button asChild size="xl" className="group">
              <Link to="/services">
                <span>Explore All Services</span>

                <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  )
}

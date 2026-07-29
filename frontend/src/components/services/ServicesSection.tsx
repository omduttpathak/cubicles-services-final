import { useEffect, useState } from "react"
import { motion } from "framer-motion"
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
import { Link } from "react-router-dom"

import { getServices, type Service } from "@/api/servicesApi"
import type { ServicesPageSettings } from "@/api/servicesPageApi"
import ErrorState from "@/components/common/ErrorState"
import PageLoader from "@/components/common/PageLoader"
import { Button } from "@/components/ui/button"

const iconMap = {
  cloud: Cloud,
  workflow: Workflow,
  refresh: RefreshCw,
  shield: ShieldCheck,
}

const cardGradients = [
  "from-blue-500/20 via-cyan-400/10 to-transparent",
  "from-violet-500/20 via-blue-400/10 to-transparent",
  "from-cyan-500/20 via-emerald-400/10 to-transparent",
  "from-indigo-500/20 via-violet-400/10 to-transparent",
]

type ServicesSectionProps = {
  settings: ServicesPageSettings
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

export default function ServicesSection({ settings }: ServicesSectionProps) {
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  async function loadServices() {
    try {
      setIsLoading(true)
      setHasError(false)

      const response = await getServices()

      setServices(response)
    } catch (error) {
      console.error("Unable to load services:", error)
      setHasError(true)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadServices()
  }, [])

  return (
    <section className="relative overflow-hidden bg-white py-24 sm:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-48 -left-48 size-[34rem] rounded-full bg-blue-100/70 blur-[140px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-52 bottom-0 size-[36rem] rounded-full bg-violet-100/60 blur-[150px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(148,163,184,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.12) 1px, transparent 1px)",
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
            {settings.services_eyebrow}
          </div>

          <h2 className="mt-6 text-4xl leading-tight font-extrabold tracking-[-0.035em] text-slate-950 sm:text-5xl">
            {settings.services_title}
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            {settings.services_description}
          </p>
        </motion.div>

        <div className="mt-16">
          {isLoading ? (
            <div className="rounded-[2rem] border border-slate-200 bg-slate-50 px-6 py-20">
              <PageLoader message="Loading services..." />
            </div>
          ) : hasError ? (
            <div className="rounded-[2rem] border border-red-100 bg-red-50/50 px-6 py-10">
              <ErrorState
                title="Unable to Load Services"
                message="The services could not be loaded. Please try again."
                onRetry={() => {
                  void loadServices()
                }}
              />
            </div>
          ) : services.length === 0 ? (
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
              className="mx-auto max-w-3xl rounded-[2rem] border border-slate-200 bg-slate-50 px-8 py-16 text-center shadow-sm"
            >
              <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                <Server className="size-7" />
              </div>

              <h3 className="mt-6 text-2xl font-bold text-slate-950">
                {settings.services_empty_title}
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                {settings.services_empty_description}
              </p>
            </motion.div>
          ) : (
            <motion.div
              variants={containerAnimation}
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
                amount: 0.1,
              }}
              className="grid gap-7 md:grid-cols-2"
            >
              {services.map((service, index) => {
                const Icon =
                  iconMap[service.icon as keyof typeof iconMap] ?? Server

                const gradient = cardGradients[index % cardGradients.length]

                return (
                  <motion.article
                    key={service.id}
                    variants={cardAnimation}
                    className="group relative isolate overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950 p-7 shadow-[0_18px_50px_rgb(15_23_42/0.1)] transition duration-500 hover:-translate-y-2 hover:border-blue-400/30 hover:shadow-[0_30px_80px_rgb(15_23_42/0.2)] sm:p-8"
                  >
                    <div
                      aria-hidden="true"
                      className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${gradient} opacity-70 transition duration-500 group-hover:opacity-100`}
                    />

                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-blue-300/60 to-transparent"
                    />

                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute -right-20 -bottom-20 size-56 rounded-full border border-white/5"
                    />

                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute -right-12 -bottom-12 size-36 rounded-full border border-white/5"
                    />

                    <div className="relative flex h-full flex-col">
                      <div className="flex items-start justify-between gap-5">
                        <div className="flex size-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.08] text-blue-300 shadow-lg backdrop-blur-md transition duration-300 group-hover:scale-105 group-hover:bg-blue-500/15">
                          <Icon className="size-7" />
                        </div>

                        <span className="text-sm font-semibold tracking-[0.14em] text-slate-500">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>

                      <h3 className="mt-7 text-2xl font-bold tracking-[-0.025em] text-white sm:text-3xl">
                        {service.title}
                      </h3>

                      <p className="mt-4 leading-7 text-slate-300">
                        {service.shortDescription}
                      </p>

                      {service.highlights.length > 0 && (
                        <ul className="mt-7 space-y-3">
                          {service.highlights.map((highlight) => (
                            <li
                              key={highlight}
                              className="flex items-start gap-3 text-sm leading-6 text-slate-300"
                            >
                              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-400/10 text-blue-300">
                                <Check className="size-3.5" />
                              </span>

                              <span>{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      <div className="mt-auto pt-8">
                        <Button
                          asChild
                          variant="outline"
                          className="group/button rounded-xl border-white/15 bg-white/[0.06] text-white hover:border-blue-300/30 hover:bg-white hover:text-slate-950"
                        >
                          <Link to={`/services/${service.slug}`}>
                            {settings.service_button_text}

                            <ArrowRight className="ml-2 size-4 transition-transform duration-300 group-hover/button:translate-x-1" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </motion.article>
                )
              })}
            </motion.div>
          )}
        </div>

        {!isLoading && !hasError && services.length > 0 && (
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
              delay: 0.15,
            }}
            className="mt-12 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-semibold text-slate-950">
                Need a solution tailored to your environment?
              </p>

              <p className="mt-1 text-sm leading-6 text-slate-600">
                Our engineers can assess your current platform and recommend a
                practical modernization roadmap.
              </p>
            </div>

            <Button asChild variant="outline" className="shrink-0 rounded-xl">
              <Link to={settings.primary_button_url}>
                Speak with our team
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  )
}

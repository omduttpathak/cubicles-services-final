import { useCallback, useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Layers3,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
} from "lucide-react"
import { Link, useParams } from "react-router-dom"

import { getServiceBySlug, type Service } from "@/api/servicesApi"
import ErrorState from "@/components/common/ErrorState"
import PageLoader from "@/components/common/PageLoader"
import RichTextContent from "@/components/common/RichTextContent"
import SEO from "@/components/seo/SEO"

const serviceBenefits = [
  {
    icon: ShieldCheck,
    title: "Secure by Design",
    description:
      "Solutions are planned with security, resilience, and operational reliability built into every stage.",
  },
  {
    icon: Layers3,
    title: "Built to Scale",
    description:
      "Architectures are designed to support growth without creating unnecessary complexity or technical debt.",
  },
  {
    icon: MessageSquareText,
    title: "Expert Guidance",
    description:
      "Our specialists work closely with your team to provide practical recommendations and clear next steps.",
  },
]

export default function ServiceDetails() {
  const { slug } = useParams<{ slug: string }>()

  const [service, setService] = useState<Service | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [notFound, setNotFound] = useState(false)

  const loadService = useCallback(async () => {
    if (!slug) {
      setNotFound(true)
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setHasError(false)
      setNotFound(false)

      const response = await getServiceBySlug(slug)

      setService(response)
    } catch (error: unknown) {
      console.error(error)

      const status =
        typeof error === "object" && error !== null && "response" in error
          ? (
              error as {
                response?: {
                  status?: number
                }
              }
            ).response?.status
          : undefined

      if (status === 404) {
        setNotFound(true)
      } else {
        setHasError(true)
      }
    } finally {
      setIsLoading(false)
    }
  }, [slug])

  useEffect(() => {
    void loadService()
  }, [loadService])

  if (isLoading) {
    return <PageLoader message="Loading service..." />
  }

  if (notFound) {
    return (
      <ErrorState
        title="Service Not Found"
        message="The requested service does not exist or is no longer available."
      />
    )
  }

  if (hasError || !service) {
    return (
      <ErrorState
        title="Unable to Load Service"
        message="The service details could not be loaded."
        onRetry={() => {
          void loadService()
        }}
      />
    )
  }

  const highlights = Array.isArray(service.highlights)
    ? service.highlights.filter((highlight) => highlight.trim().length > 0)
    : []

  return (
    <>
      <SEO title={service.seoTitle} description={service.seoDescription} />

      <section className="relative overflow-hidden bg-slate-950 pt-8 pb-24 text-white sm:pb-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-56 -left-56 size-[40rem] rounded-full bg-blue-500/20 blur-[170px]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-56 bottom-0 size-[38rem] rounded-full bg-violet-500/15 blur-[170px]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)",
            backgroundSize: "76px 76px",
            maskImage:
              "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)",
          }}
        />

        <div className="relative container mx-auto max-w-6xl px-6">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 transition hover:text-white"
          >
            <ArrowLeft className="size-4" />
            Back to Services
          </Link>

          <div className="mt-16 grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr]">
            <motion.div
              initial={{
                opacity: 0,
                y: 24,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.65,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-300 backdrop-blur-sm">
                <Sparkles className="size-4" />
                Technology Service
              </div>

              <h1 className="mt-8 max-w-4xl text-5xl leading-[1.08] font-extrabold tracking-[-0.04em] sm:text-6xl lg:text-7xl">
                {service.heroTitle}
              </h1>

              <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-300 sm:text-xl">
                {service.heroDescription}
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link
                  to="/contact"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 font-semibold text-white shadow-lg shadow-blue-950/20 transition hover:bg-blue-500 focus-visible:ring-4 focus-visible:ring-blue-300/30 focus-visible:outline-none"
                >
                  Talk to Our Experts
                  <ArrowRight className="size-4" />
                </Link>

                <a
                  href="#service-overview"
                  className="inline-flex h-12 items-center justify-center rounded-xl border border-white/15 bg-white/[0.06] px-6 font-semibold text-white backdrop-blur-sm transition hover:bg-white/[0.1] focus-visible:ring-4 focus-visible:ring-white/20 focus-visible:outline-none"
                >
                  Explore the Service
                </a>
              </div>
            </motion.div>

            <motion.aside
              initial={{
                opacity: 0,
                x: 28,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                delay: 0.15,
                duration: 0.65,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative"
            >
              <div
                aria-hidden="true"
                className="absolute -inset-5 rounded-[2.5rem] bg-blue-500/10 blur-3xl"
              />

              <div className="relative rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 shadow-2xl shadow-slate-950/30 backdrop-blur-xl sm:p-10">
                <p className="text-xs font-semibold tracking-[0.16em] text-blue-300 uppercase">
                  Service Focus
                </p>

                <h2 className="mt-4 text-3xl font-bold tracking-[-0.03em]">
                  {service.title}
                </h2>

                <p className="mt-5 leading-7 text-slate-300">
                  {service.shortDescription}
                </p>

                <div className="mt-8 border-t border-white/10 pt-8">
                  <p className="text-sm font-semibold text-white">
                    What you can expect
                  </p>

                  <div className="mt-5 space-y-4">
                    {[
                      "Clear strategy and practical recommendations",
                      "Scalable implementation approach",
                      "Ongoing collaboration with experienced specialists",
                    ].map((item) => (
                      <div key={item} className="flex items-start gap-3">
                        <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-300" />
                        <span className="text-sm leading-6 text-slate-300">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.aside>
          </div>
        </div>
      </section>

      <section
        id="service-overview"
        className="relative overflow-hidden bg-white py-20 sm:py-24"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-20 -right-56 size-[36rem] rounded-full bg-blue-100/70 blur-[160px]"
        />

        <div className="relative container mx-auto max-w-6xl px-6">
          <div className="grid gap-14 lg:grid-cols-[1.25fr_0.75fr]">
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
                amount: 0.08,
              }}
              transition={{
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <p className="text-sm font-semibold tracking-[0.16em] text-blue-600 uppercase">
                Service Overview
              </p>

              <h2 className="mt-4 max-w-3xl text-4xl font-extrabold tracking-[-0.04em] text-slate-950 sm:text-5xl">
                A focused approach to {service.title}
              </h2>

              <RichTextContent
                content={service.description}
                className="mt-7 [&_p:first-child]:mt-0"
              />
            </motion.div>

            <motion.aside
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
                amount: 0.08,
              }}
              transition={{
                delay: 0.1,
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="h-fit rounded-[2rem] border border-slate-200 bg-slate-50 p-8 shadow-sm sm:p-10 lg:sticky lg:top-28"
            >
              <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
                <CheckCircle2 className="size-5" />
              </div>

              <h2 className="mt-6 text-2xl font-bold tracking-[-0.03em] text-slate-950">
                Key Capabilities
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                Core areas this service can support across your transformation
                journey.
              </p>

              {highlights.length > 0 ? (
                <ul className="mt-8 space-y-4">
                  {highlights.map((highlight) => (
                    <li
                      key={highlight}
                      className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white px-4 py-4 text-slate-700 shadow-sm"
                    >
                      <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-blue-600" />
                      <span className="leading-6">{highlight}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-8 rounded-xl border border-dashed border-slate-300 bg-white px-4 py-5 text-sm leading-6 text-slate-500">
                  Capability details for this service will be added soon.
                </p>
              )}
            </motion.aside>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-20 sm:py-24">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold tracking-[0.16em] text-blue-600 uppercase">
              Why Cubicles Services
            </p>

            <h2 className="mt-4 text-4xl font-extrabold tracking-[-0.04em] text-slate-950 sm:text-5xl">
              Built around clarity, scale, and long-term value
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              We combine technical depth with a practical delivery mindset so
              every recommendation supports your real business goals.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {serviceBenefits.map((benefit, index) => {
              const Icon = benefit.icon

              return (
                <motion.article
                  key={benefit.title}
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
                    amount: 0.15,
                  }}
                  transition={{
                    delay: index * 0.08,
                    duration: 0.55,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="rounded-[1.75rem] border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-950/5"
                >
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                    <Icon className="size-5" />
                  </div>

                  <h3 className="mt-6 text-xl font-bold text-slate-950">
                    {benefit.title}
                  </h3>

                  <p className="mt-3 leading-7 text-slate-600">
                    {benefit.description}
                  </p>
                </motion.article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-blue-600 py-20 text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 -left-40 size-96 rounded-full bg-cyan-300/20 blur-[130px]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 -bottom-48 size-[30rem] rounded-full bg-violet-500/25 blur-[150px]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.16]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.12) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />

        <div className="relative container mx-auto max-w-5xl px-6 text-center">
          <p className="text-sm font-semibold tracking-[0.16em] text-blue-100 uppercase">
            Start a Conversation
          </p>

          <h2 className="mt-4 text-4xl font-extrabold tracking-[-0.04em] sm:text-5xl">
            Ready to move forward with {service.title}?
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-blue-100">
            Speak with our technology experts about your requirements,
            priorities, and transformation goals.
          </p>

          <Link
            to="/contact"
            className="mt-9 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-7 font-semibold text-blue-600 shadow-xl shadow-blue-950/15 transition hover:bg-blue-50 focus-visible:ring-4 focus-visible:ring-white/30 focus-visible:outline-none"
          >
            Contact Our Experts
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </>
  )
}

import { useEffect, useMemo, useState } from "react"
import { ArrowRight, CheckCircle2, Cpu, Layers3, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"

import {
  getTechnologies,
  type TechnologyApiResponse,
} from "@/api/technologiesApi"
import ErrorState from "@/components/common/ErrorState"
import PageLoader from "@/components/common/PageLoader"
import { resolveMediaUrl } from "@/utils/mediaUrl"

type TechnologySectionProps = {
  title: string
  description: string
}

const containerAnimation = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const cardAnimation = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: "easeOut" as const,
    },
  },
}

export default function TechnologySection({
  title,
  description,
}: TechnologySectionProps) {
  const [technologies, setTechnologies] = useState<TechnologyApiResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  async function loadTechnologies() {
    try {
      setIsLoading(true)
      setHasError(false)

      const response = await getTechnologies()

      setTechnologies(response)
    } catch (error) {
      console.error("Unable to load technologies:", error)
      setHasError(true)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadTechnologies()
  }, [])

  const displayedTechnologies = useMemo(() => {
    return [...technologies]
      .sort((first, second) => {
        if (first.is_featured !== second.is_featured) {
          return first.is_featured ? -1 : 1
        }

        if (first.display_order !== second.display_order) {
          return first.display_order - second.display_order
        }

        return first.name.localeCompare(second.name)
      })
      .slice(0, 8)
  }, [technologies])

  const featuredTechnology = displayedTechnologies[0]
  const remainingTechnologies = displayedTechnologies.slice(1)

  if (isLoading) {
    return (
      <section className="relative overflow-hidden bg-slate-50 py-24">
        <div className="container mx-auto px-6">
          <PageLoader message="Loading technologies..." />
        </div>
      </section>
    )
  }

  if (hasError) {
    return (
      <section className="relative overflow-hidden bg-slate-50 py-24">
        <div className="container mx-auto px-6">
          <ErrorState
            title="Unable to Load Technologies"
            message="Our technology capabilities could not be loaded."
            onRetry={() => {
              void loadTechnologies()
            }}
          />
        </div>
      </section>
    )
  }

  return (
    <section className="relative overflow-hidden bg-slate-50 py-24 sm:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-56 -right-48 size-[34rem] rounded-full bg-blue-200/40 blur-[130px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-64 -left-48 size-[36rem] rounded-full bg-violet-200/30 blur-[140px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.45]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(148,163,184,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.12) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage:
            "linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)",
        }}
      />

      <div className="relative container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-14 max-w-3xl text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm">
            <Layers3 className="size-4" />
            Technology Ecosystem
          </div>

          <h2 className="mt-6 text-4xl font-bold tracking-[-0.035em] text-slate-950 sm:text-5xl">
            {title}
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            {description}
          </p>
        </motion.div>

        {displayedTechnologies.length === 0 ? (
          <EmptyTechnologyState />
        ) : (
          <>
            <motion.div
              variants={containerAnimation}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.12 }}
              className="grid items-stretch gap-6 lg:grid-cols-12"
            >
              <motion.div variants={cardAnimation} className="lg:col-span-7">
                <FeaturedTechnologyCard technology={featuredTechnology} />
              </motion.div>

              <motion.div
                variants={cardAnimation}
                className="grid gap-6 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1"
              >
                {remainingTechnologies.slice(0, 2).map((technology) => (
                  <CompactTechnologyCard
                    key={technology.id}
                    technology={technology}
                  />
                ))}
              </motion.div>
            </motion.div>

            {remainingTechnologies.length > 2 && (
              <motion.div
                variants={containerAnimation}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.12 }}
                className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              >
                {remainingTechnologies.slice(2).map((technology) => (
                  <motion.div key={technology.id} variants={cardAnimation}>
                    <StandardTechnologyCard technology={technology} />
                  </motion.div>
                ))}
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mt-12 flex justify-center"
            >
              <Link
                to="/technologies"
                className="group inline-flex items-center justify-center rounded-xl bg-slate-950 px-7 py-3.5 font-semibold text-white shadow-lg shadow-slate-950/10 transition duration-300 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-700/15"
              >
                Explore All Technologies
                <ArrowRight className="ml-2 size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </>
        )}
      </div>
    </section>
  )
}

function FeaturedTechnologyCard({
  technology,
}: {
  technology: TechnologyApiResponse
}) {
  const summary = getPlainText(technology.description)

  return (
    <Link
      to={`/technologies/${technology.slug}`}
      className="group relative flex h-full min-h-[30rem] overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-950 p-7 shadow-2xl shadow-slate-950/15 transition duration-500 hover:-translate-y-1 sm:p-9"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -right-28 size-80 rounded-full bg-blue-500/25 blur-[100px] transition duration-500 group-hover:bg-blue-500/35"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -left-32 size-96 rounded-full bg-violet-500/15 blur-[120px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 flex w-full flex-col">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <TechnologyVisual technology={technology} variant="featured" />

          <span className="inline-flex items-center gap-2 rounded-full border border-purple-400/20 bg-purple-400/10 px-3 py-1.5 text-xs font-semibold text-purple-200 backdrop-blur-sm">
            <Sparkles className="size-3.5" />
            Featured Technology
          </span>
        </div>

        <div className="mt-10">
          <p className="text-sm font-semibold tracking-[0.16em] text-blue-300 uppercase">
            {technology.category || "Technology Platform"}
          </p>

          <h3 className="mt-3 max-w-2xl text-3xl font-bold tracking-[-0.03em] text-white sm:text-4xl">
            {technology.name}
          </h3>

          {summary && (
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              {truncateText(summary, 330)}
            </p>
          )}
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <CapabilityItem label="Enterprise-ready platform" />
          <CapabilityItem label="Secure architecture" />
          <CapabilityItem label="Scalable infrastructure" />
          <CapabilityItem label="Modern engineering practices" />
        </div>

        <div className="mt-auto flex items-center justify-between gap-5 pt-10">
          <span className="inline-flex items-center text-sm font-semibold text-white">
            Explore Technology
            <ArrowRight className="ml-2 size-4 transition-transform duration-300 group-hover:translate-x-1.5" />
          </span>

          <span className="hidden text-xs font-medium tracking-[0.16em] text-slate-500 uppercase sm:block">
            Cloud and Digital Engineering
          </span>
        </div>
      </div>
    </Link>
  )
}

function CompactTechnologyCard({
  technology,
}: {
  technology: TechnologyApiResponse
}) {
  const summary = getPlainText(technology.description)

  return (
    <Link
      to={`/technologies/${technology.slug}`}
      className="group relative flex min-h-56 overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition duration-500 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-slate-200/70"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-20 -right-20 size-44 rounded-full bg-blue-100/70 blur-3xl transition duration-500 group-hover:bg-blue-200/80"
      />

      <div className="relative z-10 flex w-full flex-col">
        <div className="flex items-start justify-between gap-4">
          <TechnologyVisual technology={technology} />

          {technology.is_featured && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-700">
              <Sparkles className="size-3.5" />
              Featured
            </span>
          )}
        </div>

        <p className="mt-5 text-xs font-semibold tracking-[0.14em] text-blue-600 uppercase">
          {technology.category || "Technology"}
        </p>

        <h3 className="mt-2 text-xl font-bold tracking-[-0.02em] text-slate-950">
          {technology.name}
        </h3>

        {summary && (
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">
            {summary}
          </p>
        )}

        <span className="mt-auto inline-flex items-center pt-5 text-sm font-semibold text-slate-900 transition-colors group-hover:text-blue-700">
          View Technology
          <ArrowRight className="ml-2 size-4 transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  )
}

function StandardTechnologyCard({
  technology,
}: {
  technology: TechnologyApiResponse
}) {
  const summary = getPlainText(technology.description)

  return (
    <Link
      to={`/technologies/${technology.slug}`}
      className="group relative flex h-full min-h-72 flex-col overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition duration-500 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-slate-200/70"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-20 -right-16 size-40 rounded-full bg-blue-100/50 blur-3xl transition duration-500 group-hover:bg-blue-200/70"
      />

      <div className="relative z-10 flex h-full flex-col">
        <div className="flex items-start justify-between gap-4">
          <TechnologyVisual technology={technology} />

          {technology.is_featured && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-700">
              <Sparkles className="size-3.5" />
              Featured
            </span>
          )}
        </div>

        <p className="mt-6 text-xs font-semibold tracking-[0.14em] text-blue-600 uppercase">
          {technology.category || "Technology"}
        </p>

        <h3 className="mt-2 text-xl font-bold tracking-[-0.02em] text-slate-950">
          {technology.name}
        </h3>

        {summary && (
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
            {summary}
          </p>
        )}

        <span className="mt-auto inline-flex items-center pt-6 text-sm font-semibold text-slate-900 transition-colors group-hover:text-blue-700">
          View Technology
          <ArrowRight className="ml-2 size-4 transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  )
}

function TechnologyVisual({
  technology,
  variant = "default",
}: {
  technology: TechnologyApiResponse
  variant?: "default" | "featured"
}) {
  const isFeatured = variant === "featured"

  const containerClassName = isFeatured
    ? "flex size-20 items-center justify-center overflow-hidden rounded-2xl border border-white/15 bg-white/10 p-3 shadow-xl shadow-black/10 backdrop-blur-sm"
    : "flex size-14 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-2.5 shadow-sm"

  if (technology.logo_url) {
    return (
      <div className={containerClassName}>
        <img
          src={resolveMediaUrl(technology.logo_url) ?? undefined}
          alt={`${technology.name} logo`}
          loading="lazy"
          className="size-full object-contain"
        />
      </div>
    )
  }

  return (
    <div
      className={`${containerClassName} text-center font-mono text-xs font-bold ${
        isFeatured ? "text-blue-200" : "text-blue-700"
      }`}
    >
      {technology.icon?.trim() ? (
        <span className="line-clamp-2">{technology.icon}</span>
      ) : (
        <Cpu className={isFeatured ? "size-9" : "size-7"} />
      )}
    </div>
  )
}

function CapabilityItem({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.055] px-4 py-3 text-sm text-slate-300 backdrop-blur-sm">
      <CheckCircle2 className="size-4 shrink-0 text-blue-300" />
      <span>{label}</span>
    </div>
  )
}

function EmptyTechnologyState() {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-1/2 size-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-100/70 blur-3xl"
      />

      <div className="relative">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-700">
          <Cpu className="size-8" />
        </div>

        <h3 className="mt-6 text-2xl font-bold tracking-[-0.02em] text-slate-950">
          Technologies Coming Soon
        </h3>

        <p className="mx-auto mt-3 max-w-xl leading-7 text-slate-600">
          Our technology capabilities are currently being updated. Please check
          back soon to explore our complete technology ecosystem.
        </p>
      </div>
    </div>
  )
}

function truncateText(value: string, maximumLength: number): string {
  if (value.length <= maximumLength) {
    return value
  }

  return `${value.slice(0, maximumLength).trimEnd()}…`
}

function getPlainText(value: string): string {
  if (!value) {
    return ""
  }

  const textarea = document.createElement("textarea")

  textarea.innerHTML = value
  const decodedOnce = textarea.value

  textarea.innerHTML = decodedOnce
  const decodedTwice = textarea.value

  return decodedTwice
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

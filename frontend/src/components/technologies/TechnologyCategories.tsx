import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import {
  ArrowRight,
  Cpu,
  ExternalLink,
  Layers3,
  Server,
  Sparkles,
} from "lucide-react"
import { Link } from "react-router-dom"

import {
  getTechnologies,
  type TechnologyApiResponse,
} from "@/api/technologiesApi"
import type { TechnologyPageSettings } from "@/api/technologyPageApi"
import ErrorState from "@/components/common/ErrorState"
import PageLoader from "@/components/common/PageLoader"
import { resolveMediaUrl } from "@/utils/mediaUrl"

type TechnologyGroup = {
  category: string
  technologies: TechnologyApiResponse[]
}

type TechnologyCategoriesProps = {
  settings: TechnologyPageSettings
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
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
}

export default function TechnologyCategories({
  settings,
}: TechnologyCategoriesProps) {
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
      console.error(error)
      setHasError(true)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadTechnologies()
  }, [])

  const featuredTechnologies = useMemo(
    () => technologies.filter((technology) => technology.is_featured),
    [technologies]
  )

  const technologyGroups = useMemo<TechnologyGroup[]>(() => {
    const groups = new Map<string, TechnologyApiResponse[]>()

    technologies.forEach((technology) => {
      const existing = groups.get(technology.category) ?? []

      existing.push(technology)

      groups.set(technology.category, existing)
    })

    return Array.from(groups.entries()).map(([category, technologies]) => ({
      category,
      technologies,
    }))
  }, [technologies])

  if (isLoading) {
    return (
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="rounded-[2rem] border border-slate-200 bg-slate-50 px-8 py-20">
            <PageLoader message="Loading technologies..." />
          </div>
        </div>
      </section>
    )
  }

  if (hasError) {
    return (
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="rounded-[2rem] border border-red-100 bg-red-50/50 px-8 py-12">
            <ErrorState
              title="Unable to Load Technologies"
              message="The technology capabilities could not be loaded."
              onRetry={() => {
                void loadTechnologies()
              }}
            />
          </div>
        </div>
      </section>
    )
  }

  if (technologies.length === 0) {
    return (
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="rounded-[2rem] border border-slate-200 bg-slate-50 px-8 py-20 text-center">
            <Cpu className="mx-auto h-14 w-14 text-slate-400" />

            <h2 className="mt-6 text-3xl font-bold text-slate-950">
              {settings.empty_title}
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-600">
              {settings.empty_description}
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative overflow-hidden bg-slate-50 py-24 sm:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-56 -left-56 size-[38rem] rounded-full bg-blue-100/70 blur-[160px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-56 bottom-0 size-[38rem] rounded-full bg-cyan-100/60 blur-[170px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(148,163,184,.14) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,.14) 1px, transparent 1px)",
          backgroundSize: "76px 76px",
          maskImage:
            "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
        }}
      />

      <div className="relative container mx-auto px-6">
        {settings.show_featured && featuredTechnologies.length > 0 && (
          <motion.section
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
          >
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-purple-100 bg-purple-50 px-4 py-2 text-sm font-semibold text-purple-700">
                <Sparkles className="size-4" />
                {settings.featured_eyebrow}
              </div>

              <h2 className="mt-6 text-4xl font-extrabold tracking-[-0.03em] text-slate-950">
                {settings.featured_title}
              </h2>

              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
                {settings.featured_description}
              </p>
            </div>

            <motion.div
              variants={containerAnimation}
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
                amount: 0.15,
              }}
              className="mt-12 grid gap-7 md:grid-cols-2 xl:grid-cols-3"
            >
              {featuredTechnologies.map((technology) => (
                <motion.div key={technology.id} variants={cardAnimation}>
                  <TechnologyCard technology={technology} featured />
                </motion.div>
              ))}
            </motion.div>
          </motion.section>
        )}

        {settings.show_categories && (
          <section
            className={
              settings.show_featured && featuredTechnologies.length > 0
                ? "mt-24"
                : ""
            }
          >
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
              className="max-w-3xl"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                <Layers3 className="size-4" />
                {settings.categories_eyebrow}
              </div>

              <h2 className="mt-6 text-4xl font-extrabold tracking-[-0.03em] text-slate-950">
                {settings.categories_title}
              </h2>

              <p className="mt-5 text-lg leading-8 text-slate-600">
                {settings.categories_description}
              </p>
            </motion.div>

            <motion.div
              variants={containerAnimation}
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
                amount: 0.1,
              }}
              className="mt-14 grid gap-8 lg:grid-cols-2"
            >
              {technologyGroups.map((group) => (
                <motion.article
                  key={group.category}
                  variants={cardAnimation}
                  className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition duration-500 hover:-translate-y-2 hover:shadow-[0_30px_80px_rgb(15_23_42/0.12)]"
                >
                  <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-8 py-7">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="flex size-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                          <Server className="size-7" />
                        </div>

                        <div>
                          <h3 className="text-2xl font-bold text-slate-950">
                            {group.category}
                          </h3>

                          <p className="mt-1 text-sm text-slate-500">
                            {group.technologies.length}{" "}
                            {group.technologies.length === 1
                              ? "technology"
                              : "technologies"}
                          </p>
                        </div>
                      </div>

                      <ArrowRight className="size-5 text-slate-300" />
                    </div>
                  </div>

                  <div className="grid gap-4 p-6 sm:grid-cols-2">
                    {group.technologies.map((technology) => (
                      <TechnologyCard
                        key={technology.id}
                        technology={technology}
                      />
                    ))}
                  </div>
                </motion.article>
              ))}
            </motion.div>
          </section>
        )}
      </div>
    </section>
  )
}

type TechnologyCardProps = {
  technology: TechnologyApiResponse
  featured?: boolean
}

function TechnologyCard({ technology, featured = false }: TechnologyCardProps) {
  return (
    <Link
      to={`/technologies/${technology.slug}`}
      className={`group relative block overflow-hidden rounded-2xl border transition-all duration-500 hover:-translate-y-1 hover:shadow-xl ${
        featured
          ? "border-purple-200 bg-white p-7 hover:border-purple-300"
          : "border-slate-200 bg-white p-5 hover:border-blue-200"
      }`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-blue-100 opacity-0 blur-3xl transition duration-500 group-hover:opacity-100"
      />

      <div className="relative flex items-start gap-4">
        <TechnologyVisual technology={technology} />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h4
              className={`font-bold tracking-[-0.02em] text-slate-950 ${
                featured ? "text-xl" : "text-base"
              }`}
            >
              {technology.name}
            </h4>

            <ExternalLink className="mt-1 h-4 w-4 shrink-0 text-slate-400 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-blue-600" />
          </div>

          {featured && (
            <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-purple-100 bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
              <Sparkles className="h-3.5 w-3.5" />
              Featured Technology
            </div>
          )}

          <p
            className={`mt-4 text-slate-600 ${
              featured
                ? "line-clamp-4 text-sm leading-7"
                : "line-clamp-3 text-sm leading-6"
            }`}
          >
            {getPlainText(technology.description)}
          </p>
        </div>
      </div>
    </Link>
  )
}

function TechnologyVisual({
  technology,
}: {
  technology: TechnologyApiResponse
}) {
  if (technology.logo_url) {
    return (
      <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <img
          src={resolveMediaUrl(technology.logo_url) ?? undefined}
          alt={`${technology.name} logo`}
          className="h-9 w-9 object-contain"
          loading="lazy"
        />
      </div>
    )
  }

  return (
    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-100 px-2 text-center font-mono text-xs font-bold text-blue-700 shadow-sm">
      {technology.icon || technology.name.substring(0, 2).toUpperCase()}
    </div>
  )
}

function getPlainText(value: string): string {
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

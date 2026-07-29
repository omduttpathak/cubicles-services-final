import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, CheckCircle2, Search, Sparkles } from "lucide-react"
import { Link } from "react-router-dom"

import { getCaseStudies, type CaseStudy } from "@/api/caseStudiesApi"
import {
  getCaseStudiesPageSettings,
  type CaseStudiesPageSettings,
} from "@/api/caseStudiesPageApi"
import ErrorState from "@/components/common/ErrorState"
import PageLoader from "@/components/common/PageLoader"
import SEO from "@/components/seo/SEO"

export default function CaseStudies() {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([])
  const [settings, setSettings] = useState<CaseStudiesPageSettings | null>(null)

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedIndustry, setSelectedIndustry] = useState("all")

  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  async function loadPage() {
    try {
      setIsLoading(true)
      setHasError(false)

      const [caseStudiesResponse, settingsResponse] = await Promise.all([
        getCaseStudies(),
        getCaseStudiesPageSettings(),
      ])

      setCaseStudies(caseStudiesResponse)
      setSettings(settingsResponse)
    } catch (error) {
      console.error("Unable to load Case Studies page:", error)
      setHasError(true)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadPage()
  }, [])

  const industries = useMemo(() => {
    return Array.from(new Set(caseStudies.map((item) => item.industry))).sort()
  }, [caseStudies])

  const filteredCaseStudies = useMemo(() => {
    const keyword = searchTerm.toLowerCase().trim()

    return caseStudies.filter((caseStudy) => {
      const matchesSearch =
        !keyword ||
        caseStudy.title.toLowerCase().includes(keyword) ||
        caseStudy.summary.toLowerCase().includes(keyword) ||
        caseStudy.industry.toLowerCase().includes(keyword) ||
        caseStudy.service.toLowerCase().includes(keyword) ||
        caseStudy.technologies.some((technology) =>
          technology.toLowerCase().includes(keyword)
        )

      const matchesIndustry =
        selectedIndustry === "all" || caseStudy.industry === selectedIndustry

      return matchesSearch && matchesIndustry
    })
  }, [caseStudies, searchTerm, selectedIndustry])

  if (isLoading) {
    return <PageLoader message="Loading case studies..." />
  }

  if (hasError || !settings) {
    return (
      <ErrorState
        title="Unable to Load Case Studies"
        message="The case studies could not be loaded."
        onRetry={() => {
          void loadPage()
        }}
      />
    )
  }

  const hasFilters = Boolean(searchTerm.trim()) || selectedIndustry !== "all"

  return (
    <>
      <SEO title={settings.seo_title} description={settings.seo_description} />

      {settings.show_hero && (
        <section className="relative overflow-hidden bg-slate-950 py-24 text-white sm:py-28">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-56 -left-56 h-[38rem] w-[38rem] rounded-full bg-blue-500/15 blur-[170px]"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-56 bottom-0 h-[38rem] w-[38rem] rounded-full bg-violet-500/15 blur-[170px]"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.14]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)",
              backgroundSize: "76px 76px",
              maskImage:
                "linear-gradient(to bottom, transparent, black 14%, black 86%, transparent)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent, black 14%, black 86%, transparent)",
            }}
          />

          <div className="relative container mx-auto px-6">
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
                duration: 0.6,
              }}
              className="mx-auto max-w-4xl text-center"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-300">
                <Sparkles className="h-4 w-4" />
                {settings.hero_eyebrow}
              </div>

              <h1 className="mt-8 text-5xl leading-tight font-extrabold tracking-[-0.04em] sm:text-6xl">
                {settings.hero_title}
              </h1>

              <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-slate-300">
                {settings.hero_description}
              </p>
            </motion.div>
          </div>
        </section>
      )}

      {settings.show_case_studies && (
        <section className="relative overflow-hidden bg-slate-50 py-24 sm:py-28">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-56 -right-56 size-[38rem] rounded-full bg-blue-100/70 blur-[160px]"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-56 -left-56 size-[38rem] rounded-full bg-violet-100/60 blur-[170px]"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.14]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(148,163,184,.14) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,.14) 1px, transparent 1px)",
              backgroundSize: "76px 76px",
              maskImage:
                "linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)",
            }}
          />

          <div className="relative container mx-auto px-6">
            {settings.show_filters && (
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
                  amount: 0.2,
                }}
                transition={{
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="mb-14 rounded-[2rem] border border-slate-200 bg-white/90 p-5 shadow-[0_20px_60px_rgb(15_23_42/0.08)] backdrop-blur-xl sm:p-6"
              >
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
                  <div className="relative min-w-0 flex-1">
                    <Search className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-slate-400" />

                    <input
                      type="search"
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                      placeholder={settings.search_placeholder}
                      aria-label={settings.search_placeholder}
                      className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 pr-5 pl-12 text-slate-900 transition outline-none placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />
                  </div>

                  <select
                    value={selectedIndustry}
                    onChange={(event) =>
                      setSelectedIndustry(event.target.value)
                    }
                    aria-label={settings.all_industries_label}
                    className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 text-slate-700 transition outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100 xl:max-w-xs"
                  >
                    <option value="all">{settings.all_industries_label}</option>

                    {industries.map((industry) => (
                      <option key={industry} value={industry}>
                        {industry}
                      </option>
                    ))}
                  </select>

                  {hasFilters && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchTerm("")
                        setSelectedIndustry("all")
                      }}
                      className="h-14 shrink-0 rounded-2xl border border-slate-200 bg-white px-6 font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 focus-visible:ring-4 focus-visible:ring-blue-100 focus-visible:outline-none"
                    >
                      {settings.clear_filters_text}
                    </button>
                  )}
                </div>

                <div className="mt-5 flex flex-col gap-2 border-t border-slate-100 pt-5 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                  <p>
                    Showing{" "}
                    <span className="font-semibold text-slate-900">
                      {filteredCaseStudies.length}
                    </span>{" "}
                    {filteredCaseStudies.length === 1
                      ? "case study"
                      : "case studies"}
                  </p>

                  {hasFilters && (
                    <p className="text-blue-700">
                      Filters are currently active
                    </p>
                  )}
                </div>
              </motion.div>
            )}

            {filteredCaseStudies.length === 0 ? (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="mx-auto max-w-3xl rounded-[2rem] border border-slate-200 bg-white px-8 py-20 text-center shadow-sm"
              >
                <div className="mx-auto flex size-16 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-700">
                  <Search className="size-7" />
                </div>

                <h2 className="mt-7 text-3xl font-bold tracking-[-0.025em] text-slate-950">
                  {settings.empty_title}
                </h2>

                <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-slate-600">
                  {hasFilters
                    ? settings.filtered_empty_description
                    : settings.empty_description}
                </p>

                {hasFilters && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchTerm("")
                      setSelectedIndustry("all")
                    }}
                    className="mt-8 inline-flex h-12 items-center justify-center rounded-xl bg-blue-600 px-6 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 focus-visible:ring-4 focus-visible:ring-blue-200 focus-visible:outline-none"
                  >
                    {settings.clear_filters_text}
                  </button>
                )}
              </motion.div>
            ) : (
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{
                  once: true,
                  amount: 0.08,
                }}
                variants={{
                  hidden: {},
                  visible: {
                    transition: {
                      staggerChildren: 0.1,
                    },
                  },
                }}
                className="grid gap-8 lg:grid-cols-2"
              >
                {filteredCaseStudies.map((caseStudy) => (
                  <motion.article
                    key={caseStudy.id}
                    variants={{
                      hidden: {
                        opacity: 0,
                        y: 30,
                      },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: {
                          duration: 0.6,
                          ease: [0.22, 1, 0.36, 1] as const,
                        },
                      },
                    }}
                    className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition duration-500 hover:-translate-y-2 hover:border-blue-200 hover:shadow-[0_30px_90px_rgb(15_23_42/0.14)]"
                  >
                    <div className="relative overflow-hidden">
                      {caseStudy.imageUrl ? (
                        <img
                          src={caseStudy.imageUrl}
                          alt={caseStudy.title}
                          className="h-64 w-full object-cover transition duration-700 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="relative flex h-64 items-center justify-center overflow-hidden bg-slate-950 px-8 text-center">
                          <div
                            aria-hidden="true"
                            className="pointer-events-none absolute -top-24 -left-20 size-64 rounded-full bg-blue-500/20 blur-[90px]"
                          />

                          <div
                            aria-hidden="true"
                            className="pointer-events-none absolute -right-20 -bottom-28 size-64 rounded-full bg-violet-500/20 blur-[100px]"
                          />

                          <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0 opacity-[0.12]"
                            style={{
                              backgroundImage:
                                "linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)",
                              backgroundSize: "46px 46px",
                            }}
                          />

                          <div className="relative">
                            <p className="text-sm font-semibold tracking-[0.16em] text-blue-300 uppercase">
                              {caseStudy.industry}
                            </p>

                            <p className="mt-4 text-3xl font-bold tracking-[-0.025em] text-white">
                              {caseStudy.service}
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/50 to-transparent" />

                      <div className="absolute bottom-5 left-5 flex flex-wrap gap-2">
                        <span className="rounded-full border border-white/20 bg-slate-950/65 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
                          {caseStudy.industry}
                        </span>

                        <span className="rounded-full border border-white/20 bg-white/90 px-3 py-1.5 text-xs font-semibold text-slate-800 backdrop-blur-md">
                          {caseStudy.service}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col p-7 sm:p-8">
                      <h2 className="text-2xl leading-tight font-bold tracking-[-0.025em] text-slate-950 sm:text-3xl">
                        {caseStudy.title}
                      </h2>

                      <p className="mt-5 leading-7 text-slate-600">
                        {caseStudy.summary}
                      </p>

                      {settings.show_results &&
                        caseStudy.results.length > 0 && (
                          <div className="mt-7 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5">
                            <h3 className="flex items-center gap-2 font-bold text-slate-950">
                              <CheckCircle2 className="size-5 text-emerald-600" />
                              {settings.results_heading}
                            </h3>

                            <ul className="mt-4 space-y-3">
                              {caseStudy.results.slice(0, 3).map((result) => (
                                <li
                                  key={result}
                                  className="flex items-start gap-3 text-sm leading-6 text-slate-700"
                                >
                                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />

                                  <span>{result}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                      {settings.show_technologies &&
                        caseStudy.technologies.length > 0 && (
                          <div className="mt-7">
                            <p className="text-xs font-semibold tracking-[0.14em] text-slate-400 uppercase">
                              Technologies
                            </p>

                            <div className="mt-3 flex flex-wrap gap-2">
                              {caseStudy.technologies.map((technology) => (
                                <span
                                  key={technology}
                                  className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600"
                                >
                                  {technology}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                      <div className="mt-auto pt-8">
                        <Link
                          to={`/case-studies/${caseStudy.slug}`}
                          className="inline-flex items-center rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-600 focus-visible:ring-4 focus-visible:ring-blue-200 focus-visible:outline-none"
                        >
                          {settings.view_button_text}

                          <ArrowRight className="ml-2 size-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </motion.div>
            )}
          </div>
        </section>
      )}
    </>
  )
}

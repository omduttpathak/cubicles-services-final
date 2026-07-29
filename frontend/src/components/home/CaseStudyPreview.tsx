import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, BriefcaseBusiness, CalendarDays } from "lucide-react"
import { Link } from "react-router-dom"

import { getCaseStudies, type CaseStudy } from "@/api/caseStudiesApi"
import ErrorState from "@/components/common/ErrorState"
import PageLoader from "@/components/common/PageLoader"

type CaseStudyPreviewProps = {
  title: string
  description: string
}

export default function CaseStudyPreview({
  title,
  description,
}: CaseStudyPreviewProps) {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  async function loadCaseStudies() {
    try {
      setIsLoading(true)
      setHasError(false)

      const response = await getCaseStudies()

      setCaseStudies(response)
    } catch (error) {
      console.error("Unable to load case studies:", error)
      setHasError(true)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadCaseStudies()
  }, [])

  const displayedCaseStudies = useMemo(() => {
    return [...caseStudies]
      .sort(
        (first, second) =>
          getDateTimestamp(second.publishedAt) -
          getDateTimestamp(first.publishedAt)
      )
      .slice(0, 3)
  }, [caseStudies])

  if (isLoading) {
    return (
      <section className="bg-white py-20 sm:py-24">
        <div className="container mx-auto px-6">
          <PageLoader message="Loading case studies..." />
        </div>
      </section>
    )
  }

  if (hasError) {
    return (
      <section className="bg-white py-20 sm:py-24">
        <div className="container mx-auto px-6">
          <ErrorState
            title="Unable to Load Case Studies"
            message="Our featured case studies could not be loaded."
            onRetry={() => {
              void loadCaseStudies()
            }}
          />
        </div>
      </section>
    )
  }

  return (
    <section className="relative overflow-hidden bg-white py-20 sm:py-24 lg:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-1/2 h-px w-[80%] -translate-x-1/2 bg-gradient-to-r from-transparent via-slate-200 to-transparent"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -right-32 h-80 w-80 rounded-full bg-blue-100/60 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-violet-100/50 blur-3xl"
      />

      <div className="relative container mx-auto px-6">
        <div className="mb-12 flex flex-col gap-7 lg:mb-14 lg:flex-row lg:items-end lg:justify-between">
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
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3.5 py-1.5 text-sm font-semibold text-blue-700">
              <BriefcaseBusiness className="size-4" />
              Featured Work
            </div>

            <h2 className="mt-5 text-4xl leading-tight font-extrabold tracking-[-0.035em] text-slate-950 sm:text-5xl">
              {title}
            </h2>

            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              {description}
            </p>
          </motion.div>

          {displayedCaseStudies.length > 0 && (
            <motion.div
              initial={{
                opacity: 0,
                y: 18,
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
                duration: 0.5,
                delay: 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <Link
                to="/case-studies"
                className="group inline-flex items-center gap-2 font-semibold text-slate-700 transition hover:text-blue-600"
              >
                Explore all case studies
                <span className="flex size-9 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm transition duration-300 group-hover:translate-x-1 group-hover:border-blue-200 group-hover:bg-blue-50">
                  <ArrowRight className="size-4" />
                </span>
              </Link>
            </motion.div>
          )}
        </div>

        {displayedCaseStudies.length === 0 ? (
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
            className="rounded-[2rem] border border-slate-200 bg-slate-50 px-6 py-16 text-center shadow-sm"
          >
            <div className="mx-auto flex size-16 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-600">
              <BriefcaseBusiness className="size-8" />
            </div>

            <h3 className="mt-6 text-2xl font-bold text-slate-950">
              Case Studies Coming Soon
            </h3>

            <p className="mx-auto mt-3 max-w-xl leading-7 text-slate-600">
              Customer success stories will appear here when published.
            </p>
          </motion.div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-12">
            {displayedCaseStudies.map((caseStudy, index) => (
              <CaseStudyCard
                key={caseStudy.id}
                caseStudy={caseStudy}
                index={index}
                isFeatured={index === 0}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function CaseStudyCard({
  caseStudy,
  index,
  isFeatured,
}: {
  caseStudy: CaseStudy
  index: number
  isFeatured: boolean
}) {
  const caseStudyUrl = `/case-studies/${caseStudy.slug}`

  return (
    <motion.article
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
        amount: 0.15,
      }}
      transition={{
        duration: 0.55,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={
        isFeatured
          ? "group relative overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950 shadow-[0_28px_80px_rgb(15_23_42/0.18)] lg:col-span-7 lg:row-span-2"
          : "group relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_15px_45px_rgb(15_23_42/0.07)] transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_22px_60px_rgb(15_23_42/0.12)] lg:col-span-5"
      }
    >
      {isFeatured ? (
        <FeaturedCardContent
          caseStudy={caseStudy}
          caseStudyUrl={caseStudyUrl}
        />
      ) : (
        <StandardCardContent
          caseStudy={caseStudy}
          caseStudyUrl={caseStudyUrl}
        />
      )}
    </motion.article>
  )
}

function FeaturedCardContent({
  caseStudy,
  caseStudyUrl,
}: {
  caseStudy: CaseStudy
  caseStudyUrl: string
}) {
  return (
    <div className="relative flex min-h-[36rem] flex-col sm:min-h-[34rem]">
      {caseStudy.imageUrl ? (
        <img
          src={caseStudy.imageUrl}
          alt={caseStudy.title}
          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgb(59_130_246/0.28),transparent_40%),linear-gradient(145deg,#0f172a,#020617)]">
          <div className="flex h-full items-center justify-center">
            <BriefcaseBusiness className="size-20 text-blue-300/30" />
          </div>
        </div>
      )}

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/15"
      />

      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-slate-950 to-transparent"
      />

      <Link
        to={caseStudyUrl}
        aria-label={`View ${caseStudy.title}`}
        className="absolute inset-0 z-10"
      />

      <div className="pointer-events-none relative z-20 mt-auto p-7 sm:p-8 lg:p-10">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-blue-300/20 bg-blue-400/15 px-3 py-1.5 text-xs font-semibold text-blue-200 backdrop-blur-md">
            {caseStudy.industry}
          </span>

          <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-slate-200 backdrop-blur-md">
            {caseStudy.service}
          </span>
        </div>

        <h3 className="mt-5 max-w-2xl text-3xl leading-tight font-bold tracking-tight text-white sm:text-4xl">
          {caseStudy.title}
        </h3>

        <p className="mt-4 line-clamp-3 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
          {caseStudy.summary}
        </p>

        <div className="mt-7 flex flex-col gap-5 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center text-sm text-slate-400">
            <CalendarDays className="mr-2 size-4" />

            {formatPublishedDate(caseStudy.publishedAt)}
          </div>

          <span className="inline-flex items-center gap-2 font-semibold text-white">
            View Case Study
            <span className="flex size-9 items-center justify-center rounded-full border border-white/15 bg-white/10 transition duration-300 group-hover:translate-x-1 group-hover:bg-white/15">
              <ArrowRight className="size-4" />
            </span>
          </span>
        </div>
      </div>
    </div>
  )
}

function StandardCardContent({
  caseStudy,
  caseStudyUrl,
}: {
  caseStudy: CaseStudy
  caseStudyUrl: string
}) {
  return (
    <Link to={caseStudyUrl} className="flex h-full min-h-64">
      <div className="hidden w-36 shrink-0 overflow-hidden bg-slate-100 sm:block">
        {caseStudy.imageUrl ? (
          <img
            src={caseStudy.imageUrl}
            alt={caseStudy.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100">
            <BriefcaseBusiness className="size-10 text-blue-300" />
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col p-6 sm:p-7">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
            {caseStudy.industry}
          </span>

          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
            {caseStudy.service}
          </span>
        </div>

        <h3 className="mt-4 text-xl leading-7 font-bold tracking-tight text-slate-950 transition group-hover:text-blue-600">
          {caseStudy.title}
        </h3>

        <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">
          {caseStudy.summary}
        </p>

        <div className="mt-auto flex items-end justify-between gap-4 pt-6">
          <div className="flex items-center text-xs text-slate-500">
            <CalendarDays className="mr-2 size-4" />

            {formatPublishedDate(caseStudy.publishedAt)}
          </div>

          <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-700 transition duration-300 group-hover:translate-x-1 group-hover:border-blue-200 group-hover:bg-blue-50 group-hover:text-blue-600">
            <ArrowRight className="size-4" />
          </span>
        </div>
      </div>
    </Link>
  )
}

function getDateTimestamp(value: string): number {
  const timestamp = new Date(value).getTime()

  return Number.isNaN(timestamp) ? 0 : timestamp
}

function formatPublishedDate(value: string): string {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable"
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

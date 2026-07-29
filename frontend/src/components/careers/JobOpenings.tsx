import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  ArrowRight,
  Briefcase,
  Clock,
  MapPin,
  Send,
  Sparkles,
} from "lucide-react"

import type { CareerPageSettings } from "@/api/careerPageApi"
import { getJobOpenings, type PublicJobOpening } from "@/api/jobOpeningsApi"
import CareerApplicationForm from "@/components/careers/CareerApplicationForm"
import ErrorState from "@/components/common/ErrorState"
import PageLoader from "@/components/common/PageLoader"

type SelectedJob = {
  title: string
  experience: string
}

type JobOpeningsProps = {
  settings: CareerPageSettings
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 28,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
}

export default function JobOpenings({ settings }: JobOpeningsProps) {
  const [jobs, setJobs] = useState<PublicJobOpening[]>([])
  const [selectedJob, setSelectedJob] = useState<SelectedJob | null>(null)

  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  async function loadJobOpenings() {
    try {
      setIsLoading(true)
      setHasError(false)

      const response = await getJobOpenings()

      setJobs(response)
    } catch (error) {
      console.error("Unable to load job openings:", error)
      setHasError(true)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadJobOpenings()
  }, [])

  return (
    <>
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
            className="mb-14 max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
              <Sparkles className="size-4" />
              {settings.openings_eyebrow}
            </div>

            <h2 className="mt-6 text-4xl leading-tight font-extrabold tracking-[-0.035em] text-slate-950 sm:text-5xl">
              {settings.openings_title}
            </h2>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              {settings.openings_description}
            </p>

            {!isLoading && !hasError && jobs.length > 0 && (
              <div className="mt-7 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-600 shadow-sm">
                <Briefcase className="size-4 text-blue-600" />

                <span>
                  <strong className="font-semibold text-slate-950">
                    {jobs.length}
                  </strong>{" "}
                  {jobs.length === 1 ? "open position" : "open positions"}
                </span>
              </div>
            )}
          </motion.div>

          {isLoading ? (
            <div className="rounded-[2rem] border border-slate-200 bg-white py-10 shadow-sm">
              <PageLoader message="Loading job openings..." />
            </div>
          ) : hasError ? (
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <ErrorState
                title="Unable to Load Job Openings"
                message="The current job openings could not be loaded."
                onRetry={() => {
                  void loadJobOpenings()
                }}
              />
            </div>
          ) : jobs.length === 0 ? (
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
                <Briefcase className="size-7" />
              </div>

              <h3 className="mt-7 text-3xl font-bold tracking-[-0.025em] text-slate-950">
                {settings.empty_title}
              </h3>

              <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-slate-600">
                {settings.empty_description}
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
                amount: 0.06,
              }}
              variants={containerVariants}
              className="space-y-6"
            >
              {jobs.map((job, index) => (
                <motion.article
                  key={job.id}
                  variants={cardVariants}
                  className="group relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition duration-500 hover:-translate-y-1.5 hover:border-blue-200 hover:shadow-[0_28px_80px_rgb(15_23_42/0.13)]"
                >
                  <div
                    aria-hidden="true"
                    className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-blue-500 via-cyan-400 to-violet-500 opacity-0 transition duration-500 group-hover:opacity-100"
                  />

                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-28 -right-28 size-64 rounded-full bg-blue-100/0 blur-[90px] transition duration-500 group-hover:bg-blue-100/70"
                  />

                  <div className="relative p-7 sm:p-8 lg:p-10">
                    <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-bold tracking-[0.1em] text-blue-700 uppercase">
                            Position {String(index + 1).padStart(2, "0")}
                          </span>

                          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
                            {job.employment_type}
                          </span>
                        </div>

                        <h3 className="mt-5 text-2xl leading-tight font-bold tracking-[-0.025em] text-slate-950 sm:text-3xl">
                          {job.title}
                        </h3>

                        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-slate-600">
                          <span className="flex items-center gap-2">
                            <span className="flex size-8 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                              <MapPin className="size-4" />
                            </span>

                            {job.location}
                          </span>

                          <span className="flex items-center gap-2">
                            <span className="flex size-8 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                              <Briefcase className="size-4" />
                            </span>

                            {job.employment_type}
                          </span>

                          <span className="flex items-center gap-2">
                            <span className="flex size-8 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                              <Clock className="size-4" />
                            </span>

                            {job.experience}
                          </span>
                        </div>

                        <p className="mt-6 max-w-4xl leading-7 text-slate-600">
                          {job.short_description}
                        </p>

                        {job.skills.length > 0 && (
                          <div className="mt-7">
                            <p className="text-xs font-bold tracking-[0.12em] text-slate-400 uppercase">
                              Key skills
                            </p>

                            <div className="mt-3 flex flex-wrap gap-2">
                              {job.skills.map((skill) => (
                                <span
                                  key={skill}
                                  className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600 transition group-hover:border-blue-100 group-hover:bg-blue-50/60 group-hover:text-blue-700"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex shrink-0 flex-col items-stretch gap-3 lg:items-end">
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedJob({
                              title: job.title,
                              experience: job.experience,
                            })
                          }
                          className="inline-flex h-12 items-center justify-center rounded-xl bg-slate-950 px-6 font-semibold text-white shadow-lg shadow-slate-950/10 transition hover:bg-blue-600 focus-visible:ring-4 focus-visible:ring-blue-200 focus-visible:outline-none"
                        >
                          <Send className="mr-2 size-4" />
                          {settings.apply_button_text}
                          <ArrowRight className="ml-2 size-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </button>

                        <p className="text-center text-xs text-slate-400 lg:text-right">
                          Application takes only a few minutes
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      <CareerApplicationForm
        position={selectedJob?.title ?? ""}
        defaultExperience={selectedJob?.experience}
        settings={settings}
        isOpen={selectedJob !== null}
        onClose={() => setSelectedJob(null)}
      />
    </>
  )
}

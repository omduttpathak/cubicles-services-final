import { useCallback, useEffect, useState } from "react"
import axios from "axios"
import { ArrowLeft, CheckCircle2, Layers3 } from "lucide-react"
import { Link, useParams } from "react-router-dom"

import {
  getCaseStudyBySlug,
  type CaseStudyDetails as CaseStudyDetailsType,
} from "@/api/caseStudiesApi"
import ErrorState from "@/components/common/ErrorState"
import PageLoader from "@/components/common/PageLoader"
import RichTextContent from "@/components/common/RichTextContent"
import SEO from "@/components/seo/SEO"

export default function CaseStudyDetails() {
  const { slug } = useParams<{ slug: string }>()

  const [caseStudy, setCaseStudy] = useState<CaseStudyDetailsType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [notFound, setNotFound] = useState(false)

  const loadCaseStudy = useCallback(async () => {
    if (!slug) {
      setNotFound(true)
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setHasError(false)
      setNotFound(false)

      const response = await getCaseStudyBySlug(slug)

      setCaseStudy(response)
    } catch (error) {
      console.error(error)

      if (axios.isAxiosError(error) && error.response?.status === 404) {
        setNotFound(true)
      } else {
        setHasError(true)
      }
    } finally {
      setIsLoading(false)
    }
  }, [slug])

  useEffect(() => {
    void loadCaseStudy()
  }, [loadCaseStudy])

  if (isLoading) {
    return <PageLoader message="Loading case study..." />
  }

  if (notFound) {
    return (
      <ErrorState
        title="Case Study Not Found"
        message="The requested case study does not exist or is no longer published."
      />
    )
  }

  if (hasError || !caseStudy) {
    return (
      <ErrorState
        title="Unable to Load Case Study"
        message="The case study could not be loaded."
        onRetry={() => {
          void loadCaseStudy()
        }}
      />
    )
  }

  return (
    <>
      <SEO title={caseStudy.seoTitle} description={caseStudy.seoDescription} />

      <article>
        <header className="bg-slate-950 py-20 text-white">
          <div className="container mx-auto px-6">
            <div className="mx-auto max-w-5xl">
              <Link
                to="/case-studies"
                className="inline-flex items-center text-sm font-semibold text-blue-300 transition hover:text-white"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Case Studies
              </Link>

              <div className="mt-10 flex flex-wrap gap-3">
                <span className="rounded-full bg-blue-500/20 px-4 py-2 text-sm font-semibold text-blue-300">
                  {caseStudy.industry}
                </span>

                <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-slate-200">
                  {caseStudy.service}
                </span>
              </div>

              <h1 className="mt-6 max-w-4xl text-4xl leading-tight font-bold md:text-5xl">
                {caseStudy.title}
              </h1>

              <p className="mt-6 max-w-3xl text-xl leading-8 text-slate-300">
                {caseStudy.summary}
              </p>
            </div>
          </div>
        </header>

        {caseStudy.imageUrl && (
          <div className="container mx-auto px-6">
            <img
              src={caseStudy.imageUrl}
              alt={caseStudy.title}
              className="mx-auto -mt-10 max-h-[520px] w-full max-w-6xl rounded-2xl object-cover shadow-xl"
            />
          </div>
        )}

        <section className="bg-white py-20">
          <div className="container mx-auto px-6">
            <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_360px]">
              <div className="space-y-12">
                <div>
                  <p className="font-semibold tracking-wider text-blue-600 uppercase">
                    The Challenge
                  </p>

                  <h2 className="mt-3 text-3xl font-bold text-slate-900">
                    Business Challenge
                  </h2>

                  <RichTextContent
                    content={caseStudy.challenge}
                    className="mt-5"
                  />
                </div>

                <div>
                  <p className="font-semibold tracking-wider text-blue-600 uppercase">
                    Our Approach
                  </p>

                  <h2 className="mt-3 text-3xl font-bold text-slate-900">
                    Solution Delivered
                  </h2>

                  <RichTextContent
                    content={caseStudy.solution}
                    className="mt-5"
                  />
                </div>
              </div>

              <aside className="space-y-6">
                <div className="rounded-2xl bg-slate-50 p-7">
                  <h2 className="text-xl font-bold text-slate-900">Results</h2>

                  <ul className="mt-5 space-y-4">
                    {caseStudy.results.map((result) => (
                      <li
                        key={result}
                        className="flex items-start gap-3 text-slate-700"
                      >
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                        <span>{result}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-7">
                  <div className="flex items-center gap-3">
                    <Layers3 className="h-5 w-5 text-blue-600" />

                    <h2 className="text-xl font-bold text-slate-900">
                      Technologies
                    </h2>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {caseStudy.technologies.map((technology) => (
                      <span
                        key={technology}
                        className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700"
                      >
                        {technology}
                      </span>
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section className="bg-blue-600 py-16 text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold">
              Ready to Start Your Transformation?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-blue-100">
              Speak with our experts about your cloud, DevOps and application
              modernization goals.
            </p>

            <Link
              to="/contact"
              className="mt-8 inline-flex rounded-lg bg-white px-7 py-3 font-semibold text-blue-600 transition hover:bg-blue-50"
            >
              Contact Our Experts
            </Link>
          </div>
        </section>
      </article>
    </>
  )
}

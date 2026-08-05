import { useCallback, useEffect, useState } from "react"
import axios from "axios"
import { ArrowLeft, CheckCircle2, Cpu, Sparkles } from "lucide-react"
import { Link, useParams } from "react-router-dom"

import {
  getTechnologyBySlug,
  type TechnologyDetailsApiResponse,
} from "@/api/technologiesApi"
import ErrorState from "@/components/common/ErrorState"
import PageLoader from "@/components/common/PageLoader"
import RichTextContent from "@/components/common/RichTextContent"
import SEO from "@/components/seo/SEO"
import { resolveMediaUrl } from "@/utils/mediaUrl"

export default function TechnologyDetails() {
  const { slug } = useParams<{
    slug: string
  }>()

  const [technology, setTechnology] =
    useState<TechnologyDetailsApiResponse | null>(null)

  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [notFound, setNotFound] = useState(false)

  const loadTechnology = useCallback(async () => {
    if (!slug) {
      setNotFound(true)
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setHasError(false)
      setNotFound(false)

      const response = await getTechnologyBySlug(slug)

      setTechnology(response)
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
    void loadTechnology()
  }, [loadTechnology])

  if (isLoading) {
    return <PageLoader message="Loading technology..." />
  }

  if (notFound) {
    return (
      <ErrorState
        title="Technology Not Found"
        message="The requested technology does not exist or is no longer available."
      />
    )
  }

  if (hasError || !technology) {
    return (
      <ErrorState
        title="Unable to Load Technology"
        message="The technology details could not be loaded."
        onRetry={() => {
          void loadTechnology()
        }}
      />
    )
  }

  return (
    <>
      <SEO
        title={technology.seo_title}
        description={technology.seo_description}
      />

      <article>
        <header className="bg-slate-950 py-20 text-white">
          <div className="container mx-auto px-6">
            <div className="mx-auto max-w-5xl">
              <Link
                to="/technologies"
                className="inline-flex items-center text-sm font-semibold text-blue-300 transition hover:text-white"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Technologies
              </Link>

              <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-center">
                <TechnologyVisual technology={technology} />

                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-blue-500/20 px-4 py-2 text-sm font-semibold text-blue-300">
                      {technology.category}
                    </span>

                    {technology.is_featured && (
                      <span className="inline-flex items-center rounded-full bg-purple-500/20 px-4 py-2 text-sm font-semibold text-purple-200">
                        <Sparkles className="mr-2 h-4 w-4" />
                        Featured Technology
                      </span>
                    )}
                  </div>

                  <h1 className="mt-5 text-4xl leading-tight font-bold md:text-5xl">
                    {technology.name}
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </header>

        <section className="bg-white py-20">
          <div className="container mx-auto px-6">
            <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_340px]">
              <div>
                <p className="font-semibold tracking-wider text-blue-600 uppercase">
                  Overview
                </p>

                <h2 className="mt-3 text-3xl font-bold text-slate-900">
                  How We Use {technology.name}
                </h2>

                <RichTextContent
                  content={technology.description}
                  className="mt-6"
                />
              </div>

              <aside className="space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-7">
                  <h2 className="text-xl font-bold text-slate-900">
                    Technology Details
                  </h2>

                  <dl className="mt-5 space-y-4">
                    <div>
                      <dt className="text-sm font-semibold text-slate-500">
                        Category
                      </dt>

                      <dd className="mt-1 font-semibold text-slate-900">
                        {technology.category}
                      </dd>
                    </div>

                    <div>
                      <dt className="text-sm font-semibold text-slate-500">
                        Technology
                      </dt>

                      <dd className="mt-1 font-semibold text-slate-900">
                        {technology.name}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="rounded-2xl border border-blue-200 bg-blue-50 p-7">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-blue-600" />

                    <h2 className="text-xl font-bold text-slate-900">
                      Need This Expertise?
                    </h2>
                  </div>

                  <p className="mt-4 leading-7 text-slate-600">
                    Speak with our team about using
                    {` ${technology.name} `}
                    in your cloud, application or infrastructure project.
                  </p>

                  <Link
                    to="/contact"
                    className="mt-6 inline-flex rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
                  >
                    Contact Our Experts
                  </Link>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </article>
    </>
  )
}

function TechnologyVisual({
  technology,
}: {
  technology: TechnologyDetailsApiResponse
}) {
  if (technology.logo_url) {
    return (
      <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white p-4 shadow-lg">
        <img
          src={resolveMediaUrl(technology.logo_url) ?? undefined}
          alt={`${technology.name} logo`}
          className="h-full w-full object-contain"
        />
      </div>
    )
  }

  return (
    <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-blue-600/20 text-blue-300">
      <Cpu className="h-10 w-10" />
    </div>
  )
}

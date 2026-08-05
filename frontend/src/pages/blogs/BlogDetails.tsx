import { useCallback, useEffect, useState } from "react"
import axios from "axios"
import { ArrowLeft, CalendarDays, UserRound } from "lucide-react"
import { Link, useParams } from "react-router-dom"

import {
  getBlogBySlug,
  type BlogDetails as BlogDetailsType,
} from "@/api/blogsApi"
import ErrorState from "@/components/common/ErrorState"
import PageLoader from "@/components/common/PageLoader"
import RichTextContent from "@/components/common/RichTextContent"
import SEO from "@/components/seo/SEO"
import { resolveMediaUrl } from "@/utils/mediaUrl"

export default function BlogDetails() {
  const { slug } = useParams<{
    slug: string
  }>()

  const [blog, setBlog] = useState<BlogDetailsType | null>(null)

  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [notFound, setNotFound] = useState(false)

  const loadBlog = useCallback(async () => {
    if (!slug) {
      setNotFound(true)
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setHasError(false)
      setNotFound(false)

      const response = await getBlogBySlug(slug)

      setBlog(response)
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
    void loadBlog()
  }, [loadBlog])

  if (isLoading) {
    return <PageLoader message="Loading article..." />
  }

  if (notFound) {
    return (
      <ErrorState
        title="Article Not Found"
        message="The requested article does not exist or is no longer published."
      />
    )
  }

  if (hasError || !blog) {
    return (
      <ErrorState
        title="Unable to Load Article"
        message="The article could not be loaded."
        onRetry={() => {
          void loadBlog()
        }}
      />
    )
  }

  return (
    <>
      <SEO title={blog.seoTitle} description={blog.seoDescription} />

      <article>
        <header className="bg-slate-950 py-20 text-white">
          <div className="container mx-auto px-6">
            <div className="mx-auto max-w-4xl">
              <Link
                to="/blogs"
                className="inline-flex items-center text-sm font-semibold text-blue-300 transition hover:text-white"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blogs
              </Link>

              <span className="mt-10 block w-fit rounded-full bg-blue-500/20 px-4 py-2 text-sm font-semibold text-blue-300">
                {blog.category}
              </span>

              <h1 className="mt-6 text-4xl leading-tight font-bold md:text-5xl">
                {blog.title}
              </h1>

              <p className="mt-6 text-xl leading-8 text-slate-300">
                {blog.excerpt}
              </p>

              <div className="mt-8 flex flex-wrap gap-6 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <UserRound className="h-4 w-4" />
                  {blog.author}
                </div>

                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />

                  {new Date(blog.publishedAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </div>
              </div>
            </div>
          </div>
        </header>

        {blog.imageUrl && (
          <div className="container mx-auto px-6">
            <img
              src={resolveMediaUrl(blog.imageUrl) ?? undefined}
              alt={blog.title}
              className="mx-auto -mt-10 max-h-[520px] w-full max-w-5xl rounded-2xl object-cover shadow-xl"
            />
          </div>
        )}

        <section className="bg-white py-20">
          <div className="container mx-auto px-6">
            <div className="mx-auto max-w-3xl">
              <RichTextContent content={blog.content} />

              <div className="mt-14 rounded-2xl bg-blue-50 p-8">
                <h2 className="text-2xl font-bold text-slate-900">
                  Need Help With Your Technology Strategy?
                </h2>

                <p className="mt-3 leading-7 text-slate-600">
                  Speak with our cloud, DevOps and application modernization
                  experts about your business requirements.
                </p>

                <Link
                  to="/contact"
                  className="mt-6 inline-flex rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
                >
                  Contact Our Experts
                </Link>
              </div>
            </div>
          </div>
        </section>
      </article>
    </>
  )
}

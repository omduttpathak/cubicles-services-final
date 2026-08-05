import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Search,
  Sparkles,
} from "lucide-react"
import { Link } from "react-router-dom"

import { getBlogs, type Blog } from "@/api/blogsApi"
import { getBlogPageSettings, type BlogPageSettings } from "@/api/blogPageApi"

import ErrorState from "@/components/common/ErrorState"
import PageLoader from "@/components/common/PageLoader"
import SEO from "@/components/seo/SEO"
import { resolveMediaUrl } from "@/utils/mediaUrl"

export default function Blogs() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [settings, setSettings] = useState<BlogPageSettings | null>(null)

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  async function loadPage() {
    try {
      setIsLoading(true)
      setHasError(false)

      const [blogsResponse, settingsResponse] = await Promise.all([
        getBlogs(),
        getBlogPageSettings(),
      ])

      setBlogs(blogsResponse)
      setSettings(settingsResponse)
    } catch (error) {
      console.error("Unable to load Blogs page:", error)
      setHasError(true)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadPage()
  }, [])

  const categories = useMemo(() => {
    return Array.from(new Set(blogs.map((blog) => blog.category))).sort()
  }, [blogs])

  const filteredBlogs = useMemo(() => {
    const keyword = searchTerm.toLowerCase().trim()

    return blogs.filter((blog) => {
      const matchesSearch =
        !keyword ||
        blog.title.toLowerCase().includes(keyword) ||
        blog.excerpt.toLowerCase().includes(keyword) ||
        blog.category.toLowerCase().includes(keyword) ||
        blog.author.toLowerCase().includes(keyword)

      const matchesCategory =
        selectedCategory === "all" || blog.category === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [blogs, searchTerm, selectedCategory])

  if (isLoading) {
    return <PageLoader message="Loading articles..." />
  }

  if (hasError || !settings) {
    return (
      <ErrorState
        title="Unable to Load Blogs"
        message="The latest articles could not be loaded."
        onRetry={() => {
          void loadPage()
        }}
      />
    )
  }

  const hasFilters = Boolean(searchTerm.trim()) || selectedCategory !== "all"

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

              <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-blue-400" />
                  Cloud & DevOps
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-blue-400" />
                  Architecture
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-blue-400" />
                  Best Practices
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-blue-400" />
                  Engineering Insights
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {settings.show_articles && (
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
                    value={selectedCategory}
                    onChange={(event) =>
                      setSelectedCategory(event.target.value)
                    }
                    aria-label={settings.all_categories_label}
                    className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 text-slate-700 transition outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100 xl:max-w-xs"
                  >
                    <option value="all">{settings.all_categories_label}</option>

                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>

                  {hasFilters && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchTerm("")
                        setSelectedCategory("all")
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
                    <span className="font-semibold text-slate-950">
                      {filteredBlogs.length}
                    </span>{" "}
                    {filteredBlogs.length === 1 ? "article" : "articles"}
                  </p>

                  {hasFilters && (
                    <p className="font-medium text-blue-700">
                      Filters are currently active
                    </p>
                  )}
                </div>
              </motion.div>
            )}

            {filteredBlogs.length === 0 ? (
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
                      setSelectedCategory("all")
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
                  amount: 0.06,
                }}
                variants={{
                  hidden: {},
                  visible: {
                    transition: {
                      staggerChildren: 0.1,
                    },
                  },
                }}
                className="grid gap-8 md:grid-cols-2 xl:grid-cols-3"
              >
                {filteredBlogs.map((blog) => (
                  <motion.article
                    key={blog.id}
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
                      {blog.imageUrl ? (
                        <img
                          src={resolveMediaUrl(blog.imageUrl) ?? undefined}
                          alt={blog.title}
                          loading="lazy"
                          className="h-60 w-full object-cover transition duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="relative flex h-60 items-center justify-center overflow-hidden bg-slate-950 px-8 text-center">
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
                              Cubicles Insights
                            </p>

                            <p className="mt-4 text-3xl font-bold tracking-[-0.025em] text-white">
                              {blog.category}
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/55 to-transparent" />

                      <span className="absolute bottom-5 left-5 rounded-full border border-white/20 bg-slate-950/70 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
                        {blog.category}
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col p-7 sm:p-8">
                      {(settings.show_date || settings.show_author) && (
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
                          {settings.show_date && (
                            <div className="flex items-center gap-2">
                              <CalendarDays className="size-4 text-blue-600" />

                              <time dateTime={blog.publishedAt}>
                                {new Date(blog.publishedAt).toLocaleDateString(
                                  "en-GB",
                                  {
                                    day: "2-digit",
                                    month: "long",
                                    year: "numeric",
                                  }
                                )}
                              </time>
                            </div>
                          )}

                          {settings.show_author && (
                            <p>
                              {settings.author_prefix}{" "}
                              <span className="font-semibold text-slate-700">
                                {blog.author}
                              </span>
                            </p>
                          )}
                        </div>
                      )}

                      <h2 className="mt-5 text-2xl leading-tight font-bold tracking-[-0.025em] text-slate-950">
                        <Link
                          to={`/blogs/${blog.slug}`}
                          className="transition hover:text-blue-700 focus-visible:ring-4 focus-visible:ring-blue-100 focus-visible:outline-none"
                        >
                          {blog.title}
                        </Link>
                      </h2>

                      <p className="mt-5 line-clamp-3 leading-7 text-slate-600">
                        {blog.excerpt}
                      </p>

                      <div className="mt-auto pt-8">
                        <Link
                          to={`/blogs/${blog.slug}`}
                          className="inline-flex items-center rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-600 focus-visible:ring-4 focus-visible:ring-blue-200 focus-visible:outline-none"
                        >
                          {settings.read_button_text}

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

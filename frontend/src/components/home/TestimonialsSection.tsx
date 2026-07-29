import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Quote, ShieldCheck, Star, UsersRound } from "lucide-react"

import {
  getHomepageTestimonials,
  type HomepageTestimonial,
} from "@/api/homepageTestimonialsApi"

const fallbackTestimonials: HomepageTestimonial[] = [
  {
    id: 1,
    name: "Michael Johnson",
    designation: "CTO, FinTech Solutions",
    content:
      "Cubicles Services successfully migrated our infrastructure to AWS with zero downtime.",
    display_order: 1,
    is_active: true,
  },
]

type TestimonialsSectionProps = {
  title: string
  description: string
}

export default function TestimonialsSection({
  title,
  description,
}: TestimonialsSectionProps) {
  const [testimonials, setTestimonials] =
    useState<HomepageTestimonial[]>(fallbackTestimonials)

  useEffect(() => {
    async function loadTestimonials() {
      try {
        const response = await getHomepageTestimonials()

        if (response.length > 0) {
          setTestimonials(response)
        }
      } catch (error) {
        console.error("Unable to load homepage testimonials:", error)
      }
    }

    void loadTestimonials()
  }, [])

  const displayedTestimonials = useMemo(() => {
    return [...testimonials]
      .filter((testimonial) => testimonial.is_active)
      .sort((first, second) => first.display_order - second.display_order)
      .slice(0, 6)
  }, [testimonials])

  return (
    <section className="relative overflow-hidden bg-slate-50 py-20 sm:py-24 lg:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-blue-100/70 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -bottom-40 h-96 w-96 rounded-full bg-violet-100/60 blur-3xl"
      />

      <div className="relative container mx-auto px-6">
        <div className="mx-auto max-w-3xl text-center">
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
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-3.5 py-1.5 text-sm font-semibold text-blue-700 shadow-sm">
              <UsersRound className="size-4" />
              Client Testimonials
            </div>

            <h2 className="mt-5 text-4xl leading-tight font-extrabold tracking-[-0.035em] text-slate-950 sm:text-5xl">
              {title}
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              {description}
            </p>
          </motion.div>
        </div>

        {displayedTestimonials.length === 0 ? (
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
            className="mx-auto mt-14 max-w-3xl rounded-[2rem] border border-slate-200 bg-white px-6 py-16 text-center shadow-sm"
          >
            <div className="mx-auto flex size-16 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-600">
              <Quote className="size-8" />
            </div>

            <h3 className="mt-6 text-2xl font-bold text-slate-950">
              Testimonials Coming Soon
            </h3>

            <p className="mx-auto mt-3 max-w-xl leading-7 text-slate-600">
              Customer feedback will appear here when published.
            </p>
          </motion.div>
        ) : (
          <>
            <div className="mt-14 grid gap-6 lg:grid-cols-12">
              {displayedTestimonials.map((testimonial, index) => (
                <TestimonialCard
                  key={testimonial.id}
                  testimonial={testimonial}
                  index={index}
                  isFeatured={index === 0}
                />
              ))}
            </div>

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
              className="mt-10 flex flex-col items-center justify-center gap-3 text-center sm:flex-row sm:gap-6"
            >
              <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                <ShieldCheck className="size-5 text-emerald-600" />
                Trusted technology partner
              </div>

              <span className="hidden h-4 w-px bg-slate-300 sm:block" />

              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    className="size-4 fill-amber-400 text-amber-400"
                  />
                ))}

                <span className="ml-2 text-sm font-medium text-slate-600">
                  Client-focused delivery
                </span>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </section>
  )
}

function TestimonialCard({
  testimonial,
  index,
  isFeatured,
}: {
  testimonial: HomepageTestimonial
  index: number
  isFeatured: boolean
}) {
  const initials = getInitials(testimonial.name)

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
          ? "group relative overflow-hidden rounded-[2rem] bg-slate-950 p-8 text-white shadow-[0_28px_80px_rgb(15_23_42/0.2)] sm:p-10 lg:col-span-6 lg:row-span-2"
          : "group relative flex min-h-72 flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-7 shadow-[0_14px_40px_rgb(15_23_42/0.06)] transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_22px_60px_rgb(15_23_42/0.1)] lg:col-span-6"
      }
    >
      {isFeatured && (
        <>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-32 -right-32 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-32 -left-32 h-72 w-72 rounded-full bg-violet-500/15 blur-3xl"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-16 top-0 h-px bg-gradient-to-r from-transparent via-blue-300/70 to-transparent"
          />
        </>
      )}

      <div className="relative flex h-full flex-col">
        <div className="flex items-start justify-between gap-4">
          <div
            className={
              isFeatured
                ? "flex size-12 items-center justify-center rounded-2xl border border-blue-300/15 bg-blue-400/10 text-blue-300"
                : "flex size-11 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-600"
            }
          >
            <Quote className="size-6" />
          </div>

          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, starIndex) => (
              <Star
                key={starIndex}
                className={
                  isFeatured
                    ? "size-4 fill-amber-300 text-amber-300"
                    : "size-4 fill-amber-400 text-amber-400"
                }
              />
            ))}
          </div>
        </div>

        <blockquote
          className={
            isFeatured
              ? "mt-8 text-2xl leading-10 font-medium tracking-[-0.02em] text-white sm:text-3xl sm:leading-[1.45]"
              : "mt-7 text-lg leading-8 font-medium text-slate-800"
          }
        >
          “{testimonial.content}”
        </blockquote>

        <div
          className={
            isFeatured
              ? "mt-auto flex items-center gap-4 border-t border-white/10 pt-8"
              : "mt-auto flex items-center gap-4 border-t border-slate-100 pt-7"
          }
        >
          <div
            className={
              isFeatured
                ? "flex size-12 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 text-sm font-bold text-white"
                : "flex size-12 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white"
            }
          >
            {initials}
          </div>

          <div className="min-w-0">
            <h3
              className={
                isFeatured
                  ? "font-semibold text-white"
                  : "font-semibold text-slate-950"
              }
            >
              {testimonial.name}
            </h3>

            <p
              className={
                isFeatured
                  ? "mt-1 text-sm text-slate-400"
                  : "mt-1 text-sm text-slate-500"
              }
            >
              {testimonial.designation}
            </p>
          </div>
        </div>
      </div>
    </motion.article>
  )
}

function getInitials(name: string): string {
  const initials = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("")

  return initials || "CS"
}

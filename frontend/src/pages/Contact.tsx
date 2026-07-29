import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { CheckCircle2, MessageSquareText, Sparkles } from "lucide-react"

import {
  getContactPageSettings,
  type ContactPageSettings,
} from "@/api/contactPageApi"
import Breadcrumb from "@/components/common/Breadcrumb"
import ErrorState from "@/components/common/ErrorState"
import PageLoader from "@/components/common/PageLoader"
import SEO from "@/components/common/SEO"
import ContactForm from "@/components/contact/ContactForm"

const conversationHighlights = [
  "Cloud and DevOps expertise",
  "Solutions tailored to your business",
  "Architecture guidance from experts",
]

export default function Contact() {
  const [settings, setSettings] = useState<ContactPageSettings | null>(null)

  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  async function loadContactPage() {
    try {
      setIsLoading(true)
      setHasError(false)

      const response = await getContactPageSettings()

      setSettings(response)
    } catch (error) {
      console.error("Unable to load Contact page:", error)
      setHasError(true)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadContactPage()
  }, [])

  if (isLoading) {
    return <PageLoader message="Loading Contact page..." />
  }

  if (hasError || !settings) {
    return (
      <ErrorState
        title="Unable to Load Contact Page"
        message="The Contact page content could not be loaded."
        onRetry={() => {
          void loadContactPage()
        }}
      />
    )
  }

  return (
    <>
      <SEO title={settings.seo_title} description={settings.seo_description} />

      <section className="relative overflow-hidden bg-slate-950 pt-8 pb-20 text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-56 -left-56 size-[38rem] rounded-full bg-blue-500/15 blur-[170px]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-56 bottom-0 size-[38rem] rounded-full bg-violet-500/15 blur-[170px]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/2 size-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/5 blur-[150px]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)",
            backgroundSize: "76px 76px",
            maskImage:
              "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)",
          }}
        />

        <div className="relative container mx-auto max-w-6xl px-6">
          {settings.show_breadcrumb && (
            <div className="mb-14 [&_a]:text-slate-300 [&_a:hover]:text-white [&_li]:text-slate-400 [&_span]:text-slate-400">
              <Breadcrumb
                items={[
                  {
                    label: "Home",
                    href: "/",
                  },
                  {
                    label: "Contact",
                  },
                ]}
              />
            </div>
          )}

          <div className="grid items-center gap-14 lg:grid-cols-[0.85fr_1.15fr]">
            <motion.div
              initial={{
                opacity: 0,
                y: 25,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.65,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-300 backdrop-blur-sm">
                <Sparkles className="size-4" />
                {settings.hero_eyebrow}
              </div>

              <h1 className="mt-8 text-5xl leading-[1.08] font-extrabold tracking-[-0.04em] sm:text-6xl lg:text-7xl">
                {settings.hero_title}
              </h1>

              <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
                {settings.hero_description}
              </p>
            </motion.div>

            <motion.div
              initial={{
                opacity: 0,
                x: 30,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                delay: 0.15,
                duration: 0.65,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative"
            >
              <div
                aria-hidden="true"
                className="absolute -inset-6 rounded-[2.5rem] bg-blue-500/10 blur-3xl"
              />

              <div className="relative rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
                <div className="flex size-14 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-blue-300">
                  <MessageSquareText className="size-6" />
                </div>

                <h2 className="mt-6 text-3xl font-bold tracking-[-0.03em]">
                  Tell Us About Your Project
                </h2>

                <p className="mt-4 text-lg leading-8 text-slate-300">
                  Share your requirements and our team will get back to you as
                  soon as possible.
                </p>

                <div className="mt-10 space-y-5">
                  {conversationHighlights.map((item) => (
                    <div key={item} className="flex items-center gap-4">
                      <span className="flex size-11 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
                        <CheckCircle2 className="size-5" />
                      </span>

                      <span className="text-lg text-slate-200">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-12 border-t border-white/10 pt-8">
                  <p className="text-xs font-semibold tracking-[0.15em] text-slate-400 uppercase">
                    Response Time
                  </p>

                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    Most enquiries receive a response within one business day.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      {settings.show_form && (
        <section className="relative overflow-hidden bg-slate-50 py-20 sm:py-24">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-0 -right-56 size-[38rem] rounded-full bg-blue-100/70 blur-[160px]"
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
                "linear-gradient(to bottom, transparent, black 8%, black 92%, transparent)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent, black 8%, black 92%, transparent)",
            }}
          />

          <div className="relative container mx-auto max-w-6xl px-6">
            <motion.div
              initial={{
                opacity: 0,
                y: 30,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.08,
              }}
              transition={{
                duration: 0.65,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative rounded-[2rem] border border-slate-200 bg-white shadow-[0_30px_100px_rgb(15_23_42/0.14)]"
            >
              <ContactForm settings={settings} />
            </motion.div>
          </div>
        </section>
      )}
    </>
  )
}

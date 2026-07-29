import { useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  ChevronDown,
  CircleHelp,
  CloudCog,
  Headphones,
  MessageCircleMore,
  ShieldCheck,
} from "lucide-react"

import { getHomepageFaqs, type HomepageFaq } from "@/api/homepageFaqsApi"

const fallbackFaqs: HomepageFaq[] = [
  {
    id: 1,
    question: "Which cloud platforms do you support?",
    answer: "We specialize in AWS and Microsoft Azure cloud platforms.",
    display_order: 1,
    is_active: true,
  },
]

type FAQSectionProps = {
  title: string
  description: string
}

export default function FAQSection({ title, description }: FAQSectionProps) {
  const [faqs, setFaqs] = useState<HomepageFaq[]>(fallbackFaqs)
  const [openId, setOpenId] = useState<number | null>(
    fallbackFaqs[0]?.id ?? null
  )

  useEffect(() => {
    async function loadFaqs() {
      try {
        const response = await getHomepageFaqs()

        if (response.length > 0) {
          setFaqs(response)

          const firstActiveFaq = [...response]
            .filter((faq) => faq.is_active)
            .sort(
              (first, second) => first.display_order - second.display_order
            )[0]

          setOpenId(firstActiveFaq?.id ?? null)
        }
      } catch (error) {
        console.error("Unable to load homepage FAQs:", error)
      }
    }

    void loadFaqs()
  }, [])

  const displayedFaqs = useMemo(() => {
    return [...faqs]
      .filter((faq) => faq.is_active)
      .sort((first, second) => first.display_order - second.display_order)
      .slice(0, 8)
  }, [faqs])

  return (
    <section className="relative overflow-hidden bg-white py-20 sm:py-24 lg:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-44 -right-44 h-[30rem] w-[30rem] rounded-full bg-blue-100/65 blur-[120px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-44 -left-44 h-[28rem] w-[28rem] rounded-full bg-violet-100/55 blur-[120px]"
      />

      <div className="relative container mx-auto px-6">
        <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16 xl:gap-24">
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
            className="lg:sticky lg:top-28 lg:self-start"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3.5 py-1.5 text-sm font-semibold text-blue-700">
              <CircleHelp className="size-4" />
              Frequently Asked Questions
            </div>

            <h2 className="mt-6 max-w-xl text-4xl leading-tight font-extrabold tracking-[-0.035em] text-slate-950 sm:text-5xl">
              {title}
            </h2>

            <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
              {description}
            </p>

            <div className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <div className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-5">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-white text-blue-600 shadow-sm">
                  <CloudCog className="size-5" />
                </div>

                <div>
                  <h3 className="font-semibold text-slate-950">
                    Cloud expertise
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Guidance across cloud migration, DevOps and modernization.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-5">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-emerald-100 bg-white text-emerald-600 shadow-sm">
                  <ShieldCheck className="size-5" />
                </div>

                <div>
                  <h3 className="font-semibold text-slate-950">
                    Security-first approach
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Secure architecture and delivery practices at every stage.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
                <Headphones className="size-5" />
              </div>

              <p className="text-sm leading-6 text-slate-700">
                Need more information? Our team can help you understand the
                right solution for your business.
              </p>
            </div>
          </motion.div>

          <div>
            {displayedFaqs.length === 0 ? (
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
                className="rounded-[2rem] border border-slate-200 bg-slate-50 px-6 py-16 text-center"
              >
                <div className="mx-auto flex size-16 items-center justify-center rounded-2xl border border-blue-100 bg-white text-blue-600 shadow-sm">
                  <MessageCircleMore className="size-8" />
                </div>

                <h3 className="mt-6 text-2xl font-bold text-slate-950">
                  Questions Coming Soon
                </h3>

                <p className="mx-auto mt-3 max-w-xl leading-7 text-slate-600">
                  Frequently asked questions will appear here when they are
                  published.
                </p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {displayedFaqs.map((faq, index) => {
                  const isOpen = openId === faq.id
                  const answerId = `faq-answer-${faq.id}`

                  return (
                    <motion.article
                      key={faq.id}
                      initial={{
                        opacity: 0,
                        y: 22,
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
                        duration: 0.5,
                        delay: index * 0.06,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className={
                        isOpen
                          ? "overflow-hidden rounded-[1.5rem] border border-blue-200 bg-blue-50/45 shadow-[0_18px_50px_rgb(15_23_42/0.08)]"
                          : "overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-[0_8px_28px_rgb(15_23_42/0.04)] transition duration-300 hover:border-blue-200 hover:shadow-[0_16px_40px_rgb(15_23_42/0.07)]"
                      }
                    >
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={answerId}
                        onClick={() => setOpenId(isOpen ? null : faq.id)}
                        className="flex w-full items-start gap-5 px-5 py-5 text-left sm:px-7 sm:py-6"
                      >
                        <span
                          className={
                            isOpen
                              ? "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-xs font-bold text-white shadow-sm"
                              : "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xs font-bold text-slate-500"
                          }
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <span className="flex-1">
                          <span
                            className={
                              isOpen
                                ? "block text-base leading-7 font-semibold text-slate-950 sm:text-lg"
                                : "block text-base leading-7 font-semibold text-slate-800 sm:text-lg"
                            }
                          >
                            {faq.question}
                          </span>
                        </span>

                        <span
                          className={
                            isOpen
                              ? "flex size-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white"
                              : "flex size-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500"
                          }
                        >
                          <ChevronDown
                            className={`size-4 transition-transform duration-300 ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          />
                        </span>
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            id={answerId}
                            initial={{
                              height: 0,
                              opacity: 0,
                            }}
                            animate={{
                              height: "auto",
                              opacity: 1,
                            }}
                            exit={{
                              height: 0,
                              opacity: 0,
                            }}
                            transition={{
                              height: {
                                duration: 0.3,
                                ease: [0.22, 1, 0.36, 1],
                              },
                              opacity: {
                                duration: 0.2,
                              },
                            }}
                            className="overflow-hidden"
                          >
                            <div className="border-t border-blue-100 px-5 pt-5 pb-6 sm:px-7 sm:pl-[5.75rem]">
                              <p className="leading-8 text-slate-600">
                                {faq.answer}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.article>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

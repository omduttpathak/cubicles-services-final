import { useEffect, useMemo, useState, type ComponentType } from "react"
import { motion } from "framer-motion"
import {
  ArrowUpRight,
  Building2,
  Factory,
  GraduationCap,
  HeartPulse,
  Landmark,
  Radio,
  ShoppingCart,
  Stethoscope,
  Truck,
  WalletCards,
} from "lucide-react"

import {
  getHomepageIndustries,
  type HomepageIndustry,
} from "@/api/homepageIndustriesApi"

const fallbackIndustries: HomepageIndustry[] = [
  {
    id: 1,
    title: "Healthcare",
    description:
      "Secure healthcare platforms with cloud solutions designed for reliability and compliance.",
    icon: "heart-pulse",
    display_order: 1,
    is_active: true,
  },
]

type IndustryIcon = ComponentType<{
  className?: string
  size?: number
  strokeWidth?: number
}>

type IndustriesSectionProps = {
  title: string
  description: string
}

const iconMap: Record<string, IndustryIcon> = {
  "building-2": Building2,
  building: Building2,
  enterprise: Building2,
  factory: Factory,
  manufacturing: Factory,
  "graduation-cap": GraduationCap,
  education: GraduationCap,
  "heart-pulse": HeartPulse,
  healthcare: HeartPulse,
  hospital: Stethoscope,
  stethoscope: Stethoscope,
  landmark: Landmark,
  banking: Landmark,
  finance: WalletCards,
  fintech: WalletCards,
  "wallet-cards": WalletCards,
  radio: Radio,
  telecom: Radio,
  telecommunications: Radio,
  "shopping-cart": ShoppingCart,
  ecommerce: ShoppingCart,
  retail: ShoppingCart,
  truck: Truck,
  logistics: Truck,
  transportation: Truck,
}

const cardAccents = [
  {
    icon: "bg-blue-50 text-blue-700 ring-blue-100",
    glow: "bg-blue-200/60",
    badge: "border-blue-100 bg-blue-50 text-blue-700",
  },
  {
    icon: "bg-violet-50 text-violet-700 ring-violet-100",
    glow: "bg-violet-200/60",
    badge: "border-violet-100 bg-violet-50 text-violet-700",
  },
  {
    icon: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    glow: "bg-emerald-200/60",
    badge: "border-emerald-100 bg-emerald-50 text-emerald-700",
  },
  {
    icon: "bg-amber-50 text-amber-700 ring-amber-100",
    glow: "bg-amber-200/60",
    badge: "border-amber-100 bg-amber-50 text-amber-700",
  },
  {
    icon: "bg-cyan-50 text-cyan-700 ring-cyan-100",
    glow: "bg-cyan-200/60",
    badge: "border-cyan-100 bg-cyan-50 text-cyan-700",
  },
  {
    icon: "bg-rose-50 text-rose-700 ring-rose-100",
    glow: "bg-rose-200/60",
    badge: "border-rose-100 bg-rose-50 text-rose-700",
  },
]

const sectionAnimation = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.09,
    },
  },
}

const cardAnimation = {
  hidden: {
    opacity: 0,
    y: 28,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: "easeOut" as const,
    },
  },
}

export default function IndustriesSection({
  title,
  description,
}: IndustriesSectionProps) {
  const [industries, setIndustries] =
    useState<HomepageIndustry[]>(fallbackIndustries)

  useEffect(() => {
    async function loadIndustries() {
      try {
        const response = await getHomepageIndustries()

        if (response.length > 0) {
          setIndustries(response)
        }
      } catch (error) {
        console.error("Unable to load homepage industries:", error)
      }
    }

    void loadIndustries()
  }, [])

  const displayedIndustries = useMemo(() => {
    return [...industries]
      .filter((industry) => industry.is_active)
      .sort((first, second) => {
        if (first.display_order !== second.display_order) {
          return first.display_order - second.display_order
        }

        return first.title.localeCompare(second.title)
      })
  }, [industries])

  return (
    <section className="relative overflow-hidden bg-white py-24 sm:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-52 -left-48 size-[34rem] rounded-full bg-blue-100/70 blur-[130px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-56 -bottom-60 size-[38rem] rounded-full bg-violet-100/60 blur-[150px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.28]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(148,163,184,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.12) 1px, transparent 1px)",
          backgroundSize: "76px 76px",
          maskImage:
            "linear-gradient(to bottom, transparent, black 18%, black 82%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, black 18%, black 82%, transparent)",
        }}
      />

      <div className="relative container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-14 max-w-3xl text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">
            <Building2 className="size-4 text-blue-600" />
            Industry Expertise
          </div>

          <h2 className="mt-6 text-4xl font-bold tracking-[-0.035em] text-slate-950 sm:text-5xl">
            {title}
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            {description}
          </p>
        </motion.div>

        {displayedIndustries.length === 0 ? (
          <EmptyIndustriesState />
        ) : (
          <motion.div
            variants={sectionAnimation}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.12 }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {displayedIndustries.map((industry, index) => (
              <motion.div key={industry.id} variants={cardAnimation}>
                <IndustryCard industry={industry} index={index} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  )
}

function IndustryCard({
  industry,
  index,
}: {
  industry: HomepageIndustry
  index: number
}) {
  const normalizedIcon = industry.icon?.trim().toLowerCase() || ""
  const Icon = iconMap[normalizedIcon] ?? Building2
  const accent = cardAccents[index % cardAccents.length]
  const sequenceNumber = String(index + 1).padStart(2, "0")

  return (
    <article className="group relative flex h-full min-h-80 overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white p-7 shadow-sm transition duration-500 hover:-translate-y-1.5 hover:border-slate-300 hover:shadow-2xl hover:shadow-slate-200/70 sm:p-8">
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute -top-24 -right-20 size-52 rounded-full ${accent.glow} opacity-0 blur-3xl transition duration-500 group-hover:opacity-80`}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />

      <div className="relative z-10 flex w-full flex-col">
        <div className="flex items-start justify-between gap-5">
          <div
            className={`flex size-14 items-center justify-center rounded-2xl ring-1 ${accent.icon} transition duration-500 group-hover:scale-105`}
          >
            <Icon className="size-7" strokeWidth={1.8} />
          </div>

          <span className="font-mono text-sm font-semibold tracking-[0.16em] text-slate-300 transition-colors duration-300 group-hover:text-slate-400">
            {sequenceNumber}
          </span>
        </div>

        <div className="mt-8">
          <span
            className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${accent.badge}`}
          >
            Industry Solution
          </span>

          <h3 className="mt-4 text-2xl font-bold tracking-[-0.025em] text-slate-950">
            {industry.title}
          </h3>

          <p className="mt-4 line-clamp-4 text-base leading-7 text-slate-600">
            {industry.description}
          </p>
        </div>

        <div className="mt-auto flex items-center justify-between pt-8">
          <span className="text-sm font-semibold text-slate-900 transition-colors duration-300 group-hover:text-blue-700">
            Tailored technology solutions
          </span>

          <span className="flex size-9 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 transition duration-300 group-hover:border-blue-200 group-hover:bg-blue-50 group-hover:text-blue-700">
            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </div>
    </article>
  )
}

function EmptyIndustriesState() {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-1/2 size-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-100/70 blur-3xl"
      />

      <div className="relative">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-700">
          <Building2 className="size-8" />
        </div>

        <h3 className="mt-6 text-2xl font-bold tracking-[-0.02em] text-slate-950">
          Industry Solutions Coming Soon
        </h3>

        <p className="mx-auto mt-3 max-w-xl leading-7 text-slate-600">
          Our industry-specific technology capabilities are currently being
          updated. Please check back soon.
        </p>
      </div>
    </div>
  )
}

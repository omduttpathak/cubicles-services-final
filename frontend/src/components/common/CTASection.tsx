import { ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"

type CTASectionProps = {
  title: string
  description: string
  primaryButtonText?: string
  primaryButtonLink?: string
  secondaryButtonText?: string
  secondaryButtonLink?: string
}

export default function CTASection({
  title,
  description,
  primaryButtonText = "Contact Us",
  primaryButtonLink = "/contact",
  secondaryButtonText = "Our Services",
  secondaryButtonLink = "/services",
}: CTASectionProps) {
  return (
    <section className="relative overflow-hidden bg-blue-600 py-20 sm:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -left-40 size-96 rounded-full bg-cyan-300/20 blur-[130px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -bottom-48 size-[30rem] rounded-full bg-violet-500/25 blur-[150px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.12) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative container mx-auto max-w-5xl px-6 text-center">
        <h2 className="text-4xl font-extrabold tracking-[-0.04em] text-white sm:text-5xl">
          {title}
        </h2>

        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-blue-100">
          {description}
        </p>

        <div className="mt-10 flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center">
          <Button asChild size="lg" variant="white">
            <Link to={primaryButtonLink}>{primaryButtonText}</Link>
          </Button>

          <Button asChild size="lg" variant="glass">
            <Link to={secondaryButtonLink}>
              {secondaryButtonText}
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

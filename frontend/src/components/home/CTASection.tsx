import { motion } from "framer-motion"
import { ArrowRight, CheckCircle2, CloudCog, ShieldCheck } from "lucide-react"
import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"

type CTASectionProps = {
  title: string
  description: string
  buttonText: string
  buttonUrl: string
}

export default function CTASection({
  title,
  description,
  buttonText,
  buttonUrl,
}: CTASectionProps) {
  return (
    <section className="relative overflow-hidden bg-slate-950 py-24">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.20),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(139,92,246,0.16),transparent_42%)]"
      />

      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px),linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      <div className="relative container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl sm:p-12 lg:p-16"
        >
          <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_.9fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-200">
                <CloudCog className="size-4" />
                Let's Build Together
              </div>

              <h2 className="mt-6 max-w-3xl text-4xl leading-tight font-extrabold tracking-[-0.03em] text-white sm:text-5xl">
                {title}
              </h2>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                {description}
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <Button
                  asChild
                  size="lg"
                  className="rounded-xl bg-white px-7 text-slate-900 hover:bg-slate-100"
                >
                  <Link to={buttonUrl}>
                    {buttonText}
                    <ArrowRight className="ml-2 size-5" />
                  </Link>
                </Button>

                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-xl border-white/20 bg-transparent text-white hover:bg-white/10"
                >
                  <Link to="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>

            <div className="grid gap-5">
              <FeatureCard
                icon={<CloudCog className="size-5" />}
                title="Cloud Transformation"
                description="AWS & Azure migration with secure enterprise architecture."
              />

              <FeatureCard
                icon={<ShieldCheck className="size-5" />}
                title="Secure Delivery"
                description="Security-first engineering from infrastructure through deployment."
              />

              <FeatureCard
                icon={<CheckCircle2 className="size-5" />}
                title="Long-Term Partnership"
                description="Modernization, managed services and continuous optimization."
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition duration-300 hover:border-blue-400/30 hover:bg-white/[0.07]">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/15 text-blue-300">
        {icon}
      </div>

      <div>
        <h3 className="font-semibold text-white">{title}</h3>

        <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
      </div>
    </div>
  )
}

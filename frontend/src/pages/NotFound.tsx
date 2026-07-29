import { ArrowLeft, Home, Search } from "lucide-react"
import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <main className="relative isolate flex min-h-[calc(100vh-5rem)] items-center overflow-hidden bg-slate-950 py-20 sm:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.22),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(124,58,237,0.20),transparent_38%)]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.10) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.10) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-400/15"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-violet-400/10"
      />

      <div className="relative container mx-auto px-6">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-200 backdrop-blur-xl">
            <Search className="size-4" />
            Page unavailable
          </div>

          <div className="relative mx-auto mt-8 w-fit">
            <span
              aria-hidden="true"
              className="absolute inset-0 translate-x-2 translate-y-2 text-[7rem] leading-none font-black tracking-[-0.08em] text-blue-500/20 blur-sm sm:text-[10rem]"
            >
              404
            </span>

            <p className="relative bg-gradient-to-r from-blue-300 via-white to-violet-300 bg-clip-text text-[7rem] leading-none font-black tracking-[-0.08em] text-transparent sm:text-[10rem]">
              404
            </p>
          </div>

          <h1 className="mt-8 text-4xl font-extrabold tracking-[-0.04em] text-white sm:text-5xl">
            This page could not be found
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            The page may have been moved, renamed, or is no longer available.
            You can return to the homepage or continue exploring our services.
          </p>

          <div className="mt-10 flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center">
            <Button asChild size="lg" variant="white">
              <Link to="/">
                <Home className="mr-2 size-4" />
                Go to homepage
              </Link>
            </Button>

            <Button asChild size="lg" variant="glass">
              <Link to="/services">
                Explore services
                <ArrowLeft className="ml-2 size-4 rotate-180" />
              </Link>
            </Button>
          </div>

          <div className="mx-auto mt-14 max-w-2xl rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-left backdrop-blur-xl sm:p-8">
            <p className="text-sm font-semibold tracking-[0.18em] text-blue-200 uppercase">
              Helpful destinations
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <QuickLink to="/about" label="About us" />
              <QuickLink to="/technologies" label="Technologies" />
              <QuickLink to="/contact" label="Contact us" />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

function QuickLink({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-center text-sm font-semibold text-slate-200 transition duration-300 hover:-translate-y-0.5 hover:border-blue-400/30 hover:bg-white/[0.08] hover:text-white focus-visible:ring-2 focus-visible:ring-blue-400/50 focus-visible:outline-none"
    >
      {label}
    </Link>
  )
}

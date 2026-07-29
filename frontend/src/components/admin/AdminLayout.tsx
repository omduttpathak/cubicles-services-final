import { useState } from "react"
import {
  BadgeCheck,
  BarChart3,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  ChevronDown,
  CircleHelp,
  Cpu,
  HeartHandshake,
  Home,
  Images,
  Info,
  Layers3,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  MessageSquareQuote,
  MessagesSquare,
  PanelBottom,
  Search,
  Settings,
  UsersRound,
  Wrench,
  X,
} from "lucide-react"
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom"
import { toast } from "sonner"

import ScrollToTop from "@/components/common/ScrollToTop"
import { removeAccessToken } from "@/utils/auth"

type NavigationItem = {
  title: string
  path: string
  icon: React.ComponentType<{ className?: string }>
}

type NavigationGroup = {
  title: string
  items: NavigationItem[]
}

const navigationGroups: NavigationGroup[] = [
  {
    title: "Overview",
    items: [
      {
        title: "Dashboard",
        path: "/admin/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "Website",
    items: [
      {
        title: "Homepage",
        path: "/admin/homepage",
        icon: Home,
      },
      {
        title: "About Page",
        path: "/admin/about",
        icon: Info,
      },
      {
        title: "Navigation",
        path: "/admin/navigation",
        icon: Menu,
      },
      {
        title: "Footer Links",
        path: "/admin/footer-links",
        icon: PanelBottom,
      },
      {
        title: "Site Settings",
        path: "/admin/site-settings",
        icon: Settings,
      },
      {
        title: "Media Library",
        path: "/admin/media",
        icon: Images,
      },
    ],
  },
  {
    title: "Homepage Content",
    items: [
      {
        title: "FAQs",
        path: "/admin/homepage-faqs",
        icon: CircleHelp,
      },
      {
        title: "Testimonials",
        path: "/admin/homepage-testimonials",
        icon: MessageSquareQuote,
      },
      {
        title: "Benefits",
        path: "/admin/homepage-benefits",
        icon: BadgeCheck,
      },
      {
        title: "Industries",
        path: "/admin/homepage-industries",
        icon: Building2,
      },
      {
        title: "Statistics",
        path: "/admin/homepage-statistics",
        icon: BarChart3,
      },
    ],
  },
  {
    title: "About Content",
    items: [
      {
        title: "Statistics",
        path: "/admin/about-statistics",
        icon: BarChart3,
      },
      {
        title: "Values",
        path: "/admin/about-values",
        icon: HeartHandshake,
      },
    ],
  },
  {
    title: "Content",
    items: [
      {
        title: "Blogs Page",
        path: "/admin/blog-page",
        icon: BookOpen,
      },
      {
        title: "Blogs",
        path: "/admin/blogs",
        icon: BookOpen,
      },
      {
        title: "Case Studies Page",
        path: "/admin/case-studies-page",
        icon: BriefcaseBusiness,
      },
      {
        title: "Case Studies",
        path: "/admin/case-studies",
        icon: BriefcaseBusiness,
      },
      {
        title: "Services Page",
        path: "/admin/services-page",
        icon: Layers3,
      },
      {
        title: "Services",
        path: "/admin/services",
        icon: Wrench,
      },
      {
        title: "Technologies Page",
        path: "/admin/technology-page",
        icon: Layers3,
      },
      {
        title: "Technologies",
        path: "/admin/technologies",
        icon: Cpu,
      },
    ],
  },
  {
    title: "Enquiries & Careers",
    items: [
      {
        title: "Contact Page",
        path: "/admin/contact-page",
        icon: MessagesSquare,
      },
      {
        title: "Contact Requests",
        path: "/admin/contacts",
        icon: Mail,
      },
      {
        title: "Careers Page",
        path: "/admin/career-page",
        icon: BriefcaseBusiness,
      },
      {
        title: "Job Openings",
        path: "/admin/job-openings",
        icon: BriefcaseBusiness,
      },
      {
        title: "Career Applications",
        path: "/admin/career-applications",
        icon: UsersRound,
      },
    ],
  },
]

export default function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  function handleLogout() {
    removeAccessToken()
    toast.success("Logged out successfully.")
    navigate("/admin/login", { replace: true })
  }

  function closeMobileMenu() {
    setIsMobileMenuOpen(false)
  }

  const currentPage =
    navigationGroups
      .flatMap((group) => group.items)
      .find((item) => location.pathname.startsWith(item.path))?.title ??
    "Admin Portal"

  return (
    <div className="min-h-screen bg-slate-100">
      <ScrollToTop />

      <div className="flex min-h-screen">
        <aside className="hidden w-72 shrink-0 border-r border-white/10 bg-slate-950 lg:flex lg:flex-col">
          <SidebarContent onNavigate={closeMobileMenu} />
        </aside>

        {isMobileMenuOpen ? (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              type="button"
              aria-label="Close navigation"
              onClick={closeMobileMenu}
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
            />

            <aside className="relative flex h-full w-[min(88vw,19rem)] flex-col border-r border-white/10 bg-slate-950 shadow-2xl">
              <div className="absolute top-4 right-4 z-10">
                <button
                  type="button"
                  aria-label="Close navigation"
                  onClick={closeMobileMenu}
                  className="flex size-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white"
                >
                  <X className="size-5" />
                </button>
              </div>

              <SidebarContent onNavigate={closeMobileMenu} />
            </aside>
          </div>
        ) : null}

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
            <div className="flex h-20 items-center justify-between gap-4 px-4 sm:px-6 xl:px-8">
              <div className="flex min-w-0 items-center gap-3">
                <button
                  type="button"
                  aria-label="Open navigation"
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 lg:hidden"
                >
                  <Menu className="size-5" />
                </button>

                <div className="min-w-0">
                  <p className="text-xs font-semibold tracking-[0.16em] text-blue-600 uppercase">
                    Cubicles Services
                  </p>
                  <h1 className="truncate text-lg font-bold text-slate-950 sm:text-xl">
                    {currentPage}
                  </h1>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative hidden xl:block">
                  <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="search"
                    placeholder="Search admin..."
                    aria-label="Search admin portal"
                    className="h-11 w-64 rounded-xl border border-slate-200 bg-slate-50 pr-4 pl-10 text-sm text-slate-900 transition outline-none placeholder:text-slate-400 focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                >
                  <LogOut className="mr-2 size-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </div>
          </header>

          <main className="min-w-0 p-4 sm:p-6 xl:p-8">
            <div className="mx-auto max-w-[1600px]">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

function SidebarContent({ onNavigate }: { onNavigate: () => void }) {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(navigationGroups.map((group) => [group.title, true]))
  )

  function toggleGroup(title: string) {
    setOpenGroups((current) => ({
      ...current,
      [title]: !current[title],
    }))
  }

  return (
    <>
      <div className="border-b border-white/10 px-5 py-6">
        <NavLink
          to="/admin/dashboard"
          onClick={onNavigate}
          className="flex items-center gap-3"
        >
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 text-white shadow-[0_14px_35px_rgb(37_99_235/0.3)]">
            <LayoutDashboard className="size-5" />
          </div>

          <div className="min-w-0">
            <p className="truncate font-bold text-white">Cubicles Services</p>
            <p className="text-sm text-slate-400">Admin Portal</p>
          </div>
        </NavLink>
      </div>

      <nav className="min-h-0 flex-1 overflow-y-auto px-4 py-5">
        <div className="space-y-6">
          {navigationGroups.map((group) => {
            const isOpen = openGroups[group.title] ?? true

            return (
              <section key={group.title}>
                <button
                  type="button"
                  onClick={() => toggleGroup(group.title)}
                  className="mb-2 flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-[0.7rem] font-bold tracking-[0.16em] text-slate-500 uppercase transition hover:bg-white/5 hover:text-slate-300"
                >
                  {group.title}
                  <ChevronDown
                    className={`size-4 transition duration-300 ${
                      isOpen ? "rotate-0" : "-rotate-90"
                    }`}
                  />
                </button>

                {isOpen ? (
                  <div className="space-y-1">
                    {group.items.map((item) => {
                      const Icon = item.icon

                      return (
                        <NavLink
                          key={item.path}
                          to={item.path}
                          onClick={onNavigate}
                          className={({ isActive }) =>
                            [
                              "group relative flex items-center rounded-xl px-3 py-2.5 text-sm font-semibold transition duration-200",
                              isActive
                                ? "bg-gradient-to-r from-blue-500/20 to-violet-500/10 text-white"
                                : "text-slate-400 hover:bg-white/[0.06] hover:text-white",
                            ].join(" ")
                          }
                        >
                          {({ isActive }) => (
                            <>
                              {isActive ? (
                                <span className="absolute inset-y-2 left-0 w-1 rounded-r-full bg-blue-400" />
                              ) : null}

                              <span
                                className={[
                                  "mr-3 flex size-9 shrink-0 items-center justify-center rounded-lg transition",
                                  isActive
                                    ? "bg-blue-500/20 text-blue-300"
                                    : "bg-white/[0.04] text-slate-500 group-hover:bg-white/[0.08] group-hover:text-slate-300",
                                ].join(" ")}
                              >
                                <Icon className="size-4" />
                              </span>

                              <span className="truncate">{item.title}</span>
                            </>
                          )}
                        </NavLink>
                      )
                    })}
                  </div>
                ) : null}
              </section>
            )
          })}
        </div>
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <p className="text-sm font-semibold text-white">Website Management</p>
          <p className="mt-1 text-xs leading-5 text-slate-400">
            Manage content, enquiries, careers, and site configuration.
          </p>
        </div>
      </div>
    </>
  )
}

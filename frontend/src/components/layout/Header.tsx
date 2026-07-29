import { useEffect, useState } from "react"
import { ArrowUpRight } from "lucide-react"
import { Link, NavLink } from "react-router-dom"

import { getNavigation, type NavigationItem } from "@/api/navigationApi"
import { useSiteSettings } from "@/context/SiteSettingsContext"

import MobileMenu from "./MobileMenu"

const fallbackNavigation: NavigationItem[] = [
  {
    id: 1,
    title: "Home",
    url: "/",
    open_in_new_tab: false,
    display_order: 1,
  },
  {
    id: 2,
    title: "About",
    url: "/about",
    open_in_new_tab: false,
    display_order: 2,
  },
  {
    id: 3,
    title: "Services",
    url: "/services",
    open_in_new_tab: false,
    display_order: 3,
  },
  {
    id: 4,
    title: "Technologies",
    url: "/technologies",
    open_in_new_tab: false,
    display_order: 4,
  },
  {
    id: 5,
    title: "Case Studies",
    url: "/case-studies",
    open_in_new_tab: false,
    display_order: 5,
  },
  {
    id: 6,
    title: "Blogs",
    url: "/blogs",
    open_in_new_tab: false,
    display_order: 6,
  },
  {
    id: 7,
    title: "Careers",
    url: "/careers",
    open_in_new_tab: false,
    display_order: 7,
  },
  {
    id: 8,
    title: "Contact",
    url: "/contact",
    open_in_new_tab: false,
    display_order: 8,
  },
]

export default function Header() {
  const { settings } = useSiteSettings()

  const [navigationItems, setNavigationItems] =
    useState<NavigationItem[]>(fallbackNavigation)

  useEffect(() => {
    async function loadNavigation() {
      try {
        const response = await getNavigation()

        if (response.length > 0) {
          setNavigationItems(
            [...response].sort(
              (first, second) => first.display_order - second.display_order
            )
          )
        }
      } catch (error) {
        console.error("Unable to load website navigation:", error)
      }
    }

    void loadNavigation()
  }, [])

  return (
    <header className="sticky top-0 z-50">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white via-white/90 to-transparent" />

      <div className="relative px-3 pt-3 sm:px-5 lg:px-6">
        <div className="container mx-auto">
          <div className="relative flex h-18 items-center justify-between overflow-hidden rounded-2xl border border-white/70 bg-white/82 px-4 shadow-[0_16px_50px_rgb(15_23_42/0.09)] backdrop-blur-2xl sm:px-5 lg:px-6">
            <div className="pointer-events-none absolute inset-x-14 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/70 to-transparent" />

            <div className="pointer-events-none absolute -top-12 left-1/4 h-24 w-40 rounded-full bg-blue-400/12 blur-3xl" />

            <div className="pointer-events-none absolute -right-10 -bottom-16 h-32 w-32 rounded-full bg-violet-400/12 blur-3xl" />

            <Link
              to="/"
              className="group relative z-10 flex min-w-0 shrink-0 items-center gap-3"
              aria-label={`${settings.company_name} homepage`}
            >
              {settings.logo_url ? (
                <>
                  <div className="relative flex shrink-0 items-center justify-center">
                    <div className="absolute inset-0 scale-110 rounded-2xl bg-gradient-to-br from-blue-500/10 to-violet-500/10 opacity-0 blur-lg transition duration-300 group-hover:opacity-100" />

                    <img
                      src={settings.logo_url}
                      alt={`${settings.company_name} logo`}
                      className="relative h-10 w-auto max-w-44 object-contain transition duration-300 group-hover:scale-[1.03]"
                    />
                  </div>

                  <span className="hidden bg-gradient-to-r from-slate-950 via-indigo-900 to-violet-700 bg-clip-text text-lg font-extrabold tracking-tight text-transparent xl:block">
                    {settings.company_name}
                  </span>
                </>
              ) : (
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-xl font-extrabold tracking-tight text-transparent">
                  {settings.company_name}
                </span>
              )}
            </Link>

            <nav
              className="relative z-10 hidden items-center gap-1 md:flex"
              aria-label="Primary navigation"
            >
              {navigationItems.map((item) => (
                <DesktopNavigationItem key={item.id} item={item} />
              ))}
            </nav>

            <div className="relative z-10 md:hidden">
              <MobileMenu items={navigationItems} />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

function DesktopNavigationItem({ item }: { item: NavigationItem }) {
  const isContact = item.url === "/contact"
  const isInternal = item.url.startsWith("/")

  if (!isInternal) {
    return (
      <a
        href={item.url}
        target={item.open_in_new_tab ? "_blank" : undefined}
        rel={item.open_in_new_tab ? "noreferrer noopener" : undefined}
        className={isContact ? contactClassName : navigationClassName}
      >
        <span>{item.title}</span>

        {item.open_in_new_tab && <ArrowUpRight className="size-3.5" />}
      </a>
    )
  }

  if (isContact) {
    return (
      <Link
        to={item.url}
        target={item.open_in_new_tab ? "_blank" : undefined}
        rel={item.open_in_new_tab ? "noreferrer noopener" : undefined}
        className={contactClassName}
      >
        <span>{item.title}</span>

        <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </Link>
    )
  }

  return (
    <NavLink
      to={item.url}
      end={item.url === "/"}
      target={item.open_in_new_tab ? "_blank" : undefined}
      rel={item.open_in_new_tab ? "noreferrer noopener" : undefined}
      className={({ isActive }) =>
        isActive ? activeNavigationClassName : navigationClassName
      }
    >
      {({ isActive }) => (
        <>
          <span>{item.title}</span>

          <span
            aria-hidden="true"
            className={
              isActive
                ? "absolute inset-x-3 bottom-1 h-0.5 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 opacity-100"
                : "absolute inset-x-3 bottom-1 h-0.5 origin-left scale-x-0 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 opacity-0 transition duration-300 group-hover:scale-x-100 group-hover:opacity-100"
            }
          />
        </>
      )}
    </NavLink>
  )
}

const navigationClassName =
  "group relative inline-flex h-11 items-center justify-center rounded-xl px-3.5 text-sm font-medium whitespace-nowrap text-slate-600 transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-50/90 hover:to-violet-50/90 hover:text-indigo-700"

const activeNavigationClassName =
  "group relative inline-flex h-11 items-center justify-center rounded-xl bg-gradient-to-r from-blue-50 via-indigo-50 to-violet-50 px-3.5 text-sm font-semibold whitespace-nowrap text-indigo-700 shadow-[inset_0_0_0_1px_rgb(99_102_241/0.08)]"

const contactClassName =
  "group ml-2 inline-flex h-11 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-5 text-sm font-semibold whitespace-nowrap text-white shadow-[0_10px_26px_rgb(79_70_229/0.24)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgb(79_70_229/0.34)]"

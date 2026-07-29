import { useEffect, useMemo, useState } from "react"
import type { LucideIcon } from "lucide-react"
import {
  ArrowRight,
  ArrowUpRight,
  CloudCog,
  Code2,
  Globe,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
} from "lucide-react"
import { Link } from "react-router-dom"

import { getFooterLinks, type FooterLink } from "@/api/footerLinksApi"
import { Button } from "@/components/ui/button"
import { useSiteSettings } from "@/context/SiteSettingsContext"

const fallbackFooterLinks: FooterLink[] = [
  {
    id: 1,
    group_name: "Services",
    title: "AWS Cloud Migration",
    url: "/services/cloud-migration",
    open_in_new_tab: false,
    display_order: 1,
  },
  {
    id: 2,
    group_name: "Services",
    title: "Azure Cloud Migration",
    url: "/services/cloud-migration",
    open_in_new_tab: false,
    display_order: 2,
  },
  {
    id: 3,
    group_name: "Services",
    title: "DevOps Engineering",
    url: "/services/devops-engineering",
    open_in_new_tab: false,
    display_order: 3,
  },
  {
    id: 4,
    group_name: "Services",
    title: "Application Modernization",
    url: "/services/application-modernization",
    open_in_new_tab: false,
    display_order: 4,
  },
  {
    id: 5,
    group_name: "Company",
    title: "About",
    url: "/about",
    open_in_new_tab: false,
    display_order: 1,
  },
  {
    id: 6,
    group_name: "Company",
    title: "Careers",
    url: "/careers",
    open_in_new_tab: false,
    display_order: 2,
  },
  {
    id: 7,
    group_name: "Company",
    title: "Blogs",
    url: "/blogs",
    open_in_new_tab: false,
    display_order: 3,
  },
  {
    id: 8,
    group_name: "Company",
    title: "Case Studies",
    url: "/case-studies",
    open_in_new_tab: false,
    display_order: 4,
  },
]

const companyCapabilities = [
  {
    title: "Cloud Transformation",
    icon: CloudCog,
  },
  {
    title: "Secure Engineering",
    icon: ShieldCheck,
  },
  {
    title: "Application Modernization",
    icon: Code2,
  },
]

type FooterLinkGroup = {
  name: string
  links: FooterLink[]
}

type SocialLink = {
  label: string
  url: string
  icon: LucideIcon
}

export default function Footer() {
  const { settings } = useSiteSettings()

  const [footerLinks, setFooterLinks] =
    useState<FooterLink[]>(fallbackFooterLinks)

  useEffect(() => {
    async function loadFooterLinks() {
      try {
        const response = await getFooterLinks()

        if (response.length > 0) {
          setFooterLinks(response)
        }
      } catch (error) {
        console.error("Unable to load footer links:", error)
      }
    }

    void loadFooterLinks()
  }, [])

  const footerGroups = useMemo<FooterLinkGroup[]>(() => {
    const groups = new Map<string, FooterLink[]>()

    footerLinks.forEach((item) => {
      const normalizedGroupName = item.group_name.trim() || "Explore"
      const existingLinks = groups.get(normalizedGroupName) ?? []

      existingLinks.push(item)
      groups.set(normalizedGroupName, existingLinks)
    })

    return Array.from(groups.entries()).map(([name, links]) => ({
      name,
      links: [...links].sort(
        (first, second) =>
          first.display_order - second.display_order || first.id - second.id
      ),
    }))
  }, [footerLinks])

  const socialLinks = useMemo<SocialLink[]>(() => {
    const links: Array<SocialLink | null> = [
      settings.linkedin_url
        ? {
            label: "LinkedIn",
            url: settings.linkedin_url,
            icon: Globe,
          }
        : null,

      settings.facebook_url
        ? {
            label: "Facebook",
            url: settings.facebook_url,
            icon: Globe,
          }
        : null,

      settings.twitter_url
        ? {
            label: "X / Twitter",
            url: settings.twitter_url,
            icon: Globe,
          }
        : null,

      settings.youtube_url
        ? {
            label: "YouTube",
            url: settings.youtube_url,
            icon: Globe,
          }
        : null,
    ]

    return links.filter((item): item is SocialLink => item !== null)
  }, [
    settings.facebook_url,
    settings.linkedin_url,
    settings.twitter_url,
    settings.youtube_url,
  ])

  const companyName = settings.company_name || "Cubicles Services"
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative overflow-hidden bg-slate-950 text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-56 -left-48 size-[32rem] rounded-full bg-blue-600/15 blur-[140px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-56 bottom-0 size-[34rem] rounded-full bg-violet-600/10 blur-[150px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.055]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "linear-gradient(to bottom, black, transparent 88%)",
          WebkitMaskImage: "linear-gradient(to bottom, black, transparent 88%)",
        }}
      />

      <div className="relative border-b border-white/10">
        <div className="container mx-auto px-6 py-10">
          <div className="flex flex-col gap-7 rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-xl sm:p-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold tracking-wide text-blue-300">
                Start your transformation
              </p>

              <h2 className="mt-2 text-2xl font-bold tracking-[-0.025em] text-white sm:text-3xl">
                Have a cloud or modernization project in mind?
              </h2>

              <p className="mt-3 leading-7 text-slate-400">
                Speak with our engineering team about your goals, challenges and
                technology roadmap.
              </p>
            </div>

            <Button
              asChild
              size="lg"
              className="w-full shrink-0 rounded-xl bg-white px-6 text-slate-950 shadow-lg shadow-black/10 hover:bg-slate-100 sm:w-auto"
            >
              <Link to="/contact">
                Talk to Our Experts
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="relative container mx-auto px-6">
        <div className="grid gap-12 py-16 sm:py-20 lg:grid-cols-12 lg:gap-10 xl:gap-14">
          <div className="lg:col-span-5">
            <Link
              to="/"
              aria-label={`${companyName} home`}
              className="inline-flex max-w-full items-center"
            >
              {settings.logo_url ? (
                <img
                  src={settings.logo_url}
                  alt={`${companyName} logo`}
                  className="h-12 w-auto max-w-56 object-contain object-left"
                />
              ) : (
                <span className="text-2xl font-extrabold tracking-[-0.03em] text-white">
                  {companyName}
                </span>
              )}
            </Link>

            {settings.logo_url && (
              <p className="mt-5 text-xl font-bold tracking-[-0.02em] text-white">
                {companyName}
              </p>
            )}

            <p className="mt-5 max-w-md text-base leading-8 text-slate-400">
              {settings.footer_description}
            </p>

            <div className="mt-7 grid max-w-lg gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {companyCapabilities.map((capability) => {
                const Icon = capability.icon

                return (
                  <div
                    key={capability.title}
                    className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.035] px-3.5 py-3"
                  >
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-300">
                      <Icon className="size-4" />
                    </span>

                    <span className="text-xs leading-5 font-medium text-slate-300">
                      {capability.title}
                    </span>
                  </div>
                )
              })}
            </div>

            {socialLinks.length > 0 && (
              <div className="mt-8">
                <p className="text-xs font-semibold tracking-[0.16em] text-slate-500 uppercase">
                  Follow us
                </p>

                <div className="mt-4 flex flex-wrap gap-3">
                  {socialLinks.map((item) => {
                    const Icon = item.icon

                    return (
                      <a
                        key={item.label}
                        href={item.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        title={item.label}
                        aria-label={item.label}
                        className="group inline-flex size-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.035] text-slate-400 transition duration-300 hover:-translate-y-0.5 hover:border-blue-400/30 hover:bg-blue-500/10 hover:text-blue-300"
                      >
                        <Icon className="size-[1.1rem] transition-transform duration-300 group-hover:scale-110" />
                      </a>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:col-span-4">
            {footerGroups.map((group) => (
              <nav
                key={group.name}
                aria-label={`${group.name} footer navigation`}
              >
                <h3 className="text-sm font-semibold tracking-wide text-white">
                  {group.name}
                </h3>

                <div className="mt-4 h-px w-10 bg-gradient-to-r from-blue-400 to-blue-400/0" />

                <ul className="mt-6 space-y-3">
                  {group.links.map((item) => (
                    <li key={item.id}>
                      <FooterLinkItem item={item} />
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-sm font-semibold tracking-wide text-white">
              Contact
            </h3>

            <div className="mt-4 h-px w-10 bg-gradient-to-r from-blue-400 to-blue-400/0" />

            <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm">
              {settings.contact_email && (
                <ContactItem
                  icon={Mail}
                  label="Email"
                  value={settings.contact_email}
                  href={`mailto:${settings.contact_email}`}
                />
              )}

              {settings.contact_phone && (
                <ContactItem
                  icon={Phone}
                  label="Phone"
                  value={settings.contact_phone}
                  href={`tel:${settings.contact_phone}`}
                />
              )}

              {settings.address && (
                <ContactItem
                  icon={MapPin}
                  label="Location"
                  value={settings.address}
                />
              )}

              {!settings.contact_email &&
                !settings.contact_phone &&
                !settings.address && (
                  <div className="p-5">
                    <p className="text-sm leading-7 text-slate-400">
                      Contact information will be available soon.
                    </p>
                  </div>
                )}
            </div>

            <div className="mt-5 rounded-2xl border border-blue-400/15 bg-blue-500/[0.07] p-5">
              <div className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/15 text-blue-300">
                  <Globe className="size-5" />
                </span>

                <div>
                  <p className="font-semibold text-white">
                    Enterprise technology partner
                  </p>

                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    Cloud, DevOps and modern application engineering for growing
                    organizations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 py-6">
          <div className="flex flex-col gap-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <p>
              {settings.copyright_text ||
                `© ${currentYear} ${companyName}. All rights reserved.`}
            </p>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <Link
                to="/contact"
                className="transition-colors hover:text-white"
              >
                Contact
              </Link>

              <Link to="/about" className="transition-colors hover:text-white">
                About
              </Link>

              <Link
                to="/services"
                className="transition-colors hover:text-white"
              >
                Services
              </Link>

              <a
                href="#top"
                className="inline-flex items-center gap-1.5 transition-colors hover:text-white"
              >
                Back to top
                <ArrowUpRight className="size-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

function ContactItem({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: LucideIcon
  label: string
  value: string
  href?: string
}) {
  const content = (
    <>
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.045] text-blue-300">
        <Icon className="size-[1.1rem]" />
      </span>

      <span className="min-w-0">
        <span className="block text-xs font-medium tracking-wide text-slate-500 uppercase">
          {label}
        </span>

        <span className="mt-1 block text-sm leading-6 break-words whitespace-pre-line text-slate-300">
          {value}
        </span>
      </span>
    </>
  )

  const className = "flex gap-3 border-b border-white/10 p-5 last:border-b-0"

  if (href) {
    return (
      <a
        href={href}
        className={`${className} group transition-colors duration-300 hover:bg-white/[0.04]`}
      >
        {content}

        <ArrowUpRight className="mt-1 ml-auto size-4 shrink-0 text-slate-600 transition-colors group-hover:text-blue-300" />
      </a>
    )
  }

  return <div className={className}>{content}</div>
}

function FooterLinkItem({ item }: { item: FooterLink }) {
  const isInternal = item.url.startsWith("/")

  const content = (
    <>
      <span className="h-px w-0 bg-blue-400 transition-all duration-300 group-hover:w-3" />

      <span>{item.title}</span>

      {item.open_in_new_tab && <ArrowUpRight className="size-3.5 opacity-50" />}
    </>
  )

  const className =
    "group inline-flex items-center gap-2 text-sm leading-6 text-slate-400 transition-colors duration-300 hover:text-white"

  if (isInternal) {
    return (
      <Link
        to={item.url}
        target={item.open_in_new_tab ? "_blank" : undefined}
        rel={item.open_in_new_tab ? "noreferrer noopener" : undefined}
        className={className}
      >
        {content}
      </Link>
    )
  }

  return (
    <a
      href={item.url}
      target={item.open_in_new_tab ? "_blank" : undefined}
      rel={item.open_in_new_tab ? "noreferrer noopener" : undefined}
      className={className}
    >
      {content}
    </a>
  )
}

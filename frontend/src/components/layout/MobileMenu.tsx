import { Menu } from "lucide-react"
import { NavLink } from "react-router-dom"

import type { NavigationItem } from "@/api/navigationApi"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"

type MobileMenuProps = {
  items: NavigationItem[]
}

export default function MobileMenu({ items }: MobileMenuProps) {
  return (
    <Sheet>
      <SheetTrigger
        className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-slate-800 transition hover:bg-slate-100"
        aria-label="Open navigation menu"
      >
        <Menu className="h-7 w-7" />
      </SheetTrigger>

      <SheetContent>
        <div className="mt-8">
          <p className="text-sm font-semibold tracking-wider text-blue-600 uppercase">
            Navigation
          </p>

          <nav
            className="mt-6 flex flex-col gap-2"
            aria-label="Mobile navigation"
          >
            {items.map((item) => (
              <MobileNavigationItem key={item.id} item={item} />
            ))}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  )
}

function MobileNavigationItem({ item }: { item: NavigationItem }) {
  const isContact = item.url === "/contact"
  const isInternal = item.url.startsWith("/")

  if (!isInternal) {
    return (
      <SheetClose asChild>
        <a
          href={item.url}
          target={item.open_in_new_tab ? "_blank" : undefined}
          rel={item.open_in_new_tab ? "noreferrer noopener" : undefined}
          className={isContact ? mobileContactClassName : mobileLinkClassName}
        >
          {item.title}
        </a>
      </SheetClose>
    )
  }

  return (
    <SheetClose asChild>
      <NavLink
        to={item.url}
        end={item.url === "/"}
        target={item.open_in_new_tab ? "_blank" : undefined}
        rel={item.open_in_new_tab ? "noreferrer noopener" : undefined}
        className={({ isActive }) => {
          if (isContact) {
            return mobileContactClassName
          }

          return isActive
            ? `${mobileLinkClassName} bg-blue-50 text-blue-700`
            : mobileLinkClassName
        }}
      >
        {item.title}
      </NavLink>
    </SheetClose>
  )
}

const mobileLinkClassName =
  "rounded-xl px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-blue-700"

const mobileContactClassName =
  "mt-3 rounded-xl bg-blue-600 px-4 py-3 text-center font-semibold text-white transition hover:bg-blue-700"

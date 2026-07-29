import { Bell, CalendarDays, Mail, Star, TrendingUp } from "lucide-react"

import type { AdminDashboardStats } from "@/api/adminApi"

type AdminStatsProps = {
  stats: AdminDashboardStats
}

export default function AdminStats({ stats }: AdminStatsProps) {
  const cards = [
    {
      title: "Total Enquiries",
      value: stats.total_contacts,
      icon: Mail,
    },
    {
      title: "Unread",
      value: stats.unread_contacts,
      icon: Bell,
    },
    {
      title: "Today",
      value: stats.today_contacts,
      icon: CalendarDays,
    },
    {
      title: "This Month",
      value: stats.month_contacts,
      icon: TrendingUp,
    },
    {
      title: "Top Service",
      value: stats.most_requested_service,
      icon: Star,
    },
  ]

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {cards.map((card) => {
        const Icon = card.icon

        return (
          <div
            key={card.title}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
                  {card.title}
                </p>
                <p className="mt-2 truncate text-2xl font-bold text-slate-900">
                  {card.value}
                </p>
              </div>
              <div className="shrink-0 rounded-lg bg-blue-50 p-2.5">
                <Icon className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

import type { CareerApplicationStatus } from "@/api/adminCareerApplicationsApi"

const classNameByStatus: Record<CareerApplicationStatus, string> = {
  new: "border-blue-200 bg-blue-50 text-blue-700",
  reviewing: "border-amber-200 bg-amber-50 text-amber-700",
  shortlisted: "border-violet-200 bg-violet-50 text-violet-700",
  rejected: "border-red-200 bg-red-50 text-red-700",
  hired: "border-emerald-200 bg-emerald-50 text-emerald-700",
}

export default function ApplicationStatusBadge({
  status,
}: {
  status: CareerApplicationStatus
}) {
  return (
    <span
      className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-bold ${classNameByStatus[status]}`}
    >
      {formatStatus(status)}
    </span>
  )
}

function formatStatus(status: CareerApplicationStatus): string {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

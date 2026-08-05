from pathlib import Path

dashboard = Path("src/pages/admin/AdminDashboard.tsx")
media_api = Path("src/api/adminMediaApi.ts")
kpi_card = Path("src/components/admin/dashboard/KPICard.tsx")

# KPICard: allow formatted string values.
kpi = kpi_card.read_text()
kpi = kpi.replace("  value: number\n", "  value: number | string\n", 1)
kpi_card.write_text(kpi)

# Media API: add dashboard stats types and request.
api = media_api.read_text()
if "export type AdminMediaDashboardStats" not in api:
    api += '''

export type AdminMediaRecentUpload = {
  filename: string
  original_filename: string
  file_url: string
  extension: string
  size_bytes: number
  created_at: string
  is_used: boolean
  usage_count: number
}

export type AdminMediaDashboardStats = {
  total_media: number
  storage_used_bytes: number
  images_in_use: number
  unused_images: number
  recent_uploads: AdminMediaRecentUpload[]
}

export async function getAdminMediaStats(): Promise<AdminMediaDashboardStats> {
  const response = await api.get<AdminMediaDashboardStats>(
    "/admin/media-stats"
  )

  return response.data
}
'''
media_api.write_text(api)

text = dashboard.read_text()

text = text.replace(
'''  Cpu,
  Mail,
''',
'''  Cpu,
  FileImage,
  HardDrive,
  Images,
  Mail,
''',
1,
)

anchor = 'import { getAdminTechnologies } from "@/api/adminTechnologiesApi"\n'
addition = '''import {
  getAdminMediaStats,
  type AdminMediaDashboardStats,
} from "@/api/adminMediaApi"
'''
if addition not in text:
    text = text.replace(anchor, anchor + addition, 1)

text = text.replace(
'''  const [stats, setStats] = useState<AdminDashboardStats | null>(null)
''',
'''  const [stats, setStats] = useState<AdminDashboardStats | null>(null)
  const [mediaStats, setMediaStats] =
    useState<AdminMediaDashboardStats | null>(null)
''',
1,
)

text = text.replace(
'''        technologiesResponse,
        applicationsResponse,
      ] = await Promise.all([
''',
'''        technologiesResponse,
        applicationsResponse,
        mediaStatsResponse,
      ] = await Promise.all([
''',
1,
)

text = text.replace(
'''        getAdminTechnologies(),
        getAdminCareerApplications(),
      ])
''',
'''        getAdminTechnologies(),
        getAdminCareerApplications(),
        getAdminMediaStats(),
      ])
''',
1,
)

text = text.replace(
'''      setRecentApplications(sortedApplications.slice(0, 5))
      setApplications(applicationsResponse)

      setSummary({
''',
'''      setRecentApplications(sortedApplications.slice(0, 5))
      setApplications(applicationsResponse)
      setMediaStats(mediaStatsResponse)

      setSummary({
''',
1,
)

text = text.replace(
"  if (hasError || !stats) {\n",
"  if (hasError || !stats || !mediaStats) {\n",
1,
)

anchor = '''        </KPIGrid>

        <div className="grid gap-6 xl:grid-cols-2">
'''
block = '''        </KPIGrid>

        <DashboardSection
          title="Media overview"
          description="Database-backed image usage and storage information."
          onViewAll={() => navigate("/admin/media")}
        >
          <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6 xl:grid-cols-4">
            <MediaMetricCard
              label="Total Media"
              value={mediaStats.total_media}
              helper="All database-backed assets"
              icon={<Images className="size-5" />}
              iconClassName="bg-blue-50 text-blue-600"
            />

            <MediaMetricCard
              label="Storage Used"
              value={formatFileSize(mediaStats.storage_used_bytes)}
              helper="Combined binary storage"
              icon={<HardDrive className="size-5" />}
              iconClassName="bg-violet-50 text-violet-600"
            />

            <MediaMetricCard
              label="In Use"
              value={mediaStats.images_in_use}
              helper="Protected by content references"
              icon={<FileImage className="size-5" />}
              iconClassName="bg-amber-50 text-amber-600"
            />

            <MediaMetricCard
              label="Unused"
              value={mediaStats.unused_images}
              helper="Available for safe cleanup"
              icon={<FileImage className="size-5" />}
              iconClassName="bg-emerald-50 text-emerald-600"
            />
          </div>
        </DashboardSection>

        <div className="grid gap-6 xl:grid-cols-2">
'''
if 'title="Media overview"' not in text:
    text = text.replace(anchor, block, 1)

anchor = '''          <DashboardSection
            title="Recent blogs"
'''
block = '''          <DashboardSection
            title="Recent media uploads"
            description="Latest images added to the database-backed Media Library."
            onViewAll={() => navigate("/admin/media")}
          >
            {mediaStats.recent_uploads.length === 0 ? (
              <EmptyState
                icon={<Images className="size-6" />}
                title="No media uploads"
                message="Recently uploaded images will appear here."
              />
            ) : (
              <ActivityList>
                {mediaStats.recent_uploads.map((item) => (
                  <ActivityItem
                    key={item.filename}
                    title={item.original_filename || item.filename}
                    meta={`${item.extension.toUpperCase()} • ${formatFileSize(
                      item.size_bytes
                    )} • ${item.usage_count} reference${
                      item.usage_count === 1 ? "" : "s"
                    }`}
                    badge={
                      <span
                        className={[
                          "shrink-0 rounded-full border px-2.5 py-1 text-xs font-bold",
                          item.is_used
                            ? "border-amber-200 bg-amber-50 text-amber-700"
                            : "border-emerald-200 bg-emerald-50 text-emerald-700",
                        ].join(" ")}
                      >
                        {item.is_used ? "In Use" : "Unused"}
                      </span>
                    }
                    date={<DateValue value={item.created_at} />}
                    onClick={() => navigate("/admin/media")}
                  />
                ))}
              </ActivityList>
            )}
          </DashboardSection>

          <DashboardSection
            title="Recent blogs"
'''
if 'title="Recent media uploads"' not in text:
    text = text.replace(anchor, block, 1)

anchor = "function createApplicationBreakdown(\n"
helpers = '''function MediaMetricCard({
  label,
  value,
  helper,
  icon,
  iconClassName,
}: {
  label: string
  value: number | string
  helper: string
  icon: React.ReactNode
  iconClassName: string
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5">
      <div
        className={`flex size-11 items-center justify-center rounded-xl ${iconClassName}`}
      >
        {icon}
      </div>

      <p className="mt-5 text-sm font-semibold text-slate-500">{label}</p>
      <p className="mt-1 text-3xl font-extrabold tracking-[-0.04em] text-slate-950">
        {value}
      </p>
      <p className="mt-2 text-xs leading-5 text-slate-500">{helper}</p>
    </div>
  )
}

function formatFileSize(sizeBytes: number): string {
  if (sizeBytes < 1024) {
    return `${sizeBytes} B`
  }

  const kilobytes = sizeBytes / 1024

  if (kilobytes < 1024) {
    return `${kilobytes.toFixed(1)} KB`
  }

  const megabytes = kilobytes / 1024

  if (megabytes < 1024) {
    return `${megabytes.toFixed(1)} MB`
  }

  return `${(megabytes / 1024).toFixed(1)} GB`
}

function createApplicationBreakdown(
'''
if "function MediaMetricCard(" not in text:
    text = text.replace(anchor, helpers, 1)

dashboard.write_text(text)

print("Frontend media dashboard analytics patch applied successfully.")

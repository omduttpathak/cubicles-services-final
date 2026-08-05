import { useEffect, useMemo, useState } from "react"
import {
  BookOpen,
  BriefcaseBusiness,
  Cpu,
  Mail,
  UsersRound,
  Wrench,
} from "lucide-react"
import { useNavigate } from "react-router-dom"

import {
  getAdminContacts,
  getAdminDashboardStats,
  type AdminContact,
  type AdminDashboardStats,
} from "@/api/adminApi"
import { getAdminBlogs, type AdminBlog } from "@/api/adminBlogsApi"
import {
  getAdminCareerApplications,
  type AdminCareerApplication,
  type CareerApplicationStatus,
} from "@/api/adminCareerApplicationsApi"
import {
  getAdminCaseStudies,
  type AdminCaseStudy,
} from "@/api/adminCaseStudiesApi"
import { getAdminServices } from "@/api/adminServicesApi"
import { getAdminTechnologies } from "@/api/adminTechnologiesApi"
import {
  ActivityItem,
  ActivityList,
} from "@/components/admin/dashboard/ActivityList"
import ApplicationStatusBadge from "@/components/admin/dashboard/ApplicationStatusBadge"
import DashboardHero from "@/components/admin/dashboard/DashboardHero"
import DashboardSection from "@/components/admin/dashboard/DashboardSection"
import DateValue from "@/components/admin/dashboard/DateValue"
import EmptyState from "@/components/admin/dashboard/EmptyState"
import KPICard from "@/components/admin/dashboard/KPICard"
import KPIGrid from "@/components/admin/dashboard/KPIGrid"
import ProgressCard from "@/components/admin/dashboard/ProgressCard"
import StatusBadge from "@/components/admin/dashboard/StatusBadge"
import AdminStats from "@/components/admin/AdminStats"
import ErrorState from "@/components/common/ErrorState"
import PageLoader from "@/components/common/PageLoader"
import SEO from "@/components/seo/SEO"

type ContentSummary = {
  totalBlogs: number
  publishedBlogs: number
  draftBlogs: number
  totalCaseStudies: number
  publishedCaseStudies: number
  draftCaseStudies: number
  totalServices: number
  totalTechnologies: number
  activeTechnologies: number
  featuredTechnologies: number
  totalApplications: number
}

const emptySummary: ContentSummary = {
  totalBlogs: 0,
  publishedBlogs: 0,
  draftBlogs: 0,
  totalCaseStudies: 0,
  publishedCaseStudies: 0,
  draftCaseStudies: 0,
  totalServices: 0,
  totalTechnologies: 0,
  activeTechnologies: 0,
  featuredTechnologies: 0,
  totalApplications: 0,
}

export default function AdminDashboard() {
  const navigate = useNavigate()

  const [stats, setStats] = useState<AdminDashboardStats | null>(null)
  const [recentContacts, setRecentContacts] = useState<AdminContact[]>([])
  const [recentBlogs, setRecentBlogs] = useState<AdminBlog[]>([])
  const [recentCaseStudies, setRecentCaseStudies] = useState<AdminCaseStudy[]>(
    []
  )
  const [recentApplications, setRecentApplications] = useState<
    AdminCareerApplication[]
  >([])
  const [applications, setApplications] = useState<AdminCareerApplication[]>([])
  const [summary, setSummary] = useState<ContentSummary>(emptySummary)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  async function loadDashboard() {
    try {
      setIsLoading(true)
      setHasError(false)

      const [
        statsResponse,
        contactsResponse,
        blogsResponse,
        caseStudiesResponse,
        servicesResponse,
        technologiesResponse,
        applicationsResponse,
      ] = await Promise.all([
        getAdminDashboardStats(),
        getAdminContacts(),
        getAdminBlogs(),
        getAdminCaseStudies(),
        getAdminServices(),
        getAdminTechnologies(),
        getAdminCareerApplications(),
      ])

      const sortedApplications = [...applicationsResponse].sort(
        (first, second) =>
          new Date(second.created_at).getTime() -
          new Date(first.created_at).getTime()
      )

      setStats(statsResponse)
      setRecentContacts(contactsResponse.slice(0, 5))
      setRecentBlogs(blogsResponse.slice(0, 5))
      setRecentCaseStudies(caseStudiesResponse.slice(0, 5))
      setRecentApplications(sortedApplications.slice(0, 5))
      setApplications(applicationsResponse)

      setSummary({
        totalBlogs: blogsResponse.length,
        publishedBlogs: blogsResponse.filter((blog) => blog.is_published)
          .length,
        draftBlogs: blogsResponse.filter((blog) => !blog.is_published).length,
        totalCaseStudies: caseStudiesResponse.length,
        publishedCaseStudies: caseStudiesResponse.filter(
          (caseStudy) => caseStudy.is_published
        ).length,
        draftCaseStudies: caseStudiesResponse.filter(
          (caseStudy) => !caseStudy.is_published
        ).length,
        totalServices: servicesResponse.length,
        totalTechnologies: technologiesResponse.length,
        activeTechnologies: technologiesResponse.filter(
          (technology) => technology.is_active
        ).length,
        featuredTechnologies: technologiesResponse.filter(
          (technology) => technology.is_featured
        ).length,
        totalApplications: applicationsResponse.length,
      })
    } catch (error) {
      console.error(error)
      setHasError(true)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadDashboard()
  }, [])

  const applicationBreakdown = useMemo(
    () => createApplicationBreakdown(applications),
    [applications]
  )

  if (isLoading) {
    return <PageLoader message="Loading dashboard..." />
  }

  if (hasError || !stats) {
    return (
      <ErrorState
        title="Unable to Load Dashboard"
        message="The admin dashboard could not be loaded."
        onRetry={() => {
          void loadDashboard()
        }}
      />
    )
  }

  return (
    <>
      <SEO
        title="Admin Dashboard | Cubicles Services"
        description="Cubicles Services administration dashboard."
      />

      <div className="space-y-6">
        <DashboardHero
          title="Dashboard overview"
          description="Review website content, enquiries, publishing activity, and career applications from one unified workspace."
          actions={[
            {
              label: "New Blog",
              onClick: () => navigate("/admin/blogs/create"),
            },
            {
              label: "New Case Study",
              onClick: () => navigate("/admin/case-studies/create"),
            },
            {
              label: "New Service",
              onClick: () => navigate("/admin/services/create"),
            },
            {
              label: "New Technology",
              onClick: () => navigate("/admin/technologies/create"),
            },
          ]}
        />

        <AdminStats stats={stats} />

        <KPIGrid>
          <KPICard
            label="Blogs"
            value={summary.totalBlogs}
            helper={`${summary.publishedBlogs} published · ${summary.draftBlogs} drafts`}
            icon={<BookOpen className="size-6" />}
            iconClassName="bg-blue-50 text-blue-600"
            onClick={() => navigate("/admin/blogs")}
          />

          <KPICard
            label="Case Studies"
            value={summary.totalCaseStudies}
            helper={`${summary.publishedCaseStudies} published · ${summary.draftCaseStudies} drafts`}
            icon={<BriefcaseBusiness className="size-6" />}
            iconClassName="bg-indigo-50 text-indigo-600"
            onClick={() => navigate("/admin/case-studies")}
          />

          <KPICard
            label="Services"
            value={summary.totalServices}
            helper="Public service pages"
            icon={<Wrench className="size-6" />}
            iconClassName="bg-emerald-50 text-emerald-600"
            onClick={() => navigate("/admin/services")}
          />

          <KPICard
            label="Technologies"
            value={summary.totalTechnologies}
            helper={`${summary.activeTechnologies} active · ${summary.featuredTechnologies} featured`}
            icon={<Cpu className="size-6" />}
            iconClassName="bg-violet-50 text-violet-600"
            onClick={() => navigate("/admin/technologies")}
          />

          <KPICard
            label="Career Applications"
            value={summary.totalApplications}
            helper={`${applicationBreakdown.new} new · ${applicationBreakdown.shortlisted} shortlisted`}
            icon={<UsersRound className="size-6" />}
            iconClassName="bg-amber-50 text-amber-600"
            onClick={() => navigate("/admin/career-applications")}
          />

          <KPICard
            label="Unread Enquiries"
            value={stats.unread_contacts}
            helper={`${stats.today_contacts} received today`}
            icon={<Mail className="size-6" />}
            iconClassName="bg-rose-50 text-rose-600"
            onClick={() => navigate("/admin/contacts")}
          />
        </KPIGrid>

        <div className="grid gap-6 xl:grid-cols-2">
          <DashboardSection
            title="Content publishing"
            description="Published and draft content distribution."
            onViewAll={() => navigate("/admin/blogs")}
          >
            <ProgressCard
              items={[
                {
                  label: "Published Blogs",
                  value: summary.publishedBlogs,
                  total: summary.totalBlogs,
                },
                {
                  label: "Draft Blogs",
                  value: summary.draftBlogs,
                  total: summary.totalBlogs,
                },
                {
                  label: "Published Case Studies",
                  value: summary.publishedCaseStudies,
                  total: summary.totalCaseStudies,
                },
                {
                  label: "Draft Case Studies",
                  value: summary.draftCaseStudies,
                  total: summary.totalCaseStudies,
                },
              ]}
            />
          </DashboardSection>

          <DashboardSection
            title="Application pipeline"
            description="Current career application status."
            onViewAll={() => navigate("/admin/career-applications")}
          >
            <div className="grid gap-3 p-5 sm:grid-cols-2 sm:p-6">
              {(
                Object.entries(applicationBreakdown) as [
                  CareerApplicationStatus,
                  number,
                ][]
              ).map(([status, value]) => (
                <div
                  key={status}
                  className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <ApplicationStatusBadge status={status} />
                    <span className="text-xs font-semibold text-slate-400">
                      Pipeline
                    </span>
                  </div>

                  <p className="mt-5 text-3xl font-extrabold tracking-[-0.04em] text-slate-950">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </DashboardSection>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <DashboardSection
            title="Recent contact requests"
            description="Latest enquiries submitted through the website."
            onViewAll={() => navigate("/admin/contacts")}
          >
            {recentContacts.length === 0 ? (
              <EmptyState
                icon={<Mail className="size-6" />}
                title="No contact requests"
                message="New customer enquiries will appear here."
              />
            ) : (
              <ActivityList>
                {recentContacts.map((contact) => (
                  <ActivityItem
                    key={contact.id}
                    title={contact.full_name}
                    meta={`${contact.email}${contact.service ? ` • ${contact.service}` : ""}`}
                    badge={
                      <span
                        className={[
                          "shrink-0 rounded-full border px-2.5 py-1 text-xs font-bold",
                          contact.is_read
                            ? "border-slate-200 bg-slate-50 text-slate-600"
                            : "border-blue-200 bg-blue-50 text-blue-700",
                        ].join(" ")}
                      >
                        {contact.is_read ? "Read" : "New"}
                      </span>
                    }
                    date={<DateValue value={contact.created_at} />}
                    onClick={() => navigate("/admin/contacts")}
                  />
                ))}
              </ActivityList>
            )}
          </DashboardSection>

          <DashboardSection
            title="Recent career applications"
            description="Newest candidates in the hiring pipeline."
            onViewAll={() => navigate("/admin/career-applications")}
          >
            {recentApplications.length === 0 ? (
              <EmptyState
                icon={<UsersRound className="size-6" />}
                title="No applications"
                message="New career applications will appear here."
              />
            ) : (
              <ActivityList>
                {recentApplications.map((application) => (
                  <ActivityItem
                    key={application.id}
                    title={application.full_name}
                    meta={`${application.position}${
                      application.location ? ` • ${application.location}` : ""
                    }`}
                    badge={
                      <ApplicationStatusBadge status={application.status} />
                    }
                    date={<DateValue value={application.created_at} />}
                    onClick={() => navigate("/admin/career-applications")}
                  />
                ))}
              </ActivityList>
            )}
          </DashboardSection>

          <DashboardSection
            title="Recent blogs"
            description="Recently created and updated articles."
            onViewAll={() => navigate("/admin/blogs")}
          >
            {recentBlogs.length === 0 ? (
              <EmptyState
                icon={<BookOpen className="size-6" />}
                title="No blogs"
                message="Created articles will appear here."
              />
            ) : (
              <ActivityList>
                {recentBlogs.map((blog) => (
                  <ActivityItem
                    key={blog.id}
                    title={blog.title}
                    meta={`${blog.category} • ${blog.author}`}
                    badge={<StatusBadge isPublished={blog.is_published} />}
                    date={<DateValue value={blog.updated_at} />}
                    onClick={() => navigate(`/admin/blogs/${blog.id}/edit`)}
                  />
                ))}
              </ActivityList>
            )}
          </DashboardSection>

          <DashboardSection
            title="Recent case studies"
            description="Recently created and updated customer-success stories."
            onViewAll={() => navigate("/admin/case-studies")}
          >
            {recentCaseStudies.length === 0 ? (
              <EmptyState
                icon={<BriefcaseBusiness className="size-6" />}
                title="No case studies"
                message="Created case studies will appear here."
              />
            ) : (
              <ActivityList>
                {recentCaseStudies.map((caseStudy) => (
                  <ActivityItem
                    key={caseStudy.id}
                    title={caseStudy.title}
                    meta={`${caseStudy.industry} • ${caseStudy.service}`}
                    badge={<StatusBadge isPublished={caseStudy.is_published} />}
                    date={<DateValue value={caseStudy.updated_at} />}
                    onClick={() =>
                      navigate(`/admin/case-studies/${caseStudy.id}/edit`)
                    }
                  />
                ))}
              </ActivityList>
            )}
          </DashboardSection>
        </div>
      </div>
    </>
  )
}

function createApplicationBreakdown(
  applications: AdminCareerApplication[]
): Record<CareerApplicationStatus, number> {
  return applications.reduce(
    (summary, application) => {
      summary[application.status] += 1
      return summary
    },
    {
      new: 0,
      reviewing: 0,
      shortlisted: 0,
      rejected: 0,
      hired: 0,
    } satisfies Record<CareerApplicationStatus, number>
  )
}

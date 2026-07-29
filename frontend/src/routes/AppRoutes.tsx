import { lazy, Suspense } from "react"
import { Navigate, Route, Routes } from "react-router-dom"

import AdminLayout from "@/components/admin/AdminLayout"
import ProtectedRoute from "@/components/admin/ProtectedRoute"
import PageLoader from "@/components/common/PageLoader"
import MainLayout from "@/components/layout/MainLayout"

const Home = lazy(() => import("@/pages/Home"))
const About = lazy(() => import("@/pages/About"))
const Services = lazy(() => import("@/pages/Services"))
const Technologies = lazy(() => import("@/pages/Technologies"))
const CaseStudies = lazy(() => import("@/pages/CaseStudies"))
const Blogs = lazy(() => import("@/pages/Blogs"))
const Careers = lazy(() => import("@/pages/Careers"))
const Contact = lazy(() => import("@/pages/Contact"))
const NotFound = lazy(() => import("@/pages/NotFound"))

const ServiceDetails = lazy(() => import("@/pages/services/ServiceDetails"))

const TechnologyDetails = lazy(
  () => import("@/pages/technologies/TechnologyDetails")
)

const CaseStudyDetails = lazy(
  () => import("@/pages/case-studies/CaseStudyDetails")
)

const BlogDetails = lazy(() => import("@/pages/blogs/BlogDetails"))

const AdminLogin = lazy(() => import("@/pages/admin/AdminLogin"))

const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"))

const AdminHomepage = lazy(() => import("@/pages/admin/AdminHomepage"))

const HomepagePreview = lazy(() => import("@/pages/admin/HomepagePreview"))

const AdminHomepageStats = lazy(
  () => import("@/pages/admin/AdminHomepageStats")
)

const AdminHomepageBenefits = lazy(
  () => import("@/pages/admin/AdminHomepageBenefits")
)

const AdminHomepageIndustries = lazy(
  () => import("@/pages/admin/AdminHomepageIndustries")
)

const AdminHomepageTestimonials = lazy(
  () => import("@/pages/admin/AdminHomepageTestimonials")
)

const AdminHomepageFaqs = lazy(() => import("@/pages/admin/AdminHomepageFaqs"))

const AdminAbout = lazy(() => import("@/pages/admin/AdminAbout"))

const AdminAboutStats = lazy(() => import("@/pages/admin/AdminAboutStats"))

const AdminAboutValues = lazy(() => import("@/pages/admin/AdminAboutValues"))

const AdminNavigation = lazy(() => import("@/pages/admin/AdminNavigation"))

const AdminFooterLinks = lazy(() => import("@/pages/admin/AdminFooterLinks"))

const AdminSiteSettings = lazy(() => import("@/pages/admin/AdminSiteSettings"))

const AdminMediaLibrary = lazy(() => import("@/pages/admin/AdminMediaLibrary"))

const AdminContactPage = lazy(() => import("@/pages/admin/AdminContactPage"))

const AdminContacts = lazy(() => import("@/pages/admin/AdminContacts"))

const AdminBlogPage = lazy(() => import("@/pages/admin/AdminBlogPage"))

const AdminBlogs = lazy(() => import("@/pages/admin/AdminBlogs"))

const AdminBlogCreate = lazy(() => import("@/pages/admin/AdminBlogCreate"))

const AdminBlogEdit = lazy(() => import("@/pages/admin/AdminBlogEdit"))

const AdminCaseStudiesPage = lazy(
  () => import("@/pages/admin/AdminCaseStudiesPage")
)

const AdminCaseStudies = lazy(() => import("@/pages/admin/AdminCaseStudies"))

const AdminCaseStudyCreate = lazy(
  () => import("@/pages/admin/AdminCaseStudyCreate")
)

const AdminCaseStudyEdit = lazy(
  () => import("@/pages/admin/AdminCaseStudyEdit")
)

const AdminServicesPage = lazy(() => import("@/pages/admin/AdminServicesPage"))

const AdminServices = lazy(() => import("@/pages/admin/AdminServices"))

const AdminServiceCreate = lazy(
  () => import("@/pages/admin/AdminServiceCreate")
)

const AdminServiceEdit = lazy(() => import("@/pages/admin/AdminServiceEdit"))

const AdminTechnologyPage = lazy(
  () => import("@/pages/admin/AdminTechnologyPage")
)

const AdminTechnologies = lazy(() => import("@/pages/admin/AdminTechnologies"))

const AdminTechnologyCreate = lazy(
  () => import("@/pages/admin/AdminTechnologyCreate")
)

const AdminTechnologyEdit = lazy(
  () => import("@/pages/admin/AdminTechnologyEdit")
)

const AdminCareerPage = lazy(() => import("@/pages/admin/AdminCareerPage"))

const AdminJobOpenings = lazy(() => import("@/pages/admin/AdminJobOpenings"))

const AdminCareerApplications = lazy(
  () => import("@/pages/admin/AdminCareerApplications")
)

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader message="Loading page..." />}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />

          <Route path="/services" element={<Services />} />
          <Route path="/services/:slug" element={<ServiceDetails />} />

          <Route path="/technologies" element={<Technologies />} />
          <Route path="/technologies/:slug" element={<TechnologyDetails />} />

          <Route path="/case-studies" element={<CaseStudies />} />
          <Route path="/case-studies/:slug" element={<CaseStudyDetails />} />

          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/:slug" element={<BlogDetails />} />

          <Route path="/careers" element={<Careers />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        <Route
          path="/admin"
          element={<Navigate to="/admin/dashboard" replace />}
        />
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/admin/homepage-preview" element={<HomepagePreview />} />

          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />

            <Route path="/admin/homepage" element={<AdminHomepage />} />

            <Route
              path="/admin/homepage-statistics"
              element={<AdminHomepageStats />}
            />

            <Route
              path="/admin/homepage-benefits"
              element={<AdminHomepageBenefits />}
            />

            <Route
              path="/admin/homepage-industries"
              element={<AdminHomepageIndustries />}
            />

            <Route
              path="/admin/homepage-testimonials"
              element={<AdminHomepageTestimonials />}
            />

            <Route
              path="/admin/homepage-faqs"
              element={<AdminHomepageFaqs />}
            />

            <Route path="/admin/about" element={<AdminAbout />} />

            <Route
              path="/admin/about-statistics"
              element={<AdminAboutStats />}
            />

            <Route path="/admin/about-values" element={<AdminAboutValues />} />

            <Route path="/admin/navigation" element={<AdminNavigation />} />

            <Route path="/admin/footer-links" element={<AdminFooterLinks />} />

            <Route
              path="/admin/site-settings"
              element={<AdminSiteSettings />}
            />

            <Route path="/admin/media" element={<AdminMediaLibrary />} />

            <Route path="/admin/contact-page" element={<AdminContactPage />} />

            <Route path="/admin/contacts" element={<AdminContacts />} />

            <Route path="/admin/blog-page" element={<AdminBlogPage />} />

            <Route path="/admin/blogs" element={<AdminBlogs />} />

            <Route path="/admin/blogs/create" element={<AdminBlogCreate />} />

            <Route
              path="/admin/blogs/:blogId/edit"
              element={<AdminBlogEdit />}
            />

            <Route
              path="/admin/case-studies-page"
              element={<AdminCaseStudiesPage />}
            />

            <Route path="/admin/case-studies" element={<AdminCaseStudies />} />

            <Route
              path="/admin/case-studies/create"
              element={<AdminCaseStudyCreate />}
            />

            <Route
              path="/admin/case-studies/:caseStudyId/edit"
              element={<AdminCaseStudyEdit />}
            />

            <Route
              path="/admin/services-page"
              element={<AdminServicesPage />}
            />

            <Route path="/admin/services" element={<AdminServices />} />

            <Route
              path="/admin/services/create"
              element={<AdminServiceCreate />}
            />

            <Route
              path="/admin/services/:serviceId/edit"
              element={<AdminServiceEdit />}
            />

            <Route
              path="/admin/technology-page"
              element={<AdminTechnologyPage />}
            />

            <Route path="/admin/technologies" element={<AdminTechnologies />} />

            <Route
              path="/admin/technologies/create"
              element={<AdminTechnologyCreate />}
            />

            <Route
              path="/admin/technologies/:technologyId/edit"
              element={<AdminTechnologyEdit />}
            />

            <Route path="/admin/career-page" element={<AdminCareerPage />} />

            <Route path="/admin/job-openings" element={<AdminJobOpenings />} />

            <Route
              path="/admin/career-applications"
              element={<AdminCareerApplications />}
            />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}

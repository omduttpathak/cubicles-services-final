import { useEffect, useState } from "react"

import { getHomepageSettings, type HomepageSettings } from "@/api/homepageApi"
import HomepageRenderer, {
  defaultHomepageSectionOrder,
} from "@/components/home/HomepageRenderer"
import SEO from "@/components/seo/SEO"

export const fallbackHomepageSettings: HomepageSettings = {
  id: 0,
  hero_badge: "Cloud Transformation & IT Modernization Partner",
  hero_title:
    "Transform Your Business With Cloud, DevOps & Modern Application Engineering",
  hero_description:
    "Cubicles Services helps enterprises migrate, modernize and optimize their applications on AWS and Azure through secure, scalable and automated cloud solutions.",
  primary_button_text: "Talk To Cloud Experts",
  primary_button_url: "/contact",
  secondary_button_text: "Explore Services",
  secondary_button_url: "/services",
  cta_title: "Ready to Transform Your Technology Landscape?",
  cta_description:
    "Partner with Cubicles Services for cloud migration, application modernization, DevOps automation and managed IT solutions.",
  cta_button_text: "Schedule Cloud Assessment",
  cta_button_url: "/contact",
  seo_title: "Cloud Transformation & IT Modernization | Cubicles Services",
  seo_description:
    "Cubicles Services provides cloud migration, DevOps automation, application modernization and managed IT services for modern enterprises.",
  is_active: true,
  show_hero: true,
  services_title: "End-to-End Cloud & Digital Engineering Services",
  services_description:
    "Modern technology services designed to help enterprises migrate, automate, modernize and operate secure digital platforms.",
  show_services: true,
  technologies_title: "Technologies We Work With",
  technologies_description:
    "Modern platforms and tools powering enterprise transformation.",
  show_technologies: true,
  benefits_title: "Why Choose Cubicles Services",
  benefits_description:
    "Helping enterprises build secure, scalable and modern technology platforms.",
  show_benefits: true,
  industries_title: "Industries We Serve",
  industries_description:
    "Technology solutions designed for different business domains.",
  show_industries: true,
  case_studies_title: "Featured Case Studies",
  case_studies_description:
    "Real-world transformation initiatives delivered for modern enterprises.",
  show_case_studies: true,
  testimonials_title: "What Our Clients Say",
  testimonials_description:
    "Trusted by organizations to deliver cloud transformation, DevOps automation and modern software solutions.",
  show_testimonials: true,
  stats_title: "Numbers That Reflect Our Experience",
  stats_description:
    "Helping organizations accelerate cloud adoption, DevOps automation and digital transformation.",
  show_stats: true,
  faq_title: "Frequently Asked Questions",
  faq_description:
    "Everything you need to know about our cloud and software engineering services.",
  show_faq: true,
  show_cta: true,
  section_order: defaultHomepageSectionOrder,
}

export default function Home() {
  const [homepageSettings, setHomepageSettings] = useState<HomepageSettings>(
    fallbackHomepageSettings
  )

  useEffect(() => {
    async function loadHomepageSettings() {
      try {
        setHomepageSettings(await getHomepageSettings())
      } catch (error) {
        console.error("Unable to load homepage settings:", error)
      }
    }

    void loadHomepageSettings()
  }, [])

  return (
    <>
      <SEO
        title={homepageSettings.seo_title}
        description={homepageSettings.seo_description}
      />

      <HomepageRenderer settings={homepageSettings} />
    </>
  )
}

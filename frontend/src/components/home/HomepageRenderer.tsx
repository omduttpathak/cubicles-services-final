import type { ReactNode } from "react"

import type { HomepageSection, HomepageSettings } from "@/api/homepageApi"
import CaseStudyPreview from "@/components/home/CaseStudyPreview"
import CTASection from "@/components/home/CTASection"
import FAQSection from "@/components/home/FAQSection"
import HeroSection from "@/components/home/HeroSection"
import IndustriesSection from "@/components/home/IndustriesSection"
import ServicesSection from "@/components/home/ServicesSection"
import StatsSection from "@/components/home/StatsSection"
import TechnologySection from "@/components/home/TechnologySection"
import TestimonialsSection from "@/components/home/TestimonialsSection"
import WhyChooseUs from "@/components/home/WhyChooseUs"

export const defaultHomepageSectionOrder: HomepageSection[] = [
  "hero",
  "services",
  "technologies",
  "benefits",
  "industries",
  "case_studies",
  "testimonials",
  "stats",
  "faq",
  "cta",
]

type HomepageRendererProps = {
  settings: HomepageSettings
}

export default function HomepageRenderer({ settings }: HomepageRendererProps) {
  const sectionOrder =
    settings.section_order.length === defaultHomepageSectionOrder.length
      ? settings.section_order
      : defaultHomepageSectionOrder

  function renderSection(section: HomepageSection): ReactNode {
    switch (section) {
      case "hero":
        return settings.show_hero ? (
          <HeroSection
            key={section}
            badge={settings.hero_badge}
            title={settings.hero_title}
            description={settings.hero_description}
            primaryButtonText={settings.primary_button_text}
            primaryButtonUrl={settings.primary_button_url}
            secondaryButtonText={settings.secondary_button_text}
            secondaryButtonUrl={settings.secondary_button_url}
          />
        ) : null

      case "services":
        return settings.show_services ? (
          <ServicesSection
            key={section}
            title={settings.services_title}
            description={settings.services_description}
          />
        ) : null

      case "technologies":
        return settings.show_technologies ? (
          <TechnologySection
            key={section}
            title={settings.technologies_title}
            description={settings.technologies_description}
          />
        ) : null

      case "benefits":
        return settings.show_benefits ? (
          <WhyChooseUs
            key={section}
            title={settings.benefits_title}
            description={settings.benefits_description}
          />
        ) : null

      case "industries":
        return settings.show_industries ? (
          <IndustriesSection
            key={section}
            title={settings.industries_title}
            description={settings.industries_description}
          />
        ) : null

      case "case_studies":
        return settings.show_case_studies ? (
          <CaseStudyPreview
            key={section}
            title={settings.case_studies_title}
            description={settings.case_studies_description}
          />
        ) : null

      case "testimonials":
        return settings.show_testimonials ? (
          <TestimonialsSection
            key={section}
            title={settings.testimonials_title}
            description={settings.testimonials_description}
          />
        ) : null

      case "stats":
        return settings.show_stats ? (
          <StatsSection
            key={section}
            title={settings.stats_title}
            description={settings.stats_description}
          />
        ) : null

      case "faq":
        return settings.show_faq ? (
          <FAQSection
            key={section}
            title={settings.faq_title}
            description={settings.faq_description}
          />
        ) : null

      case "cta":
        return settings.show_cta ? (
          <CTASection
            key={section}
            title={settings.cta_title}
            description={settings.cta_description}
            buttonText={settings.cta_button_text}
            buttonUrl={settings.cta_button_url}
          />
        ) : null
    }
  }

  return <>{sectionOrder.map(renderSection)}</>
}

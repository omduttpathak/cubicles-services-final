import { useEffect, useState } from "react"

import {
  getServicesPageSettings,
  type ServicesPageSettings,
} from "@/api/servicesPageApi"
import CTASection from "@/components/common/CTASection"
import ErrorState from "@/components/common/ErrorState"
import PageLoader from "@/components/common/PageLoader"
import SEO from "@/components/common/SEO"
import HeroSection from "@/components/services/HeroSection"
import IndustriesSection from "@/components/services/IndustriesSection"
import ProcessSection from "@/components/services/ProcessSection"
import ServicesSection from "@/components/services/ServicesSection"
import StatsSection from "@/components/services/StatsSection"
import WhyChooseUs from "@/components/services/WhyChooseUs"

export default function Services() {
  const [settings, setSettings] = useState<ServicesPageSettings | null>(null)

  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  async function loadServicesPage() {
    try {
      setIsLoading(true)
      setHasError(false)

      const response = await getServicesPageSettings()

      setSettings(response)
    } catch (error) {
      console.error("Unable to load Services page:", error)
      setHasError(true)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadServicesPage()
  }, [])

  if (isLoading) {
    return <PageLoader message="Loading Services page..." />
  }

  if (hasError || !settings) {
    return (
      <ErrorState
        title="Unable to Load Services Page"
        message="The Services page content could not be loaded."
        onRetry={() => {
          void loadServicesPage()
        }}
      />
    )
  }

  return (
    <>
      <SEO title={settings.seo_title} description={settings.seo_description} />

      {settings.show_hero && <HeroSection settings={settings} />}

      {settings.show_services && <ServicesSection settings={settings} />}

      {settings.show_benefits && <WhyChooseUs settings={settings} />}

      {settings.show_process && <ProcessSection settings={settings} />}

      {settings.show_stats && <StatsSection />}

      {settings.show_industries && <IndustriesSection settings={settings} />}

      {settings.show_cta && (
        <CTASection
          title={settings.cta_title}
          description={settings.cta_description}
          primaryButtonText={settings.cta_primary_button_text}
          primaryButtonLink={settings.cta_primary_button_url}
          secondaryButtonText={settings.cta_secondary_button_text}
          secondaryButtonLink={settings.cta_secondary_button_url}
        />
      )}
    </>
  )
}

import { useEffect, useState } from "react"

import {
  getCareerPageSettings,
  type CareerPageSettings,
} from "@/api/careerPageApi"
import CareersHero from "@/components/careers/CareersHero"
import JobOpenings from "@/components/careers/JobOpenings"
import ErrorState from "@/components/common/ErrorState"
import PageLoader from "@/components/common/PageLoader"
import SEO from "@/components/seo/SEO"

export default function Careers() {
  const [settings, setSettings] = useState<CareerPageSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  async function loadCareerPage() {
    try {
      setIsLoading(true)
      setHasError(false)

      const response = await getCareerPageSettings()

      setSettings(response)
    } catch (error) {
      console.error("Unable to load Careers page:", error)
      setHasError(true)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadCareerPage()
  }, [])

  if (isLoading) {
    return <PageLoader message="Loading Careers page..." />
  }

  if (hasError || !settings) {
    return (
      <ErrorState
        title="Unable to Load Careers Page"
        message="The Careers page content could not be loaded."
        onRetry={() => {
          void loadCareerPage()
        }}
      />
    )
  }

  return (
    <>
      <SEO title={settings.seo_title} description={settings.seo_description} />

      {settings.show_hero && (
        <CareersHero
          eyebrow={settings.hero_eyebrow}
          title={settings.hero_title}
          description={settings.hero_description}
        />
      )}

      {settings.show_openings && <JobOpenings settings={settings} />}
    </>
  )
}

import { useEffect, useState } from "react"

import {
  getAboutPage,
  getAboutStats,
  getAboutValues,
  type AboutPageSettings,
  type AboutStat,
  type AboutValue,
} from "@/api/aboutApi"
import AboutHero from "@/components/about/AboutHero"
import CompanyOverview from "@/components/about/CompanyOverview"
import CompanyValues from "@/components/about/CompanyValues"
import ErrorState from "@/components/common/ErrorState"
import PageLoader from "@/components/common/PageLoader"
import SEO from "@/components/seo/SEO"

export default function About() {
  const [settings, setSettings] = useState<AboutPageSettings | null>(null)
  const [stats, setStats] = useState<AboutStat[]>([])
  const [values, setValues] = useState<AboutValue[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  async function loadAboutPage() {
    try {
      setIsLoading(true)
      setHasError(false)

      const [settingsResponse, statsResponse, valuesResponse] =
        await Promise.all([getAboutPage(), getAboutStats(), getAboutValues()])

      setSettings(settingsResponse)
      setStats(
        [...statsResponse].sort(
          (first, second) =>
            first.display_order - second.display_order || first.id - second.id
        )
      )
      setValues(
        [...valuesResponse].sort(
          (first, second) =>
            first.display_order - second.display_order || first.id - second.id
        )
      )
    } catch (error) {
      console.error("Unable to load About page:", error)
      setHasError(true)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadAboutPage()
  }, [])

  if (isLoading) {
    return <PageLoader message="Loading About page..." />
  }

  if (hasError || !settings) {
    return (
      <ErrorState
        title="Unable to Load About Page"
        message="The About page content could not be loaded."
        onRetry={() => {
          void loadAboutPage()
        }}
      />
    )
  }

  return (
    <>
      <SEO title={settings.seo_title} description={settings.seo_description} />

      {settings.show_hero && (
        <AboutHero
          badge={settings.hero_badge}
          title={settings.hero_title}
          description={settings.hero_description}
        />
      )}

      {settings.show_overview && (
        <CompanyOverview
          eyebrow={settings.overview_eyebrow}
          title={settings.overview_title}
          descriptionOne={settings.overview_description_one}
          descriptionTwo={settings.overview_description_two}
          stats={stats}
        />
      )}

      {settings.show_values && (
        <CompanyValues
          eyebrow={settings.values_eyebrow}
          title={settings.values_title}
          description={settings.values_description}
          values={values}
        />
      )}
    </>
  )
}

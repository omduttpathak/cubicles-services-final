import { useEffect, useState } from "react"

import {
  getTechnologyPageSettings,
  type TechnologyPageSettings,
} from "@/api/technologyPageApi"
import ErrorState from "@/components/common/ErrorState"
import PageLoader from "@/components/common/PageLoader"
import SEO from "@/components/seo/SEO"
import TechnologiesHero from "@/components/technologies/TechnologiesHero"
import TechnologyCategories from "@/components/technologies/TechnologyCategories"

export default function Technologies() {
  const [settings, setSettings] = useState<TechnologyPageSettings | null>(null)

  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  async function loadTechnologyPage() {
    try {
      setIsLoading(true)
      setHasError(false)

      const response = await getTechnologyPageSettings()

      setSettings(response)
    } catch (error) {
      console.error("Unable to load Technologies page:", error)
      setHasError(true)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadTechnologyPage()
  }, [])

  if (isLoading) {
    return <PageLoader message="Loading Technologies page..." />
  }

  if (hasError || !settings) {
    return (
      <ErrorState
        title="Unable to Load Technologies Page"
        message="The Technologies page content could not be loaded."
        onRetry={() => {
          void loadTechnologyPage()
        }}
      />
    )
  }

  return (
    <>
      <SEO title={settings.seo_title} description={settings.seo_description} />

      {settings.show_hero && (
        <TechnologiesHero
          badge={settings.hero_badge}
          title={settings.hero_title}
          description={settings.hero_description}
        />
      )}

      <TechnologyCategories settings={settings} />
    </>
  )
}

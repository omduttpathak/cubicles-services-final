import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"

import { getSiteSettings, type SiteSettings } from "@/api/siteSettingsApi"

export const fallbackSiteSettings: SiteSettings = {
  id: 0,
  company_name: "Cubicles Services",
  logo_url: null,
  favicon_url: null,
  contact_email: "info@cubiclesservices.com",
  contact_phone: null,
  address: null,
  footer_description:
    "Cloud migration, application modernization, DevOps, Cybersecurity and managed IT services.",
  copyright_text: "© 2026 Cubicles Services. All rights reserved.",
  linkedin_url: null,
  facebook_url: null,
  twitter_url: null,
  youtube_url: null,
  is_active: true,
}

type SiteSettingsContextValue = {
  settings: SiteSettings
  isLoading: boolean
  hasError: boolean
  reloadSettings: () => Promise<void>
}

const SiteSettingsContext = createContext<SiteSettingsContextValue | null>(null)

type SiteSettingsProviderProps = {
  children: ReactNode
}

export function SiteSettingsProvider({ children }: SiteSettingsProviderProps) {
  const [settings, setSettings] = useState<SiteSettings>(fallbackSiteSettings)

  const [isLoading, setIsLoading] = useState(true)

  const [hasError, setHasError] = useState(false)

  async function reloadSettings() {
    try {
      setIsLoading(true)
      setHasError(false)

      const response = await getSiteSettings()

      setSettings(response)

      updateFavicon(response.favicon_url)
    } catch (error) {
      console.error("Unable to load site settings:", error)

      setHasError(true)
      setSettings(fallbackSiteSettings)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void reloadSettings()
  }, [])

  const contextValue = useMemo(
    () => ({
      settings,
      isLoading,
      hasError,
      reloadSettings,
    }),
    [settings, isLoading, hasError]
  )

  return (
    <SiteSettingsContext.Provider value={contextValue}>
      {children}
    </SiteSettingsContext.Provider>
  )
}

export function useSiteSettings() {
  const context = useContext(SiteSettingsContext)

  if (!context) {
    throw new Error("useSiteSettings must be used inside SiteSettingsProvider.")
  }

  return context
}

function updateFavicon(faviconUrl: string | null) {
  if (!faviconUrl) {
    return
  }

  let favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]')

  if (!favicon) {
    favicon = document.createElement("link")
    favicon.rel = "icon"
    document.head.appendChild(favicon)
  }

  favicon.href = faviconUrl
}

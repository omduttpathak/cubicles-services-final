import api from "./axios"

export type SiteSettings = {
  id: number
  company_name: string
  logo_url: string | null
  favicon_url: string | null
  contact_email: string
  contact_phone: string | null
  address: string | null
  footer_description: string
  copyright_text: string
  linkedin_url: string | null
  facebook_url: string | null
  twitter_url: string | null
  youtube_url: string | null
  is_active: boolean
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const response = await api.get<SiteSettings>("/site-settings")
  return response.data
}

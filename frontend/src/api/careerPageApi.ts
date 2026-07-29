import api from "./axios"

export type CareerPageSettings = {
  id: number
  hero_eyebrow: string
  hero_title: string
  hero_description: string
  openings_eyebrow: string
  openings_title: string
  openings_description: string
  empty_title: string
  empty_description: string
  apply_button_text: string
  application_eyebrow: string
  application_title_prefix: string
  application_description: string
  full_name_label: string
  email_label: string
  phone_label: string
  position_label: string
  experience_label: string
  company_label: string
  location_label: string
  linkedin_label: string
  resume_label: string
  cover_letter_label: string
  resume_upload_title: string
  resume_upload_description: string
  cancel_button_text: string
  submit_button_text: string
  submitting_button_text: string
  success_message: string
  error_message: string
  seo_title: string
  seo_description: string
  show_hero: boolean
  show_openings: boolean
  is_active: boolean
}

export async function getCareerPageSettings(): Promise<CareerPageSettings> {
  const response = await api.get<CareerPageSettings>("/career-page")

  return response.data
}

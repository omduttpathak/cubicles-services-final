import api from "./axios"

export type ContactPageSettings = {
  id: number
  hero_eyebrow: string
  hero_title: string
  hero_description: string
  form_title: string
  form_description: string
  full_name_label: string
  email_label: string
  company_label: string
  phone_label: string
  service_label: string
  message_label: string
  service_placeholder: string
  submit_button_text: string
  submitting_button_text: string
  success_message: string
  error_message: string
  seo_title: string
  seo_description: string
  show_breadcrumb: boolean
  show_form: boolean
  is_active: boolean
}

export async function getContactPageSettings(): Promise<ContactPageSettings> {
  const response = await api.get<ContactPageSettings>("/contact-page")

  return response.data
}

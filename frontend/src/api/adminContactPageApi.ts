import api from "./axios"

export type AdminContactPage = {
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

export type UpdateAdminContactPageRequest = Omit<AdminContactPage, "id">

export async function getAdminContactPage(): Promise<AdminContactPage> {
  const response = await api.get<AdminContactPage>("/admin/contact-page")

  return response.data
}

export async function updateAdminContactPage(
  data: UpdateAdminContactPageRequest
): Promise<AdminContactPage> {
  const response = await api.put<AdminContactPage>("/admin/contact-page", data)

  return response.data
}

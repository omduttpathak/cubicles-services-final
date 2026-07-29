import api from "./axios"

export type FooterLink = {
  id: number
  group_name: string
  title: string
  url: string
  open_in_new_tab: boolean
  display_order: number
}

export async function getFooterLinks(): Promise<FooterLink[]> {
  const response = await api.get<FooterLink[]>("/footer-links")

  return response.data
}

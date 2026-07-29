import api from "./axios"

export type AdminFooterLink = {
  id: number
  group_name: string
  title: string
  url: string
  open_in_new_tab: boolean
  display_order: number
  is_visible: boolean
  created_at: string
  updated_at: string
}

export type FooterLinkRequest = {
  group_name: string
  title: string
  url: string
  open_in_new_tab: boolean
  display_order: number
  is_visible: boolean
}

export type FooterLinkOrderItem = {
  id: number
  group_name: string
  display_order: number
}

export async function getAdminFooterLinks(): Promise<AdminFooterLink[]> {
  const response = await api.get<AdminFooterLink[]>("/admin/footer-links")

  return response.data
}

export async function createAdminFooterLink(
  data: FooterLinkRequest
): Promise<AdminFooterLink> {
  const response = await api.post<AdminFooterLink>("/admin/footer-links", data)

  return response.data
}

export async function updateAdminFooterLink(
  footerLinkId: number,
  data: FooterLinkRequest
): Promise<AdminFooterLink> {
  const response = await api.put<AdminFooterLink>(
    `/admin/footer-links/${footerLinkId}`,
    data
  )

  return response.data
}

export async function updateAdminFooterLinkOrder(
  items: FooterLinkOrderItem[]
): Promise<AdminFooterLink[]> {
  const response = await api.put<AdminFooterLink[]>(
    "/admin/footer-links/order",
    {
      items,
    }
  )

  return response.data
}

export async function deleteAdminFooterLink(
  footerLinkId: number
): Promise<void> {
  await api.delete(`/admin/footer-links/${footerLinkId}`)
}

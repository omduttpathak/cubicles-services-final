import api from "./axios"

export type AdminContact = {
  id: number
  full_name: string
  email: string
  company: string | null
  phone: string | null
  service: string | null
  message: string
  is_read: boolean
  created_at: string
}

export type AdminDashboardStats = {
  total_contacts: number
  today_contacts: number
  month_contacts: number
  unread_contacts: number
  most_requested_service: string
}

export async function getAdminContacts(): Promise<AdminContact[]> {
  const response = await api.get<AdminContact[]>("/admin/contacts")

  return response.data
}

export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  const response = await api.get<AdminDashboardStats>("/admin/dashboard-stats")

  return response.data
}

export async function markAdminContactAsRead(contactId: number): Promise<void> {
  await api.patch(`/admin/contacts/${contactId}/read`)
}

export async function deleteAdminContact(contactId: number): Promise<void> {
  await api.delete(`/admin/contacts/${contactId}`)
}

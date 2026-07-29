import api from "./axios"

export type NavigationItem = {
  id: number
  title: string
  url: string
  open_in_new_tab: boolean
  display_order: number
  is_visible: boolean
  created_at: string
  updated_at: string
}

export type NavigationCreate = {
  title: string
  url: string
  open_in_new_tab: boolean
  display_order: number
  is_visible: boolean
}

export type NavigationUpdate = NavigationCreate

export async function getNavigationItems(): Promise<NavigationItem[]> {
  const response = await api.get<NavigationItem[]>("/admin/navigation")
  return response.data
}

export async function createNavigationItem(
  payload: NavigationCreate
): Promise<NavigationItem> {
  const response = await api.post<NavigationItem>("/admin/navigation", payload)
  return response.data
}

export async function updateNavigationItem(
  navigationItemId: number,
  payload: NavigationUpdate
): Promise<NavigationItem> {
  const response = await api.put<NavigationItem>(
    `/admin/navigation/${navigationItemId}`,
    payload
  )
  return response.data
}

export async function updateNavigationOrder(
  itemIds: number[]
): Promise<NavigationItem[]> {
  const response = await api.put<NavigationItem[]>("/admin/navigation-order", {
    item_ids: itemIds,
  })
  return response.data
}

export async function deleteNavigationItem(
  navigationItemId: number
): Promise<void> {
  await api.delete(`/admin/navigation/${navigationItemId}`)
}

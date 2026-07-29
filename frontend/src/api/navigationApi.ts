import api from "./axios"

export type NavigationItem = {
  id: number
  title: string
  url: string
  open_in_new_tab: boolean
  display_order: number
}

export async function getNavigation() {
  const { data } = await api.get<NavigationItem[]>("/navigation")
  return data
}

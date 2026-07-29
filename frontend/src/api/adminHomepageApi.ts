import api from "./axios"

import type { HomepageSection, HomepageSettings } from "@/api/homepageApi"

export type { HomepageSection, HomepageSettings }

export type UpdateHomepageSettingsRequest = Omit<HomepageSettings, "id">

export async function getAdminHomepageSettings(): Promise<HomepageSettings> {
  const response = await api.get<HomepageSettings>("/admin/homepage")

  return response.data
}

export async function updateAdminHomepageSettings(
  data: UpdateHomepageSettingsRequest
): Promise<HomepageSettings> {
  const response = await api.put<HomepageSettings>("/admin/homepage", data)

  return response.data
}

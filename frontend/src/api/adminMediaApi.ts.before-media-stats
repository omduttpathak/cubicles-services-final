import api from "./axios"

export type AdminMediaUsage = {
  type: string
  id: number
  label: string
}

export type AdminMediaItem = {
  filename: string
  file_url: string
  extension: string
  size_bytes: number
  created_at: string
  is_used: boolean
  usage: AdminMediaUsage[]
}

export async function getAdminMedia(): Promise<AdminMediaItem[]> {
  const response = await api.get<AdminMediaItem[]>("/admin/media")
  return response.data
}

export async function deleteAdminMedia(filename: string): Promise<void> {
  await api.delete(`/admin/media/${encodeURIComponent(filename)}`)
}

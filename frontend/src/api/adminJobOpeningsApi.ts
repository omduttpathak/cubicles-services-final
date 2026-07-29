import api from "./axios"

export type AdminJobOpening = {
  id: number
  title: string
  slug: string
  location: string
  employment_type: string
  experience: string
  short_description: string
  description: string | null
  responsibilities: string[]
  requirements: string[]
  skills: string[]
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export type JobOpeningRequest = {
  title: string
  slug: string
  location: string
  employment_type: string
  experience: string
  short_description: string
  description: string | null
  responsibilities: string[]
  requirements: string[]
  skills: string[]
  display_order: number
  is_active: boolean
}

export async function getAdminJobOpenings(): Promise<AdminJobOpening[]> {
  const response = await api.get<AdminJobOpening[]>("/admin/job-openings")

  return response.data
}

export async function getAdminJobOpeningById(
  jobId: number
): Promise<AdminJobOpening> {
  const response = await api.get<AdminJobOpening>(
    `/admin/job-openings/${jobId}`
  )

  return response.data
}

export async function createAdminJobOpening(
  data: JobOpeningRequest
): Promise<AdminJobOpening> {
  const response = await api.post<AdminJobOpening>("/admin/job-openings", data)

  return response.data
}

export async function updateAdminJobOpening(
  jobId: number,
  data: JobOpeningRequest
): Promise<AdminJobOpening> {
  const response = await api.put<AdminJobOpening>(
    `/admin/job-openings/${jobId}`,
    data
  )

  return response.data
}

export async function deleteAdminJobOpening(jobId: number): Promise<void> {
  await api.delete(`/admin/job-openings/${jobId}`)
}

export async function updateJobOpeningOrder(
  jobIds: number[]
): Promise<AdminJobOpening[]> {
  const response = await api.put<AdminJobOpening[]>(
    "/admin/job-openings/order",
    {
      job_ids: jobIds,
    }
  )

  return response.data
}

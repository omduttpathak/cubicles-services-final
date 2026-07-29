import api from "./axios"

export type CareerApplicationStatus =
  "new" | "reviewing" | "shortlisted" | "rejected" | "hired"

export type AdminCareerApplication = {
  id: number
  full_name: string
  email: string
  phone: string | null
  position: string
  experience: string | null
  current_company: string | null
  location: string | null
  linkedin_url: string | null
  resume_url: string | null
  cover_letter: string | null
  status: CareerApplicationStatus
  created_at: string
  updated_at: string
}

export async function getAdminCareerApplications(): Promise<
  AdminCareerApplication[]
> {
  const response = await api.get<AdminCareerApplication[]>(
    "/admin/career-applications"
  )

  return response.data
}

export async function getAdminCareerApplicationById(
  applicationId: number
): Promise<AdminCareerApplication> {
  const response = await api.get<AdminCareerApplication>(
    `/admin/career-applications/${applicationId}`
  )

  return response.data
}

export async function updateCareerApplicationStatus(
  applicationId: number,
  status: CareerApplicationStatus
): Promise<AdminCareerApplication> {
  const response = await api.patch<AdminCareerApplication>(
    `/admin/career-applications/${applicationId}/status`,
    {
      status,
    }
  )

  return response.data
}

export async function deleteCareerApplication(
  applicationId: number
): Promise<void> {
  await api.delete(`/admin/career-applications/${applicationId}`)
}

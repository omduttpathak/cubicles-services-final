import api from "./axios"

export type AdminCaseStudy = {
  id: number
  title: string
  slug: string
  industry: string
  service: string
  summary: string
  challenge: string
  solution: string
  results: string[]
  technologies: string[]
  image_url: string | null
  seo_title: string
  seo_description: string
  is_published: boolean
  published_at: string
  created_at: string
  updated_at: string
}

export type CreateAdminCaseStudyRequest = {
  title: string
  slug: string
  industry: string
  service: string
  summary: string
  challenge: string
  solution: string
  results: string[]
  technologies: string[]
  image_url: string | null
  seo_title: string
  seo_description: string
  is_published: boolean
  published_at: string | null
}

export async function getAdminCaseStudies(): Promise<AdminCaseStudy[]> {
  const response = await api.get<AdminCaseStudy[]>("/admin/case-studies")

  return response.data
}

export async function createAdminCaseStudy(
  data: CreateAdminCaseStudyRequest
): Promise<AdminCaseStudy> {
  const response = await api.post<AdminCaseStudy>("/admin/case-studies", data)

  return response.data
}

export async function updateAdminCaseStudyPublishStatus(
  caseStudyId: number,
  isPublished: boolean
): Promise<AdminCaseStudy> {
  const response = await api.patch<AdminCaseStudy>(
    `/admin/case-studies/${caseStudyId}/publish-status`,
    {
      is_published: isPublished,
    }
  )

  return response.data
}

export type UpdateAdminCaseStudyRequest = {
  title: string
  slug: string
  industry: string
  service: string
  summary: string
  challenge: string
  solution: string
  results: string[]
  technologies: string[]
  image_url: string | null
  seo_title: string
  seo_description: string
}

export async function getAdminCaseStudyById(
  caseStudyId: number
): Promise<AdminCaseStudy> {
  const response = await api.get<AdminCaseStudy>(
    `/admin/case-studies/${caseStudyId}`
  )

  return response.data
}

export async function updateAdminCaseStudy(
  caseStudyId: number,
  data: UpdateAdminCaseStudyRequest
): Promise<AdminCaseStudy> {
  const response = await api.put<AdminCaseStudy>(
    `/admin/case-studies/${caseStudyId}`,
    data
  )

  return response.data
}

export async function deleteAdminCaseStudy(caseStudyId: number): Promise<void> {
  await api.delete(`/admin/case-studies/${caseStudyId}`)
}

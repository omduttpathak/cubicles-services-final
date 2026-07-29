import api from "./axios"

export type PublicJobOpening = {
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
}

export async function getJobOpenings(): Promise<PublicJobOpening[]> {
  const response = await api.get<PublicJobOpening[]>("/job-openings")

  return response.data
}

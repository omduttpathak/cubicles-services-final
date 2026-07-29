import api from "./axios"

export type CareerApplicationFormData = {
  full_name: string
  email: string
  phone: string | null
  position: string
  experience: string | null
  current_company: string | null
  location: string | null
  linkedin_url: string | null
  cover_letter: string | null
  resume: File
}

export type CareerApplicationResponse = {
  message: string
  id: number
}

export async function submitCareerApplication(
  data: CareerApplicationFormData
): Promise<CareerApplicationResponse> {
  const formData = new FormData()

  formData.append("full_name", data.full_name)
  formData.append("email", data.email)
  formData.append("position", data.position)
  formData.append("resume", data.resume)

  if (data.phone) {
    formData.append("phone", data.phone)
  }

  if (data.experience) {
    formData.append("experience", data.experience)
  }

  if (data.current_company) {
    formData.append("current_company", data.current_company)
  }

  if (data.location) {
    formData.append("location", data.location)
  }

  if (data.linkedin_url) {
    formData.append("linkedin_url", data.linkedin_url)
  }

  if (data.cover_letter) {
    formData.append("cover_letter", data.cover_letter)
  }

  const response = await api.post<CareerApplicationResponse>(
    "/careers/applications",
    formData
  )

  return response.data
}

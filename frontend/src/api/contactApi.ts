import api from "./axios"

export interface ContactRequest {
  fullName: string
  email: string
  company?: string
  phone?: string
  service?: string
  message: string
}

export async function sendContactMessage(data: ContactRequest) {
  return api.post("/contact", {
    full_name: data.fullName,
    email: data.email,
    company: data.company,
    phone: data.phone,
    service: data.service,
    message: data.message,
  })
}

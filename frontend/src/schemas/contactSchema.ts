import { z } from "zod"

export const contactSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters"),

  email: z.string().email("Please enter a valid email address"),

  company: z.string().optional(),

  phone: z.string().min(10, "Phone number must be at least 10 digits"),

  service: z.string().min(1, "Please select a service"),

  message: z.string().min(20, "Message should contain at least 20 characters"),
})

export type ContactSchema = z.infer<typeof contactSchema>

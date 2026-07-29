import { useEffect, useState, type ReactNode } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Building2,
  CheckCircle2,
  Loader2,
  Mail,
  MessageSquareText,
  Phone,
  Send,
  UserRound,
} from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { sendContactMessage } from "@/api/contactApi"
import type { ContactPageSettings } from "@/api/contactPageApi"
import { getServices, type Service } from "@/api/servicesApi"
import { contactSchema, type ContactSchema } from "@/schemas/contactSchema"

type ContactFormProps = {
  settings: ContactPageSettings
}

export default function ContactForm({ settings }: ContactFormProps) {
  const [services, setServices] = useState<Service[]>([])
  const [servicesLoading, setServicesLoading] = useState(true)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<ContactSchema>({
    resolver: zodResolver(contactSchema),
  })

  useEffect(() => {
    async function loadServices() {
      try {
        setServicesLoading(true)

        const response = await getServices()

        setServices(response)
      } catch (error) {
        console.error("Unable to load contact services:", error)
      } finally {
        setServicesLoading(false)
      }
    }

    void loadServices()
  }, [])

  async function onSubmit(data: ContactSchema) {
    try {
      await sendContactMessage(data)

      toast.success(settings.success_message)
      reset()
    } catch (error) {
      console.error(error)
      toast.error(settings.error_message)
    }
  }

  return (
    <div className="overflow-hidden rounded-[2rem] bg-white">
      <div className="grid lg:grid-cols-[0.85fr_1.15fr]">
        <aside className="relative overflow-hidden bg-slate-950 p-8 text-white sm:p-10 lg:p-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-32 -left-32 size-72 rounded-full bg-blue-500/20 blur-[110px]"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-32 -bottom-36 size-80 rounded-full bg-violet-500/20 blur-[120px]"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />

          <div className="relative">
            <div className="flex size-14 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-blue-300">
              <MessageSquareText className="size-6" />
            </div>

            <h2 className="mt-7 text-3xl font-bold tracking-[-0.03em]">
              {settings.form_title}
            </h2>

            <p className="mt-4 leading-7 text-slate-300">
              {settings.form_description}
            </p>

            <div className="mt-10 space-y-5">
              {[
                "Discuss your technology goals",
                "Get practical expert guidance",
                "Plan the right next steps",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-300">
                    <CheckCircle2 className="size-4" />
                  </span>

                  <span className="text-sm leading-6 text-slate-200">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-12 border-t border-white/10 pt-8">
              <p className="text-xs font-semibold tracking-[0.14em] text-slate-400 uppercase">
                What happens next
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-300">
                Our team will review your message and respond with the most
                relevant guidance for your needs.
              </p>
            </div>
          </div>
        </aside>

        <div className="p-7 sm:p-10 lg:p-12">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-7"
            noValidate
          >
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                id="contact-full-name"
                label={settings.full_name_label}
                error={errors.fullName?.message}
                required
              >
                <div className="relative">
                  <UserRound className={iconClassName} />

                  <input
                    id="contact-full-name"
                    type="text"
                    autoComplete="name"
                    aria-invalid={errors.fullName ? "true" : "false"}
                    aria-describedby={
                      errors.fullName ? "contact-full-name-error" : undefined
                    }
                    placeholder="Your full name"
                    {...register("fullName")}
                    className={getInputClassName(Boolean(errors.fullName))}
                  />
                </div>
              </FormField>

              <FormField
                id="contact-email"
                label={settings.email_label}
                error={errors.email?.message}
                required
              >
                <div className="relative">
                  <Mail className={iconClassName} />

                  <input
                    id="contact-email"
                    type="email"
                    autoComplete="email"
                    aria-invalid={errors.email ? "true" : "false"}
                    aria-describedby={
                      errors.email ? "contact-email-error" : undefined
                    }
                    placeholder="you@example.com"
                    {...register("email")}
                    className={getInputClassName(Boolean(errors.email))}
                  />
                </div>
              </FormField>

              <FormField id="contact-company" label={settings.company_label}>
                <div className="relative">
                  <Building2 className={iconClassName} />

                  <input
                    id="contact-company"
                    type="text"
                    autoComplete="organization"
                    placeholder="Company or organization"
                    {...register("company")}
                    className={getInputClassName(false)}
                  />
                </div>
              </FormField>

              <FormField
                id="contact-phone"
                label={settings.phone_label}
                error={errors.phone?.message}
              >
                <div className="relative">
                  <Phone className={iconClassName} />

                  <input
                    id="contact-phone"
                    type="tel"
                    autoComplete="tel"
                    aria-invalid={errors.phone ? "true" : "false"}
                    aria-describedby={
                      errors.phone ? "contact-phone-error" : undefined
                    }
                    placeholder="+91 99999 99999"
                    {...register("phone")}
                    className={getInputClassName(Boolean(errors.phone))}
                  />
                </div>
              </FormField>
            </div>

            <FormField
              id="contact-service"
              label={settings.service_label}
              error={errors.service?.message}
              required
            >
              <select
                id="contact-service"
                aria-invalid={errors.service ? "true" : "false"}
                aria-describedby={
                  errors.service ? "contact-service-error" : undefined
                }
                disabled={servicesLoading}
                {...register("service")}
                className={`${getInputClassName(
                  Boolean(errors.service),
                  false
                )} disabled:cursor-wait disabled:bg-slate-100 disabled:text-slate-500`}
              >
                <option value="">
                  {servicesLoading
                    ? "Loading services..."
                    : settings.service_placeholder}
                </option>

                {services.map((service) => (
                  <option key={service.id} value={service.title}>
                    {service.title}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField
              id="contact-message"
              label={settings.message_label}
              error={errors.message?.message}
              required
            >
              <textarea
                id="contact-message"
                rows={7}
                aria-invalid={errors.message ? "true" : "false"}
                aria-describedby={
                  errors.message ? "contact-message-error" : undefined
                }
                placeholder="Tell us about your goals, challenges, or upcoming project."
                {...register("message")}
                className={`${getInputClassName(
                  Boolean(errors.message),
                  false
                )} min-h-44 resize-y py-4`}
              />
            </FormField>

            <div className="flex flex-col gap-4 border-t border-slate-200 pt-7 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-md text-sm leading-6 text-slate-500">
                By submitting this form, you agree that our team may contact you
                regarding your enquiry.
              </p>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex h-12 shrink-0 items-center justify-center rounded-xl bg-slate-950 px-7 font-semibold text-white shadow-lg shadow-slate-950/10 transition hover:bg-blue-600 focus-visible:ring-4 focus-visible:ring-blue-200 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  <Send className="mr-2 size-4" />
                )}

                {isSubmitting
                  ? settings.submitting_button_text
                  : settings.submit_button_text}
              </button>
            </div>

            {isSubmitSuccessful && !isSubmitting && (
              <div
                role="status"
                className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
              >
                <CheckCircle2 className="mt-0.5 size-5 shrink-0" />

                <span>{settings.success_message}</span>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

type FormFieldProps = {
  id: string
  label: string
  error?: string
  required?: boolean
  children: ReactNode
}

function FormField({
  id,
  label,
  error,
  required = false,
  children,
}: FormFieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2.5 block text-sm font-semibold text-slate-800"
      >
        {label}

        {required && (
          <span aria-hidden="true" className="ml-1 text-red-600">
            *
          </span>
        )}
      </label>

      {children}

      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-2 text-sm font-medium text-red-600"
        >
          {error}
        </p>
      )}
    </div>
  )
}

function getInputClassName(hasError: boolean, withIcon = true) {
  return [
    "w-full rounded-xl border bg-white py-3.5 pr-4 text-slate-900 outline-none transition placeholder:text-slate-400",
    withIcon ? "pl-11" : "px-4",
    hasError
      ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100"
      : "border-slate-300 hover:border-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100",
  ].join(" ")
}

const iconClassName =
  "pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-slate-400"

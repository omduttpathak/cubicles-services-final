import { Building2, Mail, Phone, X } from "lucide-react"

import type { AdminContact } from "@/api/adminApi"

type ContactDetailsModalProps = {
  contact: AdminContact
  onClose: () => void
}

export default function ContactDetailsModal({
  contact,
  onClose,
}: ContactDetailsModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-details-title"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-slate-200 p-6">
          <div>
            <p className="font-semibold tracking-wider text-blue-600 uppercase">
              Contact Request
            </p>

            <h2
              id="contact-details-title"
              className="mt-2 text-2xl font-bold text-slate-900"
            >
              {contact.full_name}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Submitted {new Date(contact.created_at).toLocaleString()}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close contact details"
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-8 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-slate-50 p-4">
              <div className="flex items-center gap-3 text-slate-500">
                <Mail className="h-5 w-5" />
                <span className="text-sm font-medium">Email</span>
              </div>

              <a
                href={`mailto:${contact.email}`}
                className="mt-3 block font-semibold break-all text-blue-600 hover:underline"
              >
                {contact.email}
              </a>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <div className="flex items-center gap-3 text-slate-500">
                <Phone className="h-5 w-5" />
                <span className="text-sm font-medium">Phone</span>
              </div>

              <p className="mt-3 font-semibold text-slate-900">
                {contact.phone || "Not provided"}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <div className="flex items-center gap-3 text-slate-500">
                <Building2 className="h-5 w-5" />
                <span className="text-sm font-medium">Company</span>
              </div>

              <p className="mt-3 font-semibold text-slate-900">
                {contact.company || "Not provided"}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-500">
                Requested Service
              </p>

              <p className="mt-3 font-semibold text-slate-900">
                {contact.service || "Not specified"}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900">Message</h3>

            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-5 leading-7 whitespace-pre-wrap text-slate-700">
              {contact.message}
            </div>
          </div>
        </div>

        <div className="flex justify-end border-t border-slate-200 p-6">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

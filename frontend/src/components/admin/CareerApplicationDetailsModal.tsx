import { X, ExternalLink } from "lucide-react"
import { getApiAssetUrl } from "@/utils/apiAssetUrl"
import type { AdminCareerApplication } from "@/api/adminCareerApplicationsApi"

type Props = {
  application: AdminCareerApplication | null
  isOpen: boolean
  onClose: () => void
}

export default function CareerApplicationDetailsModal({
  application,
  isOpen,
  onClose,
}: Props) {
  if (!isOpen || !application) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-5">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b p-6">
          <h2 className="text-2xl font-bold">Candidate Details</h2>

          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <div className="space-y-8 p-6">
          <section>
            <h3 className="mb-3 text-lg font-semibold">Personal Information</h3>

            <div className="grid grid-cols-2 gap-4">
              <Info label="Name" value={application.full_name} />

              <Info label="Email" value={application.email} />

              <Info label="Phone" value={application.phone} />

              <Info label="Location" value={application.location} />
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-lg font-semibold">Professional</h3>

            <div className="grid grid-cols-2 gap-4">
              <Info label="Position" value={application.position} />

              <Info label="Experience" value={application.experience} />

              <Info label="Company" value={application.current_company} />

              <Info label="Status" value={application.status} />
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-lg font-semibold">Links</h3>

            <div className="space-y-3">
              {application.linkedin_url && (
                <a
                  href={application.linkedin_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-blue-600"
                >
                  LinkedIn
                  <ExternalLink size={16} />
                </a>
              )}

              {application.resume_url && (
                <a
                  href={getApiAssetUrl(application.resume_url) ?? undefined}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 font-semibold text-blue-600 hover:underline"
                >
                  Open Résumé
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-lg font-semibold">Cover Letter</h3>

            <div className="rounded-lg bg-slate-100 p-4 whitespace-pre-wrap">
              {application.cover_letter || "No cover letter provided."}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

function Info({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <p className="text-sm text-slate-500">{label}</p>

      <p className="font-medium">{value || "-"}</p>
    </div>
  )
}

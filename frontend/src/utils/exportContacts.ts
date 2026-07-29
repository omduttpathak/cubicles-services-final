import type { AdminContact } from "@/api/adminApi"

function escapeCsvValue(value: unknown): string {
  return `"${String(value ?? "").replace(/"/g, '""')}"`
}

export function exportContactsToCSV(contacts: AdminContact[]): void {
  if (contacts.length === 0) {
    return
  }

  const headers = [
    "ID",
    "Name",
    "Email",
    "Company",
    "Phone",
    "Service",
    "Message",
    "Created At",
  ]

  const rows = contacts.map((contact) => [
    contact.id,
    contact.full_name,
    contact.email,
    contact.company ?? "",
    contact.phone ?? "",
    contact.service ?? "",
    contact.message,
    new Date(contact.created_at).toLocaleString(),
  ])

  const csvContent = [headers, ...rows]
    .map((row) => row.map(escapeCsvValue).join(","))
    .join("\n")

  const blob = new Blob(["\uFEFF", csvContent], {
    type: "text/csv;charset=utf-8;",
  })

  const downloadUrl = URL.createObjectURL(blob)
  const link = document.createElement("a")

  link.href = downloadUrl
  link.download = `contact-requests-${new Date()
    .toISOString()
    .slice(0, 10)}.csv`

  document.body.appendChild(link)
  link.click()
  link.remove()

  URL.revokeObjectURL(downloadUrl)
}

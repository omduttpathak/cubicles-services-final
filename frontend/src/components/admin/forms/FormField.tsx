import type { ReactNode } from "react"

type FormFieldProps = {
  id: string
  label: string
  required?: boolean
  description?: string
  children: ReactNode
}

export default function FormField({
  id,
  label,
  required = false,
  description,
  children,
}: FormFieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-bold text-slate-700"
      >
        {label}
        {required ? <span className="text-red-600"> *</span> : null}
      </label>

      {children}

      {description ? (
        <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
      ) : null}
    </div>
  )
}

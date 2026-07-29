import { AlertTriangle } from "lucide-react"

type ErrorStateProps = {
  title?: string
  message?: string
  onRetry?: () => void
}

export default function ErrorState({
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <AlertTriangle className="mb-6 text-red-500" size={64} />

      <h2 className="text-3xl font-bold text-slate-900">{title}</h2>

      <p className="mt-4 max-w-xl text-slate-600">{message}</p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-8 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Try Again
        </button>
      )}
    </div>
  )
}

import LoadingSpinner from "./LoadingSpinner"

type PageLoaderProps = {
  message?: string
}

export default function PageLoader({
  message = "Loading...",
}: PageLoaderProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-5">
      <LoadingSpinner size={48} />

      <p className="text-slate-600">{message}</p>
    </div>
  )
}

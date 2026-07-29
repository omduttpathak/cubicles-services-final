import { Loader2 } from "lucide-react"

type LoadingSpinnerProps = {
  size?: number
}

export default function LoadingSpinner({ size = 32 }: LoadingSpinnerProps) {
  return <Loader2 className="animate-spin text-blue-600" size={size} />
}

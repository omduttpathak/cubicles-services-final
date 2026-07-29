const apiBaseUrl = (
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api"
).replace(/\/+$/, "")

const backendBaseUrl = apiBaseUrl.replace(/\/api$/, "")

export function getApiAssetUrl(path: string | null): string | null {
  if (!path) {
    return null
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`

  return `${backendBaseUrl}${normalizedPath}`
}

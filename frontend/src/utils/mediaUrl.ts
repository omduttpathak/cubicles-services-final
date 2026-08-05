const configuredApiUrl = import.meta.env.VITE_API_URL?.trim() ?? ""

function getApiOrigin(): string {
  if (!configuredApiUrl) {
    return window.location.origin
  }

  try {
    return new URL(configuredApiUrl, window.location.origin).origin
  } catch {
    return window.location.origin
  }
}

export function resolveMediaUrl(
  value: string | null | undefined
): string | null {
  if (!value) {
    return null
  }

  const normalized = value.trim()

  if (!normalized) {
    return null
  }

  if (
    normalized.startsWith("http://") ||
    normalized.startsWith("https://") ||
    normalized.startsWith("data:") ||
    normalized.startsWith("blob:")
  ) {
    return normalized
  }

  const origin = getApiOrigin()

  return normalized.startsWith("/")
    ? `${origin}${normalized}`
    : `${origin}/${normalized}`
}

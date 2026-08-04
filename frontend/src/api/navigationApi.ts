import api from "./axios"

export type NavigationItem = {
  id: number
  title: string
  url: string
  open_in_new_tab: boolean
  display_order: number
}

type UnknownRecord = Record<string, unknown>

function isRecord(value: unknown): value is UnknownRecord {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  )
}

function findNavigationArray(payload: unknown): unknown[] {
  if (Array.isArray(payload)) {
    return payload
  }

  if (!isRecord(payload)) {
    return []
  }

  const possibleKeys = [
    "items",
    "data",
    "navigation",
    "navigation_items",
    "results",
  ]

  for (const key of possibleKeys) {
    const value = payload[key]

    if (Array.isArray(value)) {
      return value
    }

    /*
     * This also supports nested responses such as:
     *
     * {
     *   data: {
     *     items: [...]
     *   }
     * }
     */
    if (isRecord(value)) {
      const nestedItems = findNavigationArray(value)

      if (nestedItems.length > 0) {
        return nestedItems
      }
    }
  }

  return []
}

function normalizeNavigationItem(
  value: unknown,
  index: number
): NavigationItem | null {
  if (!isRecord(value)) {
    return null
  }

  const rawTitle =
    value.title ??
    value.label ??
    value.name ??
    value.menu_title

  const rawUrl =
    value.url ??
    value.path ??
    value.href ??
    value.link

  if (
    typeof rawTitle !== "string" ||
    rawTitle.trim().length === 0 ||
    typeof rawUrl !== "string" ||
    rawUrl.trim().length === 0
  ) {
    return null
  }

  const rawId = value.id

  const id =
    typeof rawId === "number"
      ? rawId
      : typeof rawId === "string" && !Number.isNaN(Number(rawId))
        ? Number(rawId)
        : index + 1

  const rawDisplayOrder =
    value.display_order ??
    value.order ??
    value.sort_order ??
    value.position

  const displayOrder =
    typeof rawDisplayOrder === "number"
      ? rawDisplayOrder
      : typeof rawDisplayOrder === "string" &&
          !Number.isNaN(Number(rawDisplayOrder))
        ? Number(rawDisplayOrder)
        : index + 1

  const rawOpenInNewTab =
    value.open_in_new_tab ??
    value.new_tab ??
    value.target_blank

  const openInNewTab =
    rawOpenInNewTab === true ||
    rawOpenInNewTab === 1 ||
    rawOpenInNewTab === "1" ||
    rawOpenInNewTab === "true"

  return {
    id,
    title: rawTitle.trim(),
    url: rawUrl.trim(),
    open_in_new_tab: openInNewTab,
    display_order: displayOrder,
  }
}

function normalizeNavigationResponse(
  payload: unknown
): NavigationItem[] {
  const rawItems = findNavigationArray(payload)

  return rawItems
    .map((item, index) => normalizeNavigationItem(item, index))
    .filter(
      (item): item is NavigationItem => item !== null
    )
}

export async function getNavigation(): Promise<NavigationItem[]> {
  const response = await api.get<unknown>("/navigation")

  const navigationItems = normalizeNavigationResponse(
    response.data
  )

  if (navigationItems.length === 0) {
    console.warn(
      "Navigation API did not return a recognized navigation array:",
      response.data
    )
  }

  return navigationItems
}

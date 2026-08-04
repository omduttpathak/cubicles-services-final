import api from "./axios"

export type ServiceApiResponse = {
  id: number
  title: string
  slug: string
  icon: string
  short_description: string
  description: string
  highlights: string[]
  hero_title: string
  hero_description: string
  seo_title: string
  seo_description: string
}

export type Service = {
  id: number
  title: string
  slug: string
  icon: string
  shortDescription: string
  description: string
  highlights: string[]
  heroTitle: string
  heroDescription: string
  seoTitle: string
  seoDescription: string
}

type ServicesApiEnvelope = {
  items?: ServiceApiResponse[]
  data?: ServiceApiResponse[]
  services?: ServiceApiResponse[]
  results?: ServiceApiResponse[]
}

function mapService(service: ServiceApiResponse): Service {
  return {
    id: service.id,
    title: service.title,
    slug: service.slug,
    icon: service.icon,
    shortDescription: service.short_description,
    description: service.description,
    highlights: Array.isArray(service.highlights)
      ? service.highlights
      : [],
    heroTitle: service.hero_title,
    heroDescription: service.hero_description,
    seoTitle: service.seo_title,
    seoDescription: service.seo_description,
  }
}

function extractServices(payload: unknown): ServiceApiResponse[] {
  if (Array.isArray(payload)) {
    return payload as ServiceApiResponse[]
  }

  if (!payload || typeof payload !== "object") {
    return []
  }

  const response = payload as ServicesApiEnvelope

  if (Array.isArray(response.items)) {
    return response.items
  }

  if (Array.isArray(response.data)) {
    return response.data
  }

  if (Array.isArray(response.services)) {
    return response.services
  }

  if (Array.isArray(response.results)) {
    return response.results
  }

  return []
}

export async function getServices(): Promise<Service[]> {
  const response = await api.get<
    ServiceApiResponse[] | ServicesApiEnvelope
  >("/services")

  const services = extractServices(response.data)

  return services.map(mapService)
}

export async function getServiceBySlug(
  slug: string
): Promise<Service> {
  const response = await api.get<ServiceApiResponse>(
    `/services/${slug}`
  )

  return mapService(response.data)
}

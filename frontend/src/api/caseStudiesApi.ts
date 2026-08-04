import api from "./axios"

export type CaseStudyApiResponse = {
  id: number
  title: string
  slug: string
  industry: string
  service: string
  summary: string
  results: string[]
  technologies: string[]
  image_url: string | null
  published_at: string
}

export type CaseStudyDetailsApiResponse =
  CaseStudyApiResponse & {
    challenge: string
    solution: string
    seo_title: string
    seo_description: string
  }

export type CaseStudy = {
  id: number
  title: string
  slug: string
  industry: string
  service: string
  summary: string
  results: string[]
  technologies: string[]
  imageUrl: string | null
  publishedAt: string
}

export type CaseStudyDetails = CaseStudy & {
  challenge: string
  solution: string
  seoTitle: string
  seoDescription: string
}

type CaseStudiesApiEnvelope = {
  items?: CaseStudyApiResponse[]
  data?: CaseStudyApiResponse[]
  case_studies?: CaseStudyApiResponse[]
  caseStudies?: CaseStudyApiResponse[]
  results?: CaseStudyApiResponse[]
}

function mapCaseStudy(
  caseStudy: CaseStudyApiResponse
): CaseStudy {
  return {
    id: caseStudy.id,
    title: caseStudy.title,
    slug: caseStudy.slug,
    industry: caseStudy.industry,
    service: caseStudy.service,
    summary: caseStudy.summary,
    results: Array.isArray(caseStudy.results)
      ? caseStudy.results
      : [],
    technologies: Array.isArray(caseStudy.technologies)
      ? caseStudy.technologies
      : [],
    imageUrl: caseStudy.image_url,
    publishedAt: caseStudy.published_at,
  }
}

function mapCaseStudyDetails(
  caseStudy: CaseStudyDetailsApiResponse
): CaseStudyDetails {
  return {
    ...mapCaseStudy(caseStudy),
    challenge: caseStudy.challenge,
    solution: caseStudy.solution,
    seoTitle: caseStudy.seo_title,
    seoDescription: caseStudy.seo_description,
  }
}

function extractCaseStudies(
  payload: unknown
): CaseStudyApiResponse[] {
  if (Array.isArray(payload)) {
    return payload as CaseStudyApiResponse[]
  }

  if (!payload || typeof payload !== "object") {
    return []
  }

  const response = payload as CaseStudiesApiEnvelope

  if (Array.isArray(response.items)) {
    return response.items
  }

  if (Array.isArray(response.data)) {
    return response.data
  }

  if (Array.isArray(response.case_studies)) {
    return response.case_studies
  }

  if (Array.isArray(response.caseStudies)) {
    return response.caseStudies
  }

  if (Array.isArray(response.results)) {
    return response.results
  }

  return []
}

export async function getCaseStudies(): Promise<CaseStudy[]> {
  const response = await api.get<
    CaseStudyApiResponse[] | CaseStudiesApiEnvelope
  >("/case-studies")

  const caseStudies = extractCaseStudies(response.data)

  return caseStudies.map(mapCaseStudy)
}

export async function getCaseStudyBySlug(
  slug: string
): Promise<CaseStudyDetails> {
  const response =
    await api.get<CaseStudyDetailsApiResponse>(
      `/case-studies/${slug}`
    )

  return mapCaseStudyDetails(response.data)
}

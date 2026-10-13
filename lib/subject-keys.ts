/** Maps static taxonomy IDs (home/subjects UI) to Supabase subject slugs from seed data. */
const TAXONOMY_ID_TO_DB_SLUG: Record<string, string> = {
  'puc1-phy': 'puc1-physics',
  'puc1-che': 'puc1-chemistry',
  'puc1-mat': 'puc1-mathematics',
  'puc1-bio': 'puc1-biology',
  'puc1-acc': 'puc1-accountancy',
  'puc1-bst': 'puc1-business-studies',
  'puc1-eco': 'puc1-economics',
  'puc2-phy': 'puc2-physics',
  'puc2-che': 'puc2-chemistry',
  'puc2-mat': 'puc2-mathematics',
  'puc2-bio': 'puc2-biology',
  'puc2-cs': 'puc2-computer-science',
  'puc2-acc': 'puc2-accountancy',
  'puc2-bst': 'puc2-business-studies',
  'puc2-eco': 'puc2-economics',
  'puc2-sta': 'puc2-statistics',
  'puc2-eng': 'puc2-english',
  'puc2-knd': 'puc2-kannada',
  'puc1-eng': 'puc1-english',
  'puc1-knd': 'puc1-kannada',
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export function isUuid(value: string): boolean {
  return UUID_RE.test(value)
}

/** Normalize a route segment to the DB slug when possible. */
export function resolveSubjectSlug(routeKey: string): string {
  return TAXONOMY_ID_TO_DB_SLUG[routeKey] ?? routeKey
}

/** Preferred URL segment for a taxonomy subject id (SEO-friendly slug when seeded). */
export function subjectHrefKey(taxonomyOrSlugId: string): string {
  return resolveSubjectSlug(taxonomyOrSlugId)
}

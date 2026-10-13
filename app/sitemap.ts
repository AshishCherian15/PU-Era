import type { MetadataRoute } from 'next'
import { createAdminClient } from '@/lib/supabase/admin'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://puera.in'
  const now = new Date().toISOString()

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${base}/subjects`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/lab-guides`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/textbooks`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/legal/terms`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${base}/legal/privacy`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${base}/legal/copyright`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${base}/legal/grievance`, lastModified: now, changeFrequency: 'monthly', priority: 0.2 },
  ]

  const supabase = createAdminClient()

  // Dynamic subjects
  const { data: subjects } = await supabase
    .from('subjects')
    .select('slug, created_at')
    .eq('active', true)

  const subjectRoutes: MetadataRoute.Sitemap = (subjects ?? []).map(s => ({
    url: `${base}/subjects/${s.slug}`,
    lastModified: s.created_at,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Dynamic chapters
  const { data: chapters } = await supabase
    .from('chapters')
    .select('slug, subject_id, created_at, subjects!inner(slug)')
    .eq('status', 'active')

  const chapterRoutes: MetadataRoute.Sitemap = (chapters ?? []).map(c => {
    const sub = (c as unknown as { subjects: { slug: string } }).subjects
    return {
      url: `${base}/subjects/${sub.slug}/${c.slug}`,
      lastModified: c.created_at,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }
  })

  // Dynamic resources (published)
  const { data: resources } = await supabase
    .from('resources')
    .select('slug, published_at')
    .eq('status', 'published')
    .is('deleted_at', null)
    .eq('allow_view', true)

  const resourceRoutes: MetadataRoute.Sitemap = (resources ?? []).map(r => ({
    url: `${base}/resources/${r.slug}`,
    lastModified: r.published_at ?? now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  // Lab guides
  const { data: experiments } = await supabase
    .from('lab_experiments')
    .select('slug, created_at')
    .eq('status', 'published')

  const labRoutes: MetadataRoute.Sitemap = (experiments ?? []).map(e => ({
    url: `${base}/lab-guides/${e.slug}`,
    lastModified: e.created_at,
    changeFrequency: 'monthly' as const,
    priority: 0.65,
  }))

  return [
    ...staticRoutes,
    ...subjectRoutes,
    ...chapterRoutes,
    ...resourceRoutes,
    ...labRoutes,
  ]
}

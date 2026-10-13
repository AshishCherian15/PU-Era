import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { BookOpen, FileText, Search, Filter } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Study Resources | PU Era',
  description:
    'Free notes, question papers, model papers, and study guides for Karnataka PUC 1st & 2nd Year Science, Commerce, and Arts streams.',
  openGraph: {
    title: 'Study Resources | PU Era',
    description: 'Free PUC study resources — notes, question papers, and more.',
  },
}

const TYPE_LABELS: Record<string, string> = {
  notes: 'Notes',
  question_paper: 'Question Paper',
  model_paper: 'Model Paper',
  lab_guide: 'Lab Guide',
  textbook: 'Textbook',
  solved_paper: 'Solved Paper',
  reference: 'Reference',
}

const TYPE_COLORS: Record<string, string> = {
  notes: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  question_paper: 'bg-blue-50 text-blue-700 border-blue-200',
  model_paper: 'bg-violet-50 text-violet-700 border-violet-200',
  lab_guide: 'bg-amber-50 text-amber-700 border-amber-200',
  textbook: 'bg-rose-50 text-rose-700 border-rose-200',
  solved_paper: 'bg-teal-50 text-teal-700 border-teal-200',
  reference: 'bg-slate-100 text-slate-700 border-slate-200',
}

export default async function ResourcesPage() {
  const supabase = await createClient()

  const { data: resources } = await supabase
    .from('resources')
    .select(`
      id, slug, title, description, type, medium, views, downloads,
      subjects!inner(name, class_level, stream)
    `)
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(60)

  type ResourceRow = {
    id: string
    slug: string
    title: string
    description: string | null
    type: string
    medium: string
    views: number
    downloads: number
    subjects: { name: string; class_level: string; stream: string } | { name: string; class_level: string; stream: string }[]
  }

  const items = (resources ?? []) as ResourceRow[]

  function subjectMeta(row: ResourceRow) {
    const s = row.subjects
    return Array.isArray(s) ? s[0] : s
  }

  return (
    <div>
      {/* Hero */}
      <div className="page-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: '#D1FAE5' }}
            >
              <FileText className="w-4 h-4" style={{ color: 'var(--brand-green)' }} />
            </div>
            <p className="section-eyebrow" style={{ color: 'var(--brand-green)' }}>
              Study Library
            </p>
          </div>
          <h1
            className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight mb-2"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Study Resources
          </h1>
          <p className="text-slate-500 text-sm sm:text-base max-w-xl">
            Free notes, question papers, model papers, and more for Karnataka PUC students.
            Browse by subject or filter by type.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {items.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-14 h-14 text-slate-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-700 mb-2">No resources yet</h2>
            <p className="text-slate-500 text-sm">
              Resources will appear here once they&apos;re added by the admin team.
            </p>
            <Link
              href="/subjects"
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-xl hover:bg-emerald-700 transition-colors"
            >
              Browse Subjects
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map(resource => {
              const sub = subjectMeta(resource)
              return (
              <Link
                key={resource.id}
                href={`/resources/${resource.slug}`}
                className="group bg-white rounded-2xl border border-slate-200 p-5 hover:border-emerald-300 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${TYPE_COLORS[resource.type] ?? TYPE_COLORS.reference}`}
                  >
                    {TYPE_LABELS[resource.type] ?? resource.type}
                  </span>
                  <span className="text-xs text-slate-400 capitalize">
                    {resource.medium}
                  </span>
                </div>

                <h2 className="text-sm font-semibold text-slate-800 group-hover:text-emerald-700 transition-colors line-clamp-2 mb-1">
                  {resource.title}
                </h2>

                {resource.description && (
                  <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                    {resource.description}
                  </p>
                )}

                <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100">
                  <div className="text-xs text-slate-500">
                    <span className="font-medium text-slate-700">{sub?.name ?? 'Subject'}</span>
                    {' · '}
                    <span className="uppercase">{sub?.class_level ?? ''}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span>{resource.views} views</span>
                  </div>
                </div>
              </Link>
            )})}
          </div>
        )}

        {/* Browse by subject CTA */}
        <div className="mt-12 text-center">
          <p className="text-sm text-slate-500 mb-3">Looking for a specific subject?</p>
          <Link
            href="/subjects"
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-800 transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            Browse All Subjects
          </Link>
        </div>
      </div>
    </div>
  )
}

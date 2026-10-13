import { Suspense } from 'react'
import { getSubjectsByClass } from '@/lib/content/taxonomy'
import SubjectsList from './SubjectsList'
import { BookOpen } from 'lucide-react'

export const metadata = {
  title: 'Browse Subjects | PU Era',
  description:
    'Explore study materials for Karnataka PUC 1st & 2nd Year and NCERT Class 11 & 12 across Science, Commerce, and Arts streams.',
}

export default function SubjectsPage() {
  const puc1   = getSubjectsByClass('PUC1')
  const puc2   = getSubjectsByClass('PUC2')
  const ncert11 = getSubjectsByClass('NCERT11')
  const ncert12 = getSubjectsByClass('NCERT12')

  return (
    <div>
      {/* ── Page Hero ── */}
      <div className="page-hero">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: '#D1FAE5' }}
            >
              <BookOpen className="w-4 h-4" style={{ color: 'var(--brand-green)' }} />
            </div>
            <p className="section-eyebrow" style={{ color: 'var(--brand-green)' }}>
              Study Library
            </p>
          </div>
          <h1
            className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight mb-2"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Browse All Subjects
          </h1>
          <p className="text-slate-500 text-sm sm:text-base max-w-xl">
            Search and filter subjects across Karnataka PUC and NCERT curricula. Use the filters below to narrow down by class and stream.
          </p>

          {/* Jump nav */}
          <div className="flex flex-wrap items-center gap-2 mt-4 text-xs font-semibold">
            <span className="text-slate-400 uppercase tracking-wider">Jump to:</span>
            {[
              { href: '#puc2',    label: '2nd PUC' },
              { href: '#puc1',    label: '1st PUC' },
              { href: '#ncert12', label: 'NCERT 12' },
              { href: '#ncert11', label: 'NCERT 11' },
            ].map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="px-3 py-1 rounded-full border border-slate-200 bg-white text-slate-600 hover:border-brand-green hover:text-brand-green transition-colors"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── Subject Grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<SubjectsSkeleton />}>
          <SubjectsList
            puc1Subjects={puc1}
            puc2Subjects={puc2}
            ncert11Subjects={ncert11}
            ncert12Subjects={ncert12}
          />
        </Suspense>
      </div>
    </div>
  )
}

function SubjectsSkeleton() {
  return (
    <div className="space-y-8">
      <div className="skeleton h-11 w-full max-w-xl rounded-full" />
      <div className="flex gap-2">
        {[1,2,3,4,5].map(i => <div key={i} className="skeleton h-8 w-20 rounded-lg" />)}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="rounded-3xl border border-slate-200 p-6 space-y-4 bg-white">
            <div className="flex justify-between">
              <div className="skeleton h-11 w-11 rounded-xl" />
              <div className="skeleton h-6 w-20 rounded-full" />
            </div>
            <div className="skeleton h-5 w-3/4 rounded" />
            <div className="skeleton h-4 w-1/2 rounded" />
            <div className="skeleton h-4 w-full rounded mt-2" />
          </div>
        ))}
      </div>
    </div>
  )
}

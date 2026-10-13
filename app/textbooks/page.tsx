export const instant = false

import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { BookOpen, ExternalLink, CheckCircle2, ShieldCheck } from 'lucide-react'
import type { Textbook, ClassLevel } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Official Textbooks Directory — Karnataka PUC & NCERT | PU Era',
  description: 'Direct links to official Karnataka PUC (KTBS) and NCERT textbooks for free download.',
}

const CLASS_LABELS: Record<ClassLevel, string> = {
  puc1: '1st PUC (KTBS)',
  puc2: '2nd PUC (KTBS)',
  ncert11: 'NCERT Class 11',
  ncert12: 'NCERT Class 12',
}

const CLASS_ORDER: ClassLevel[] = ['puc2', 'puc1', 'ncert12', 'ncert11']

const STATIC_BOOKS = [
  {
    label: '2nd PUC (KTBS)',
    books: [
      { name: 'Physics Part I & II', url: 'https://ktbs.kar.nic.in' },
      { name: 'Chemistry Part I & II', url: 'https://ktbs.kar.nic.in' },
      { name: 'Mathematics', url: 'https://ktbs.kar.nic.in' },
      { name: 'Biology', url: 'https://ktbs.kar.nic.in' },
      { name: 'Accountancy', url: 'https://ktbs.kar.nic.in' },
      { name: 'Business Studies', url: 'https://ktbs.kar.nic.in' },
      { name: 'Economics', url: 'https://ktbs.kar.nic.in' },
    ],
  },
  {
    label: 'NCERT Class 12',
    books: [
      { name: 'Physics Part I & II', url: 'https://ncert.nic.in/textbook.php' },
      { name: 'Chemistry Part I & II', url: 'https://ncert.nic.in/textbook.php' },
      { name: 'Mathematics', url: 'https://ncert.nic.in/textbook.php' },
      { name: 'Accountancy Part I & II', url: 'https://ncert.nic.in/textbook.php' },
      { name: 'Business Studies', url: 'https://ncert.nic.in/textbook.php' },
    ],
  },
] as const

export default async function TextbooksPage() {
  const supabase = await createClient()

  const { data: textbooks } = await supabase
    .from('textbooks')
    .select('*')
    .eq('is_active', true)
    .order('subject_name')

  const grouped = (textbooks ?? []).reduce(
    (acc: Record<ClassLevel, Textbook[]>, tb) => {
      const cls = tb.class_level as ClassLevel
      if (!acc[cls]) acc[cls] = []
      acc[cls]!.push(tb as unknown as Textbook)
      return acc
    },
    {} as Record<ClassLevel, Textbook[]>
  )

  const hasTextbooks = (textbooks ?? []).length > 0

  return (
    <div>
      {/* ── Page Hero ── */}
      <div className="page-hero">
        <div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: '#E0F2FE' }}>
              <BookOpen className="w-6 h-6" style={{ color: '#0C4A6E' }} />
            </div>
            <div>
              <p className="section-eyebrow mb-1" style={{ color: 'var(--brand-green)' }}>Official Sources</p>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
                Official Textbooks Directory
              </h1>
              <p className="text-slate-500 text-sm sm:text-base mt-2 max-w-xl">
                Direct links to KTBS &amp; NCERT official sources — never pirated, always verified.
              </p>
            </div>
          </div>

          {/* Trust badge */}
          <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl border" style={{ background: '#F0FDF4', borderColor: '#A7F3D0', color: '#065F46' }}>
            <ShieldCheck className="w-4 h-4 flex-shrink-0" />
            We only link to official government/publisher sources. We never host these files ourselves.
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {hasTextbooks ? (
          <div className="space-y-10">
            {CLASS_ORDER.map(cls => {
              const books = grouped[cls]
              if (!books?.length) return null
              return (
                <section key={cls}>
                  <div className="flex items-center gap-3 mb-5">
                    <h2 className="text-lg font-bold text-[#111827]" style={{ fontFamily: 'var(--font-display)' }}>
                      {CLASS_LABELS[cls]}
                    </h2>
                    <span className="text-sm text-slate-400">{books.length} book{books.length !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {books.map(book => <TextbookCard key={book.id} book={book} />)}
                  </div>
                </section>
              )
            })}
          </div>
        ) : (
          <div className="space-y-10">
            {STATIC_BOOKS.map(section => (
              <section key={section.label}>
                <div className="flex items-center gap-3 mb-5 pb-3 border-b border-slate-200">
                  <h2 className="text-lg font-bold text-[#111827]" style={{ fontFamily: 'var(--font-display)' }}>
                    {section.label}
                  </h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {section.books.map(book => (
                    <a
                      key={book.name}
                      href={book.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="calling-card group flex items-start gap-3"
                    >
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#E0F2FE' }}>
                        <BookOpen className="w-4 h-4" style={{ color: '#0C4A6E' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[#111827] text-sm group-hover:text-brand-green transition-colors" style={{ fontFamily: 'var(--font-display)' }}>
                          {book.name}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">English Medium · Official</p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-slate-300 flex-shrink-0 group-hover:text-brand-green transition-colors" />
                    </a>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        {/* Footer note */}
        <div className="mt-10 flex items-start gap-3 p-4 rounded-xl border text-sm" style={{ background: '#FFFBEB', borderColor: '#FDE68A' }}>
          <CheckCircle2 className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-amber-800">
            These links point to official government and publisher websites. If a link is broken, please{' '}
            <Link href="/contact" className="underline font-medium">report it here</Link>.
          </p>
        </div>
      </div>
    </div>
  )
}

function TextbookCard({ book }: { book: Textbook }) {
  return (
    <a
      href={book.official_url}
      target="_blank"
      rel="noopener noreferrer"
      className="calling-card group flex items-start gap-3"
    >
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#E0F2FE' }}>
        <BookOpen className="w-4 h-4" style={{ color: '#0C4A6E' }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-[#111827] text-sm group-hover:text-brand-green transition-colors" style={{ fontFamily: 'var(--font-display)' }}>
          {book.subject_name}
        </p>
        <p className="text-xs text-slate-500 mt-0.5">{book.source_label} · {book.medium === 'en' ? 'English' : 'Kannada'}</p>
        {book.last_checked && (
          <p className="text-xs text-slate-400 mt-1">
            Verified: {new Date(book.last_checked).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
        )}
      </div>
      <ExternalLink className="w-4 h-4 text-slate-300 flex-shrink-0 group-hover:text-brand-green transition-colors" />
    </a>
  )
}

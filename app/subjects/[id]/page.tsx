export const instant = false

import Link from 'next/link'
import { Suspense } from 'react'
import { getSubjectByKey } from '@/lib/data/subjects'
import { getPublishedChapters } from '@/lib/data/chapters'
import { getSubjectById } from '@/lib/content/taxonomy'
import { resolveSubjectSlug } from '@/lib/subject-keys'
import { notFound } from 'next/navigation'
import {
  ChevronRight, BookOpen, FlaskConical, FileText,
  Check, ArrowRight, Layers
} from 'lucide-react'
import { subjectName, subjectCode } from '@/lib/display-subject'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const fallback = getSubjectById(id)
  const name = fallback ? subjectName(fallback) : 'Subject'
  return {
    title: `${name} | PU Era`,
    description: `Free notes, chapter summaries, and study resources for ${name}. Karnataka PUC & NCERT.`,
  }
}

export default async function SubjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <Suspense fallback={<SubjectSkeleton />}>
      <SubjectData id={id} />
    </Suspense>
  )
}

async function SubjectData({ id }: { id: string }) {
  const [subject, chapters] = await Promise.all([
    getSubjectByKey(id),
    getPublishedChapters(id),
  ])

  const fallbackSubject = getSubjectById(id)
  const displaySubject = subject || fallbackSubject

  if (!displaySubject) notFound()

  const subjectSlug = subject?.slug ?? resolveSubjectSlug(id)
  const displayChapters = chapters

  const streamTheme = getStreamTheme(displaySubject.stream)

  return (
    <div>
      {/* ── Page Hero ── */}
      <div className="page-hero">
        <div>
          {/* Breadcrumb */}
          <nav className="breadcrumb mb-4">
            <Link href="/subjects">Subjects</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span style={{ color: '#111827', fontWeight: 600 }}>{subjectName(displaySubject)}</span>
          </nav>

          <div className="flex items-start gap-4">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: streamTheme.iconBg }}
            >
              {displaySubject.has_lab
                ? <FlaskConical className="w-6 h-6" style={{ color: streamTheme.iconColor }} />
                : <BookOpen className="w-6 h-6" style={{ color: streamTheme.iconColor }} />
              }
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className={streamTheme.pill}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: streamTheme.dotBg }} />
                  {displaySubject.stream}
                </span>
                <span className="stream-pill general">{displaySubject.class_level}</span>
                <span className="stream-pill general">{displaySubject.board}</span>
                {displaySubject.has_lab && (
                  <span className="stream-pill science">
                    <FlaskConical className="w-3 h-3" /> Lab
                  </span>
                )}
              </div>
              <h1
                className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {subjectName(displaySubject)}
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                {subjectCode(displaySubject)} · {displaySubject.class_level} · {displaySubject.board}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* ── Chapter List ── */}
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-5">
              <h2
                className="text-xl font-bold text-[#111827]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Chapters
              </h2>
              <span className="text-sm text-slate-400">
                {displayChapters.length} chapter{displayChapters.length !== 1 ? 's' : ''}
              </span>
            </div>

            {displayChapters.length === 0 ? (
              <div className="picker-box text-center py-12">
                <BookOpen className="w-10 h-10 mx-auto mb-3 text-slate-300" />
                <p className="text-slate-500 font-medium">No chapters available yet.</p>
                <p className="text-slate-400 text-sm mt-1">Check back soon — content is being added.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {displayChapters.map((chapter, idx) => {
                  const num = (chapter as any).number ?? idx + 1
                  const title = (chapter as any).title ?? (chapter as any).title_en ?? `Chapter ${num}`
                  const chapterKey = (chapter as any).slug ?? (chapter as any).id
                  return (
                    <Link
                      key={(chapter as any).id ?? idx}
                      href={`/subjects/${subjectSlug}/${chapterKey}`}
                      className="chapter-row group"
                    >
                      <div className="chapter-num-badge">{num}</div>
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-sm font-semibold text-[#111827] truncate"
                          style={{ fontFamily: 'var(--font-display)' }}
                        >
                          {title}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">Notes &amp; Resources</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-brand-green flex-shrink-0 transition-colors" />
                    </Link>
                  )
                })}
              </div>
            )}
          </div>

          {/* ── Sidebar ── */}
          <div className="lg:col-span-4 space-y-4">

            {/* Quick info */}
            <div className="picker-box space-y-3">
              <p className="section-eyebrow">Subject Info</p>
              {[
                { label: 'Class', value: displaySubject.class_level },
                { label: 'Stream', value: displaySubject.stream },
                { label: 'Board', value: displaySubject.board },
                { label: 'Code', value: subjectCode(displaySubject) },
                { label: 'Lab', value: displaySubject.has_lab ? 'Yes' : 'No' },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">{label}</span>
                  <span className="font-semibold text-[#111827]">{value}</span>
                </div>
              ))}
            </div>

            {/* Resources CTA */}
            <div className="picker-box space-y-3">
              <p className="section-eyebrow">Quick Links</p>
              <Link
                href="/textbooks"
                className="flex items-center gap-3 text-sm text-slate-700 hover:text-brand-green transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4 text-amber-700" />
                </div>
                Official Textbooks
              </Link>
              <Link
                href="/lab-guides"
                className="flex items-center gap-3 text-sm text-slate-700 hover:text-brand-green transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                  <FlaskConical className="w-4 h-4 text-emerald-700" />
                </div>
                Lab Guides
              </Link>
              <Link
                href="/subjects"
                className="flex items-center gap-3 text-sm text-slate-700 hover:text-brand-green transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                  <Layers className="w-4 h-4 text-slate-500" />
                </div>
                All Subjects
              </Link>
            </div>

            {/* Verified badge */}
            <div
              className="picker-box flex items-center gap-3"
              style={{ background: '#F0FDF4', borderColor: '#A7F3D0' }}
            >
              <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <p className="text-sm text-emerald-800 font-medium">
                Content verified for {displaySubject.class_level} syllabus
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Helpers ── */

function getStreamTheme(stream: string) {
  switch (stream) {
    case 'Science':  return { pill: 'stream-pill science',  iconBg: '#D1FAE5', iconColor: '#065F46', dotBg: '#16a34a' }
    case 'Commerce': return { pill: 'stream-pill commerce', iconBg: '#E0F2FE', iconColor: '#0C4A6E', dotBg: '#0EA5E9' }
    case 'Arts':     return { pill: 'stream-pill arts',     iconBg: '#FEF3C7', iconColor: '#78350F', dotBg: '#F59E0B' }
    default:         return { pill: 'stream-pill general',  iconBg: '#F1F5F9', iconColor: '#475569', dotBg: '#94A3B8' }
  }
}

function SubjectSkeleton() {
  return (
    <div>
      <div className="page-hero">
        <div>
          <div className="skeleton h-4 w-40 rounded mb-4" />
          <div className="flex items-start gap-4">
            <div className="skeleton w-12 h-12 rounded-2xl" />
            <div className="space-y-2">
              <div className="skeleton h-4 w-32 rounded" />
              <div className="skeleton h-8 w-64 rounded" />
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="skeleton h-16 rounded-xl" />
        ))}
      </div>
    </div>
  )
}

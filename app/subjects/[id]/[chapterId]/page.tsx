export const instant = false

import Link from 'next/link'
import { Suspense } from 'react'
import { getSubjectByKey } from '@/lib/data/subjects'
import { getChapterWithResources } from '@/lib/data/chapters'
import { resolveSubjectSlug } from '@/lib/subject-keys'
import { getSubjectById } from '@/lib/content/taxonomy'
import { notFound } from 'next/navigation'
import {
  ChevronRight, BookOpen, Download, ExternalLink,
  FlaskConical, FileText, Eye, Lock, Check
} from 'lucide-react'
import { subjectName, subjectCode } from '@/lib/display-subject'

export async function generateMetadata({ params }: { params: Promise<{ id: string; chapterId: string }> }) {
  const { id, chapterId } = await params
  const fallback = getSubjectById(id)
  const subName = fallback ? subjectName(fallback) : 'Subject'
  return {
    title: `Chapter — ${subName} | PU Era`,
    description: `Free notes and resources for ${subName}. Karnataka PUC & NCERT.`,
  }
}

export default async function ChapterPage({ params }: { params: Promise<{ id: string; chapterId: string }> }) {
  const { id, chapterId } = await params
  return (
    <Suspense fallback={<ChapterSkeleton />}>
      <ChapterData id={id} chapterId={chapterId} />
    </Suspense>
  )
}

async function ChapterData({ id, chapterId }: { id: string; chapterId: string }) {
  const [subject, chapterData] = await Promise.all([
    getSubjectByKey(id),
    getChapterWithResources(id, chapterId),
  ])

  const fallbackSubject = getSubjectById(id)
  const displaySubject = subject || fallbackSubject
  if (!displaySubject) notFound()

  const subjectSlug = subject?.slug ?? resolveSubjectSlug(id)
  const code = subjectCode(displaySubject)
  const chapterNumber = chapterData?.number ?? parseInt(chapterId.split('-ch')[1]) ?? 1
  const chapterTitle = chapterData?.title ?? getChapterTitle(code, chapterNumber)
  const resources = (chapterData as any)?.resources ?? []

  return (
    <div>
      {/* ── Page Hero ── */}
      <div className="page-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Breadcrumb */}
          <nav className="breadcrumb mb-4">
            <Link href="/subjects">Subjects</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href={`/subjects/${subjectSlug}`}>{subjectName(displaySubject)}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span style={{ color: '#111827', fontWeight: 600 }}>Chapter {chapterNumber}</span>
          </nav>

          <div className="flex items-start gap-4">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: '#D1FAE5' }}
            >
              <span
                className="text-lg font-bold"
                style={{ color: 'var(--brand-green)', fontFamily: 'var(--font-display)' }}
              >
                {chapterNumber}
              </span>
            </div>
            <div>
              <p className="section-eyebrow mb-1">{subjectName(displaySubject)} · {displaySubject.class_level}</p>
              <h1
                className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight leading-tight"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {chapterTitle}
              </h1>
              {chapterData?.description && (
                <p className="text-slate-500 text-sm mt-2 max-w-2xl">{chapterData.description}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* ── Left: Resources ── */}
          <div className="lg:col-span-8 space-y-8">

            {/* Study Resources */}
            <section>
              <h2
                className="text-lg font-bold text-[#111827] mb-4"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Study Resources
              </h2>

              {resources.length === 0 ? (
                <div className="picker-box text-center py-12">
                  <FileText className="w-10 h-10 mx-auto mb-3 text-slate-300" />
                  <p className="text-slate-500 font-medium">No resources yet</p>
                  <p className="text-slate-400 text-sm mt-1">
                    Resources will appear here once they&apos;re added.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {resources.map((resource: any) => (
                    <ResourceCard key={resource.id} resource={resource} />
                  ))}
                </div>
              )}
            </section>

            {/* Sign-in to download banner */}
            <div
              className="picker-box flex items-start gap-4"
              style={{ background: '#F0FDF4', borderColor: '#A7F3D0' }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: '#D1FAE5' }}
              >
                <Lock className="w-5 h-5 text-emerald-700" />
              </div>
              <div className="flex-1">
                <h3
                  className="text-sm font-bold text-emerald-900 mb-1"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Sign in to Download
                </h3>
                <p className="text-sm text-emerald-800 mb-3">
                  Create a free account to download all study materials.
                </p>
                <Link href="/login" className="btn-primary text-sm py-2 px-4">
                  <Download className="w-3.5 h-3.5" />
                  Sign In to Download
                </Link>
              </div>
            </div>

            {/* Official Textbook */}
            <section>
              <h2
                className="text-lg font-bold text-[#111827] mb-3"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Official Textbook
              </h2>
              <Link
                href="/textbooks"
                className="btn-ghost inline-flex"
              >
                <ExternalLink className="w-4 h-4" />
                View Official Textbook Directory
              </Link>
            </section>

            {/* Report issue */}
            <p className="text-sm text-slate-500 border-t border-slate-200 pt-6">
              Found an error?{' '}
              <Link href="/contact" className="text-brand-green hover:underline font-medium">
                Report an issue
              </Link>
            </p>
          </div>

          {/* ── Sidebar ── */}
          <div className="lg:col-span-4 space-y-4">

            {/* Chapter nav */}
            <div className="picker-box space-y-2">
              <p className="section-eyebrow mb-3">Navigate</p>
              <Link
                href={`/subjects/${subjectSlug}`}
                className="flex items-center gap-2 text-sm text-slate-700 hover:text-brand-green transition-colors font-medium"
              >
                <BookOpen className="w-4 h-4 text-slate-400" />
                All Chapters
              </Link>
              {displaySubject.has_lab && (
                <Link
                  href="/lab-guides"
                  className="flex items-center gap-2 text-sm text-slate-700 hover:text-brand-green transition-colors font-medium"
                >
                  <FlaskConical className="w-4 h-4 text-slate-400" />
                  Lab Guides
                </Link>
              )}
            </div>

            {/* Verified */}
            <div
              className="picker-box flex items-center gap-3"
              style={{ background: '#F0FDF4', borderColor: '#A7F3D0' }}
            >
              <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <p className="text-sm text-emerald-800 font-medium">
                Syllabus verified for {displaySubject.class_level}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Resource Card ── */
const TYPE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  notes:          { bg: '#D1FAE5', text: '#065F46', border: '#A7F3D0' },
  question_paper: { bg: '#DBEAFE', text: '#1E40AF', border: '#BFDBFE' },
  model_paper:    { bg: '#EDE9FE', text: '#5B21B6', border: '#DDD6FE' },
  lab_guide:      { bg: '#FEF3C7', text: '#78350F', border: '#FDE68A' },
  solved_paper:   { bg: '#CCFBF1', text: '#134E4A', border: '#99F6E4' },
  reference:      { bg: '#F1F5F9', text: '#475569', border: '#E2E8F0' },
}

const TYPE_LABELS: Record<string, string> = {
  notes: 'Notes', question_paper: 'Question Paper', model_paper: 'Model Paper',
  lab_guide: 'Lab Guide', solved_paper: 'Solved Paper', reference: 'Reference',
}

function ResourceCard({ resource }: { resource: any }) {
  const colors = TYPE_COLORS[resource.type] ?? TYPE_COLORS.reference
  const label = TYPE_LABELS[resource.type] ?? resource.type

  return (
    <div className="calling-card group">
      <div className="flex items-start justify-between gap-2">
        <span
          className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border"
          style={{ background: colors.bg, color: colors.text, borderColor: colors.border }}
        >
          {label}
        </span>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Eye className="w-3.5 h-3.5" />
          {resource.views ?? 0}
        </div>
      </div>

      <div>
        <h3
          className="text-sm font-bold text-[#111827] leading-snug mb-1"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {resource.title}
        </h3>
        {resource.description && (
          <p className="text-xs text-slate-500 line-clamp-2">{resource.description}</p>
        )}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <Link
          href={resource.slug ? `/resources/${resource.slug}` : '/login'}
          className="flex items-center gap-1.5 text-xs font-semibold text-brand-green hover:underline"
        >
          <Eye className="w-3.5 h-3.5" />
          View Resource
        </Link>
        <Link
          href="/login"
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-brand-green transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          Download
        </Link>
      </div>
    </div>
  )
}

/* ── Chapter title fallback ── */
function getChapterTitle(code: string, num: number): string {
  const titles: Record<string, string[]> = {
    PHY: ['Physical World', 'Units and Measurements', 'Motion in a Straight Line', 'Motion in a Plane', 'Laws of Motion', 'Work, Energy and Power', 'System of Particles', 'Gravitation', 'Mechanical Properties of Solids', 'Mechanical Properties of Fluids', 'Thermal Properties of Matter', 'Thermodynamics', 'Kinetic Theory', 'Oscillations', 'Waves'],
    CHE: ['Some Basic Concepts', 'Structure of Atom', 'Classification of Elements', 'Chemical Bonding', 'Thermodynamics', 'Equilibrium', 'Redox Reactions', 'Organic Chemistry', 'Hydrocarbons', 'Environmental Chemistry'],
    MAT: ['Sets', 'Relations and Functions', 'Trigonometric Functions', 'Complex Numbers', 'Linear Inequalities', 'Permutations and Combinations', 'Binomial Theorem', 'Sequences and Series', 'Straight Lines', 'Conic Sections', 'Introduction to 3D Geometry', 'Limits and Derivatives', 'Statistics', 'Probability'],
    BIO: ['The Living World', 'Biological Classification', 'Plant Kingdom', 'Animal Kingdom', 'Morphology of Flowering Plants', 'Anatomy of Flowering Plants', 'Structural Organisation', 'Cell: The Unit of Life', 'Biomolecules', 'Cell Cycle and Cell Division'],
    ACC: ['Introduction to Accounting', 'Theory Base of Accounting', 'Recording of Transactions I', 'Recording of Transactions II', 'Bank Reconciliation Statement', 'Trial Balance', 'Depreciation', 'Bills of Exchange'],
    ECO: ['Indian Economy on the Eve', 'Indian Economy 1950–1990', 'Liberalisation', 'Poverty', 'Human Capital Formation', 'Rural Development', 'Employment', 'Infrastructure'],
    BST: ['Nature and Significance', 'Principles of Management', 'Business Environment', 'Planning', 'Organising', 'Staffing', 'Directing', 'Controlling'],
    CS:  ['Computer Fundamentals', 'Introduction to C++', 'Data Types', 'Control Structures', 'Functions', 'Arrays', 'Strings', 'Structures', 'File Handling', 'Data Structures'],
  }
  return titles[code]?.[num - 1] ?? `Chapter ${num}`
}

function ChapterSkeleton() {
  return (
    <div>
      <div className="page-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="skeleton h-4 w-56 rounded mb-4" />
          <div className="flex items-start gap-4">
            <div className="skeleton w-12 h-12 rounded-2xl" />
            <div className="space-y-2">
              <div className="skeleton h-3 w-32 rounded" />
              <div className="skeleton h-7 w-72 rounded" />
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton h-32 rounded-2xl" />
          ))}
        </div>
        <div className="lg:col-span-4 space-y-4">
          <div className="skeleton h-40 rounded-2xl" />
        </div>
      </div>
    </div>
  )
}

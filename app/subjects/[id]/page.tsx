import Link from 'next/link'
import { Suspense } from 'react'
import { getSubjectByKey } from '@/lib/data/subjects'
import { getPublishedChapters } from '@/lib/data/chapters'
import { getSubjectById } from '@/lib/content/taxonomy'
import { resolveSubjectSlug } from '@/lib/subject-keys'
import { notFound } from 'next/navigation'
import { ChevronRight, BookOpen } from 'lucide-react'
import { subjectName } from '@/lib/display-subject'

export default async function SubjectPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto px-4 py-12">
      <Suspense fallback={<div className="text-center py-12">Loading subject...</div>}>
        <SubjectData id={params.id} />
      </Suspense>
    </div>
  )
}

async function SubjectData({ id }: { id: string }) {
  const subject = await getSubjectByKey(id)
  const chapters = await getPublishedChapters(id)
  const subjectSlug = subject?.slug ?? resolveSubjectSlug(id)

  const fallbackSubject = getSubjectById(id)
  const displaySubject = subject || fallbackSubject

  if (!displaySubject) {
    notFound()
  }

  const displayChapters = chapters.length > 0 ? chapters : generateMockChapters(displaySubject)

  return (
    <>
      <nav className="flex items-center text-sm text-neutral-600 mb-6">
        <Link href="/subjects" className="hover:text-primary-600">Subjects</Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span className="text-neutral-900">{subjectName(displaySubject)}</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-neutral-900 mb-2">{subjectName(displaySubject)}</h1>
        <p className="text-lg text-neutral-600">
          {displaySubject.class_level} • {displaySubject.stream} • {displaySubject.board}
        </p>
        {displaySubject.has_lab && (
          <span className="inline-block mt-2 px-3 py-1 bg-accent-100 text-accent-700 text-sm font-medium rounded">
            Includes Lab Materials
          </span>
        )}
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Chapters</h2>
        {displayChapters.length === 0 ? (
          <div className="text-center py-12 text-neutral-600">
            <p>No chapters available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayChapters.map((chapter) => (
              <Link
                key={chapter.id}
                href={`/subjects/${subjectSlug}/${'slug' in chapter ? chapter.slug : chapter.id}`}
                className="flex items-center p-4 border border-neutral-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all bg-white"
              >
                <div className="flex items-center justify-center w-10 h-10 bg-primary-100 text-primary-600 rounded-lg mr-4">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-neutral-900">{(chapter as any).title || (chapter as any).title_en}</h3>
                  <p className="text-sm text-neutral-600">Notes & Resources</p>
                </div>
                <ChevronRight className="h-5 w-5 text-neutral-400" />
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-neutral-200 pt-8">
        <h2 className="text-xl font-semibold text-neutral-900 mb-4">Related Subjects</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <RelatedSubjectCard classLevel={displaySubject.class_level} stream={displaySubject.stream} excludeId={id} />
        </div>
      </div>
    </>
  )
}

function generateMockChapters(subject: any) {
  return Array.from({ length: 10 }, (_, i) => ({
    id: `${subject.id}-ch${i + 1}`,
    number: i + 1,
    title: `Chapter ${i + 1}: ${getChapterTitle(subject.code, i + 1)}`,
  }))
}

function getChapterTitle(code: string, num: number): string {
  const titles: Record<string, string[]> = {
    'PHY': ['Physical World', 'Units and Measurements', 'Motion in a Straight Line', 'Motion in a Plane', 'Laws of Motion', 'Work, Energy and Power', 'System of Particles', 'Gravitation'],
    'CHE': ['Some Basic Concepts', 'Structure of Atom', 'Classification of Elements', 'Chemical Bonding', 'Thermodynamics', 'Equilibrium', 'Redox Reactions', 'Organic Chemistry'],
    'MAT': ['Sets', 'Relations and Functions', 'Trigonometric Functions', 'Complex Numbers', 'Linear Inequalities', 'Permutations', 'Binomial Theorem', 'Sequences'],
    'BIO': ['The Living World', 'Biological Classification', 'Plant Kingdom', 'Animal Kingdom', 'Morphology of Flowering', 'Anatomy of Flowering', 'Structural Organisation', 'Cell: The Unit'],
    'ACC': ['Introduction to Accounting', 'Theory Base of Accounting', 'Recording of Transactions', 'Preparation of Journal', 'Ledger', 'Trial Balance', 'Depreciation', 'Bills of Exchange'],
    'ECO': ['Indian Economy on the Eve', 'Indian Economy 1950-1990', 'Liberalisation', 'Poverty', 'Human Capital Formation', 'Rural Development', 'Employment', 'Infrastructure'],
    'BST': ['Nature and Significance', 'Forms of Business Organisation', 'Private, Public and Global', 'Business Services', 'Emerging Modes', 'Social Responsibility', 'Formation of Company', 'Sources of Business'],
  }
  return titles[code]?.[num - 1] || `Topic ${num}`
}

function RelatedSubjectCard({ classLevel, stream, excludeId }: { classLevel: string, stream: string, excludeId: string }) {
  return (
    <div className="p-4 border border-neutral-200 rounded-lg bg-neutral-50">
      <p className="text-sm text-neutral-600">More subjects coming soon...</p>
    </div>
  )
}

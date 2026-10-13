import Link from 'next/link'
import { Suspense } from 'react'
import { getSubjectByKey } from '@/lib/data/subjects'
import { getChapterWithResources } from '@/lib/data/chapters'
import { resolveSubjectSlug } from '@/lib/subject-keys'
import { getSubjectById } from '@/lib/content/taxonomy'
import { notFound } from 'next/navigation'
import { ChevronRight, BookOpen, Download, ExternalLink, AlertCircle } from 'lucide-react'
import { subjectName, subjectCode } from '@/lib/display-subject'

export default async function ChapterPage({ params }: { params: { id: string; chapterId: string } }) {
  return (
    <div className="container mx-auto px-4 py-12">
      <Suspense fallback={<div className="text-center py-12">Loading chapter...</div>}>
        <ChapterData id={params.id} chapterId={params.chapterId} />
      </Suspense>
    </div>
  )
}

async function ChapterData({ id, chapterId }: { id: string; chapterId: string }) {
  const subject = await getSubjectByKey(id)
  const chapterData = await getChapterWithResources(id, chapterId)
  const subjectSlug = subject?.slug ?? resolveSubjectSlug(id)

  const fallbackSubject = getSubjectById(id)
  const displaySubject = subject || fallbackSubject

  if (!displaySubject) {
    notFound()
  }

  const chapter = chapterData
  const chapterNumber = chapter?.number || parseInt(chapterId.split('-ch')[1]) || 1
  const code = subjectCode(displaySubject)
  const chapterTitle = chapter?.title || getChapterTitle(code, chapterNumber)
  const resources = chapter?.resources || []

  return (
    <>
      <nav className="flex items-center text-sm text-neutral-600 mb-6">
        <Link href="/subjects" className="hover:text-primary-600">Subjects</Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <Link href={`/subjects/${subjectSlug}`} className="hover:text-primary-600">{subjectName(displaySubject)}</Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span className="text-neutral-900">Chapter {chapterNumber}</span>
      </nav>

      <div className="max-w-4xl">
        <h1 className="text-4xl font-bold text-neutral-900 mb-4">
          Chapter {chapterNumber}: {chapterTitle}
        </h1>
        <p className="text-lg text-neutral-600 mb-8">
          {subjectName(displaySubject)} • {displaySubject.class_level}
        </p>

        {chapter?.description && (
          <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Description</h2>
            <p className="text-neutral-700">{chapter.description}</p>
          </div>
        )}

        <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Topics Covered</h2>
          <ul className="space-y-2 text-neutral-700">
            <li className="flex items-start">
              <span className="text-primary-600 mr-2">•</span>
              <span>Introduction and basic concepts</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-600 mr-2">•</span>
              <span>Key formulas and equations</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-600 mr-2">•</span>
              <span>Solved examples and problems</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-600 mr-2">•</span>
              <span>Practice exercises</span>
            </li>
          </ul>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Chapter Summary</h2>
          <p className="text-neutral-700 leading-relaxed">
            This chapter covers fundamental concepts that are essential for understanding the subject.
            Students will learn the theoretical foundations, practical applications, and problem-solving
            techniques relevant to this topic. The materials include detailed explanations, worked examples,
            and practice problems to reinforce learning.
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Key Points</h2>
          <ol className="list-decimal list-inside space-y-2 text-neutral-700">
            <li>Understand the basic definitions and terminology</li>
            <li>Learn the fundamental principles and laws</li>
            <li>Practice solving numerical problems</li>
            <li>Apply concepts to real-world scenarios</li>
            <li>Review and revise regularly for better retention</li>
          </ol>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Study Resources</h2>
          {resources.length === 0 ? (
            <div className="text-center py-8 text-neutral-600">
              <p>No resources available yet. Check back later!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resources.map((resource: any) => (
                <ResourceCard
                  key={resource.id}
                  id={resource.id}
                  title={resource.title || resource.title_en}
                  type={resource.type}
                  description={resource.description || resource.description_en}
                  downloadCount={resource.downloads ?? resource.download_count}
                  viewCount={resource.views ?? resource.view_count}
                  slug={resource.slug}
                />
              ))}
            </div>
          )}
        </div>

        <div className="bg-primary-50 border border-primary-200 rounded-lg p-6 mb-8">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-primary-600 mr-3 mt-0.5" />
            <div>
              <h3 className="font-semibold text-neutral-900 mb-2">Sign in to Download</h3>
              <p className="text-neutral-700 mb-4">
                Create a free account to access and download all study materials.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Download className="mr-2 h-4 w-4" />
                Sign In to Download
              </Link>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Official Textbook</h2>
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-primary-600 border border-primary-300 rounded-lg hover:bg-primary-50 transition-colors"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            View Official Textbook
          </a>
        </div>

        <div className="border-t border-neutral-200 pt-8">
          <p className="text-sm text-neutral-600">
            Found an error or have a suggestion?{' '}
            <Link href="/contact" className="text-primary-600 hover:underline">
              Report an issue
            </Link>
          </p>
        </div>
      </div>
    </>
  )
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

function ResourceCard({ id, slug, title, type, description, downloadCount, viewCount }: { id: string; slug?: string; title: string; type: string; description: string; downloadCount?: number; viewCount?: number }) {
  return (
    <div className="p-4 border border-neutral-200 rounded-lg bg-white">
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-medium text-neutral-900">{title}</h3>
        <span className="text-xs px-2 py-1 bg-neutral-100 text-neutral-600 rounded capitalize">{type}</span>
      </div>
      <p className="text-sm text-neutral-600 mb-3">{description}</p>
      <div className="flex items-center justify-between">
        <Link
          href={slug ? `/resources/${slug}` : '/login'}
          className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          <Download className="mr-1 h-4 w-4" />
          {slug ? 'View resource' : 'Download'}
        </Link>
        {(downloadCount !== undefined || viewCount !== undefined) && (
          <div className="text-xs text-neutral-500">
            {viewCount !== undefined && `${viewCount} views`}
            {downloadCount !== undefined && viewCount !== undefined && ' • '}
            {downloadCount !== undefined && `${downloadCount} downloads`}
          </div>
        )}
      </div>
    </div>
  )
}

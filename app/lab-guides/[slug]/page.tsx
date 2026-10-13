import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { FlaskConical, BookOpen, ChevronRight, AlertTriangle } from 'lucide-react'
import type { LabExperiment } from '@/lib/types'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('lab_experiments')
    .select('title, aim')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!data) return { title: 'Experiment Not Found | PU Era' }

  return {
    title: `${data.title} — Lab Guide & Viva Q&A | PU Era`,
    description: data.aim ?? `Complete lab guide for ${data.title} with procedure, observations, result and viva questions.`,
  }
}

export default async function ExperimentPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: exp } = await supabase
    .from('lab_experiments')
    .select(`
      *,
      subjects!inner(id, name, slug, class_level, stream)
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!exp) notFound()

  const experiment = exp as unknown as LabExperiment & {
    subjects: { name: string; slug: string; class_level: string }
  }

  const vivaQA = experiment.viva_qa as Array<{ q: string; a: string }> ?? []

  return (
    <main className="page-container py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-muted mb-6" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <ChevronRight className="w-4 h-4" />
        <Link href="/lab-guides" className="hover:text-primary transition-colors">Lab Guides</Link>
        <ChevronRight className="w-4 h-4" />
        <Link href={`/subjects/${experiment.subjects.slug}`} className="hover:text-primary transition-colors">
          {experiment.subjects.name}
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-heading font-medium">{experiment.title}</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
            <FlaskConical className="w-6 h-6 text-emerald-700 dark:text-emerald-400" />
          </div>
          <div>
            <span className="stream-pill stream-science mb-2 inline-block">Lab Experiment</span>
            <h1 className="text-2xl sm:text-3xl font-bold text-heading">{experiment.title}</h1>
            <p className="text-muted mt-1">{experiment.subjects.name} · {experiment.subjects.class_level.toUpperCase()}</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {experiment.aim && (
            <Section title="🎯 Aim">
              <p className="text-body">{experiment.aim}</p>
            </Section>
          )}

          {experiment.apparatus && (
            <Section title="🔧 Apparatus Required">
              <div className="text-body whitespace-pre-line">{experiment.apparatus}</div>
            </Section>
          )}

          {experiment.theory && (
            <Section title="📖 Theory">
              <div className="text-body whitespace-pre-line">{experiment.theory}</div>
            </Section>
          )}

          {experiment.procedure && (
            <Section title="📝 Procedure">
              <div className="text-body whitespace-pre-line">{experiment.procedure}</div>
            </Section>
          )}

          {experiment.observations && (
            <Section title="📊 Observations">
              <div className="text-body whitespace-pre-line">{experiment.observations}</div>
            </Section>
          )}

          {experiment.result && (
            <Section title="✅ Result">
              <div className="text-body whitespace-pre-line">{experiment.result}</div>
            </Section>
          )}

          {experiment.precautions && (
            <Section title="⚠️ Precautions">
              <div className="text-body whitespace-pre-line">{experiment.precautions}</div>
            </Section>
          )}

          {vivaQA.length > 0 && (
            <Section title="❓ Viva Questions & Answers">
              <div className="space-y-4">
                {vivaQA.map((item, i) => (
                  <div key={i} className="border border-border rounded-lg overflow-hidden">
                    <div className="bg-surface-alt px-4 py-3 font-medium text-heading text-sm">
                      Q{i + 1}. {item.q}
                    </div>
                    <div className="px-4 py-3 text-body text-sm">
                      <span className="text-emerald-600 font-medium">Ans: </span>{item.a}
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          <div className="calling-card">
            <h3 className="font-semibold text-heading mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" />
              Related Subject
            </h3>
            <Link
              href={`/subjects/${experiment.subjects.slug}`}
              className="block text-primary hover:underline font-medium"
            >
              {experiment.subjects.name}
            </Link>
            <p className="text-sm text-muted mt-1">{experiment.subjects.class_level.toUpperCase()}</p>
          </div>

          <div className="calling-card bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-amber-800 dark:text-amber-200">Original work</p>
                <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                  This content is written by us. Please cite PU Era if you share it.
                </p>
              </div>
            </div>
          </div>

          <Link
            href={`/contact?type=broken_link&page=${encodeURIComponent(`/lab-guides/${experiment.slug}`)}`}
            className="block text-sm text-muted hover:text-primary transition-colors text-center py-2"
          >
            Something wrong? Report it →
          </Link>
        </aside>
      </div>
    </main>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="calling-card">
      <h2 className="text-lg font-semibold text-heading mb-3">{title}</h2>
      {children}
    </div>
  )
}

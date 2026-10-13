export const instant = false

import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { LabCard } from '@/app/components/LabCard'
import { EmptyState } from '@/app/components/EmptyState'
import { FlaskConical, BookOpen, ArrowRight, CheckCircle2, ClipboardList, HelpCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Lab Guides & Practical Records | PU Era',
  description: 'Free lab guides, practical records, viva Q&A and experiment notes for Karnataka PUC Science students.',
}

export default async function LabGuidesPage() {
  const supabase = await createClient()

  const { data: experiments } = await supabase
    .from('lab_experiments')
    .select(`id, slug, title, aim, status, created_at, subjects!inner(id, name, slug, class_level, stream)`)
    .eq('status', 'published')
    .order('created_at', { ascending: false })

  const subjectGroups = (experiments ?? []).reduce((acc: Record<string, typeof experiments>, exp) => {
    const subject = (exp as unknown as { subjects: { name: string } }).subjects?.name ?? 'Other'
    if (!acc[subject]) acc[subject] = []
    acc[subject]!.push(exp)
    return acc
  }, {})

  const hasExperiments = (experiments ?? []).length > 0

  return (
    <div>
      {/* ── Page Hero ── */}
      <div className="page-hero">
        <div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: '#D1FAE5' }}>
              <FlaskConical className="w-6 h-6" style={{ color: 'var(--brand-green)' }} />
            </div>
            <div>
              <p className="section-eyebrow mb-1" style={{ color: 'var(--brand-green)' }}>Science Practicals</p>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
                Lab Guides & Practical Records
              </h1>
              <p className="text-slate-500 text-sm sm:text-base mt-2 max-w-xl">
                Aim · Apparatus · Procedure · Observations · Viva Q&amp;A — written for Karnataka PUC students.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Feature strips */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            { icon: FlaskConical, title: 'Step-by-step procedures', desc: 'Every experiment broken into clear numbered steps', bg: '#D1FAE5', color: '#065F46' },
            { icon: ClipboardList, title: 'Observation tables', desc: 'Ready-to-copy observation and result tables', bg: '#E0F2FE', color: '#0C4A6E' },
            { icon: HelpCircle, title: 'Viva Q&A', desc: 'At least 5 viva questions with model answers per experiment', bg: '#FEF3C7', color: '#78350F' },
          ].map(({ icon: Icon, title, desc, bg, color }) => (
            <div key={title} className="picker-box flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: bg }}>
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#111827]" style={{ fontFamily: 'var(--font-display)' }}>{title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Subject filter chips */}
        {hasExperiments && (
          <div className="flex flex-wrap gap-2 mb-8">
            {Object.keys(subjectGroups).map(subject => (
              <a key={subject} href={`#${subject.toLowerCase().replace(/\s+/g, '-')}`} className="stream-pill science">
                {subject} ({subjectGroups[subject]?.length})
              </a>
            ))}
          </div>
        )}

        {/* Experiments */}
        {hasExperiments ? (
          <div className="space-y-12">
            {Object.entries(subjectGroups).map(([subject, exps]) => (
              <section key={subject} id={subject.toLowerCase().replace(/\s+/g, '-')}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#D1FAE5' }}>
                    <BookOpen className="w-4 h-4" style={{ color: 'var(--brand-green)' }} />
                  </div>
                  <h2 className="text-lg font-bold text-[#111827]" style={{ fontFamily: 'var(--font-display)' }}>{subject}</h2>
                  <span className="text-sm text-slate-400">{exps?.length} experiment{exps?.length !== 1 ? 's' : ''}</span>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {(exps ?? []).map((exp) => (
                    <LabCard key={exp.id} experiment={exp as unknown as import('@/lib/types').LabExperiment} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<FlaskConical className="w-12 h-12 text-slate-300" />}
            title="Lab guides coming soon"
            description="We're writing practical records for Science subjects. Check back soon — or request the experiment you need."
            action={
              <Link href="/student/requests" className="btn-primary">
                Request an Experiment <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            }
          />
        )}

        {/* Official note */}
        <div className="mt-12 flex items-start gap-3 p-4 rounded-xl border text-sm" style={{ background: '#F0FDF4', borderColor: '#A7F3D0' }}>
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
          <p className="text-emerald-800">
            All lab guides are written for the <strong>Karnataka KTBS syllabus</strong>. Procedures follow the official practical manual.
          </p>
        </div>
      </div>
    </div>
  )
}

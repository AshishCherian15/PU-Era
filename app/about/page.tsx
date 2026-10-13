import type { Metadata } from 'next'
import Link from 'next/link'
import { BookOpen, Search, ExternalLink } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'About PU Era | Free PUC & NCERT Study Hub',
  description: 'Learn about PU Era — a free, ad-free study hub built for Karnataka PUC and NCERT students. Original student-written notes, lab guides, and official textbook links.',
  openGraph: {
    title: 'About PU Era | Free PUC & NCERT Study Hub',
    description: 'Free, ad-free study hub for PUC and NCERT students. Student-written content. No tracking. No fees.',
  },
}

export default async function AboutPage() {
  const supabase = await createClient()

  // Stats from DB
  const [{ count: subjectCount }, { count: resourceCount }] = await Promise.all([
    supabase.from('subjects').select('id', { count: 'exact', head: true }).eq('active', true),
    supabase.from('resources').select('id', { count: 'exact', head: true }).eq('status', 'published'),
  ])

  const displaySubjects = subjectCount ?? 0
  const displayResources = resourceCount ?? 0

  return (
    <div>
      {/* Hero */}
      <div className="page-hero">
        <div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'var(--brand-green)' }}>
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="section-eyebrow mb-1" style={{ color: 'var(--brand-green)' }}>About Us</p>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>About PU Era</h1>
            </div>
          </div>
          <p className="text-slate-500 text-sm sm:text-base mt-3 max-w-xl">
            Free, ad-free study materials for Karnataka PUC and NCERT students — written by students, for students.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Subjects', value: displaySubjects > 0 ? `${displaySubjects}+` : 'Growing' },
            { label: 'Resources', value: displayResources > 0 ? `${displayResources}+` : 'Growing' },
            { label: 'Cost', value: '₹0' },
          ].map(s => (
            <div key={s.label} className="calling-card text-center">
              <p className="text-3xl font-bold text-primary mb-1">{s.value}</p>
              <p className="text-sm text-muted">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Story */}
        <div className="space-y-4">
          <div className="calling-card">
            <h2 className="text-xl font-bold text-heading mb-3">🎯 What we do</h2>
            <p className="text-body">
              PU Era provides free, original study materials for Karnataka PUC (1st and 2nd year) students,
              aligned to both KTBS and NCERT syllabuses. Everything is organised as:
              <strong className="text-heading"> Class → Stream → Subject → Chapter</strong>.
            </p>
            <p className="text-body mt-3">
              You can browse chapter notes, short notes, formula sheets, important Q&amp;A, revision PDFs,
              lab guides with viva questions, and direct links to official KTBS and NCERT textbooks — all in one place.
            </p>
          </div>

          <div className="calling-card">
            <h2 className="text-xl font-bold text-heading mb-3">✋ Our promises</h2>
            <ul className="space-y-2">
              {[
                'No ads — ever',
                'No tracking or analytics cookies',
                'No paid tiers or paywalls',
                'No direct messages between users (safeguarding minors)',
                'No content uploaded without verified source and licence',
                'Official NCERT/KTBS links are direct-to-source, never re-hosted',
                'DPDP Act compliant — guardian consent for under-18 registrations',
              ].map(p => (
                <li key={p} className="flex items-start gap-2 text-body text-sm">
                  <span className="text-emerald-500 flex-shrink-0">✓</span>
                  {p}
                </li>
              ))}
            </ul>
          </div>

          <div className="calling-card">
            <h2 className="text-xl font-bold text-heading mb-3">📚 What we cover</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { label: '2nd PUC Science', sub: 'Physics, Chemistry, Biology, Mathematics' },
                { label: '2nd PUC Commerce', sub: 'Accountancy, Business Studies, Economics' },
                { label: '1st PUC Science', sub: 'Physics, Chemistry, Biology, Mathematics' },
                { label: '1st PUC Commerce', sub: 'Accountancy, Business Studies, Economics' },
                { label: 'NCERT Class 11 & 12', sub: 'All main subjects' },
                { label: 'Lab Guides', sub: 'Physics, Chemistry, Biology practicals' },
              ].map(c => (
                <div key={c.label} className="flex items-start gap-2">
                  <span className="text-primary text-sm mt-0.5">▸</span>
                  <div>
                    <p className="font-medium text-heading text-sm">{c.label}</p>
                    <p className="text-xs text-muted">{c.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="calling-card">
            <h2 className="text-xl font-bold text-heading mb-3">⚖️ Legal &amp; licensing</h2>
            <p className="text-body text-sm">
              All original content on PU Era is written by us and licensed under a Creative Commons Attribution licence.
              NCERT e-content links point directly to{' '}
              <a href="https://ncert.nic.in" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">ncert.nic.in</a>
              {' '}— NCERT makes these freely available under the "e-content" government initiative.
              KTBS links point directly to{' '}
              <a href="https://ktbs.kar.nic.in" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">ktbs.kar.nic.in</a>.
              We do not host NCERT or KTBS files ourselves.
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <Link href="/legal/terms" className="text-xs text-primary hover:underline">Terms of Service</Link>
              <span className="text-muted text-xs">·</span>
              <Link href="/legal/privacy" className="text-xs text-primary hover:underline">Privacy Policy</Link>
              <span className="text-muted text-xs">·</span>
              <Link href="/legal/copyright" className="text-xs text-primary hover:underline">Copyright Notice</Link>
              <span className="text-muted text-xs">·</span>
              <Link href="/legal/grievance" className="text-xs text-primary hover:underline">Grievance Officer</Link>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Link href="/subjects" className="btn-primary inline-flex items-center gap-2">
              <Search className="w-4 h-4" />
              Browse study materials
            </Link>
            <Link href="/contact" className="btn-secondary inline-flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              Contact us
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import {
  BookOpen, FlaskConical, FileText, ArrowRight,
  ShieldCheck, Check, Search, BookMarked, Sparkles,
  Layers, ChevronRight, GraduationCap, Heart,
  CheckCircle2, Award
} from 'lucide-react'
import { SUBJECTS } from '@/lib/content/taxonomy'
import { subjectHrefKey } from '@/lib/subject-keys'

type ClassLevel = '2nd-puc' | '1st-puc' | 'ncert-12' | 'ncert-11'
type StreamType = 'science' | 'commerce' | 'arts'

interface Announcement {
  title: string
  body: string
  action_label: string | null
  action_url: string | null
}

const CLASS_MAP: Record<ClassLevel, string> = {
  '2nd-puc': 'PUC2', '1st-puc': 'PUC1', 'ncert-12': 'NCERT12', 'ncert-11': 'NCERT11',
}
const STREAM_MAP: Record<StreamType, string> = {
  science: 'Science', commerce: 'Commerce', arts: 'Arts',
}

function getStreamTheme(stream: StreamType) {
  switch (stream) {
    case 'science':  return { pill: 'stream-pill science',  cardHover: 'science',  iconBg: '#D1FAE5', iconColor: '#065F46' }
    case 'commerce': return { pill: 'stream-pill commerce', cardHover: 'commerce', iconBg: '#E0F2FE', iconColor: '#0C4A6E' }
    case 'arts':     return { pill: 'stream-pill arts',     cardHover: 'arts',     iconBg: '#FEF3C7', iconColor: '#78350F' }
  }
}

export default function HomeClient() {
  const [selectedClass,  setSelectedClass]  = useState<ClassLevel>('2nd-puc')
  const [selectedStream, setSelectedStream] = useState<StreamType>('science')
  const [announcement,   setAnnouncement]   = useState<Announcement | null>(null)

  useEffect(() => {
    const supabase = createClient()
    const now = new Date().toISOString()
    supabase
      .from('announcements')
      .select('title, body, action_label, action_url')
      .eq('status', 'active')
      .lte('publish_at', now)
      .or(`expires_at.is.null,expires_at.gt.${now}`)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => setAnnouncement(data ?? null))
  }, [])

  const filteredSubjects = SUBJECTS.filter(
    s => s.class_level === CLASS_MAP[selectedClass] && s.stream === STREAM_MAP[selectedStream]
  )

  return (
    <div className="space-y-0">

      {/* Announcement strip — only rendered when admin has an active announcement in DB */}
      {announcement && (
        <div className="announcement-strip">
          <span className="inline-flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-accent-amber" />
            {announcement.body || announcement.title}
            {announcement.action_label && announcement.action_url && (
              <Link href={announcement.action_url} className="underline font-semibold ml-1">
                {announcement.action_label}
              </Link>
            )}
          </span>
        </div>
      )}

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

          {/* Left */}
          <div className="lg:col-span-7 space-y-6 fade-in-up">
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-800 flex-wrap">
              <span className="green-dot" />
              <span>Syllabus Aligned 2026-27</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span>100% Free &amp; Ad-Free</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span>Karnataka DPUE &amp; NCERT</span>
            </div>

            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#111827] tracking-tight leading-[1.15]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Complete notes, official books &amp; practical guides for{' '}
              <span style={{ color: 'var(--brand-green)' }}>Karnataka PUC.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              Pick your class and stream to open interactive subject cards with blueprint marks,
              verified chapter lecture notes, and practical laboratory viva toolkits.
            </p>

            <div className="picker-box space-y-4">
              <p className="section-eyebrow flex items-center justify-between">
                <span>Start Studying: Select Your Class &amp; Stream</span>
                <span style={{ color: 'var(--brand-green)', fontSize: '0.6875rem', fontWeight: 600 }}>
                  click any card below to open →
                </span>
              </p>

              <div className="segmented-control">
                {([
                  { id: '2nd-puc', label: '2nd PUC' }, { id: '1st-puc', label: '1st PUC' },
                  { id: 'ncert-12', label: 'NCERT 12' }, { id: 'ncert-11', label: 'NCERT 11' },
                ] as { id: ClassLevel; label: string }[]).map(cls => (
                  <button key={cls.id} id={`class-seg-${cls.id}`}
                    onClick={() => setSelectedClass(cls.id)}
                    className={`seg-btn ${selectedClass === cls.id ? 'active' : ''}`}>
                    {cls.label}
                  </button>
                ))}
              </div>

              <div className="stream-toggle">
                {([
                  { id: 'science', label: '🔬 Science' },
                  { id: 'commerce', label: '📊 Commerce' },
                  { id: 'arts', label: '🎨 Arts' },
                ] as { id: StreamType; label: string }[]).map(s => (
                  <button key={s.id} id={`stream-btn-${s.id}`}
                    onClick={() => setSelectedStream(s.id)}
                    className={`stream-btn ${selectedStream === s.id ? `active ${s.id}` : ''}`}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {filteredSubjects.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredSubjects.map(subject => (
                  <SubjectCallingCard key={subject.id} subject={subject} stream={selectedStream} />
                ))}
              </div>
            ) : (
              <div className="picker-box text-center py-10">
                <BookOpen className="w-10 h-10 mx-auto mb-3 text-slate-300" />
                <p className="text-slate-500 text-sm font-medium">No subjects found for this combination.</p>
                <p className="text-slate-400 text-xs mt-1">Try selecting a different stream or class.</p>
              </div>
            )}
          </div>

          {/* Right */}
          <div className="lg:col-span-5 space-y-4 fade-in-up delay-200">
            <div className="picker-box">
              <p className="section-eyebrow mb-1">Platform Overview</p>
              <p className="text-xs text-slate-400 mb-3">Targets — content being added</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: '40+', label: 'Subjects', icon: BookOpen },
                  { value: '500+', label: 'Resources', icon: FileText },
                  { value: '3', label: 'Languages', icon: Layers },
                  { value: '100%', label: 'Free', icon: Heart },
                ].map(({ value, label, icon: Icon }) => (
                  <div key={label} className="flex flex-col items-center justify-center bg-slate-50 rounded-xl py-4 gap-1.5">
                    <Icon className="w-4 h-4 text-brand-green" />
                    <span className="text-2xl font-bold text-[#111827]" style={{ fontFamily: 'var(--font-display)' }}>{value}</span>
                    <span className="text-xs text-slate-500">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {[
                { icon: ShieldCheck, iconBg: '#D1FAE5', iconColor: '#14532D', title: 'Verified Chapter Notes',     desc: 'Each chapter is reviewed and verified by subject lecturers for syllabus accuracy.' },
                { icon: FlaskConical, iconBg: '#E0F2FE', iconColor: '#0C4A6E', title: 'Lab Record & Viva Toolkits', desc: 'Complete practical guides with diagrams, observations, and viva question banks.' },
                { icon: BookMarked,  iconBg: '#FEF3C7', iconColor: '#78350F', title: 'Official Textbook Links',    desc: 'Direct links to NCERT and Karnataka DPUE official PDF textbooks.' },
                { icon: Award,       iconBg: '#F3E8FF', iconColor: '#6B21A8', title: 'Blueprint & Marks Scheme',   desc: 'Question paper patterns, marks distribution and important topics highlighted.' },
              ].map(({ icon: Icon, iconBg, iconColor, title, desc }) => (
                <div key={title} className="trust-card flex items-start gap-4 text-left"
                  style={{ textAlign: 'left', flexDirection: 'row', padding: '1rem 1.25rem' }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: iconBg }}>
                    <Icon className="w-5 h-5" style={{ color: iconColor }} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#111827] mb-0.5" style={{ fontFamily: 'var(--font-display)' }}>{title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white border-t border-b border-slate-100 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="section-eyebrow mb-2">Simple Process</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#111827]" style={{ fontFamily: 'var(--font-display)' }}>How It Works</h2>
            <p className="text-slate-500 mt-2 text-sm max-w-md mx-auto">Three simple steps to find the right study material.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { icon: Search,       step: '01', title: 'Browse Subjects',   desc: 'Select your class and stream. Explore notes for PUC 1st & 2nd Year and NCERT 11 & 12.' },
              { icon: BookOpen,     step: '02', title: 'Open Subject Card', desc: 'View marks scheme, blueprint, verified chapter notes and official textbook links.' },
              { icon: FlaskConical, step: '03', title: 'Download & Study',  desc: 'Get lab records, viva toolkits and worked examples instantly. 100% free.' },
            ].map(({ icon: Icon, step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: '#D1FAE5' }}>
                  <Icon className="w-6 h-6" style={{ color: 'var(--brand-green)' }} />
                </div>
                <p className="section-eyebrow mb-2">{step}</p>
                <h3 className="text-base font-semibold text-[#111827] mb-2" style={{ fontFamily: 'var(--font-display)' }}>{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Trust Us */}
      <section className="py-14" style={{ background: '#111827' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">Why Students Trust Us</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>We&apos;re built different</h2>
            <p className="text-slate-400 mt-2 text-sm">Because students deserve better than clickbait and paywalls.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {[
              { icon: ShieldCheck,   title: 'No Spam Calls',     desc: 'We never share your contact info with anyone.' },
              { icon: CheckCircle2,  title: 'Verified Content',  desc: 'Every resource is checked by subject lecturers.' },
              { icon: Heart,         title: '100% Free',         desc: 'No paywalls, no subscriptions. Ever.' },
              { icon: GraduationCap, title: 'Karnataka Focused', desc: 'Built specifically for Karnataka PUC & NCERT.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex flex-col items-center text-center p-6 rounded-2xl border transition-all"
                style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.07)' }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ background: 'rgba(20,83,45,0.4)' }}>
                  <Icon className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-sm font-semibold text-white mb-1.5" style={{ fontFamily: 'var(--font-display)' }}>{title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-14 border-t border-slate-100">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#111827] mb-3" style={{ fontFamily: 'var(--font-display)' }}>
            Ready to start studying?
          </h2>
          <p className="text-slate-500 text-sm mb-8">Join students across Karnataka using PU Era to ace their PUC board exams.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/subjects" id="cta-browse-btn" className="btn-primary">
              <BookOpen className="w-4 h-4" /> Browse All Subjects <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/lab-guides" id="cta-lab-btn" className="btn-ghost">
              <FlaskConical className="w-4 h-4" /> Lab Guides
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}

function SubjectCallingCard({ subject, stream }: {
  subject: { id: string; code: string; name: string; stream: string; class_level: string; has_lab: boolean }
  stream: StreamType
}) {
  const theme = getStreamTheme(stream)
  return (
    <Link href={`/subjects/${subjectHrefKey(subject.id)}`} id={`calling-card-${subject.id}`}
      className={`calling-card ${theme.cardHover} group`}>
      <div className="flex items-start justify-between">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
          style={{ background: theme.iconBg }}>
          {subject.has_lab
            ? <FlaskConical className="w-5 h-5" style={{ color: theme.iconColor }} />
            : <BookOpen     className="w-5 h-5" style={{ color: theme.iconColor }} />}
        </div>
        <span className={theme.pill}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: theme.iconColor }} />
          {subject.stream}
        </span>
      </div>
      <div>
        <h3 className="text-base font-bold text-[#111827] leading-tight mb-1" style={{ fontFamily: 'var(--font-display)' }}>
          {subject.name}
        </h3>
        <p className="text-xs text-slate-500">
          {subject.class_level} · {subject.code}
          {subject.has_lab && (
            <span className="ml-2 inline-flex items-center gap-0.5 text-emerald-700 font-medium">
              <FlaskConical className="w-3 h-3" /> Lab
            </span>
          )}
        </p>
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <div className="flex items-center gap-1 text-xs text-slate-400">
          <Check className="w-3.5 h-3.5 text-emerald-600" /><span>Verified</span>
        </div>
        <span className="flex items-center gap-1 text-xs font-semibold group-hover:underline" style={{ color: theme.iconColor }}>
          Open Card <ChevronRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </Link>
  )
}

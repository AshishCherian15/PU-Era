'use client'

import Link from 'next/link'
import { useState, useMemo } from 'react'
import {
  BookOpen, FlaskConical, Search, ChevronRight,
  Check, Globe, FileText
} from 'lucide-react'
import type { Subject } from '@/lib/content/taxonomy'
import { subjectHrefKey } from '@/lib/subject-keys'

type ClassFilter  = 'all' | 'PUC1' | 'PUC2' | 'NCERT11' | 'NCERT12'
type StreamFilter = 'all' | 'Science' | 'Commerce' | 'Arts'

interface Props {
  puc1Subjects:   Subject[]
  puc2Subjects:   Subject[]
  ncert11Subjects: Subject[]
  ncert12Subjects: Subject[]
}

function getStreamTheme(stream: string) {
  switch (stream) {
    case 'Science':  return { pill: 'stream-pill science',  hoverClass: 'science',  iconBg: '#D1FAE5', iconColor: '#065F46', dotBg: '#16a34a' }
    case 'Commerce': return { pill: 'stream-pill commerce', hoverClass: 'commerce', iconBg: '#E0F2FE', iconColor: '#0C4A6E', dotBg: '#0EA5E9' }
    case 'Arts':     return { pill: 'stream-pill arts',     hoverClass: 'arts',     iconBg: '#FEF3C7', iconColor: '#78350F', dotBg: '#F59E0B' }
    default:         return { pill: 'stream-pill general',  hoverClass: '',         iconBg: '#F1F5F9', iconColor: '#475569', dotBg: '#94A3B8' }
  }
}

export default function SubjectsList({ puc1Subjects, puc2Subjects, ncert11Subjects, ncert12Subjects }: Props) {
  const [search,       setSearch]       = useState('')
  const [classFilter,  setClassFilter]  = useState<ClassFilter>('all')
  const [streamFilter, setStreamFilter] = useState<StreamFilter>('all')

  const allSubjects = useMemo(() => [
    ...puc1Subjects, ...puc2Subjects, ...ncert11Subjects, ...ncert12Subjects,
  ], [puc1Subjects, puc2Subjects, ncert11Subjects, ncert12Subjects])

  const filtered = useMemo(() =>
    allSubjects.filter((s) => {
      const q = search.toLowerCase()
      const nameMatch = s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q)
      const classMatch  = classFilter  === 'all' || s.class_level === classFilter
      const streamMatch = streamFilter === 'all' || s.stream      === streamFilter
      return nameMatch && classMatch && streamMatch
    }),
    [allSubjects, search, classFilter, streamFilter]
  )

  const sections = useMemo(() => {
    if (classFilter !== 'all') {
      return [{ key: classFilter, label: classLabel(classFilter), items: filtered }]
    }
    return [
      { key: 'PUC2',    label: 'Karnataka 2nd PUC',   items: filtered.filter(s => s.class_level === 'PUC2')   },
      { key: 'PUC1',    label: 'Karnataka 1st PUC',   items: filtered.filter(s => s.class_level === 'PUC1')   },
      { key: 'NCERT12', label: 'NCERT Class 12',      items: filtered.filter(s => s.class_level === 'NCERT12') },
      { key: 'NCERT11', label: 'NCERT Class 11',      items: filtered.filter(s => s.class_level === 'NCERT11') },
    ].filter(s => s.items.length > 0)
  }, [filtered, classFilter])

  return (
    <div>
      {/* ── Search & Filters ── */}
      <div className="mb-10 space-y-4">

        {/* Search */}
        <div className="search-bar max-w-xl">
          <Search className="w-4.5 h-4.5 text-slate-400 flex-shrink-0" />
          <input
            id="subjects-search"
            type="text"
            placeholder="Search subjects, e.g. Physics, Accountancy..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Class Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {(
            [
              { id: 'all',     label: 'All Classes' },
              { id: 'PUC2',    label: '2nd PUC'    },
              { id: 'PUC1',    label: '1st PUC'    },
              { id: 'NCERT12', label: 'NCERT 12'   },
              { id: 'NCERT11', label: 'NCERT 11'   },
            ] as { id: ClassFilter; label: string }[]
          ).map((tab) => (
            <button
              key={tab.id}
              id={`class-tab-${tab.id}`}
              onClick={() => setClassFilter(tab.id)}
              className={`seg-btn border border-slate-200 px-4 py-1.5 text-xs ${
                classFilter === tab.id ? 'active !bg-brand-green !text-white !border-transparent' : 'bg-white'
              }`}
              style={classFilter === tab.id ? { background: 'var(--brand-green)', color: 'white', borderColor: 'transparent' } : {}}
            >
              {tab.label}
            </button>
          ))}

          <div className="h-5 w-px bg-slate-200 mx-1 hidden sm:block" />

          {(
            [
              { id: 'all',      label: 'All Streams' },
              { id: 'Science',  label: '🔬 Science'  },
              { id: 'Commerce', label: '📊 Commerce' },
              { id: 'Arts',     label: '🎨 Arts'     },
            ] as { id: StreamFilter; label: string }[]
          ).map((s) => (
            <button
              key={s.id}
              id={`stream-tab-${s.id}`}
              onClick={() => setStreamFilter(s.id)}
              className={`stream-btn ${streamFilter === s.id ? `active ${s.id.toLowerCase()}` : ''}`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Results ── */}
      {sections.length === 0 ? (
        <div className="text-center py-20">
          <BookOpen className="w-12 h-12 mx-auto mb-4 text-slate-300" />
          <p className="font-semibold text-slate-500" style={{ fontFamily: 'var(--font-display)' }}>
            No subjects found
          </p>
          <p className="text-sm text-slate-400 mt-1">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="space-y-14">
          {sections.map((section) => (
            <section key={section.key}>
              {/* Section header */}
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: '#D1FAE5' }}
                >
                  {section.key.startsWith('NCERT')
                    ? <Globe className="w-4 h-4" style={{ color: 'var(--brand-green)' }} />
                    : <BookOpen className="w-4 h-4" style={{ color: 'var(--brand-green)' }} />
                  }
                </div>
                <h2
                  className="text-lg font-bold text-[#111827]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {section.label}
                </h2>
                <span className="text-sm text-slate-400">
                  {section.items.length} subject{section.items.length !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Cards grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {section.items.map((subject) => (
                  <SubjectCard key={subject.id} subject={subject} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}

/* ── Subject Card ── */
function SubjectCard({ subject }: { subject: Subject }) {
  const theme = getStreamTheme(subject.stream)

  return (
    <Link
      href={`/subjects/${subjectHrefKey(subject.id)}`}
      id={`subject-card-${subject.id}`}
      className={`calling-card ${theme.hoverClass} group`}
    >
      {/* Top row */}
      <div className="flex items-start justify-between">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
          style={{ background: theme.iconBg }}
        >
          {subject.has_lab
            ? <FlaskConical className="w-5 h-5" style={{ color: theme.iconColor }} />
            : <BookOpen    className="w-5 h-5" style={{ color: theme.iconColor }} />
          }
        </div>
        <span className={theme.pill}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: theme.dotBg }} />
          {subject.stream}
        </span>
      </div>

      {/* Subject info */}
      <div>
        <h3
          className="text-base font-bold text-[#111827] leading-tight mb-1"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {subject.name}
        </h3>
        <p className="text-xs text-slate-500">
          {subject.class_level} · {subject.code}
          {subject.has_lab && (
            <span className="ml-2 inline-flex items-center gap-0.5 text-emerald-700 font-semibold">
              <FlaskConical className="w-3 h-3" /> Lab
            </span>
          )}
        </p>
      </div>

      {/* Footer row */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <div className="flex items-center gap-1 text-xs text-slate-400">
          <Check className="w-3.5 h-3.5 text-emerald-600" />
          <span>Verified</span>
        </div>
        <span
          className="flex items-center gap-1 text-xs font-semibold group-hover:underline"
          style={{ color: theme.iconColor }}
        >
          Open <ChevronRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </Link>
  )
}

function classLabel(c: ClassFilter): string {
  switch (c) {
    case 'PUC1':    return 'Karnataka 1st PUC'
    case 'PUC2':    return 'Karnataka 2nd PUC'
    case 'NCERT11': return 'NCERT Class 11'
    case 'NCERT12': return 'NCERT Class 12'
    default:        return 'All Classes'
  }
}

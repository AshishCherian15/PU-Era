'use client'

import { useState } from 'react'
import { Plus, ChevronDown, ChevronRight, BookOpen, Layers, Check, Loader2 } from 'lucide-react'

interface Chapter {
  id: string
  number: number
  title: string
  title_kn: string | null
  slug: string
  status: string
}

interface Subject {
  id: string
  slug: string
  name: string
  name_kn: string | null
  class_level: string
  stream: string
  board: string
  has_lab: boolean
  active: boolean
  sort_order: number
  chapters?: Chapter[]
}

export default function SubjectsManager({ initialSubjects }: { initialSubjects: Subject[] }) {
  const [subjects, setSubjects] = useState(initialSubjects)
  const [classFilter, setClassFilter] = useState('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [showAddSubject, setShowAddSubject] = useState(false)
  const [newSub, setNewSub] = useState({
    name: '',
    slug: '',
    class_level: 'puc2',
    stream: 'science',
    board: 'ktbs',
    has_lab: false,
  })
  const [submittingSub, setSubmittingSub] = useState(false)

  // Chapter adding state
  const [activeSubjectForChapter, setActiveSubjectForChapter] = useState<string | null>(null)
  const [newChapNumber, setNewChapNumber] = useState('')
  const [newChapTitle, setNewChapTitle] = useState('')
  const [submittingChap, setSubmittingChap] = useState(false)

  const filtered = subjects.filter(s => {
    if (classFilter !== 'all' && s.class_level !== classFilter) return false
    return true
  })

  async function handleAddSubject(e: React.FormEvent) {
    e.preventDefault()
    setSubmittingSub(true)
    try {
      const slug = newSub.slug || newSub.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      const res = await fetch('/api/admin/subjects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newSub, slug }),
      })
      const data = await res.json()
      if (res.ok && data.ok) {
        setSubjects([...subjects, { ...data.data, chapters: [] }])
        setShowAddSubject(false)
        setNewSub({ name: '', slug: '', class_level: 'puc2', stream: 'science', board: 'ktbs', has_lab: false })
      }
    } finally {
      setSubmittingSub(false)
    }
  }

  async function handleAddChapter(e: React.FormEvent, subjectId: string) {
    e.preventDefault()
    if (!newChapTitle || !newChapNumber) return
    setSubmittingChap(true)
    try {
      const res = await fetch(`/api/admin/subjects/${subjectId}/chapters`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          number: Number(newChapNumber),
          title: newChapTitle.trim(),
        }),
      })
      const data = await res.json()
      if (res.ok && data.ok) {
        setSubjects(prev =>
          prev.map(s => {
            if (s.id === subjectId) {
              const chaps = [...(s.chapters ?? []), data.data].sort((a, b) => a.number - b.number)
              return { ...s, chapters: chaps }
            }
            return s
          })
        )
        setActiveSubjectForChapter(null)
        setNewChapNumber('')
        setNewChapTitle('')
      }
    } finally {
      setSubmittingChap(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Top actions & filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {['all', 'puc1', 'puc2', 'ncert11', 'ncert12'].map(lvl => (
            <button
              key={lvl}
              onClick={() => setClassFilter(lvl)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase transition-colors ${
                classFilter === lvl
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowAddSubject(!showAddSubject)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          {showAddSubject ? 'Cancel' : 'Add Subject'}
        </button>
      </div>

      {/* Add subject form */}
      {showAddSubject && (
        <form onSubmit={handleAddSubject} className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
          <h2 className="text-sm font-bold text-white">Create New Subject</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Subject Name</label>
              <input
                type="text"
                required
                value={newSub.name}
                onChange={e => setNewSub({ ...newSub, name: e.target.value })}
                placeholder="e.g. Physics"
                className="admin-input"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Class Level</label>
              <select
                value={newSub.class_level}
                onChange={e => setNewSub({ ...newSub, class_level: e.target.value })}
                className="admin-input"
              >
                <option value="puc1">1st PUC</option>
                <option value="puc2">2nd PUC</option>
                <option value="ncert11">NCERT Class 11</option>
                <option value="ncert12">NCERT Class 12</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Stream</label>
              <select
                value={newSub.stream}
                onChange={e => setNewSub({ ...newSub, stream: e.target.value })}
                className="admin-input"
              >
                <option value="science">Science</option>
                <option value="commerce">Commerce</option>
                <option value="arts">Arts</option>
                <option value="common">Common / Languages</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Board</label>
              <select
                value={newSub.board}
                onChange={e => setNewSub({ ...newSub, board: e.target.value })}
                className="admin-input"
              >
                <option value="ktbs">KTBS (Karnataka State Board)</option>
                <option value="ncert">NCERT</option>
              </select>
            </div>
            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="has_lab"
                checked={newSub.has_lab}
                onChange={e => setNewSub({ ...newSub, has_lab: e.target.checked })}
                className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-emerald-500"
              />
              <label htmlFor="has_lab" className="text-xs text-slate-300 cursor-pointer">
                Has Practical / Lab Syllabus
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="submit"
              disabled={submittingSub}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5"
            >
              {submittingSub ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              Save Subject
            </button>
          </div>
        </form>
      )}

      {/* Subjects List */}
      <div className="space-y-3">
        {filtered.map(sub => {
          const isExpanded = expandedId === sub.id
          const chapCount = sub.chapters?.length ?? 0

          return (
            <div key={sub.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              <div
                onClick={() => setExpandedId(isExpanded ? null : sub.id)}
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-850 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-emerald-400">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm flex items-center gap-2">
                      {sub.name}
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-normal uppercase">
                        {sub.class_level} • {sub.stream}
                      </span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {chapCount} chapter{chapCount === 1 ? '' : 's'} • {sub.board.toUpperCase()}
                      {sub.has_lab && ' • Lab Included'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={e => {
                      e.stopPropagation()
                      setExpandedId(sub.id)
                      setActiveSubjectForChapter(sub.id)
                    }}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded font-medium flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Chapter
                  </button>
                  {isExpanded ? <ChevronDown className="w-4 h-4 text-slate-500" /> : <ChevronRight className="w-4 h-4 text-slate-500" />}
                </div>
              </div>

              {/* Expanded chapters */}
              {isExpanded && (
                <div className="border-t border-slate-800 p-4 bg-slate-950/40 space-y-3">
                  {/* Add chapter inline form */}
                  {activeSubjectForChapter === sub.id && (
                    <form
                      onSubmit={e => handleAddChapter(e, sub.id)}
                      className="p-3 bg-slate-800/60 rounded-lg flex flex-col sm:flex-row items-center gap-3"
                    >
                      <input
                        type="number"
                        required
                        value={newChapNumber}
                        onChange={e => setNewChapNumber(e.target.value)}
                        placeholder="Ch #"
                        className="admin-input sm:w-20"
                      />
                      <input
                        type="text"
                        required
                        value={newChapTitle}
                        onChange={e => setNewChapTitle(e.target.value)}
                        placeholder="Chapter Title (e.g. Electric Charges and Fields)"
                        className="admin-input flex-1"
                      />
                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <button
                          type="button"
                          onClick={() => setActiveSubjectForChapter(null)}
                          className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={submittingChap}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded"
                        >
                          {submittingChap ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Add'}
                        </button>
                      </div>
                    </form>
                  )}

                  {chapCount === 0 ? (
                    <p className="text-xs text-slate-500 py-2 italic text-center">
                      No chapters defined yet for this subject.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {sub.chapters!.map(ch => (
                        <div
                          key={ch.id}
                          className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded bg-slate-800 text-emerald-400 font-bold flex items-center justify-center text-[10px]">
                              {ch.number}
                            </span>
                            <span className="text-slate-200 font-medium">{ch.title}</span>
                          </div>
                          <span className="text-[10px] text-slate-500 uppercase">{ch.status}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

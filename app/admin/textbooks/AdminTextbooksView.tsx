'use client'

import { useState } from 'react'
import { Plus, ExternalLink, Loader2, Check } from 'lucide-react'

interface TextbookItem {
  id: string
  board: string
  class_level: string
  subject_name: string
  medium: string
  official_url: string
  source_label: string
  is_active: boolean
  last_checked: string | null
}

export default function AdminTextbooksView({ initialTextbooks }: { initialTextbooks: TextbookItem[] }) {
  const [textbooks, setTextbooks] = useState(initialTextbooks)
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({
    board: 'ktbs',
    class_level: 'puc2',
    subject_name: '',
    medium: 'en',
    official_url: '',
    source_label: 'KTBS Official Portal',
  })
  const [submitting, setSubmitting] = useState(false)

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch('/api/admin/textbooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (res.ok && data.ok) {
        setTextbooks([data.data, ...textbooks])
        setShowAdd(false)
        setForm({
          board: 'ktbs',
          class_level: 'puc2',
          subject_name: '',
          medium: 'en',
          official_url: '',
          source_label: 'KTBS Official Portal',
        })
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <span className="text-sm text-slate-400">
          {textbooks.length} official textbook link{textbooks.length === 1 ? '' : 's'} registered
        </span>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          {showAdd ? 'Cancel' : 'Add Textbook Link'}
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
          <h2 className="text-sm font-bold text-white">Add Official Textbook Link</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Subject Name</label>
              <input
                type="text"
                required
                value={form.subject_name}
                onChange={e => setForm({ ...form, subject_name: e.target.value })}
                placeholder="e.g. Mathematics Part 1"
                className="admin-input"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Class Level</label>
              <select
                value={form.class_level}
                onChange={e => setForm({ ...form, class_level: e.target.value })}
                className="admin-input"
              >
                <option value="puc1">1st PUC</option>
                <option value="puc2">2nd PUC</option>
                <option value="ncert11">NCERT Class 11</option>
                <option value="ncert12">NCERT Class 12</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Board</label>
              <select
                value={form.board}
                onChange={e => setForm({ ...form, board: e.target.value, source_label: e.target.value === 'ktbs' ? 'KTBS Portal' : 'NCERT Official' })}
                className="admin-input"
              >
                <option value="ktbs">KTBS (Karnataka State Board)</option>
                <option value="ncert">NCERT</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Medium</label>
              <select
                value={form.medium}
                onChange={e => setForm({ ...form, medium: e.target.value })}
                className="admin-input"
              >
                <option value="en">English Medium</option>
                <option value="kn">Kannada Medium</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-400 mb-1">Official Canonical URL</label>
              <input
                type="url"
                required
                value={form.official_url}
                onChange={e => setForm({ ...form, official_url: e.target.value })}
                placeholder="https://ktbs.kar.nic.in/... or https://ncert.nic.in/..."
                className="admin-input"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5"
            >
              {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              Save Link
            </button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {textbooks.map(tb => (
          <div key={tb.id} className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-white text-sm">{tb.subject_name}</h3>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 uppercase font-medium">
                  {tb.class_level} • {tb.board} • {tb.medium}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 truncate max-w-lg">{tb.official_url}</p>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={tb.official_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded flex items-center gap-1"
              >
                Test Link <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

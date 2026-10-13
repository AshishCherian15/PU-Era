'use client'

import { useState } from 'react'
import { Plus, Send, Loader2, Lightbulb, CheckCircle2, Clock } from 'lucide-react'

interface Suggestion {
  id: string
  title: string
  body: string
  category: string | null
  status: string
  upvotes: number
  admin_reply: string | null
  created_at: string
  user_id: string
}

export default function SuggestionsView({
  userId,
  initialSuggestions,
}: {
  userId: string
  initialSuggestions: Suggestion[]
}) {
  const [suggestions, setSuggestions] = useState(initialSuggestions)
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [category, setCategory] = useState('Study Tools')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (title.trim().length < 5) {
      setError('Title must be at least 5 characters.')
      return
    }
    if (body.trim().length < 20) {
      setError('Please provide at least 20 characters explaining your suggestion.')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const res = await fetch('/api/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          body: body.trim(),
          category,
        }),
      })

      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data.error?.message || 'Failed to submit')

      setSuggestions([data.data, ...suggestions])
      setTitle('')
      setBody('')
      setShowForm(false)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted">
          {suggestions.length} suggestion{suggestions.length === 1 ? '' : 's'} shared
        </span>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary text-sm flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          {showForm ? 'Cancel' : 'Suggest an Idea'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="calling-card p-5 space-y-4 border-primary/30">
          <h2 className="font-semibold text-heading text-sm">Submit New Suggestion</h2>

          {error && (
            <div className="p-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Add chapter-wise past KCET cutoffs / formula audio recaps"
              className="input-field text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="input-field text-sm"
            >
              <option value="Study Tools">Study Tools</option>
              <option value="Notes & Content">Notes & Content</option>
              <option value="Accessibility / UI">Accessibility / UI</option>
              <option value="Kannada Medium">Kannada Medium</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Details <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={body}
              onChange={e => setBody(e.target.value)}
              placeholder="Explain how this would help Karnataka PUC students prepare better..."
              className="input-field text-sm"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="btn-secondary text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary text-xs flex items-center gap-1.5"
            >
              {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              Submit Idea
            </button>
          </div>
        </form>
      )}

      {suggestions.length === 0 ? (
        <div className="calling-card text-center py-12">
          <Lightbulb className="w-10 h-10 text-muted mx-auto mb-2" />
          <p className="font-semibold text-heading text-sm">No suggestions yet</p>
          <p className="text-muted text-xs">Be the first student to suggest a new feature or improvement.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {suggestions.map(s => (
            <div key={s.id} className="calling-card p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">
                      {s.category || 'General'}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      s.status === 'implemented'
                        ? 'bg-emerald-100 text-emerald-800'
                        : s.status === 'planned'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {s.status.replace(/_/g, ' ')}
                    </span>
                    {s.user_id === userId && (
                      <span className="text-[11px] text-muted">(Submitted by you)</span>
                    )}
                  </div>
                  <h3 className="text-base font-semibold text-heading">{s.title}</h3>
                </div>
              </div>

              <p className="text-sm text-body mt-2 leading-relaxed">{s.body}</p>

              {s.admin_reply && (
                <div className="mt-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-green mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Team PU Era Response
                  </div>
                  <p className="text-xs text-slate-700">{s.admin_reply}</p>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-muted mt-3 pt-3 border-t border-slate-100">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(s.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

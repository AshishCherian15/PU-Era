'use client'

import { useState } from 'react'
import { Star, ExternalLink } from 'lucide-react'

interface AdminFeedbackItem {
  id: string
  type: string
  rating: number | null
  message: string
  page_url: string | null
  status: string
  created_at: string
  profiles?: { full_name: string; email: string } | null
}

export default function AdminFeedbackTable({ initialFeedback }: { initialFeedback: AdminFeedbackItem[] }) {
  const [feedback, setFeedback] = useState(initialFeedback)
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  const filtered = feedback.filter(item => {
    if (statusFilter !== 'all' && item.status !== statusFilter) return false
    if (typeFilter !== 'all' && item.type !== typeFilter) return false
    return true
  })

  async function updateStatus(id: string, status: string) {
    const res = await fetch(`/api/admin/feedback/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    const data = await res.json()
    if (res.ok && data.ok) {
      setFeedback(prev => prev.map(f => f.id === id ? { ...f, status } : f))
    }
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="space-y-3">
        <div className="flex gap-2 flex-wrap">
          {['all', 'new', 'acknowledged', 'investigating', 'resolved', 'closed'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                statusFilter === s
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <div>
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="admin-input w-56 text-xs"
          >
            <option value="all">All Types</option>
            <option value="broken_link">Broken Drive Link</option>
            <option value="content_error">Content / Formula Error</option>
            <option value="wrong_chapter">Wrong Chapter</option>
            <option value="general">General</option>
            <option value="suggestion">Suggestion</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="p-8 text-center text-slate-500 bg-slate-900 border border-slate-800 rounded-xl text-sm">
          No feedback entries match your filters.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(item => (
            <div key={item.id} className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                    item.type === 'broken_link'
                      ? 'bg-red-950 text-red-400 border border-red-800'
                      : item.type === 'content_error'
                      ? 'bg-amber-950 text-amber-400 border border-amber-800'
                      : 'bg-slate-800 text-slate-300'
                  }`}>
                    {item.type.replace(/_/g, ' ')}
                  </span>

                  {item.rating && (
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: item.rating }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                  )}

                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                    item.status === 'resolved'
                      ? 'bg-emerald-950 text-emerald-400'
                      : item.status === 'closed'
                      ? 'bg-slate-800 text-slate-400'
                      : 'bg-blue-950 text-blue-400'
                  }`}>
                    {item.status}
                  </span>
                </div>

                <span className="text-xs text-slate-500">
                  {new Date(item.created_at).toLocaleDateString('en-IN', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>

              <p className="text-sm text-slate-200 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-850">
                {item.message}
              </p>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400">
                <div className="flex items-center gap-3">
                  <span>User: {item.profiles?.full_name ?? 'Anonymous'}</span>
                  {item.page_url && (
                    <a
                      href={item.page_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 hover:underline inline-flex items-center gap-1"
                    >
                      Reported page <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Status:</span>
                  <select
                    value={item.status}
                    onChange={e => updateStatus(item.id, e.target.value)}
                    className="bg-slate-800 text-slate-200 text-xs px-2 py-1 rounded border border-slate-700 outline-none"
                  >
                    <option value="new">New</option>
                    <option value="acknowledged">Acknowledged</option>
                    <option value="investigating">Investigating</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

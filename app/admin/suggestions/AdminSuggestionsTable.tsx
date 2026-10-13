'use client'

import { useState } from 'react'
import { Send, Loader2 } from 'lucide-react'

interface AdminSuggestionItem {
  id: string
  title: string
  body: string
  category: string | null
  status: string
  upvotes: number
  admin_reply: string | null
  created_at: string
  profiles?: { full_name: string; email: string } | null
}

export default function AdminSuggestionsTable({ initialSuggestions }: { initialSuggestions: AdminSuggestionItem[] }) {
  const [suggestions, setSuggestions] = useState(initialSuggestions)
  const [statusFilter, setStatusFilter] = useState('all')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [savingId, setSavingId] = useState<string | null>(null)

  const filtered = suggestions.filter(s => {
    if (statusFilter !== 'all' && s.status !== statusFilter) return false
    return true
  })

  async function updateStatus(id: string, newStatus: string, reply?: string) {
    setSavingId(id)
    try {
      const res = await fetch(`/api/admin/suggestions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          ...(reply !== undefined ? { admin_reply: reply } : {}),
        }),
      })
      const data = await res.json()
      if (res.ok && data.ok) {
        setSuggestions(prev => prev.map(s => s.id === id ? { ...s, ...data.data } : s))
        setEditingId(null)
        setReplyText('')
      }
    } finally {
      setSavingId(null)
    }
  }

  return (
    <div className="space-y-4">
      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'new', 'reviewing', 'planned', 'in_progress', 'implemented', 'declined'].map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
              statusFilter === s
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {s.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="p-8 text-center text-slate-500 bg-slate-900 border border-slate-800 rounded-xl text-sm">
          No suggestions found.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(item => {
            const isEditing = editingId === item.id
            const isSaving = savingId === item.id

            return (
              <div key={item.id} className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium">
                      {item.category || 'General'}
                    </span>
                    <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                      item.status === 'implemented'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : item.status === 'planned'
                        ? 'bg-blue-950 text-blue-400 border border-blue-800'
                        : item.status === 'declined'
                        ? 'bg-red-950 text-red-400 border border-red-800'
                        : 'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}>
                      {item.status.replace(/_/g, ' ')}
                    </span>
                    <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                  </div>

                  <span className="text-xs text-slate-500">
                    {new Date(item.created_at).toLocaleDateString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-850">
                  {item.body}
                </p>

                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>From: {item.profiles?.full_name ?? 'Anonymous'}</span>

                  <div className="flex items-center gap-2">
                    <select
                      value={item.status}
                      disabled={isSaving}
                      onChange={e => updateStatus(item.id, e.target.value)}
                      className="bg-slate-800 text-slate-200 text-xs px-2 py-1 rounded border border-slate-700 outline-none"
                    >
                      <option value="new">New</option>
                      <option value="reviewing">Reviewing</option>
                      <option value="planned">Planned</option>
                      <option value="in_progress">In Progress</option>
                      <option value="implemented">Implemented</option>
                      <option value="declined">Declined</option>
                    </select>

                    <button
                      onClick={() => {
                        setEditingId(isEditing ? null : item.id)
                        setReplyText(item.admin_reply ?? '')
                      }}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs"
                    >
                      {item.admin_reply ? 'Edit Reply' : 'Reply'}
                    </button>
                  </div>
                </div>

                {item.admin_reply && !isEditing && (
                  <div className="text-xs text-emerald-300 bg-emerald-950/40 p-2.5 rounded border border-emerald-900/50">
                    <span className="font-semibold">Team Response:</span> {item.admin_reply}
                  </div>
                )}

                {isEditing && (
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
                    <textarea
                      rows={2}
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      placeholder="Public response to this suggestion..."
                      className="admin-input text-xs"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-3 py-1 text-xs text-slate-400 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => updateStatus(item.id, item.status, replyText)}
                        disabled={isSaving}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs rounded font-medium flex items-center gap-1"
                      >
                        {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                        Save Reply
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

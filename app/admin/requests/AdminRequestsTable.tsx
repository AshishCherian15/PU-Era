'use client'

import { useState } from 'react'
import { CheckCircle2, Clock, XCircle, Loader2, Send } from 'lucide-react'

interface AdminRequestItem {
  id: string
  description: string
  resource_type: string | null
  status: string
  priority: string | null
  admin_reply: string | null
  internal_note: string | null
  created_at: string
  profiles?: { full_name: string; email: string } | null
  subjects?: { name: string } | null
  chapters?: { title: string; number: number } | null
}

export default function AdminRequestsTable({ initialRequests }: { initialRequests: AdminRequestItem[] }) {
  const [requests, setRequests] = useState(initialRequests)
  const [statusFilter, setStatusFilter] = useState('all')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [savingStatus, setSavingStatus] = useState<string | null>(null)

  const filtered = requests.filter(r => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false
    return true
  })

  async function updateStatus(id: string, newStatus: string, reply?: string) {
    setSavingStatus(id)
    try {
      const res = await fetch(`/api/admin/requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          ...(reply ? { admin_reply: reply } : {}),
        }),
      })
      const data = await res.json()
      if (res.ok && data.ok) {
        setRequests(prev => prev.map(r => r.id === id ? { ...r, ...data.data } : r))
        setEditingId(null)
        setReplyText('')
      }
    } finally {
      setSavingStatus(null)
    }
  }

  return (
    <div className="space-y-4">
      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'submitted', 'in_review', 'in_progress', 'completed', 'declined'].map(s => (
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
          No requests in this category.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(req => {
            const isEditing = editingId === req.id
            const isSaving = savingStatus === req.id

            return (
              <div key={req.id} className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                      req.status === 'completed'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : req.status === 'in_progress'
                        ? 'bg-purple-950 text-purple-400 border border-purple-800'
                        : req.status === 'declined'
                        ? 'bg-red-950 text-red-400 border border-red-800'
                        : 'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}>
                      {req.status.replace(/_/g, ' ')}
                    </span>
                    {req.subjects && (
                      <span className="text-xs text-slate-300 font-semibold">
                        {req.subjects.name}
                        {req.chapters && ` (Ch ${req.chapters.number})`}
                      </span>
                    )}
                    <span className="text-xs text-slate-500 capitalize">
                      • {req.resource_type?.replace(/_/g, ' ') || 'Any material'}
                    </span>
                  </div>

                  <span className="text-xs text-slate-500">
                    {new Date(req.created_at).toLocaleDateString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                <p className="text-sm text-slate-200 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-850">
                  {req.description}
                </p>

                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Student: {req.profiles?.full_name ?? 'Anonymous'} ({req.profiles?.email ?? 'No email'})</span>

                  <div className="flex items-center gap-2">
                    <select
                      value={req.status}
                      disabled={isSaving}
                      onChange={e => updateStatus(req.id, e.target.value)}
                      className="bg-slate-800 text-slate-200 text-xs px-2 py-1 rounded border border-slate-700 outline-none"
                    >
                      <option value="submitted">Submitted</option>
                      <option value="in_review">In Review</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="declined">Declined</option>
                    </select>

                    <button
                      onClick={() => {
                        setEditingId(isEditing ? null : req.id)
                        setReplyText(req.admin_reply ?? '')
                      }}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs"
                    >
                      {req.admin_reply ? 'Edit Reply' : 'Reply'}
                    </button>
                  </div>
                </div>

                {req.admin_reply && !isEditing && (
                  <div className="text-xs text-emerald-300 bg-emerald-950/40 p-2.5 rounded border border-emerald-900/50">
                    <span className="font-semibold">Admin Response:</span> {req.admin_reply}
                  </div>
                )}

                {isEditing && (
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
                    <textarea
                      rows={2}
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      placeholder="Type a response to the student..."
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
                        onClick={() => updateStatus(req.id, req.status, replyText)}
                        disabled={isSaving}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs rounded font-medium flex items-center gap-1"
                      >
                        {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                        Send Reply
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

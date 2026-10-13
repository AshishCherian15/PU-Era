'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Send, Loader2 } from 'lucide-react'

export default function AddAnnouncementForm() {
  const router = useRouter()
  const [form, setForm] = useState({
    title: '',
    body: '',
    display_style: 'banner',
    priority: 'normal',
    popup_policy: 'once',
    action_label: '',
    action_url: '',
    status: 'active',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          action_label: form.action_label || null,
          action_url: form.action_url || null,
        }),
      })

      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data.error?.message || 'Failed to publish announcement')

      router.push('/admin/announcements')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 text-xs text-red-400 bg-red-950/50 border border-red-800 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1">
          Title <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          required
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
          placeholder="e.g. Karnataka 2nd PUC 2027 Final Exam Timetable Released"
          className="admin-input"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Display Style</label>
          <select
            value={form.display_style}
            onChange={e => setForm({ ...form, display_style: e.target.value })}
            className="admin-input"
          >
            <option value="banner">Top Banner</option>
            <option value="popup">Modal Popup</option>
            <option value="both">Both Banner &amp; Popup</option>
            <option value="page_only">Page Only</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Priority</label>
          <select
            value={form.priority}
            onChange={e => setForm({ ...form, priority: e.target.value })}
            className="admin-input"
          >
            <option value="normal">Normal</option>
            <option value="important">Important (Amber)</option>
            <option value="urgent">Urgent (Red Alert)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Status</label>
          <select
            value={form.status}
            onChange={e => setForm({ ...form, status: e.target.value })}
            className="admin-input"
          >
            <option value="active">Active (Live Immediately)</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1">
          Body Text <span className="text-red-400">*</span>
        </label>
        <textarea
          required
          rows={4}
          value={form.body}
          onChange={e => setForm({ ...form, body: e.target.value })}
          placeholder="Detailed announcement copy..."
          className="admin-input resize-y"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Action Button Label (optional)</label>
          <input
            type="text"
            value={form.action_label}
            onChange={e => setForm({ ...form, action_label: e.target.value })}
            placeholder="e.g. View Timetable PDF"
            className="admin-input"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Action URL (optional)</label>
          <input
            type="url"
            value={form.action_url}
            onChange={e => setForm({ ...form, action_url: e.target.value })}
            placeholder="https://..."
            className="admin-input"
          />
        </div>
      </div>

      <div className="pt-3 flex justify-end gap-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 bg-slate-800 text-slate-300 text-xs rounded hover:bg-slate-700"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded flex items-center gap-1.5"
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
          Publish Announcement
        </button>
      </div>
    </form>
  )
}

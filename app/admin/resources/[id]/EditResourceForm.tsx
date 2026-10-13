'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { parseDriveLink, isDriveUrl } from '@/lib/drive'
import { Save, Loader2, CheckCircle2, Trash2 } from 'lucide-react'

export default function EditResourceForm({ resource }: { resource: any }) {
  const router = useRouter()
  const [form, setForm] = useState({
    title: resource.title || '',
    description: resource.description || '',
    type: resource.type || 'chapter_notes',
    medium: resource.medium || 'en',
    external_url: resource.external_url || '',
    allow_view: resource.allow_view ?? true,
    allow_download: resource.allow_download ?? false,
    status: resource.status || 'draft',
    academic_year: resource.academic_year || '',
  })
  const [drivePreview, setDrivePreview] = useState(
    resource.external_url && isDriveUrl(resource.external_url)
      ? parseDriveLink(resource.external_url)
      : null
  )
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  function handleUrlChange(url: string) {
    setForm(f => ({ ...f, external_url: url }))
    if (isDriveUrl(url)) {
      setDrivePreview(parseDriveLink(url))
    } else {
      setDrivePreview(null)
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      const res = await fetch(`/api/admin/resources/${resource.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data.error?.message || 'Failed to update resource')

      router.push('/admin/resources')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this resource? It will be archived and hidden from public search.')) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/resources/${resource.id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        router.push('/admin/resources')
        router.refresh()
      }
    } finally {
      setDeleting(false)
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-4">
      {error && (
        <div className="p-3 text-xs text-red-400 bg-red-950/50 border border-red-800 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1">Title</label>
        <input
          type="text"
          required
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
          className="admin-input"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Status</label>
          <select
            value={form.status}
            onChange={e => setForm({ ...form, status: e.target.value })}
            className="admin-input"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Medium</label>
          <select
            value={form.medium}
            onChange={e => setForm({ ...form, medium: e.target.value })}
            className="admin-input"
          >
            <option value="en">English</option>
            <option value="kn">Kannada</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Academic Year</label>
          <input
            type="text"
            value={form.academic_year}
            onChange={e => setForm({ ...form, academic_year: e.target.value })}
            placeholder="2026-27"
            className="admin-input"
          />
        </div>
      </div>

      {/* Google Drive Link input */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1">
          Google Drive Share Link
        </label>
        <input
          type="url"
          value={form.external_url}
          onChange={e => handleUrlChange(e.target.value)}
          placeholder="https://drive.google.com/file/d/..."
          className="admin-input"
        />
        {drivePreview && (
          <div className="mt-2 p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>
              Valid Drive link detected (File ID: <code className="font-mono">{drivePreview.fileId}</code>).
            </span>
          </div>
        )}
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1">Description (Max 400 chars)</label>
        <textarea
          rows={3}
          maxLength={400}
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
          className="admin-input resize-y text-xs"
        />
      </div>

      <div className="flex items-center gap-6 pt-2">
        <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
          <input
            type="checkbox"
            checked={form.allow_view}
            onChange={e => setForm({ ...form, allow_view: e.target.checked })}
            className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-emerald-500"
          />
          Allow Inline Viewing (Drive embed)
        </label>
        <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
          <input
            type="checkbox"
            checked={form.allow_download}
            onChange={e => setForm({ ...form, allow_download: e.target.checked })}
            className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-emerald-500"
          />
          Allow Direct Download
        </label>
      </div>

      <div className="pt-4 flex items-center justify-between border-t border-slate-800">
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="px-3 py-2 bg-red-950/60 hover:bg-red-900 border border-red-800 text-red-300 text-xs rounded-lg flex items-center gap-1.5"
        >
          {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
          Archive Resource
        </button>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 bg-slate-800 text-slate-300 text-xs rounded hover:bg-slate-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded flex items-center gap-1.5"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            Save Changes
          </button>
        </div>
      </div>
    </form>
  )
}

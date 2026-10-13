'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { parseDriveLink, isDriveUrl } from '@/lib/drive'
import { AlertCircle, CheckCircle2, ExternalLink } from 'lucide-react'

const RESOURCE_TYPES = [
  'chapter_notes', 'short_notes', 'summary', 'important_qa',
  'formula_sheet', 'revision_pdf', 'project_guide', 'worked_examples',
  'lab_guide', 'lab_video',
]

const LICENCE_OPTIONS = [
  { value: 'own', label: 'Own original content (CC BY 4.0)' },
  { value: 'ncert_econtent', label: 'NCERT e-Content (official link)' },
  { value: 'ktbs_permission', label: 'KTBS (official link)' },
  { value: 'cc_by', label: 'Creative Commons Attribution' },
  { value: 'govt', label: 'Government publication' },
  { value: 'written_permission', label: 'Written permission obtained' },
]

interface Subject { id: string; name: string; class_level: string; stream: string }
interface Chapter { id: string; title: string; number: number }

interface Props {
  subjects: Subject[]
}

export function AddResourceForm({ subjects }: Props) {
  const router = useRouter()
  const [form, setForm] = useState({
    title: '',
    description: '',
    type: 'chapter_notes',
    subject_id: '',
    chapter_id: '',
    medium: 'en',
    source_type: 'own',
    licence: 'own',
    permission_ref: '',
    external_url: '',
    allow_view: true,
    allow_download: false,
    status: 'draft',
    academic_year: '',
  })
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [drivePreview, setDrivePreview] = useState<ReturnType<typeof parseDriveLink>>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [globalError, setGlobalError] = useState('')
  const [loading, setLoading] = useState(false)

  async function loadChapters(subjectId: string) {
    if (!subjectId) { setChapters([]); return }
    const res = await fetch(`/api/admin/subjects/${subjectId}/chapters`)
    if (res.ok) {
      const data = await res.json()
      setChapters(data.data ?? [])
    }
  }

  function handleUrlChange(url: string) {
    setForm(f => ({ ...f, external_url: url }))
    if (isDriveUrl(url)) {
      setDrivePreview(parseDriveLink(url))
    } else {
      setDrivePreview(null)
    }
  }

  function validate() {
    const e: Record<string, string> = {}
    if (!form.title.trim()) e.title = 'Title is required.'
    if (!form.type) e.type = 'Type is required.'
    if (!form.subject_id) e.subject_id = 'Subject is required.'
    if (!form.external_url.trim()) e.external_url = 'A Google Drive link or URL is required.'
    if (!form.licence) e.licence = 'Licence is required.'
    if (form.source_type === 'permissioned' && !form.permission_ref.trim())
      e.permission_ref = 'Permission reference is required for permissioned content.'
    if (form.description && form.description.length > 400) e.description = 'Max 400 characters.'
    return e
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setGlobalError('')
    setLoading(true)

    try {
      const res = await fetch('/api/admin/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          chapter_id: form.chapter_id || null,
          permission_ref: form.permission_ref || null,
          academic_year: form.academic_year || null,
        }),
      })
      const data = await res.json()

      if (!res.ok) {
        setGlobalError(data.error?.message ?? 'Failed to create resource.')
        return
      }

      router.push(`/admin/resources/${data.data.id}`)
    } catch {
      setGlobalError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6" noValidate>
      {/* Title */}
      <Field label="Title *" error={errors.title}>
        <input
          id="res-title"
          value={form.title}
          onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
          className="admin-input"
          placeholder="e.g. Chapter 1 — Electric Charges and Fields — Notes"
        />
      </Field>

      {/* Description */}
      <Field label="Description (max 400 chars)" error={errors.description}>
        <textarea
          id="res-description"
          value={form.description}
          onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          className="admin-input min-h-[80px] resize-y"
          placeholder="Brief summary of what this resource covers…"
          maxLength={400}
        />
        <p className="text-xs text-slate-500 text-right mt-1">{form.description.length}/400</p>
      </Field>

      <div className="grid grid-cols-2 gap-4">
        {/* Type */}
        <Field label="Resource type *" error={errors.type}>
          <select
            value={form.type}
            onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
            className="admin-input"
          >
            {RESOURCE_TYPES.map(t => (
              <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>
            ))}
          </select>
        </Field>

        {/* Medium */}
        <Field label="Medium">
          <select
            value={form.medium}
            onChange={e => setForm(f => ({ ...f, medium: e.target.value }))}
            className="admin-input"
          >
            <option value="en">English</option>
            <option value="kn">Kannada</option>
          </select>
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Subject */}
        <Field label="Subject *" error={errors.subject_id}>
          <select
            value={form.subject_id}
            onChange={e => {
              setForm(f => ({ ...f, subject_id: e.target.value, chapter_id: '' }))
              loadChapters(e.target.value)
            }}
            className="admin-input"
          >
            <option value="">Select subject…</option>
            {subjects.map(s => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.class_level.toUpperCase()} / {s.stream})
              </option>
            ))}
          </select>
        </Field>

        {/* Chapter */}
        <Field label="Chapter (optional)">
          <select
            value={form.chapter_id}
            onChange={e => setForm(f => ({ ...f, chapter_id: e.target.value }))}
            className="admin-input"
            disabled={chapters.length === 0}
          >
            <option value="">No specific chapter</option>
            {chapters.map(c => (
              <option key={c.id} value={c.id}>Ch {c.number}. {c.title}</option>
            ))}
          </select>
        </Field>
      </div>

      {/* Google Drive / URL */}
      <Field label="Google Drive link or URL *" error={errors.external_url}>
        <input
          id="res-url"
          type="url"
          value={form.external_url}
          onChange={e => handleUrlChange(e.target.value)}
          className="admin-input"
          placeholder="https://drive.google.com/file/d/…/view?usp=sharing"
        />
        {/* Drive link validation feedback */}
        {form.external_url && (
          <div className="mt-2">
            {drivePreview ? (
              <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-900/20 px-3 py-1.5 rounded-lg border border-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5" />
                ✓ Google Drive file detected. File ID: <code className="font-mono">{drivePreview.fileId}</code>
                <a href={drivePreview.viewUrl} target="_blank" rel="noopener noreferrer" className="ml-1 hover:underline">
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ) : isDriveUrl(form.external_url) ? (
              <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-900/20 px-3 py-1.5 rounded-lg border border-amber-800">
                <AlertCircle className="w-3.5 h-3.5" />
                Drive URL detected but could not extract file ID. Check the link format.
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-800 px-3 py-1.5 rounded-lg">
                ℹ External URL (non-Drive). Will open in a new tab.
              </div>
            )}
          </div>
        )}
        <p className="text-xs text-slate-500 mt-1">
          Paste the "Anyone with the link can view" share URL from Google Drive.
        </p>
      </Field>

      {/* Source / Licence */}
      <div className="grid grid-cols-2 gap-4">
        <Field label="Source type *">
          <select
            value={form.source_type}
            onChange={e => setForm(f => ({ ...f, source_type: e.target.value }))}
            className="admin-input"
          >
            <option value="own">Own / Original content</option>
            <option value="external_link">External link (official)</option>
            <option value="permissioned">Third-party with permission</option>
          </select>
        </Field>

        <Field label="Licence *" error={errors.licence}>
          <select
            value={form.licence}
            onChange={e => setForm(f => ({ ...f, licence: e.target.value }))}
            className="admin-input"
          >
            {LICENCE_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </Field>
      </div>

      {/* Permission ref — only for permissioned */}
      {form.source_type === 'permissioned' && (
        <Field label="Permission reference / proof *" error={errors.permission_ref}>
          <input
            value={form.permission_ref}
            onChange={e => setForm(f => ({ ...f, permission_ref: e.target.value }))}
            className="admin-input"
            placeholder="e.g. Email from publisher on 12 Oct 2026, stored in /legal/permissions/"
          />
        </Field>
      )}

      {/* Access toggles */}
      <div className="grid grid-cols-3 gap-4 p-4 bg-slate-800 rounded-xl border border-slate-700">
        <Toggle
          label="Allow view / preview"
          checked={form.allow_view}
          onChange={v => setForm(f => ({ ...f, allow_view: v }))}
        />
        <Toggle
          label="Allow download"
          checked={form.allow_download}
          onChange={v => setForm(f => ({ ...f, allow_download: v }))}
          disabled={form.source_type === 'external_link'}
          hint={form.source_type === 'external_link' ? 'Cannot enable download for external links' : undefined}
        />
        <div>
          <label className="block text-xs text-slate-400 mb-1">Status</label>
          <select
            value={form.status}
            onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
            className="admin-input text-xs"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="scheduled">Scheduled</option>
          </select>
        </div>
      </div>

      {/* Academic year */}
      <Field label="Academic year (optional)">
        <input
          value={form.academic_year}
          onChange={e => setForm(f => ({ ...f, academic_year: e.target.value }))}
          className="admin-input"
          placeholder="e.g. 2025-26"
          maxLength={10}
        />
      </Field>

      {globalError && (
        <div className="flex items-center gap-2 text-sm text-red-400 bg-red-900/20 px-3 py-2 rounded-lg border border-red-800">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {globalError}
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg transition-colors disabled:opacity-60"
        >
          {loading ? 'Creating…' : 'Create resource'}
        </button>
        <Link href="/admin/resources" className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-lg transition-colors">
          Cancel
        </Link>
      </div>
    </form>
  )
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
      {children}
      {error && (
        <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />{error}
        </p>
      )}
    </div>
  )
}

function Toggle({ label, checked, onChange, disabled, hint }: {
  label: string; checked: boolean; onChange: (v: boolean) => void; disabled?: boolean; hint?: string
}) {
  return (
    <div>
      <label className="block text-xs text-slate-400 mb-1">{label}</label>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? 'bg-emerald-600' : 'bg-slate-600'
        } ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
      {hint && <p className="text-xs text-slate-600 mt-1">{hint}</p>}
    </div>
  )
}

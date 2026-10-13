'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Send, Loader2 } from 'lucide-react'

interface Subject {
  id: string
  name: string
  class_level: string
  stream: string
}

const RESOURCE_TYPES = [
  { value: 'chapter_notes', label: 'Chapter Notes' },
  { value: 'short_notes', label: 'Short Notes / Revision' },
  { value: 'formula_sheet', label: 'Formula Sheet' },
  { value: 'important_qa', label: 'Important Q&A' },
  { value: 'summary', label: 'Chapter Summary' },
  { value: 'worked_examples', label: 'Worked Examples' },
  { value: 'project_guide', label: 'Project Guide' },
  { value: 'lab_guide', label: 'Lab Guide' },
]

export default function RequestForm({ subjects }: { subjects: Subject[] }) {
  const router = useRouter()
  const [subjectId, setSubjectId] = useState('')
  const [resourceType, setResourceType] = useState('chapter_notes')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (description.trim().length < 20) {
      setError('Please provide at least 20 characters explaining what you need.')
      return
    }
    if (description.trim().length > 500) {
      setError('Description cannot exceed 500 characters.')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject_id: subjectId || null,
          resource_type: resourceType,
          description: description.trim(),
        }),
      })

      const data = await res.json()
      if (!res.ok || !data.ok) {
        throw new Error(data.error?.message || 'Failed to submit request')
      }

      router.push('/student/requests')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-heading mb-1.5">
          Subject (optional)
        </label>
        <select
          value={subjectId}
          onChange={e => setSubjectId(e.target.value)}
          className="input-field"
        >
          <option value="">-- General / Any Subject --</option>
          {subjects.map(s => (
            <option key={s.id} value={s.id}>
              {s.name} ({s.class_level.toUpperCase()} • {s.stream})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-heading mb-1.5">
          Resource Type
        </label>
        <select
          value={resourceType}
          onChange={e => setResourceType(e.target.value)}
          className="input-field"
        >
          {RESOURCE_TYPES.map(rt => (
            <option key={rt.value} value={rt.value}>{rt.label}</option>
          ))}
        </select>
      </div>

      <div>
        <div className="flex justify-between items-center mb-1.5">
          <label className="block text-sm font-medium text-heading">
            What material do you need? <span className="text-red-500">*</span>
          </label>
          <span className={`text-xs ${description.length > 500 ? 'text-red-500' : 'text-muted'}`}>
            {description.length}/500
          </span>
        </div>
        <textarea
          required
          rows={4}
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="e.g. Please upload 2nd PUC Physics Ray Optics formula sheet and derivation steps in English medium..."
          className="input-field resize-y"
        />
        <p className="text-xs text-muted mt-1">
          Minimum 20 characters. Be specific about the chapter, topic, and medium.
        </p>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={submitting || description.trim().length < 20}
          className="btn-primary w-full py-2.5 flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Submit Material Request
            </>
          )}
        </button>
      </div>
    </form>
  )
}

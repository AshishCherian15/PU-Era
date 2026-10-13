'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Save, Loader2, CheckCircle2, Key, Building2, ChevronDown } from 'lucide-react'
import { KARNATAKA_PUC_COLLEGES, searchColleges } from '@/lib/colleges'

interface ProfileData {
  full_name: string
  email: string
  class_level: string | null
  stream: string | null
  medium: string | null
  board_focus: string | null
  college_name?: string | null
  guardian_email?: string | null
  is_minor: boolean
  email_verified: boolean
  created_at: string
}

export default function ProfileForm({
  profile,
  email,
}: {
  profile: ProfileData | null
  email: string
}) {
  const router = useRouter()
  const [fullName, setFullName] = useState(profile?.full_name ?? '')
  const [classLevel, setClassLevel] = useState(profile?.class_level ?? 'puc2')
  const [stream, setStream] = useState(profile?.stream ?? 'science')
  const [medium, setMedium] = useState(profile?.medium ?? 'en')
  const [boardFocus, setBoardFocus] = useState(profile?.board_focus ?? 'ktbs')
  const [collegeName, setCollegeName] = useState(profile?.college_name ?? '')
  const [customCollege, setCustomCollege] = useState('')
  const [guardianEmail, setGuardianEmail] = useState(profile?.guardian_email ?? '')
  const [collegeSearch, setCollegeSearch] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const collegeOptions = collegeSearch ? searchColleges(collegeSearch) : KARNATAKA_PUC_COLLEGES.slice(0, 20)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!fullName.trim()) {
      setError('Full name is required.')
      return
    }

    setSaving(true)
    setError('')
    setSaved(false)

    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fullName.trim(),
          class_level: classLevel,
          stream,
          medium,
          board_focus: boardFocus,
          college_name: collegeName === 'other' ? customCollege : collegeName,
          guardian_email: guardianEmail || null,
        }),
      })

      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data.error?.message || 'Failed to update profile')

      setSaved(true)
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {saved && (
        <div className="p-3 text-sm text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Profile updated successfully!
        </div>
      )}

      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-heading mb-1.5">
          Email Address
        </label>
        <input
          type="email"
          disabled
          value={email}
          className="input-field bg-slate-100 cursor-not-allowed text-slate-500"
        />
        <p className="text-xs text-muted mt-1">
          Email cannot be changed directly for account security.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-heading mb-1.5">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          required
          value={fullName}
          onChange={e => setFullName(e.target.value)}
          className="input-field"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-heading mb-1.5">
            Class Level
          </label>
          <select
            value={classLevel}
            onChange={e => setClassLevel(e.target.value)}
            className="input-field"
          >
            <option value="puc1">1st PUC (Class 11)</option>
            <option value="puc2">2nd PUC (Class 12)</option>
            <option value="ncert11">NCERT Class 11</option>
            <option value="ncert12">NCERT Class 12</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-heading mb-1.5">
            Stream
          </label>
          <select
            value={stream}
            onChange={e => setStream(e.target.value)}
            className="input-field"
          >
            <option value="science">Science (PCMB / PCMC)</option>
            <option value="commerce">Commerce (EBAC / HEBA)</option>
            <option value="arts">Arts / Humanities</option>
            <option value="common">General / Language</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-heading mb-1.5">
            Preferred Medium
          </label>
          <select
            value={medium}
            onChange={e => setMedium(e.target.value)}
            className="input-field"
          >
            <option value="en">English Medium</option>
            <option value="kn">Kannada Medium</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-heading mb-1.5">
            Curriculum Focus
          </label>
          <select
            value={boardFocus}
            onChange={e => setBoardFocus(e.target.value)}
            className="input-field"
          >
            <option value="ktbs">Karnataka State Board (KSEAB/KTBS)</option>
            <option value="ncert">NCERT / National</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-heading mb-1.5">
          College Name
        </label>
        <div className="relative">
          <select
            value={collegeName}
            onChange={e => setCollegeName(e.target.value)}
            className="input-field appearance-none pr-8"
          >
            <option value="">Select your college…</option>
            <option value="other">Other (type below)</option>
            {collegeOptions.slice(0, 20).map(col => (
              <option key={col.id} value={col.name}>{col.name} — {col.city}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
        </div>
        <input
          type="text"
          value={collegeSearch}
          onChange={e => setCollegeSearch(e.target.value)}
          className="input-field mt-2"
          placeholder="🔍 Search colleges..."
        />
      </div>

      {collegeName === 'other' && (
        <div>
          <label className="block text-sm font-medium text-heading mb-1.5">
            Enter Your College Name
          </label>
          <input
            type="text"
            value={customCollege}
            onChange={e => setCustomCollege(e.target.value)}
            className="input-field"
            placeholder="Type your college name here"
          />
        </div>
      )}

      {profile?.is_minor && (
        <div>
          <label className="block text-sm font-medium text-heading mb-1.5">
            Parent / Guardian Email (Optional)
          </label>
          <input
            type="email"
            value={guardianEmail}
            onChange={e => setGuardianEmail(e.target.value)}
            className="input-field"
            placeholder="parent@example.com (optional)"
          />
          <p className="text-xs text-muted mt-1">
            Optional — helps us follow Indian law (DPDP Act) for under-18 accounts
          </p>
        </div>
      )}

      <div className="pt-2">
        <button
          type="submit"
          disabled={saving}
          className="btn-primary py-2.5 px-6 flex items-center gap-2"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Profile Changes
            </>
          )}
        </button>
      </div>

      <div className="pt-4 border-t border-border">
        <Link
          href="/student/security"
          className="flex items-center gap-2 text-sm text-primary hover:underline"
        >
          <Key className="w-4 h-4" />
          Change Password
        </Link>
      </div>
    </form>
  )
}

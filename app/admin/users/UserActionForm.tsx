'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Check } from 'lucide-react'

export default function UserActionForm({
  userId,
  action,
}: {
  userId: string
  action: 'warn' | 'suspend' | 'lift_suspension'
}) {
  const router = useRouter()
  const [reason, setReason] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (action !== 'lift_suspension' && reason.trim().length < 5) {
      setError('Please provide a reason of at least 5 characters.')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const res = await fetch(`/api/admin/users/${userId}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          reason: reason.trim() || 'Suspension lifted by admin',
        }),
      })

      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data.error?.message || 'Failed to update user status')

      router.push(`/admin/users/${userId}`)
      router.refresh()
    } catch (err: any) {
      setError(err.message)
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 text-xs text-red-400 bg-red-950/50 border border-red-800 rounded-lg">
          {error}
        </div>
      )}

      {action !== 'lift_suspension' ? (
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Reason / Moderation Note <span className="text-red-400">*</span>
          </label>
          <textarea
            required
            rows={3}
            value={reason}
            onChange={e => setReason(e.target.value)}
            placeholder={
              action === 'warn'
                ? 'e.g. Warning for repeated automated download attempts or improper submissions...'
                : 'e.g. Account suspended due to Terms of Service violation...'
            }
            className="admin-input resize-y text-xs"
          />
        </div>
      ) : (
        <p className="text-xs text-slate-300">
          Are you sure you want to lift this suspension and re-activate the account?
        </p>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 bg-slate-800 text-slate-300 text-xs rounded hover:bg-slate-700"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className={`px-4 py-2 text-white text-xs font-semibold rounded flex items-center gap-1.5 ${
            action === 'warn'
              ? 'bg-amber-600 hover:bg-amber-500'
              : action === 'suspend'
              ? 'bg-red-600 hover:bg-red-500'
              : 'bg-emerald-600 hover:bg-emerald-500'
          }`}
        >
          {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
          {action === 'warn' ? 'Submit Warning' : action === 'suspend' ? 'Confirm Suspension' : 'Lift Suspension'}
        </button>
      </div>
    </form>
  )
}

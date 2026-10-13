'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, Loader2 } from 'lucide-react'

export default function DeleteAccountForm({ email }: { email: string }) {
  const router = useRouter()
  const [confirmation, setConfirmation] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleDelete(e: React.FormEvent) {
    e.preventDefault()
    if (confirmation !== 'DELETE') {
      setError('Please type DELETE in capital letters to confirm.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/profile', {
        method: 'DELETE',
      })

      const data = await res.json()
      if (!res.ok || !data.ok) {
        throw new Error(data.error?.message || 'Failed to delete account')
      }

      window.location.href = '/'
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleDelete} className="space-y-4">
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-heading mb-1.5">
          Type <span className="font-mono font-bold text-red-600">DELETE</span> to confirm
        </label>
        <input
          type="text"
          required
          value={confirmation}
          onChange={e => setConfirmation(e.target.value)}
          placeholder="DELETE"
          className="input-field"
        />
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={loading || confirmation !== 'DELETE'}
          className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Deleting account...
            </>
          ) : (
            <>
              <Trash2 className="w-4 h-4" />
              Permanently Delete Account
            </>
          )}
        </button>
      </div>
    </form>
  )
}

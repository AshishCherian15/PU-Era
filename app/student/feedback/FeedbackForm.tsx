'use client'

import { useState } from 'react'
import { Send, Loader2, Star, CheckCircle2 } from 'lucide-react'

const FEEDBACK_TYPES = [
  { value: 'general', label: 'General Experience' },
  { value: 'broken_link', label: 'Broken Drive Link / File' },
  { value: 'wrong_chapter', label: 'Wrong Chapter or Subject' },
  { value: 'content_error', label: 'Content / Formula Error' },
  { value: 'suggestion', label: 'Platform Suggestion' },
]

export default function FeedbackForm() {
  const [type, setType] = useState('general')
  const [rating, setRating] = useState(5)
  const [message, setMessage] = useState('')
  const [pageUrl, setPageUrl] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (message.trim().length < 10) {
      setError('Please provide at least 10 characters.')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          rating,
          message: message.trim(),
          page_url: pageUrl.trim() || null,
        }),
      })

      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data.error?.message || 'Failed to submit feedback')

      setSubmitted(true)
    } catch (err: any) {
      setError(err.message)
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-8">
        <CheckCircle2 className="w-12 h-12 text-brand-green mx-auto mb-3" />
        <h2 className="text-lg font-bold text-heading mb-1">Thank you for your feedback!</h2>
        <p className="text-muted text-sm max-w-md mx-auto mb-6">
          Your feedback helps us keep Karnataka PUC study resources accurate, complete, and completely free.
        </p>
        <button
          onClick={() => {
            setSubmitted(false)
            setMessage('')
            setPageUrl('')
          }}
          className="btn-secondary text-sm"
        >
          Send another response
        </button>
      </div>
    )
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
          Category
        </label>
        <select
          value={type}
          onChange={e => setType(e.target.value)}
          className="input-field"
        >
          {FEEDBACK_TYPES.map(t => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-heading mb-1.5">
          Rating
        </label>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="p-1 rounded hover:scale-110 transition-transform"
            >
              <Star
                className={`w-6 h-6 ${
                  star <= rating
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-slate-300'
                }`}
              />
            </button>
          ))}
          <span className="text-xs text-muted ml-2">
            {rating === 5 ? 'Excellent' : rating === 4 ? 'Good' : rating === 3 ? 'Average' : 'Needs improvement'}
          </span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-heading mb-1.5">
          Related Page URL (optional)
        </label>
        <input
          type="text"
          value={pageUrl}
          onChange={e => setPageUrl(e.target.value)}
          placeholder="e.g. /subjects/puc2-physics or specific resource page"
          className="input-field"
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-1.5">
          <label className="block text-sm font-medium text-heading">
            Your message <span className="text-red-500">*</span>
          </label>
          <span className={`text-xs ${message.length > 1000 ? 'text-red-500' : 'text-muted'}`}>
            {message.length}/1000
          </span>
        </div>
        <textarea
          required
          rows={4}
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Describe your issue or feedback in detail..."
          className="input-field resize-y"
        />
        <p className="text-xs text-muted mt-1">Minimum 10 characters.</p>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={submitting || message.trim().length < 10}
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
              Submit Feedback
            </>
          )}
        </button>
      </div>
    </form>
  )
}

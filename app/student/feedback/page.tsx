import type { Metadata } from 'next'
import { MessageCircle } from 'lucide-react'
import FeedbackForm from './FeedbackForm'

export const metadata: Metadata = {
  title: 'Send Feedback | PU Era',
  robots: { index: false },
}

export default function FeedbackPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-heading flex items-center gap-2">
          <MessageCircle className="w-6 h-6 text-primary" />
          Send Feedback
        </h1>
        <p className="text-muted text-sm mt-1">
          Found an error in formulas, a dead link, or have a suggestion to improve the platform? Let us know.
        </p>
      </div>

      <div className="calling-card p-6">
        <FeedbackForm />
      </div>
    </div>
  )
}

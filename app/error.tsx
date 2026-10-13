'use client'

import { useEffect } from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8 text-red-600" />
      </div>
      <h2
        className="text-2xl font-bold text-[#111827] mb-3"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        Something went wrong
      </h2>
      <p className="text-slate-500 mb-8 max-w-md text-sm leading-relaxed">
        An unexpected error occurred. Please try again or contact support if the problem persists.
      </p>
      <button onClick={reset} className="btn-primary">
        <RefreshCw className="w-4 h-4" />
        Try Again
      </button>
    </div>
  )
}

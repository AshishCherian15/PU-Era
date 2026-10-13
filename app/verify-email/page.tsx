'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { CheckCircle2, Mail, AlertCircle, RefreshCw } from 'lucide-react'

export default function VerifyEmailPage() {
  const router = useRouter()
  const [resending, setResending] = useState(false)
  const [resent, setResent] = useState(false)
  const [error, setError] = useState('')

  async function handleResend() {
    setResending(true)
    setError('')
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user?.email) {
      setError('Could not find your email. Please sign in again.')
      setResending(false)
      return
    }

    const { error: resendError } = await supabase.auth.resend({
      type: 'signup',
      email: user.email,
    })

    if (resendError) {
      setError('Could not resend. Please try again in a few minutes.')
    } else {
      setResent(true)
    }
    setResending(false)
  }

  return (
    <div className="auth-bg">
      <div className="w-full max-w-md text-center">
        <div className="calling-card p-8">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-emerald-600" />
          </div>

          <h1 className="text-2xl font-bold text-heading mb-2">Verify your email</h1>
          <p className="text-muted mb-6">
            We sent a verification link to your email. Click it to activate your account and
            unlock downloads.
          </p>

          <div className="space-y-3">
            {resent ? (
              <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-200 justify-center">
                <CheckCircle2 className="w-4 h-4" />
                Verification email sent! Check your inbox.
              </div>
            ) : (
              <button
                onClick={handleResend}
                disabled={resending}
                className="btn-secondary w-full flex items-center justify-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${resending ? 'animate-spin' : ''}`} />
                {resending ? 'Sending…' : 'Resend verification email'}
              </button>
            )}

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-200">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <button
              onClick={() => router.push('/student/dashboard')}
              className="btn-primary w-full"
            >
              Continue to dashboard
            </button>
          </div>

          <div className="mt-6 text-xs text-muted space-y-1">
            <p>Check your spam folder if you don't see the email.</p>
            <p>
              Wrong email?{' '}
              <Link href="/contact" className="text-primary hover:underline">Contact us</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

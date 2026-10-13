'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { BookOpen, ArrowLeft, Mail, Loader2, CheckCircle2 } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const supabase = createClient()
      const redirectUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/student/security`
        : 'http://localhost:3000/student/security'

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: redirectUrl,
      })

      if (resetError) {
        throw resetError
      }

      setSubmitted(true)
    } catch {
      // DPDP & security best practice: don't disclose whether email exists or not
      setSubmitted(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-bg">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-heading">PU Era</span>
          </Link>
          <h1 className="text-2xl font-bold text-heading mt-6">Reset Password</h1>
          <p className="text-muted mt-1 text-sm">
            Enter your registered email and we&apos;ll send you a secure password reset link.
          </p>
        </div>

        <div className="calling-card p-6 sm:p-8">
          {submitted ? (
            <div className="text-center py-4">
              <CheckCircle2 className="w-12 h-12 text-brand-green mx-auto mb-3" />
              <h2 className="text-base font-bold text-heading mb-1">Check your inbox</h2>
              <p className="text-xs text-muted leading-relaxed mb-6">
                If an account exists with <span className="font-semibold text-heading">{email}</span>, you will receive password reset instructions shortly.
              </p>
              <Link
                href="/login"
                className="btn-primary w-full py-2.5 text-xs flex items-center justify-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Return to Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-heading mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="student@example.com"
                    className="input-field pl-10"
                  />
                  <Mail className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading || !email}
                  className="btn-primary w-full py-2.5 text-sm flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending link...
                    </>
                  ) : (
                    'Send Reset Link'
                  )}
                </button>
              </div>

              <div className="pt-2 text-center">
                <Link
                  href="/login"
                  className="text-xs text-muted hover:text-heading inline-flex items-center gap-1"
                >
                  <ArrowLeft className="w-3 h-3" /> Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

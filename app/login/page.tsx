'use client'
import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Eye, EyeOff, AlertCircle, BookOpen, ArrowRight } from 'lucide-react'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') ?? '/student/dashboard'

  const [form, setForm] = useState({ email: '', password: '', remember: false })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const supabase = createClient()
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      })

      if (authError) {
        // Generic error — no user enumeration
        setError('Incorrect email or password. Please try again.')
        return
      }

      router.push(next)
      router.refresh()
    } catch {
      setError('Something went wrong. Please try again.')
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
          <h1 className="text-2xl font-bold text-heading mt-6">Welcome back</h1>
          <p className="text-muted mt-1">Sign in to download resources &amp; track your progress</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="calling-card space-y-4"
          noValidate
          aria-label="Sign in form"
        >
          {/* Email */}
          <div>
            <label htmlFor="login-email" className="block text-sm font-medium text-heading mb-1">
              Email address
            </label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              required
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              className="input-field"
              placeholder="you@example.com"
              aria-describedby={error ? 'login-error' : undefined}
            />
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="login-password" className="block text-sm font-medium text-heading">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-sm text-primary hover:underline"
                tabIndex={0}
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                className="input-field pr-10"
                placeholder="••••••••"
                aria-describedby={error ? 'login-error' : undefined}
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-heading transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember me */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.remember}
              onChange={e => setForm(f => ({ ...f, remember: e.target.checked }))}
              className="w-4 h-4 rounded border-border accent-primary"
            />
            <span className="text-sm text-body">Keep me signed in for 30 days</span>
          </label>

          {/* Error */}
          {error && (
            <div
              id="login-error"
              role="alert"
              className="flex items-center gap-2 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg border border-red-200 dark:border-red-800"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {loading ? 'Signing in…' : <>Sign in <ArrowRight className="w-4 h-4" /></>}
          </button>

          <div className="text-center text-sm text-muted">
            Free to read. Sign in once to download.
          </div>
        </form>

        <p className="text-center text-sm text-muted mt-6">
          New to PU Era?{' '}
          <Link href="/register" className="text-primary font-medium hover:underline">
            Create a free account
          </Link>
        </p>

        <div className="flex items-center justify-center gap-4 mt-4 text-xs text-muted">
          <Link href="/legal/terms" className="hover:text-primary transition-colors">Terms</Link>
          <span>·</span>
          <Link href="/legal/privacy" className="hover:text-primary transition-colors">Privacy</Link>
          <span>·</span>
          <Link href="/contact" className="hover:text-primary transition-colors">Help</Link>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted">Loading…</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}

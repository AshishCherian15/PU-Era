'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Eye, EyeOff, AlertCircle, BookOpen, ArrowRight, ChevronDown, Info, Search } from 'lucide-react'
import type { ClassLevel, Stream, Medium } from '@/lib/types'

const CLASS_OPTIONS: { value: ClassLevel; label: string }[] = [
  { value: 'puc2', label: '2nd PUC (Karnataka)' },
  { value: 'puc1', label: '1st PUC (Karnataka)' },
  { value: 'ncert12', label: 'NCERT Class 12' },
  { value: 'ncert11', label: 'NCERT Class 11' },
]
const STREAM_OPTIONS: { value: Stream; label: string }[] = [
  { value: 'science', label: 'Science (PCMB / PCMC / PCMS)' },
  { value: 'commerce', label: 'Commerce' },
  { value: 'arts', label: 'Arts / Humanities' },
]
const AGE_BANDS = ['Under 14', '14–15', '16–17', '18–20', '21 or older']

interface CollegeOption { id: string; name: string; city: string; district: string; source?: string }

function getPasswordStrength(p: string): { label: string; color: string; width: string } {
  if (p.length === 0) return { label: '', color: 'bg-border', width: 'w-0' }
  if (p.length < 8) return { label: 'Too short', color: 'bg-red-500', width: 'w-1/4' }
  if (p.length < 12 && !/[0-9!@#$%]/.test(p)) return { label: 'Weak', color: 'bg-orange-400', width: 'w-2/4' }
  if (p.length >= 12 || /[0-9!@#$%]/.test(p)) return { label: 'Good', color: 'bg-emerald-500', width: 'w-3/4' }
  return { label: 'Strong', color: 'bg-emerald-600', width: 'w-full' }
}

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    classLevel: '' as ClassLevel | '',
    stream: '' as Stream | '',
    medium: 'en' as Medium,
    ageBand: '',
    collegeName: '',
    guardianEmail: '',
    acceptTos: false,
    acceptPrivacy: false,
    marketingOptIn: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [globalError, setGlobalError] = useState('')

  // College combobox state
  const [collegeQuery, setCollegeQuery] = useState('')
  const [collegeOptions, setCollegeOptions] = useState<CollegeOption[]>([])
  const [collegeOpen, setCollegeOpen] = useState(false)
  const [collegeFetching, setCollegeFetching] = useState(false)
  const collegeRef = useRef<HTMLDivElement>(null)

  const isMinor = ['Under 14', '14–15', '16–17'].includes(form.ageBand)
  const strength = getPasswordStrength(form.password)

  // Fetch colleges from API when query changes
  useEffect(() => {
    const controller = new AbortController()
    setCollegeFetching(true)
    fetch(`/api/colleges?q=${encodeURIComponent(collegeQuery)}`, { signal: controller.signal })
      .then(r => r.json())
      .then((data: CollegeOption[]) => { setCollegeOptions(data); setCollegeFetching(false) })
      .catch(() => setCollegeFetching(false))
    return () => controller.abort()
  }, [collegeQuery])

  // Close dropdown on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (collegeRef.current && !collegeRef.current.contains(e.target as Node)) {
        setCollegeOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  function validate() {
    const e: Record<string, string> = {}
    if (!form.fullName.trim()) e.fullName = 'Please enter your name.'
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "That doesn't look like a valid email address."
    if (form.password.length < 8) e.password = 'Use at least 8 characters. A phrase works well.'
    if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords don't match."
    if (!form.classLevel) e.classLevel = 'Choose your class so we show the right notes.'
    if (!form.stream) e.stream = 'Choose your stream.'
    if (!form.ageBand) e.ageBand = 'Please pick your age group.'
    if (isMinor && form.guardianEmail && !form.guardianEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      e.guardianEmail = 'Please enter a valid parent or guardian email.'
    return e
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) {
      setErrors(errs)
      document.getElementById(`reg-${Object.keys(errs)[0]}`)?.focus()
      return
    }
    setErrors({})
    setGlobalError('')
    setLoading(true)

    try {
      const supabase = createClient()
      const { data, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            full_name: form.fullName,
            class_level: form.classLevel,
            stream: form.stream,
            medium: form.medium,
            is_minor: isMinor,
            guardian_email: form.guardianEmail || null,
            college_name: form.collegeName || null,
          },
        },
      })

      if (authError) {
        if (authError.message.includes('already registered')) {
          setErrors({ email: 'An account already uses this email. Try signing in.' })
        } else {
          setGlobalError('Something went wrong. Please try again.')
        }
        return
      }

      if (data.user) router.push('/verify-email')
    } catch {
      setGlobalError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-bg">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-heading">PU Era</span>
          </Link>
          <h1 className="text-2xl font-bold text-heading mt-6">Create a free account</h1>
          <p className="text-muted mt-1">Free to read. Sign up once to download &amp; track progress.</p>
        </div>

        <form onSubmit={handleSubmit} className="calling-card space-y-5" noValidate aria-label="Registration form">

          <FormField id="reg-fullName" label="Full name" required error={errors.fullName}>
            <input id="reg-fullName" type="text" autoComplete="name" value={form.fullName}
              onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
              className="input-field" placeholder="Aishwarya Kumar" />
          </FormField>

          <FormField id="reg-email" label="Email address" required error={errors.email}>
            <input id="reg-email" type="email" autoComplete="email" value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              className="input-field" placeholder="you@example.com" />
          </FormField>

          <FormField id="reg-password" label="Password" required error={errors.password}>
            <div className="relative">
              <input id="reg-password" type={showPassword ? 'text' : 'password'} autoComplete="new-password"
                value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                className="input-field pr-10" placeholder="At least 8 characters" />
              <button type="button" onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-heading"
                aria-label={showPassword ? 'Hide password' : 'Show password'}>
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {form.password && (
              <div className="mt-1.5">
                <div className="h-1 bg-border rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${strength.color} ${strength.width}`} />
                </div>
                <p className="text-xs text-muted mt-0.5">{strength.label}</p>
              </div>
            )}
          </FormField>

          <FormField id="reg-confirmPassword" label="Confirm password" required error={errors.confirmPassword}>
            <input id="reg-confirmPassword" type={showPassword ? 'text' : 'password'} autoComplete="new-password"
              value={form.confirmPassword} onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
              className="input-field" placeholder="Same password again" />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField id="reg-classLevel" label="Class" required error={errors.classLevel}>
              <div className="relative">
                <select id="reg-classLevel" value={form.classLevel}
                  onChange={e => setForm(f => ({ ...f, classLevel: e.target.value as ClassLevel }))}
                  className="input-field appearance-none pr-8">
                  <option value="">Select…</option>
                  {CLASS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
              </div>
            </FormField>

            <FormField id="reg-stream" label="Stream" required error={errors.stream}>
              <div className="relative">
                <select id="reg-stream" value={form.stream}
                  onChange={e => setForm(f => ({ ...f, stream: e.target.value as Stream }))}
                  className="input-field appearance-none pr-8">
                  <option value="">Select…</option>
                  {STREAM_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
              </div>
            </FormField>
          </div>

          <FormField id="reg-ageBand" label="Age group" required error={errors.ageBand}>
            <div className="relative">
              <select id="reg-ageBand" value={form.ageBand}
                onChange={e => setForm(f => ({ ...f, ageBand: e.target.value }))}
                className="input-field appearance-none pr-8">
                <option value="">Please pick your age group…</option>
                {AGE_BANDS.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
            </div>
          </FormField>

          {/* College combobox */}
          <FormField id="reg-collegeName" label="College / University / Institute (optional)">
            <div className="relative" ref={collegeRef}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
                <input
                  id="reg-collegeName"
                  type="text"
                  autoComplete="off"
                  value={collegeQuery}
                  onFocus={() => setCollegeOpen(true)}
                  onChange={e => {
                    setCollegeQuery(e.target.value)
                    setForm(f => ({ ...f, collegeName: e.target.value }))
                    setCollegeOpen(true)
                  }}
                  className="input-field pl-9"
                  placeholder="Search or type your college name…"
                />
              </div>

              {collegeOpen && (
                <div className="absolute z-50 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-lg max-h-56 overflow-y-auto">
                  {collegeFetching && (
                    <p className="px-3 py-2 text-xs text-muted">Searching…</p>
                  )}
                  {!collegeFetching && collegeOptions.length === 0 && collegeQuery && (
                    <button
                      type="button"
                      className="w-full text-left px-3 py-2.5 text-sm text-heading hover:bg-slate-50 border-b border-slate-100"
                      onClick={() => {
                        setForm(f => ({ ...f, collegeName: collegeQuery }))
                        setCollegeOpen(false)
                      }}
                    >
                      <span className="text-brand-green font-semibold">+ Add</span> &ldquo;{collegeQuery}&rdquo; as new college
                    </button>
                  )}
                  {!collegeFetching && collegeOptions.map(col => (
                    <button
                      key={col.id}
                      type="button"
                      className="w-full text-left px-3 py-2.5 text-sm hover:bg-slate-50 flex items-center justify-between gap-2"
                      onClick={() => {
                        setCollegeQuery(col.name)
                        setForm(f => ({ ...f, collegeName: col.name }))
                        setCollegeOpen(false)
                      }}
                    >
                      <span className="text-heading">{col.name}</span>
                      {col.city && <span className="text-xs text-muted flex-shrink-0">{col.city}</span>}
                    </button>
                  ))}
                  {!collegeFetching && collegeOptions.length > 0 && collegeQuery && (
                    <button
                      type="button"
                      className="w-full text-left px-3 py-2.5 text-sm text-brand-green font-medium hover:bg-slate-50 border-t border-slate-100"
                      onClick={() => {
                        setForm(f => ({ ...f, collegeName: collegeQuery }))
                        setCollegeOpen(false)
                      }}
                    >
                      + Use &ldquo;{collegeQuery}&rdquo; as entered
                    </button>
                  )}
                </div>
              )}
            </div>
            {form.collegeName && form.collegeName !== collegeQuery && (
              <p className="text-xs text-emerald-700 mt-1">Selected: {form.collegeName}</p>
            )}
          </FormField>

          {/* Guardian email — optional for under-18 */}
          {isMinor && form.ageBand && (
            <FormField id="reg-guardianEmail" label="Parent / Guardian email (optional)" error={errors.guardianEmail}>
              <input id="reg-guardianEmail" type="email" value={form.guardianEmail}
                onChange={e => setForm(f => ({ ...f, guardianEmail: e.target.value }))}
                className="input-field" placeholder="parent@example.com (optional)" />
              <p className="text-xs text-muted mt-1">
                We can send a consent email to your parent/guardian if needed. Optional — you can still use the platform without it.
              </p>
            </FormField>
          )}

          {/* Consent — all optional checkboxes */}
          <div className="space-y-3 pt-4 border-t border-border">
            <div className="flex items-start gap-2 mb-1">
              <Info className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-muted">All items below are optional — you can skip them and still create your account.</p>
            </div>

            <CheckboxField
              id="reg-acceptTos"
              checked={form.acceptTos}
              onChange={v => setForm(f => ({ ...f, acceptTos: v }))}
              label={
                <>
                  I agree to the{' '}
                  <Link href="/legal/terms" target="_blank" className="text-primary underline">Terms of Service</Link>
                  {' '}— rules for using PU Era (no misuse, respect copyright)
                </>
              }
            />

            <CheckboxField
              id="reg-acceptPrivacy"
              checked={form.acceptPrivacy}
              onChange={v => setForm(f => ({ ...f, acceptPrivacy: v }))}
              label={
                <>
                  I&apos;ve read the{' '}
                  <Link href="/legal/privacy" target="_blank" className="text-primary underline">Privacy Policy</Link>
                  {' '}— we never sell your data
                </>
              }
            />

            <CheckboxField
              id="reg-marketingOptIn"
              checked={form.marketingOptIn}
              onChange={v => setForm(f => ({ ...f, marketingOptIn: v }))}
              label="Send me updates about new study materials (optional)"
            />
          </div>

          {globalError && (
            <div role="alert" className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-200">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {globalError}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
            {loading ? 'Creating account…' : <>Create account <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>

        <p className="text-center text-sm text-muted mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-primary font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}

function FormField({ id, label, error, required, children }: {
  id: string; label: string; error?: string; required?: boolean; children: React.ReactNode
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-heading mb-1">
        {label}
        {required && <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-xs text-red-600 mt-1 flex items-center gap-1" role="alert" id={`${id}-error`}>
          <AlertCircle className="w-3 h-3 flex-shrink-0" />{error}
        </p>
      )}
    </div>
  )
}

function CheckboxField({ id, checked, onChange, label, error }: {
  id: string; checked: boolean; onChange: (v: boolean) => void; label: React.ReactNode; error?: string
}) {
  return (
    <div>
      <label htmlFor={id} className="flex items-start gap-2 cursor-pointer">
        <input id={id} type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)}
          className="w-4 h-4 mt-0.5 rounded border-border accent-primary flex-shrink-0" />
        <span className="text-sm text-body">{label}</span>
      </label>
      {error && (
        <p className="text-xs text-red-600 mt-1 flex items-center gap-1 ml-6" role="alert">
          <AlertCircle className="w-3 h-3 flex-shrink-0" />{error}
        </p>
      )}
    </div>
  )
}

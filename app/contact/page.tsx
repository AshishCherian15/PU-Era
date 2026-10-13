'use client'
import { useState } from 'react'
import { Mail, MapPin, Clock, Send, CheckCircle2, AlertCircle } from 'lucide-react'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [errors, setErrors] = useState<Record<string, string>>({})

  function validate() {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = 'Please enter your name.'
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "That doesn't look like a valid email."
    if (!form.subject.trim()) e.subject = 'Please enter a subject.'
    if (form.message.trim().length < 20) e.message = 'Please add a little more detail (at least 20 characters).'
    return e
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setStatus('sending')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Server error')
      setStatus('sent')
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <div>
      <div className="page-hero">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight mb-2" style={{ fontFamily: 'var(--font-display)' }}>Contact Us</h1>
          <p className="text-slate-500 text-sm sm:text-base max-w-xl">
            Have a question, found an error, or want to request study material? We read every message.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid md:grid-cols-5 gap-8">
          {/* Info sidebar */}
          <aside className="md:col-span-2 space-y-4">
            <InfoCard
              icon={<Mail className="w-5 h-5 text-primary" />}
              title="Email"
              content="contact@puera.in"
              sub="We reply within 48 hours"
            />
            <InfoCard
              icon={<Clock className="w-5 h-5 text-primary" />}
              title="Response time"
              content="Within 48 hours"
              sub="Mon – Sat, 9 AM – 9 PM IST"
            />
            <InfoCard
              icon={<MapPin className="w-5 h-5 text-primary" />}
              title="Based in"
              content="Karnataka, India"
              sub="Serving PUC students statewide"
            />

            <div className="calling-card bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800">
              <p className="text-sm font-semibold text-amber-800 dark:text-amber-200 mb-1">Legal / Takedown</p>
              <p className="text-xs text-amber-700 dark:text-amber-300">
                For copyright or content removal requests, email{' '}
                <a href="mailto:legal@puera.in" className="underline">legal@puera.in</a>
                {' '}— we respond within 24–48 h.
              </p>
            </div>
          </aside>

          {/* Form */}
          <div className="md:col-span-3">
            {status === 'sent' ? (
              <div className="calling-card text-center py-10">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                <h2 className="text-xl font-bold text-heading mb-2">Message sent!</h2>
                <p className="text-muted">We'll get back to you at {form.email || 'your email'} within 48 hours.</p>
                <button
                  onClick={() => setStatus('idle')}
                  className="btn-secondary mt-4"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="calling-card space-y-4" noValidate>
                <h2 className="text-xl font-semibold text-heading mb-2">Send a message</h2>

                <Field label="Your name" error={errors.name}>
                  <input
                    id="contact-name"
                    type="text"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="input-field"
                    placeholder="Aishwarya K"
                    aria-describedby={errors.name ? 'contact-name-error' : undefined}
                  />
                </Field>

                <Field label="Email address" error={errors.email}>
                  <input
                    id="contact-email"
                    type="email"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    className="input-field"
                    placeholder="you@example.com"
                    aria-describedby={errors.email ? 'contact-email-error' : undefined}
                  />
                </Field>

                <Field label="Subject" error={errors.subject}>
                  <select
                    id="contact-subject"
                    value={form.subject}
                    onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                    className="input-field"
                    aria-describedby={errors.subject ? 'contact-subject-error' : undefined}
                  >
                    <option value="">Select a subject…</option>
                    <option value="Request study material">Request study material</option>
                    <option value="Report broken link">Report broken link</option>
                    <option value="Report content error">Report content error</option>
                    <option value="Technical issue">Technical issue</option>
                    <option value="Takedown / copyright">Takedown / copyright</option>
                    <option value="General question">General question</option>
                    <option value="Collaboration / contributor">Collaboration / contributor</option>
                  </select>
                </Field>

                <Field label="Message" error={errors.message}>
                  <textarea
                    id="contact-message"
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    className="input-field min-h-[120px] resize-y"
                    placeholder="Describe what you need or found…"
                    aria-describedby={errors.message ? 'contact-message-error' : undefined}
                  />
                  <p className="text-xs text-muted text-right mt-1">{form.message.length}/1000</p>
                </Field>

                {status === 'error' && (
                  <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg border border-red-200">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    Something went wrong. Please try again or email us directly.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  {status === 'sending' ? (
                    <>Sending…</>
                  ) : (
                    <><Send className="w-4 h-4" /> Send Message</>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoCard({ icon, title, content, sub }: { icon: React.ReactNode; title: string; content: string; sub: string }) {
  return (
    <div className="calling-card flex items-start gap-3">
      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-xs text-muted font-medium uppercase tracking-wider">{title}</p>
        <p className="text-heading font-semibold text-sm mt-0.5">{content}</p>
        <p className="text-xs text-muted mt-0.5">{sub}</p>
      </div>
    </div>
  )
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-heading mb-1">{label}</label>
      {children}
      {error && (
        <p className="text-xs text-red-600 mt-1 flex items-center gap-1" role="alert">
          <AlertCircle className="w-3 h-3" />{error}
        </p>
      )}
    </div>
  )
}

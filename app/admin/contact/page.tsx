export const instant = false

import type { Metadata } from 'next'
import { createAdminClient } from '@/lib/supabase/admin'
import { Mail, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contact Messages | Admin PU Era',
  robots: { index: false },
}

export default async function AdminContactPage() {
  const supabase = createAdminClient()

  const { data: messages } = await supabase
    .from('contact_messages')
    .select('id, name, email, subject, message, created_at')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Mail className="w-6 h-6 text-emerald-400" />
          Public Contact Submissions
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Inquiries and messages submitted through the puera.in/contact page.
        </p>
      </div>

      {(messages ?? []).length === 0 ? (
        <div className="p-8 text-center text-slate-500 bg-slate-900 border border-slate-800 rounded-xl text-sm">
          No contact messages received yet.
        </div>
      ) : (
        <div className="space-y-3">
          {messages!.map(m => (
            <div key={m.id} className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-white">{m.subject}</h3>
                  <span className="text-xs text-slate-400">from {m.name} ({m.email})</span>
                </div>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(m.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <p className="text-sm text-slate-300 bg-slate-950/60 p-3 rounded-lg border border-slate-850 whitespace-pre-wrap">
                {m.message}
              </p>
              <div className="flex justify-end pt-1">
                <a
                  href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject)}`}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded"
                >
                  Reply via Email
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

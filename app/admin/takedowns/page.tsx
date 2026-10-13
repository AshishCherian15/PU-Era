export const instant = false

import type { Metadata } from 'next'
import { createAdminClient } from '@/lib/supabase/admin'
import { ShieldAlert, CheckCircle2, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Copyright & Takedowns | Admin PU Era',
  robots: { index: false },
}

export default async function AdminTakedownsPage() {
  const supabase = createAdminClient()

  const { data: takedowns } = await supabase
    .from('takedowns')
    .select(`
      id, complainant, basis, received_at, action_taken, taken_down_at,
      resources (id, title, slug)
    `)
    .order('received_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-red-400" />
          Copyright &amp; Takedown Requests
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Review notices submitted under Copyright Act 1957 and DPDP compliance. PU Era targets a 48-hour response SLA.
        </p>
      </div>

      {(takedowns ?? []).length === 0 ? (
        <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-xl">
          <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-white">No active takedown notices</p>
          <p className="text-xs text-slate-500 mt-1">Zero pending copyright claims or complaints.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {takedowns!.map(t => (
            <div key={t.id} className="p-4 bg-slate-900 border border-red-900/40 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs px-2 py-0.5 rounded-full bg-red-950 text-red-400 border border-red-800 font-semibold">
                  Claim from: {t.complainant}
                </span>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(t.received_at).toLocaleDateString('en-IN')}
                </span>
              </div>
              <p className="text-sm text-slate-200 bg-slate-950/60 p-3 rounded-lg border border-slate-850">
                {t.basis}
              </p>
              {t.resources && (
                <p className="text-xs text-slate-400">
                  Target Resource: <span className="text-white font-medium">{(t.resources as any).title}</span>
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

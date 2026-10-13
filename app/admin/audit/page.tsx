export const instant = false

import { createAdminClient } from '@/lib/supabase/admin'
import { BarChart2 } from 'lucide-react'

export default async function AdminAuditPage() {
  const supabase = createAdminClient()

  const { data: events } = await supabase
    .from('audit_logs')
    .select('id, action, entity_type, entity_id, reason, at')
    .order('at', { ascending: false })
    .limit(50)

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Audit Log</h1>
        <p className="text-slate-400 text-sm mt-1">Track all administrative actions for security and accountability</p>
      </div>

      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Recent Activity</h2>
          <span className="text-xs text-slate-500">Last 50 events</span>
        </div>

        {(events ?? []).length === 0 ? (
          <div className="p-8 text-center">
            <BarChart2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">No audit events recorded yet.</p>
            <p className="text-slate-500 text-sm mt-1">
              Admin actions such as resource uploads, user suspensions, and content changes will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800">
            {events!.map((event) => (
              <div key={event.id} className="px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <p className="text-sm font-medium text-white">{event.action}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {event.entity_type}
                    {event.entity_id ? ` · ${event.entity_id}` : ''}
                    {event.reason ? ` · ${event.reason}` : ''}
                  </p>
                </div>
                <time className="text-xs text-slate-500 shrink-0">
                  {new Date(event.at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                </time>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

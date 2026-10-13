import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { MessageSquare, Plus, Clock, CheckCircle2, XCircle, Loader } from 'lucide-react'
import type { RequestStatus } from '@/lib/types'

export const metadata: Metadata = {
  title: 'My Requests | PU Era',
  robots: { index: false },
}

const STATUS_CONFIG: Record<RequestStatus, { label: string; icon: React.ElementType; color: string }> = {
  submitted: { label: 'Submitted', icon: Clock, color: 'text-amber-500' },
  in_review: { label: 'In Review', icon: Loader, color: 'text-blue-500' },
  approved: { label: 'Approved', icon: CheckCircle2, color: 'text-emerald-500' },
  in_progress: { label: 'In Progress', icon: Loader, color: 'text-purple-500' },
  completed: { label: 'Completed', icon: CheckCircle2, color: 'text-emerald-600' },
  declined: { label: 'Declined', icon: XCircle, color: 'text-red-500' },
}

export default async function RequestsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/student/requests')

  const { data: requests } = await supabase
    .from('requests')
    .select(`
      id, description, resource_type, status, admin_reply, created_at, updated_at,
      subjects(name), chapters(title, number)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-heading flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-primary" />
          My Requests
        </h1>
        <Link href="/student/requests/new" className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New request
        </Link>
      </div>

      {(requests ?? []).length === 0 ? (
        <div className="calling-card text-center py-12">
          <MessageSquare className="w-12 h-12 text-muted mx-auto mb-3" />
          <p className="font-semibold text-heading mb-1">No requests yet</p>
          <p className="text-muted text-sm mb-4">
            Missing a chapter's notes? Request it and we'll try to add it.
          </p>
          <Link href="/student/requests/new" className="btn-primary">
            Request study material
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {(requests ?? []).map(req => {
            const status = req.status as RequestStatus
            const cfg = STATUS_CONFIG[status]
            const StatusIcon = cfg.icon
            const subject = req.subjects as unknown as { name: string } | null
            const chapter = req.chapters as unknown as { title: string; number: number } | null

            return (
              <div key={req.id} className="calling-card">
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <StatusIcon className={`w-4 h-4 ${cfg.color} flex-shrink-0`} />
                      <span className={`text-xs font-medium ${cfg.color}`}>{cfg.label}</span>
                      {subject && <span className="text-xs text-muted">· {subject.name}</span>}
                      {chapter && <span className="text-xs text-muted">Ch {chapter.number}: {chapter.title}</span>}
                    </div>
                    {req.resource_type && (
                      <span className="text-xs bg-surface-alt px-2 py-0.5 rounded-full text-muted capitalize mb-2 inline-block">
                        {req.resource_type.replace(/_/g, ' ')}
                      </span>
                    )}
                    <p className="text-sm text-body">{req.description}</p>

                    {req.admin_reply && (
                      <div className="mt-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                        <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 mb-1">Reply from PU Era:</p>
                        <p className="text-sm text-body">{req.admin_reply}</p>
                      </div>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-muted">
                      {new Date(req.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

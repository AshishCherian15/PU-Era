export const instant = false

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import { ArrowLeft, User, ShieldAlert, AlertTriangle, Ban, Clock, Download, CheckCircle2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'User Details | Admin PU Era',
  robots: { index: false },
}

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = createAdminClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single()

  if (!profile) notFound()

  const { data: warnings } = await supabase
    .from('warnings')
    .select('*')
    .eq('user_id', id)
    .order('created_at', { ascending: false })

  const { data: suspensions } = await supabase
    .from('suspensions')
    .select('*')
    .eq('user_id', id)
    .order('created_at', { ascending: false })

  const { count: downloadCount } = await supabase
    .from('resource_downloads')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', id)

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Users
        </Link>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <User className="w-6 h-6 text-emerald-400" />
            {profile.full_name}
          </h1>
          <div className="flex items-center gap-2">
            <Link
              href={`/admin/users/${id}/warn`}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1"
            >
              <AlertTriangle className="w-3.5 h-3.5" /> Issue Warning
            </Link>
            <Link
              href={`/admin/users/${id}/suspend`}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1"
            >
              <Ban className="w-3.5 h-3.5" /> Suspend Account
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-2 text-sm">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Account Info</h2>
          <div className="flex justify-between">
            <span className="text-slate-500">Email:</span>
            <span className="text-slate-200 font-mono text-xs">{profile.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Status:</span>
            <span className={`capitalize font-semibold ${
              profile.status === 'active' ? 'text-emerald-400' : profile.status === 'warned' ? 'text-amber-400' : 'text-red-400'
            }`}>
              {profile.status}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Classification:</span>
            <span className="text-slate-300">
              {profile.is_minor ? 'Minor (Under 18, DPDP protected)' : 'Adult (18+)'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Email Verified:</span>
            <span className={profile.email_verified ? 'text-emerald-400' : 'text-amber-400'}>
              {profile.email_verified ? 'Yes' : 'No'}
            </span>
          </div>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-2 text-sm">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Academics &amp; Activity</h2>
          <div className="flex justify-between">
            <span className="text-slate-500">Class &amp; Stream:</span>
            <span className="text-slate-200 uppercase font-medium">
              {profile.class_level || '—'} • {profile.stream || '—'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Medium:</span>
            <span className="text-slate-200 uppercase">{profile.medium || 'en'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Total Downloads:</span>
            <span className="text-slate-200 font-bold">{downloadCount ?? 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Joined:</span>
            <span className="text-slate-400 text-xs">
              {new Date(profile.created_at).toLocaleDateString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* Warnings History */}
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          Warnings Issued ({(warnings ?? []).length})
        </h2>
        {(warnings ?? []).length === 0 ? (
          <p className="text-xs text-slate-500">No warnings on record.</p>
        ) : (
          <div className="space-y-2">
            {warnings!.map(w => (
              <div key={w.id} className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span className="font-semibold text-amber-400">Warning</span>
                  <span>{new Date(w.created_at).toLocaleDateString('en-IN')}</span>
                </div>
                <p className="text-slate-200">{w.reason}</p>
                {w.acknowledged_at && (
                  <p className="text-emerald-400 text-[11px]">✓ Acknowledged by user</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Suspensions History */}
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <Ban className="w-4 h-4 text-red-400" />
          Suspension History ({(suspensions ?? []).length})
        </h2>
        {(suspensions ?? []).length === 0 ? (
          <p className="text-xs text-slate-500">No suspensions recorded.</p>
        ) : (
          <div className="space-y-2">
            {suspensions!.map(s => (
              <div key={s.id} className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span className="font-semibold text-red-400">Suspension</span>
                  <span>{new Date(s.starts_at).toLocaleDateString('en-IN')}</span>
                </div>
                <p className="text-slate-200">{s.reason}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

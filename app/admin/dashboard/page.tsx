export const instant = false

import type { Metadata } from 'next'
import { createAdminClient } from '@/lib/supabase/admin'
import { Users, BookOpen, Download, Eye, MessageSquare, TrendingUp, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Admin Dashboard | PU Era',
  robots: { index: false },
}

export default async function AdminDashboardPage() {
  const supabase = createAdminClient()

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayStr = today.toISOString()
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

  const [
    { count: totalUsers },
    { count: newUsersToday },
    { count: totalResources },
    { count: publishedResources },
    { count: downloadsToday },
    { count: downloadsWeek },
    { count: pendingRequests },
    { count: newFeedback },
    { count: newContacts },
    { count: newTakedowns },
  ] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact', head: true }).is('deleted_at', null),
    supabase.from('profiles').select('id', { count: 'exact', head: true }).gte('created_at', todayStr),
    supabase.from('resources').select('id', { count: 'exact', head: true }).is('deleted_at', null),
    supabase.from('resources').select('id', { count: 'exact', head: true }).eq('status', 'published').is('deleted_at', null),
    supabase.from('resource_downloads').select('id', { count: 'exact', head: true }).gte('at', todayStr),
    supabase.from('resource_downloads').select('id', { count: 'exact', head: true }).gte('at', weekAgo),
    supabase.from('requests').select('id', { count: 'exact', head: true }).in('status', ['submitted', 'in_review']),
    supabase.from('feedback').select('id', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('contact_messages').select('id', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('takedowns').select('id', { count: 'exact', head: true }).is('taken_down_at', null),
  ])

  // Recent requests (action items)
  const { data: pendingRequestItems } = await supabase
    .from('requests')
    .select('id, description, status, created_at, profiles!inner(full_name)')
    .in('status', ['submitted', 'in_review'])
    .order('created_at', { ascending: false })
    .limit(5)

  const stats = [
    { label: 'Total users', value: totalUsers ?? 0, sub: `+${newUsersToday ?? 0} today`, icon: Users, color: 'text-blue-400', href: '/admin/users' },
    { label: 'Resources', value: publishedResources ?? 0, sub: `${totalResources ?? 0} total`, icon: BookOpen, color: 'text-emerald-400', href: '/admin/resources' },
    { label: 'Downloads today', value: downloadsToday ?? 0, sub: `${downloadsWeek ?? 0} this week`, icon: Download, color: 'text-purple-400', href: '/admin/resources' },
    { label: 'Pending requests', value: pendingRequests ?? 0, sub: 'Need review', icon: MessageSquare, color: 'text-amber-400', href: '/admin/requests' },
    { label: 'New feedback', value: newFeedback ?? 0, sub: 'Unacknowledged', icon: Eye, color: 'text-pink-400', href: '/admin/feedback' },
    { label: 'Contact messages', value: newContacts ?? 0, sub: 'Unanswered', icon: TrendingUp, color: 'text-cyan-400', href: '/admin/contact' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 mt-1">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
      </div>

      {/* Takedown alert */}
      {(newTakedowns ?? 0) > 0 && (
        <Link href="/admin/takedowns" className="block mb-6 p-4 bg-red-900/30 border border-red-700 rounded-xl flex items-center gap-3 hover:bg-red-900/40 transition-colors">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <div>
            <p className="font-semibold text-red-300">{newTakedowns} unresolved takedown{(newTakedowns ?? 0) > 1 ? 's' : ''}</p>
            <p className="text-xs text-red-400">Review and act within 48 hours as required by law.</p>
          </div>
        </Link>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {stats.map(stat => (
          <Link key={stat.label} href={stat.href} className="bg-slate-900 rounded-xl border border-slate-800 p-4 hover:border-slate-600 transition-colors group">
            <div className="flex items-start justify-between mb-2">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="text-2xl font-bold text-white">{stat.value.toLocaleString()}</p>
            <p className="text-sm text-slate-400 mt-0.5">{stat.label}</p>
            <p className="text-xs text-slate-600 mt-0.5">{stat.sub}</p>
          </Link>
        ))}
      </div>

      {/* Action items */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-5">
        <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-amber-400" />
          Pending student requests
        </h2>
        {(pendingRequestItems ?? []).length > 0 ? (
          <div className="space-y-2">
            {(pendingRequestItems ?? []).map((r) => {
              const profile = r.profiles as unknown as { full_name: string }
              return (
                <Link
                  key={r.id}
                  href={`/admin/requests/${r.id}`}
                  className="flex items-start gap-3 p-3 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium truncate">
                      {profile?.full_name ?? 'Unknown'}
                    </p>
                    <p className="text-xs text-slate-400 truncate">{r.description}</p>
                  </div>
                  <span className="text-xs text-amber-400 bg-amber-900/30 px-2 py-0.5 rounded-full capitalize flex-shrink-0">
                    {r.status}
                  </span>
                </Link>
              )
            })}
            <Link href="/admin/requests" className="block text-xs text-emerald-400 text-center mt-2 hover:underline">
              View all requests →
            </Link>
          </div>
        ) : (
          <p className="text-sm text-slate-500 text-center py-4">🎉 No pending requests</p>
        )}
      </div>
    </div>
  )
}

export const instant = false

import type { Metadata } from 'next'
import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import { Megaphone, Plus } from 'lucide-react'
import ArchiveButton from './ArchiveButton'

export const metadata: Metadata = {
  title: 'Announcements | Admin | PU Era',
  robots: { index: false },
}

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-emerald-900/30 text-emerald-400',
  scheduled: 'bg-blue-900/30 text-blue-400',
  draft: 'bg-slate-700 text-slate-400',
  expired: 'bg-slate-700 text-slate-500',
  archived: 'bg-slate-700 text-slate-600',
}

const PRIORITY_COLORS: Record<string, string> = {
  urgent: 'text-red-400',
  important: 'text-amber-400',
  normal: 'text-slate-400',
}


export default async function AdminAnnouncementsPage() {
  const supabase = createAdminClient()

  const { data: announcements } = await supabase
    .from('announcements')
    .select('id, title, status, priority, display_style, publish_at, expires_at, created_at, popup_policy')
    .not('status', 'eq', 'archived')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Megaphone className="w-6 h-6 text-emerald-400" />
          Announcements
        </h1>
        <Link
          href="/admin/announcements/new"
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          New announcement
        </Link>
      </div>

      {/* Table */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-800">
            <tr>
              {['Title', 'Status', 'Priority', 'Display', 'Popup policy', 'Publish at', 'Expires', 'Actions'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs text-slate-500 font-medium uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {(announcements ?? []).map(ann => (
              <tr key={ann.id} className="hover:bg-slate-800/50 transition-colors">
                <td className="px-4 py-3">
                  <p className="text-white font-medium">{ann.title}</p>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs capitalize ${STATUS_COLORS[ann.status] ?? 'text-slate-400'}`}>
                    {ann.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs capitalize font-medium ${PRIORITY_COLORS[ann.priority]}`}>
                    {ann.priority}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-400 capitalize text-xs">{ann.display_style}</td>
                <td className="px-4 py-3 text-slate-400 text-xs capitalize">{ann.popup_policy}</td>
                <td className="px-4 py-3 text-slate-400 text-xs">
                  {ann.publish_at ? new Date(ann.publish_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '–'}
                </td>
                <td className="px-4 py-3 text-slate-400 text-xs">
                  {ann.expires_at ? new Date(ann.expires_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Never'}
                </td>
                <td className="px-4 py-3">
                  <ArchiveButton id={ann.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(announcements ?? []).length === 0 && (
          <p className="text-center text-slate-500 py-8">No announcements yet. Create one to notify students.</p>
        )}
      </div>
    </div>
  )
}

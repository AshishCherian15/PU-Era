export const instant = false

import type { Metadata } from 'next'
import Link from 'next/link'
import { Megaphone, ArrowLeft } from 'lucide-react'
import AddAnnouncementForm from './AddAnnouncementForm'

export const metadata: Metadata = {
  title: 'New Announcement | Admin PU Era',
  robots: { index: false },
}

export default function NewAnnouncementPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link
          href="/admin/announcements"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Announcements
        </Link>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Megaphone className="w-6 h-6 text-emerald-400" />
          Create New Announcement
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Publish exam date notices, revised blueprint alerts, or platform updates.
        </p>
      </div>

      <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
        <AddAnnouncementForm />
      </div>
    </div>
  )
}

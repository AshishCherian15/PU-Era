export const instant = false

import Link from 'next/link'
import { FlaskConical, Plus } from 'lucide-react'

export default function AdminLabGuidesPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Lab Guides</h1>
          <p className="text-slate-400 text-sm mt-1">Manage practical lab guides for PUC subjects</p>
        </div>
        <span
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-500 rounded-lg text-sm font-medium cursor-not-allowed"
          title="Lab guide CRUD UI coming in Phase 2 — add experiments via Supabase for now"
        >
          <Plus className="w-4 h-4" /> Add Lab Guide
        </span>
      </div>

      <div className="bg-slate-900 rounded-xl border border-slate-800 p-8 text-center">
        <FlaskConical className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <p className="text-slate-400">No lab guides added yet.</p>
        <p className="text-slate-500 text-sm mt-1">Click "Add Lab Guide" to upload your first lab guide.</p>
      </div>
    </div>
  )
}

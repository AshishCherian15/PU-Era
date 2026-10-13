export const instant = false

import type { Metadata } from 'next'
import { createAdminClient } from '@/lib/supabase/admin'
import { BookMarked, Plus } from 'lucide-react'
import { AddResourceForm } from '../AddResourceForm'

export const metadata: Metadata = {
  title: 'Add Resource | Admin | PU Era',
  robots: { index: false },
}

export default async function NewResourcePage() {
  const supabase = createAdminClient()
  const { data: subjects } = await supabase
    .from('subjects')
    .select('id, name, class_level, stream')
    .eq('active', true)
    .order('class_level')
    .order('name')

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-emerald-600/20 flex items-center justify-center">
          <Plus className="w-4 h-4 text-emerald-400" />
        </div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <BookMarked className="w-6 h-6 text-emerald-400" />
          Add Resource
        </h1>
      </div>

      {/* How-to reminder */}
      <div className="bg-blue-900/20 border border-blue-800 rounded-xl p-4 mb-6 text-sm">
        <p className="font-semibold text-blue-300 mb-1">📌 Google Drive workflow</p>
        <ol className="text-blue-200 space-y-0.5 list-decimal list-inside text-xs">
          <li>Upload the PDF/document to the PU Era Google Drive folder</li>
          <li>Right-click → Share → "Anyone with the link" → Viewer</li>
          <li>Copy the link and paste it in the field below</li>
          <li>The file ID will be detected automatically</li>
        </ol>
      </div>

      <AddResourceForm subjects={subjects ?? []} />
    </div>
  )
}

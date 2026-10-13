export const instant = false

import type { Metadata } from 'next'
import { createAdminClient } from '@/lib/supabase/admin'
import { Lightbulb } from 'lucide-react'
import AdminSuggestionsTable from './AdminSuggestionsTable'

export const metadata: Metadata = {
  title: 'Suggestions | Admin PU Era',
  robots: { index: false },
}

export default async function AdminSuggestionsPage() {
  const supabase = createAdminClient()

  const { data: suggestions } = await supabase
    .from('suggestions')
    .select(`
      id, title, body, category, status, upvotes, admin_reply, created_at, updated_at,
      profiles (full_name, email)
    `)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Lightbulb className="w-6 h-6 text-amber-400" />
          Platform Suggestions
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Review ideas and feature requests submitted by students.
        </p>
      </div>

      <AdminSuggestionsTable initialSuggestions={(suggestions as any) ?? []} />
    </div>
  )
}

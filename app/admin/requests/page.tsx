export const instant = false

import type { Metadata } from 'next'
import { createAdminClient } from '@/lib/supabase/admin'
import { MessageSquare } from 'lucide-react'
import AdminRequestsTable from './AdminRequestsTable'

export const metadata: Metadata = {
  title: 'Material Requests | Admin PU Era',
  robots: { index: false },
}

export default async function AdminRequestsPage() {
  const supabase = createAdminClient()

  const { data: requests } = await supabase
    .from('requests')
    .select(`
      id, description, resource_type, status, priority, admin_reply, internal_note, created_at, updated_at,
      profiles (full_name, email),
      subjects (name),
      chapters (title, number)
    `)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-emerald-400" />
          Student Material Requests
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Review, prioritize, and respond to Karnataka PUC syllabus requests from students.
        </p>
      </div>

      <AdminRequestsTable initialRequests={(requests as any) ?? []} />
    </div>
  )
}

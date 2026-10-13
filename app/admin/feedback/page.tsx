export const instant = false

import type { Metadata } from 'next'
import { createAdminClient } from '@/lib/supabase/admin'
import { MessageCircle } from 'lucide-react'
import AdminFeedbackTable from './AdminFeedbackTable'

export const metadata: Metadata = {
  title: 'Feedback | Admin PU Era',
  robots: { index: false },
}

export default async function AdminFeedbackPage() {
  const supabase = createAdminClient()

  const { data: feedback } = await supabase
    .from('feedback')
    .select(`
      id, type, rating, message, page_url, status, created_at,
      profiles (full_name, email)
    `)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <MessageCircle className="w-6 h-6 text-emerald-400" />
          Feedback &amp; Error Reports
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Review broken Drive link reports, formula errors, and student feedback.
        </p>
      </div>

      <AdminFeedbackTable initialFeedback={(feedback as any) ?? []} />
    </div>
  )
}

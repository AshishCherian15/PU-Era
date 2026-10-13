import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { ArrowLeft, MessageSquare } from 'lucide-react'
import RequestForm from './RequestForm'

export const metadata: Metadata = {
  title: 'Request Material | PU Era',
  robots: { index: false },
}

export default async function NewRequestPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/student/requests/new')

  const admin = createAdminClient()
  const { data: subjects } = await admin
    .from('subjects')
    .select('id, name, class_level, stream')
    .eq('active', true)
    .order('name', { ascending: true })

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link
          href="/student/requests"
          className="inline-flex items-center gap-1 text-sm text-muted hover:text-heading mb-3 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to My Requests
        </Link>
        <h1 className="text-2xl font-bold text-heading flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-primary" />
          Request Study Material
        </h1>
        <p className="text-muted text-sm mt-1">
          Can't find a formula sheet, notes, or worked examples? Submit a request and our content curators will review it.
        </p>
      </div>

      <div className="calling-card p-6">
        <RequestForm subjects={subjects ?? []} />
      </div>
    </div>
  )
}

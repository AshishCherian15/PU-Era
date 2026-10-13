export const instant = false

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import { AlertTriangle, ArrowLeft } from 'lucide-react'
import UserActionForm from '../../UserActionForm'

export const metadata: Metadata = {
  title: 'Issue Warning | Admin PU Era',
  robots: { index: false },
}

export default async function WarnUserPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = createAdminClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, full_name, email')
    .eq('id', id)
    .single()

  if (!profile) notFound()

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <Link
          href={`/admin/users/${id}`}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to User Profile
        </Link>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-amber-400" />
          Issue Warning to {profile.full_name}
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          The student will be prompted to acknowledge this warning on their next login.
        </p>
      </div>

      <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
        <UserActionForm userId={id} action="warn" />
      </div>
    </div>
  )
}

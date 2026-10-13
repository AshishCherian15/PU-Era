import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Shield, KeyRound } from 'lucide-react'
import SecurityForm from './SecurityForm'

export const metadata: Metadata = {
  title: 'Security Settings | PU Era',
  robots: { index: false },
}

export default async function SecurityPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/student/security')

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-heading flex items-center gap-2">
          <Shield className="w-6 h-6 text-primary" />
          Security Settings
        </h1>
        <p className="text-muted text-sm mt-1">
          Manage your login password and account credentials.
        </p>
      </div>

      <div className="calling-card p-6">
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-heading">Change Password</h2>
            <p className="text-xs text-muted">Use a strong password with at least 8 characters</p>
          </div>
        </div>

        <SecurityForm />
      </div>
    </div>
  )
}

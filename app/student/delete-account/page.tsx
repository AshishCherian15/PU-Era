import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Trash2, AlertTriangle } from 'lucide-react'
import DeleteAccountForm from './DeleteAccountForm'

export const metadata: Metadata = {
  title: 'Delete Account | PU Era',
  robots: { index: false },
}

export default async function DeleteAccountPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/student/delete-account')

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-red-600 flex items-center gap-2">
          <Trash2 className="w-6 h-6" />
          Delete Account
        </h1>
        <p className="text-muted text-sm mt-1">
          Under the Digital Personal Data Protection Act 2023, you have the right to request erasure of your personal data.
        </p>
      </div>

      <div className="calling-card p-6 border-red-200">
        <div className="flex items-start gap-3 p-4 bg-red-50 text-red-800 rounded-xl mb-6 border border-red-200 text-sm">
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold">This action cannot be undone</p>
            <p className="text-xs text-red-700 leading-relaxed">
              Deleting your account will permanently remove:
            </p>
            <ul className="text-xs text-red-700 list-disc list-inside mt-2 space-y-1">
              <li>Your profile information (name, email, college, etc.)</li>
              <li>All bookmarks and saved resources</li>
              <li>Chapter progress tracking</li>
              <li>Download history</li>
              <li>Material requests and suggestions</li>
              <li>Consent records and guardian verifications</li>
              <li>Your authentication account</li>
            </ul>
            <p className="text-xs text-red-700 mt-2">
              You will be logged out immediately and redirected to the homepage.
            </p>
          </div>
        </div>

        <DeleteAccountForm email={user.email!} />
      </div>
    </div>
  )
}

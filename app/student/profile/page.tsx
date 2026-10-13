import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { User, ShieldCheck } from 'lucide-react'
import ProfileForm from './ProfileForm'

export const metadata: Metadata = {
  title: 'My Profile | PU Era',
  robots: { index: false },
}

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/student/profile')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, email, class_level, stream, medium, board_focus, college_name, guardian_email, is_minor, email_verified, created_at')
    .eq('id', user.id)
    .single()

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-heading flex items-center gap-2">
          <User className="w-6 h-6 text-primary" />
          My Profile
        </h1>
        <p className="text-muted text-sm mt-1">
          Manage your academic stream, class level, and personal preferences.
        </p>
      </div>

      <div className="calling-card p-6">
        <ProfileForm profile={profile} email={user.email!} />
      </div>
    </div>
  )
}

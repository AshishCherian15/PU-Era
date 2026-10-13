import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Bell } from 'lucide-react'
import NotificationsList from './NotificationsList'

export const metadata: Metadata = {
  title: 'Notifications | PU Era',
  robots: { index: false },
}

export default async function NotificationsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/student/notifications')

  const { data: notifications } = await supabase
    .from('notifications')
    .select('id, type, title, body, link, read_at, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-heading flex items-center gap-2">
            <Bell className="w-6 h-6 text-primary" />
            Notifications
          </h1>
          <p className="text-muted text-sm mt-1">
            Updates on requested study materials, new syllabus resources, and system announcements.
          </p>
        </div>
      </div>

      <NotificationsList initialNotifications={notifications ?? []} />
    </div>
  )
}

export const instant = false

import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import {
  BookOpen, Bookmark, CheckSquare, Download, Bell,
  MessageSquare, Lightbulb, MessageCircle, User, Shield, Trash2
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Dashboard | PU Era',
  robots: { index: false },
}

const NAV_ITEMS = [
  { href: '/student/dashboard', icon: BookOpen, label: 'Dashboard' },
  { href: '/student/bookmarks', icon: Bookmark, label: 'Bookmarks' },
  { href: '/student/progress', icon: CheckSquare, label: 'Progress' },
  { href: '/student/downloads', icon: Download, label: 'Downloads' },
  { href: '/student/notifications', icon: Bell, label: 'Notifications' },
  { href: '/student/requests', icon: MessageSquare, label: 'Requests' },
  { href: '/student/suggestions', icon: Lightbulb, label: 'Suggestions' },
  { href: '/student/feedback', icon: MessageCircle, label: 'Feedback' },
  { href: '/student/profile', icon: User, label: 'Profile' },
  { href: '/student/security', icon: Shield, label: 'Security' },
  { href: '/student/consent', icon: Shield, label: 'Consent Centre' },
  { href: '/student/delete-account', icon: Trash2, label: 'Delete Account' },
]

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login?next=/student/dashboard')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, email, email_verified, status')
    .eq('id', user.id)
    .single()

  // Unread notification count
  const { count: unreadCount } = await supabase
    .from('notifications')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .is('read_at', null)

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-surface">
      {/* Sidebar */}
      <aside className="md:w-64 md:min-h-screen border-r border-border bg-surface-alt flex-shrink-0">
        {/* Profile summary */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
              {profile?.full_name?.charAt(0)?.toUpperCase() ?? '?'}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-heading text-sm truncate">{profile?.full_name ?? 'Student'}</p>
              <p className="text-xs text-muted truncate">{profile?.email ?? user.email}</p>
            </div>
          </div>
          {!profile?.email_verified && (
            <Link
              href="/verify-email"
              className="mt-2 block text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded border border-amber-200 dark:border-amber-700 hover:bg-amber-100 transition-colors"
            >
              ⚠ Verify email to download
            </Link>
          )}
        </div>

        {/* Navigation */}
        <nav className="p-2" aria-label="Student navigation">
          {NAV_ITEMS.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-body hover:bg-surface hover:text-primary transition-colors relative"
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
              {item.label === 'Notifications' && (unreadCount ?? 0) > 0 && (
                <span className="ml-auto bg-primary text-white text-xs rounded-full px-1.5 py-0.5 min-w-[1.25rem] text-center">
                  {unreadCount}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Sign out */}
        <div className="p-4 border-t border-border mt-auto">
          <form action="/api/auth/signout" method="POST">
            <button
              type="submit"
              className="w-full text-sm text-muted hover:text-red-600 transition-colors text-left py-1"
            >
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 p-4 md:p-8">
        {children}
      </main>
    </div>
  )
}

import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { BookOpen, CheckSquare, Bookmark, Bell, TrendingUp } from 'lucide-react'

export default async function StudentDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/student/dashboard')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, class_level, stream, email_verified, is_minor')
    .eq('id', user.id)
    .single()

  // Stats
  const [{ count: bookmarkCount }, { count: progressCount }, { count: downloadCount }, { count: unreadCount }] =
    await Promise.all([
      supabase.from('bookmarks').select('user_id', { count: 'exact', head: true }).eq('user_id', user.id),
      supabase.from('progress').select('user_id', { count: 'exact', head: true }).eq('user_id', user.id),
      supabase.from('resource_downloads').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
      supabase.from('notifications').select('id', { count: 'exact', head: true }).eq('user_id', user.id).is('read_at', null),
    ])

  // Recent notifications
  const { data: notifications } = await supabase
    .from('notifications')
    .select('id, title, body, type, read_at, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  const firstName = profile?.full_name?.split(' ')[0] ?? 'Student'

  return (
    <div>
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-heading">
          Welcome back, {firstName} 👋
        </h1>
        <p className="text-muted mt-1">
          {profile?.class_level?.toUpperCase()} · {profile?.stream ? profile.stream.charAt(0).toUpperCase() + profile.stream.slice(1) : 'All streams'}
        </p>
      </div>

      {/* Verification banner */}
      {!profile?.email_verified && (
        <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl flex items-start gap-3">
          <span className="text-amber-500 text-xl">⚠</span>
          <div>
            <p className="font-semibold text-amber-800 dark:text-amber-200 text-sm">Verify your email to unlock downloads</p>
            <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">
              Check your inbox for a verification link. It may take a few minutes.
            </p>
            <Link href="/verify-email" className="text-xs text-amber-700 underline mt-1 inline-block">
              Resend verification email →
            </Link>
          </div>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: Bookmark, label: 'Bookmarks', value: bookmarkCount ?? 0, href: '/student/bookmarks', color: 'text-blue-600' },
          { icon: CheckSquare, label: 'Chapters done', value: progressCount ?? 0, href: '/student/progress', color: 'text-emerald-600' },
          { icon: BookOpen, label: 'Downloads', value: downloadCount ?? 0, href: '/student/downloads', color: 'text-purple-600' },
          { icon: Bell, label: 'Unread', value: unreadCount ?? 0, href: '/student/notifications', color: 'text-amber-600' },
        ].map(stat => (
          <Link key={stat.label} href={stat.href} className="calling-card hover:border-primary transition-colors group">
            <div className={`${stat.color} mb-2`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-heading">{stat.value}</p>
            <p className="text-sm text-muted group-hover:text-primary transition-colors">{stat.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Quick links */}
        <div className="calling-card">
          <h2 className="font-semibold text-heading mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            Quick actions
          </h2>
          <div className="space-y-2">
            {[
              { label: 'Browse study materials', href: '/subjects', icon: BookOpen },
              { label: 'Find lab guides', href: '/lab-guides', icon: '🔬' },
              { label: 'Official textbooks', href: '/textbooks', icon: '📚' },
              { label: 'Request missing material', href: '/student/requests', icon: '📩' },
            ].map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-surface-alt transition-colors text-sm text-body hover:text-primary"
              >
                <span className="text-base">
                  {typeof link.icon === 'string' ? link.icon : <link.icon className="w-4 h-4 text-primary" />}
                </span>
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Recent notifications */}
        <div className="calling-card">
          <h2 className="font-semibold text-heading mb-4 flex items-center gap-2">
            <Bell className="w-4 h-4 text-primary" />
            Recent notifications
          </h2>
          {(notifications ?? []).length > 0 ? (
            <div className="space-y-2">
              {(notifications ?? []).map(n => (
                <div
                  key={n.id}
                  className={`px-3 py-2 rounded-lg text-sm ${!n.read_at ? 'bg-primary/5 border border-primary/20' : 'bg-surface-alt'}`}
                >
                  <p className="font-medium text-heading">{n.title}</p>
                  {n.body && <p className="text-muted text-xs mt-0.5">{n.body}</p>}
                </div>
              ))}
              <Link href="/student/notifications" className="block text-xs text-primary text-center mt-2 hover:underline">
                View all notifications →
              </Link>
            </div>
          ) : (
            <p className="text-sm text-muted text-center py-4">No notifications yet</p>
          )}
        </div>
      </div>
    </div>
  )
}

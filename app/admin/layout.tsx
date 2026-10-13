export const instant = false

import { redirect } from 'next/navigation'
import { cookies, headers } from 'next/headers'
import Link from 'next/link'
import './admin.css'
import { createAdminClient } from '@/lib/supabase/admin'
import {
  LayoutDashboard, Users, BookOpen, FlaskConical, BookMarked, Megaphone,
  MessageSquare, Lightbulb, MessageCircle, Mail, Shield, Settings,
  BarChart2, AlertTriangle, LogOut, ChevronRight, Gavel
} from 'lucide-react'

async function verifyAdmin() {
  const cookieStore = await cookies()
  const adminSession = cookieStore.get('admin-session')
  if (!adminSession?.value) redirect('/admin/login')

  const supabase = createAdminClient()
  const { data: { user } } = await supabase.auth.getUser(adminSession.value)
  if (!user) redirect('/admin/login')

  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('role, status')
    .eq('user_id', user.id)
    .single()

  if (!adminUser || adminUser.status !== 'active') redirect('/admin/login')
  return { user, adminUser }
}

const NAV_GROUPS = [
  {
    label: 'Content',
    items: [
      { href: '/admin/subjects', icon: BookOpen, label: 'Subjects & Chapters' },
      { href: '/admin/resources', icon: BookMarked, label: 'Resources' },
      { href: '/admin/textbooks', icon: BookOpen, label: 'Textbooks' },
      { href: '/admin/lab-guides', icon: FlaskConical, label: 'Lab Guides' },
      { href: '/admin/announcements', icon: Megaphone, label: 'Announcements' },
      { href: '/admin/pages', icon: BookOpen, label: 'Pages / Legal' },
    ],
  },
  {
    label: 'Users',
    items: [
      { href: '/admin/users', icon: Users, label: 'All Users' },
      { href: '/admin/warnings', icon: AlertTriangle, label: 'Warnings' },
      { href: '/admin/roles', icon: Shield, label: 'Roles' },
    ],
  },
  {
    label: 'Engagement',
    items: [
      { href: '/admin/requests', icon: MessageSquare, label: 'Requests' },
      { href: '/admin/suggestions', icon: Lightbulb, label: 'Suggestions' },
      { href: '/admin/feedback', icon: MessageCircle, label: 'Feedback' },
      { href: '/admin/contact', icon: Mail, label: 'Contact Messages' },
    ],
  },
  {
    label: 'System',
    items: [
      { href: '/admin/provenance', icon: Shield, label: 'Provenance' },
      { href: '/admin/takedowns', icon: Gavel, label: 'Takedowns' },
      { href: '/admin/audit', icon: BarChart2, label: 'Audit Log' },
      { href: '/admin/settings', icon: Settings, label: 'Settings' },
    ],
  },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Skip auth guard for the login page itself
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') ?? headersList.get('x-invoke-path') ?? ''
  const isLoginPage = pathname === '/admin/login' || pathname.startsWith('/admin/login')

  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-slate-950">
        {children}
      </div>
    )
  }

  const { user, adminUser } = await verifyAdmin()

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-200">
      {/* Admin Sidebar */}
      <aside className="w-64 min-h-screen bg-slate-900 border-r border-slate-800 flex flex-col flex-shrink-0">
        {/* Logo */}
        <div className="p-4 border-b border-slate-800">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">PU Era Admin</p>
              <p className="text-xs text-slate-500 capitalize">{adminUser.role}</p>
            </div>
          </Link>
        </div>

        {/* Dashboard link */}
        <div className="p-2 border-b border-slate-800">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>
        </div>

        {/* Navigation groups */}
        <nav className="flex-1 overflow-y-auto p-2" aria-label="Admin navigation">
          {NAV_GROUPS.map(group => (
            <div key={group.label} className="mb-4">
              <p className="px-3 py-1 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                {group.label}
              </p>
              {group.items.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 text-xs text-slate-500 hover:text-slate-300 transition-colors"
          >
            View site <ChevronRight className="w-3 h-3" />
          </Link>
          <form action="/api/admin/auth/signout" method="POST">
            <button
              type="submit"
              className="flex items-center gap-2 text-xs text-slate-500 hover:text-red-400 transition-colors"
            >
              <LogOut className="w-3 h-3" /> Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 overflow-auto">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}

export const instant = false

import type { Metadata } from 'next'
import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import { Search, Filter, Shield, Ban, AlertTriangle, ExternalLink } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Users | Admin | PU Era',
  robots: { index: false },
}

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-emerald-900/30 text-emerald-400',
  warned: 'bg-amber-900/30 text-amber-400',
  suspended: 'bg-orange-900/30 text-orange-400',
  banned: 'bg-red-900/30 text-red-400',
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string; page?: string }>
}) {
  const params = await searchParams
  const status = params.status ?? ''
  const q = params.q ?? ''
  const page = parseInt(params.page ?? '1')
  const limit = 30
  const offset = (page - 1) * limit

  const supabase = createAdminClient()

  let query = supabase
    .from('profiles')
    .select('id, full_name, email, class_level, stream, status, is_minor, email_verified, login_count, last_login_at, created_at', { count: 'exact' })
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (status) query = query.eq('status', status)
  if (q) query = query.ilike('email', `%${q}%`)

  const { data: users, count } = await query

  const totalPages = Math.ceil((count ?? 0) / limit)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Shield className="w-6 h-6 text-emerald-400" />
          Users
          <span className="text-sm font-normal text-slate-500">{(count ?? 0).toLocaleString()} total</span>
        </h1>
      </div>

      {/* Filters */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 mb-6">
        <form className="flex flex-wrap gap-3" method="GET">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              name="q"
              defaultValue={q}
              placeholder="Search by email…"
              className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>
          <select
            name="status"
            defaultValue={status}
            className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-500"
          >
            <option value="">All statuses</option>
            <option value="active">Active</option>
            <option value="warned">Warned</option>
            <option value="suspended">Suspended</option>
            <option value="banned">Banned</option>
          </select>
          <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm rounded-lg transition-colors flex items-center gap-2">
            <Filter className="w-3 h-3" /> Filter
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-800">
            <tr>
              {['Name', 'Email', 'Class', 'Status', 'Verified', 'Logins', 'Joined', 'Actions'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs text-slate-500 font-medium uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {(users ?? []).map(user => (
              <tr key={user.id} className="hover:bg-slate-800/50 transition-colors">
                <td className="px-4 py-3 text-white font-medium">{user.full_name}</td>
                <td className="px-4 py-3 text-slate-400">{user.email}</td>
                <td className="px-4 py-3 text-slate-400">
                  {user.class_level?.toUpperCase() ?? '–'} {user.stream ? `/ ${user.stream}` : ''}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs capitalize ${STATUS_COLORS[user.status] ?? 'text-slate-400'}`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {user.email_verified ? (
                    <span className="text-emerald-400 text-xs">✓</span>
                  ) : (
                    <span className="text-amber-400 text-xs">Pending</span>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-400">{user.login_count ?? 0}</td>
                <td className="px-4 py-3 text-slate-500 text-xs">
                  {new Date(user.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/users/${user.id}`} className="text-slate-400 hover:text-white transition-colors" title="View user">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                    <Link href={`/admin/users/${user.id}/warn`} className="text-slate-400 hover:text-amber-400 transition-colors" title="Warn user">
                      <AlertTriangle className="w-3.5 h-3.5" />
                    </Link>
                    <Link href={`/admin/users/${user.id}/suspend`} className="text-slate-400 hover:text-red-400 transition-colors" title="Suspend/ban user">
                      <Ban className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {(users ?? []).length === 0 && (
          <p className="text-center text-slate-500 py-8">No users found</p>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          {page > 1 && (
            <Link
              href={`?page=${page - 1}${status ? `&status=${status}` : ''}${q ? `&q=${q}` : ''}`}
              className="px-3 py-1.5 bg-slate-800 text-slate-300 text-sm rounded-lg hover:bg-slate-700 transition-colors"
            >
              ← Prev
            </Link>
          )}
          <span className="text-slate-500 text-sm">Page {page} of {totalPages}</span>
          {page < totalPages && (
            <Link
              href={`?page=${page + 1}${status ? `&status=${status}` : ''}${q ? `&q=${q}` : ''}`}
              className="px-3 py-1.5 bg-slate-800 text-slate-300 text-sm rounded-lg hover:bg-slate-700 transition-colors"
            >
              Next →
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

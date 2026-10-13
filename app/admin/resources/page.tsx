export const instant = false

import type { Metadata } from 'next'
import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import { BookMarked, Plus, Filter, CheckCircle2, Clock, Archive } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Resources | Admin | PU Era',
  robots: { index: false },
}

const STATUS_COLORS: Record<string, string> = {
  published: 'bg-emerald-900/30 text-emerald-400',
  draft: 'bg-slate-700 text-slate-400',
  scheduled: 'bg-blue-900/30 text-blue-400',
  archived: 'bg-slate-700 text-slate-600',
}

export default async function AdminResourcesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; type?: string; q?: string; page?: string }>
}) {
  const params = await searchParams
  const status = params.status ?? ''
  const type = params.type ?? ''
  const q = params.q ?? ''
  const page = parseInt(params.page ?? '1')
  const limit = 30
  const offset = (page - 1) * limit

  const supabase = createAdminClient()

  let query = supabase
    .from('resources')
    .select(`
      id, slug, title, type, status, medium, allow_download, allow_view,
      views, downloads, published_at, created_at, verified_at,
      subjects!inner(name, class_level)
    `, { count: 'exact' })
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (status) query = query.eq('status', status)
  if (type) query = query.eq('type', type)
  if (q) query = query.ilike('title', `%${q}%`)

  const { data: resources, count } = await query
  const totalPages = Math.ceil((count ?? 0) / limit)

  const { data: subjects } = await supabase
    .from('subjects')
    .select('id, name, class_level')
    .eq('active', true)
    .order('name')

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <BookMarked className="w-6 h-6 text-emerald-400" />
          Resources
          <span className="text-sm font-normal text-slate-500">{(count ?? 0).toLocaleString()} total</span>
        </h1>
        <Link
          href="/admin/resources/new"
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add resource
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 mb-6">
        <form className="flex flex-wrap gap-3" method="GET">
          <input
            name="q"
            defaultValue={q}
            placeholder="Search by title…"
            className="flex-1 min-w-48 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-500"
          />
          <select name="status" defaultValue={status} className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm">
            <option value="">All statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="archived">Archived</option>
          </select>
          <select name="type" defaultValue={type} className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm">
            <option value="">All types</option>
            {['chapter_notes','short_notes','summary','important_qa','formula_sheet','revision_pdf','project_guide','worked_examples','lab_guide','lab_video'].map(t => (
              <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>
            ))}
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
              {['Title', 'Subject', 'Type', 'Status', 'Medium', 'Views', 'Downloads', 'Verified', 'Actions'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs text-slate-500 font-medium uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {(resources ?? []).map((r) => {
              const subject = (r as unknown as { subjects: { name: string; class_level: string } }).subjects
              return (
                <tr key={r.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-3">
                    <Link href={`/admin/resources/${r.id}`} className="text-white font-medium hover:text-emerald-400 transition-colors">
                      {r.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-xs">{subject.name} · {subject.class_level?.toUpperCase()}</td>
                  <td className="px-4 py-3 text-slate-400 text-xs capitalize">{(r.type as string).replace(/_/g, ' ')}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs capitalize ${STATUS_COLORS[r.status as string] ?? 'text-slate-400'}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-xs uppercase">{r.medium}</td>
                  <td className="px-4 py-3 text-slate-400">{(r.views as number ?? 0).toLocaleString()}</td>
                  <td className="px-4 py-3 text-slate-400">{(r.downloads as number ?? 0).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    {r.verified_at ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Clock className="w-4 h-4 text-slate-600" />
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/resources/${r.id}`} className="text-xs text-slate-400 hover:text-white px-2 py-1 bg-slate-800 rounded">Edit</Link>
                      <Link href={`/admin/resources/${r.id}/verify`} className="text-xs text-slate-400 hover:text-emerald-400 px-2 py-1 bg-slate-800 rounded">Verify</Link>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {(resources ?? []).length === 0 && (
          <p className="text-center text-slate-500 py-8">No resources found.</p>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          {page > 1 && (
            <Link href={`?page=${page - 1}&status=${status}&type=${type}&q=${q}`} className="px-3 py-1.5 bg-slate-800 text-slate-300 text-sm rounded-lg hover:bg-slate-700">← Prev</Link>
          )}
          <span className="text-slate-500 text-sm">Page {page} of {totalPages}</span>
          {page < totalPages && (
            <Link href={`?page=${page + 1}&status=${status}&type=${type}&q=${q}`} className="px-3 py-1.5 bg-slate-800 text-slate-300 text-sm rounded-lg hover:bg-slate-700">Next →</Link>
          )}
        </div>
      )}
    </div>
  )
}

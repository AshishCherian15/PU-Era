export const instant = false

import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import { Shield, Info } from 'lucide-react'

export default async function AdminProvenancePage() {
  const supabase = createAdminClient()

  const { data: resources } = await supabase
    .from('resources')
    .select(`
      id, slug, title, source_type, licence, permission_ref, permission_proof_path,
      external_url, status, created_at,
      subjects ( slug, name )
    `)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .limit(100)

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Content Provenance</h1>
        <p className="text-slate-400 text-sm mt-1">Track the origin and licensing of all uploaded content</p>
      </div>

      <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 mb-6">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <h2 className="text-sm font-semibold text-white mb-1">About Provenance Tracking</h2>
            <p className="text-sm text-slate-400">
              Each resource records source type, licence, and permission references. Use this view before publishing
              or when responding to copyright requests.
            </p>
          </div>
        </div>
      </div>

      {(resources ?? []).length === 0 ? (
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-8 text-center">
          <Shield className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400">No resources in the database yet.</p>
          <p className="text-slate-500 text-sm mt-1">
            Add resources via{' '}
            <Link href="/admin/resources/new" className="text-emerald-400 hover:text-emerald-300">
              Admin → Resources → New
            </Link>
            .
          </p>
        </div>
      ) : (
        <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-left text-slate-500">
                  <th className="px-5 py-3 font-medium">Resource</th>
                  <th className="px-5 py-3 font-medium">Subject</th>
                  <th className="px-5 py-3 font-medium">Source</th>
                  <th className="px-5 py-3 font-medium">Licence</th>
                  <th className="px-5 py-3 font-medium">Permission ref</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {resources!.map((r) => {
                  const raw = r.subjects as { slug: string; name: string } | { slug: string; name: string }[] | null
                  const subject = Array.isArray(raw) ? raw[0] : raw
                  return (
                    <tr key={r.id}>
                      <td className="px-5 py-3">
                        <Link href={`/admin/resources/${r.id}`} className="text-white hover:text-emerald-400">
                          {r.title}
                        </Link>
                        <p className="text-xs text-slate-600 font-mono mt-0.5">{r.slug}</p>
                      </td>
                      <td className="px-5 py-3 text-slate-300">{subject?.name ?? '—'}</td>
                      <td className="px-5 py-3 text-slate-400 capitalize">{r.source_type.replace('_', ' ')}</td>
                      <td className="px-5 py-3 text-slate-400">{r.licence}</td>
                      <td className="px-5 py-3 text-slate-500 text-xs max-w-[200px] truncate">
                        {r.permission_ref || r.permission_proof_path || '—'}
                      </td>
                      <td className="px-5 py-3">
                        <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300">{r.status}</span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

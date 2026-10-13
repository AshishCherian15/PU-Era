import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Download, FileText, ExternalLink, Calendar } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Download History | PU Era',
  robots: { index: false },
}

export default async function DownloadsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/student/downloads')

  const { data: downloads } = await supabase
    .from('resource_downloads')
    .select(`
      id, at,
      resources (
        id, slug, title, type, medium, external_url
      )
    `)
    .eq('user_id', user.id)
    .order('at', { ascending: false })

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-heading flex items-center gap-2">
          <Download className="w-6 h-6 text-primary" />
          Download History
        </h1>
        <p className="text-muted text-sm mt-1">
          Review notes, formula sheets, and study materials you previously downloaded.
        </p>
      </div>

      {(downloads ?? []).length === 0 ? (
        <div className="calling-card text-center py-16">
          <Download className="w-12 h-12 text-muted mx-auto mb-3" />
          <p className="font-semibold text-heading mb-1">No downloads yet</p>
          <p className="text-muted text-sm mb-4">
            Browse our subject notes and revision materials to start studying offline.
          </p>
          <Link href="/subjects" className="btn-primary">
            Browse Subjects
          </Link>
        </div>
      ) : (
        <div className="calling-card overflow-hidden p-0 divide-y divide-border">
          {downloads!.map(item => {
            const res = item.resources as any
            if (!res) return null

            return (
              <div key={item.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-brand-green flex items-center justify-center flex-shrink-0 mt-0.5 border border-emerald-100">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <Link
                      href={`/resources/${res.slug}`}
                      className="font-semibold text-heading text-sm hover:text-primary transition-colors block truncate"
                    >
                      {res.title}
                    </Link>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted mt-1">
                      <span className="capitalize">{res.type?.replace(/_/g, ' ')}</span>
                      <span>•</span>
                      <span className="uppercase">{res.medium} Medium</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(item.at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link
                    href={`/resources/${res.slug}`}
                    className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Open
                  </Link>
                  <a
                    href={`/api/resources/${res.id}/download`}
                    className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download Again
                  </a>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

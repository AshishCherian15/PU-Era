import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Bookmark, FolderOpen, ExternalLink, Download } from 'lucide-react'

export const metadata: Metadata = {
  title: 'My Bookmarks | PU Era',
  robots: { index: false },
}

export default async function BookmarksPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/student/bookmarks')

  const { data: bookmarks } = await supabase
    .from('bookmarks')
    .select(`
      folder, created_at,
      resources!inner(
        id, slug, title, type, medium, allow_download, external_url,
        verified_at, subjects!inner(name, slug)
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const folders = [...new Set((bookmarks ?? []).map(b => b.folder ?? 'Unsorted'))]

  return (
    <div>
      <h1 className="text-2xl font-bold text-heading mb-6 flex items-center gap-2">
        <Bookmark className="w-6 h-6 text-primary" />
        My Bookmarks
      </h1>

      {(bookmarks ?? []).length === 0 ? (
        <div className="calling-card text-center py-12">
          <Bookmark className="w-12 h-12 text-muted mx-auto mb-3" />
          <p className="font-semibold text-heading mb-1">No bookmarks yet</p>
          <p className="text-muted text-sm mb-4">Save resources as you study to find them quickly later.</p>
          <Link href="/subjects" className="btn-primary">Browse subjects</Link>
        </div>
      ) : (
        <div className="space-y-8">
          {folders.map(folder => {
            const items = (bookmarks ?? []).filter(b => (b.folder ?? 'Unsorted') === folder)
            return (
              <section key={folder}>
                <h2 className="text-base font-semibold text-heading mb-3 flex items-center gap-2">
                  <FolderOpen className="w-4 h-4 text-amber-500" />
                  {folder}
                  <span className="text-xs text-muted font-normal">({items.length})</span>
                </h2>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map(b => {
                    const r = b.resources as unknown as {
                      id: string; slug: string; title: string; type: string; allow_download: boolean;
                      external_url?: string; verified_at?: string; subjects: { name: string; slug: string }
                    }
                    return (
                      <div key={r.id} className="calling-card hover:border-primary transition-colors">
                        <p className="text-xs text-muted mb-1">{r.subjects.name}</p>
                        <h3 className="font-medium text-heading text-sm mb-2 leading-snug">{r.title}</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-surface-alt px-2 py-0.5 rounded-full capitalize">
                            {r.type.replace(/_/g, ' ')}
                          </span>
                          {r.allow_download && (
                            <Link
                              href={`/api/resources/${r.id}/download`}
                              className="text-xs text-primary hover:underline flex items-center gap-1"
                            >
                              <Download className="w-3 h-3" /> Download
                            </Link>
                          )}
                          {r.external_url && (
                            <a
                              href={r.external_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-primary hover:underline flex items-center gap-1"
                            >
                              <ExternalLink className="w-3 h-3" /> Open
                            </a>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>
            )
          })}
        </div>
      )}
    </div>
  )
}

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { GoogleDriveViewer } from '@/app/components/GoogleDriveViewer'
import { parseDriveLink, isDriveUrl } from '@/lib/drive'
import {
  ChevronRight, FileText, CheckCircle2, AlertTriangle,
  Eye, Download, ExternalLink, Calendar
} from 'lucide-react'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('resources')
    .select('title, description, type, subjects!inner(name, class_level)')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!data) return { title: 'Resource Not Found | PU Era' }
  const subject = (data as unknown as { subjects: { name: string; class_level: string } }).subjects

  return {
    title: `${data.title} — ${subject.name} ${subject.class_level.toUpperCase()} | PU Era`,
    description: data.description ?? `Free ${(data.type as string).replace(/_/g, ' ')} for ${subject.name} — Karnataka PUC ${subject.class_level.toUpperCase()}`,
    openGraph: {
      title: `${data.title} | PU Era`,
      description: data.description ?? `Free study material for ${subject.name}`,
    },
  }
}

export default async function ResourcePage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  // Get resource
  const { data: resource } = await supabase
    .from('resources')
    .select(`
      id, slug, title, description, type, medium, allow_view, allow_download,
      external_url, file_path, source_type, licence, views, downloads,
      verified_at, published_at, created_at,
      subjects!inner(id, name, slug, class_level, stream),
      chapters(id, title, number, slug)
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .is('deleted_at', null)
    .single()

  if (!resource) notFound()

  // Auth check
  const { data: { user } } = await supabase.auth.getUser()
  const isLoggedIn = !!user

  // Get related resources
  const { data: related } = await supabase
    .from('resources')
    .select('id, slug, title, type, medium, allow_download')
    .eq('subject_id', (resource as unknown as { subjects: { id: string } }).subjects.id)
    .eq('status', 'published')
    .neq('id', resource.id)
    .limit(4)

  const r = resource as unknown as typeof resource & {
    subjects: { id: string; name: string; slug: string; class_level: string; stream: string }
    chapters: { id: string; title: string; number: number; slug: string } | null
  }

  const driveLink = r.external_url ? parseDriveLink(r.external_url) : null
  const isExternal = r.external_url && !driveLink
  const isVideo = r.type === 'lab_video'

  const TYPE_LABELS: Record<string, string> = {
    chapter_notes: 'Chapter Notes', short_notes: 'Short Notes', summary: 'Summary',
    important_qa: 'Important Q&A', formula_sheet: 'Formula Sheet', revision_pdf: 'Revision PDF',
    project_guide: 'Project Guide', worked_examples: 'Worked Examples',
    lab_guide: 'Lab Guide', lab_video: 'Lab Video',
  }

  const LICENCE_LABELS: Record<string, string> = {
    own: 'Original PU Era content (CC BY 4.0)',
    ncert_econtent: 'NCERT e-Content (Government of India)',
    ktbs_permission: 'KTBS (Government of Karnataka)',
    cc_by: 'Creative Commons Attribution',
    govt: 'Government publication',
    written_permission: 'Reproduced with permission',
  }

  // Increment view count (fire and forget)
  supabase.rpc('increment_resource_views', { resource_id: resource.id }).then(() => {})

  return (
    <main className="page-container py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-muted mb-6 flex-wrap" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <ChevronRight className="w-4 h-4 flex-shrink-0" />
        <Link href="/subjects" className="hover:text-primary transition-colors">Subjects</Link>
        <ChevronRight className="w-4 h-4 flex-shrink-0" />
        <Link href={`/subjects/${r.subjects.slug}`} className="hover:text-primary transition-colors">
          {r.subjects.name}
        </Link>
        {r.chapters && (
          <>
            <ChevronRight className="w-4 h-4 flex-shrink-0" />
            <Link href={`/subjects/${r.subjects.slug}/${r.chapters.slug}`} className="hover:text-primary transition-colors">
              Ch {r.chapters.number}
            </Link>
          </>
        )}
        <ChevronRight className="w-4 h-4 flex-shrink-0" />
        <span className="text-heading font-medium truncate max-w-[200px]">{r.title}</span>
      </nav>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main content — Preview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                {TYPE_LABELS[r.type] ?? r.type}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-surface-alt text-muted border border-border">
                {r.medium === 'en' ? 'English Medium' : 'Kannada Medium'}
              </span>
              {r.verified_at && (
                <span className="text-xs flex items-center gap-1 text-emerald-600 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3" /> Verified
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-heading leading-tight">{r.title}</h1>
            {r.description && (
              <p className="text-muted mt-2 text-base">{r.description}</p>
            )}
          </div>

          {/* Google Drive Preview / Video embed */}
          {r.allow_view && r.external_url && (
            <>
              {isVideo ? (
                <div className="calling-card p-0 overflow-hidden">
                  <div className="aspect-video bg-black rounded-xl overflow-hidden">
                    {isDriveUrl(r.external_url) ? (
                      <iframe
                        src={parseDriveLink(r.external_url)?.previewUrl ?? r.external_url}
                        className="w-full h-full border-0"
                        allowFullScreen
                        allow="autoplay"
                        title={r.title}
                      />
                    ) : (
                      <iframe
                        src={r.external_url}
                        className="w-full h-full border-0"
                        allowFullScreen
                        allow="autoplay"
                        title={r.title}
                      />
                    )}
                  </div>
                </div>
              ) : driveLink ? (
                <div className="calling-card p-4">
                  <h2 className="font-semibold text-heading mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" />
                    Preview
                  </h2>
                  <GoogleDriveViewer
                    url={r.external_url}
                    title={r.title}
                    allowDownload={r.allow_download}
                    requiresLogin={r.allow_download && !isLoggedIn}
                  />
                </div>
              ) : isExternal ? (
                <div className="calling-card flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <ExternalLink className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-heading">External resource</p>
                    <p className="text-sm text-muted">Opens on the official source website</p>
                  </div>
                  <a
                    href={r.external_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary flex items-center gap-1"
                  >
                    Open <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ) : null}
            </>
          )}

          {/* Login gate for download-only resources */}
          {!r.allow_view && r.allow_download && !isLoggedIn && (
            <div className="calling-card text-center py-8">
              <FileText className="w-10 h-10 text-muted mx-auto mb-3" />
              <h2 className="font-bold text-heading mb-2">Sign in to download</h2>
              <p className="text-muted text-sm mb-4">Free to register · No credit card</p>
              <div className="flex items-center justify-center gap-3">
                <Link href="/register" className="btn-primary">Create free account</Link>
                <Link href={`/login?next=/resources/${r.slug}`} className="btn-secondary">Sign in</Link>
              </div>
            </div>
          )}

          {/* Source disclosure */}
          <div className="flex items-start gap-2 text-xs text-muted bg-surface-alt px-3 py-2.5 rounded-lg border border-border">
            <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Source:</strong> {LICENCE_LABELS[r.licence] ?? r.licence}.
              {r.source_type === 'own' && ' Written and verified by PU Era.'}
            </span>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          {/* Info card */}
          <div className="calling-card space-y-3">
            <h3 className="font-semibold text-heading">Resource details</h3>
            <InfoRow icon={<FileText className="w-4 h-4" />} label="Type" value={TYPE_LABELS[r.type] ?? r.type} />
            <InfoRow icon={<Eye className="w-4 h-4" />} label="Views" value={r.views.toLocaleString()} />
            {r.allow_download && (
              <InfoRow icon={<Download className="w-4 h-4" />} label="Downloads" value={r.downloads.toLocaleString()} />
            )}
            <InfoRow
              icon={<Calendar className="w-4 h-4" />}
              label="Published"
              value={r.published_at ? new Date(r.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
            />
          </div>

          {/* Subject link */}
          <div className="calling-card">
            <h3 className="font-semibold text-heading mb-2 text-sm">Subject</h3>
            <Link
              href={`/subjects/${r.subjects.slug}`}
              className="text-primary hover:underline font-medium text-sm"
            >
              {r.subjects.name}
            </Link>
            <p className="text-xs text-muted mt-0.5">
              {r.subjects.class_level.toUpperCase()} · {r.subjects.stream}
            </p>
          </div>

          {/* Chapter link */}
          {r.chapters && (
            <div className="calling-card">
              <h3 className="font-semibold text-heading mb-2 text-sm">Chapter</h3>
              <Link
                href={`/subjects/${r.subjects.slug}/${r.chapters.slug}`}
                className="text-primary hover:underline font-medium text-sm"
              >
                Ch {r.chapters.number}. {r.chapters.title}
              </Link>
            </div>
          )}

          {/* Related resources */}
          {(related ?? []).length > 0 && (
            <div className="calling-card">
              <h3 className="font-semibold text-heading mb-3 text-sm">More from {r.subjects.name}</h3>
              <div className="space-y-2">
                {(related ?? []).map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/resources/${rel.slug}`}
                    className="block text-sm text-body hover:text-primary transition-colors py-1 border-b border-border last:border-0"
                  >
                    {rel.title}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Report link */}
          <Link
            href={`/contact?type=content_error&page=${encodeURIComponent(`/resources/${r.slug}`)}`}
            className="block text-center text-xs text-muted hover:text-primary transition-colors py-2"
          >
            Found an error? Report it →
          </Link>
        </aside>
      </div>
    </main>
  )
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-muted">{icon}</span>
      <span className="text-muted flex-shrink-0">{label}:</span>
      <span className="text-heading font-medium">{value}</span>
    </div>
  )
}

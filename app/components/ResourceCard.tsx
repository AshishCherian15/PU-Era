'use client'
import Link from 'next/link'
import { Download, ExternalLink, Eye, Bookmark, FileText, FlaskConical, Film, CheckCircle2 } from 'lucide-react'
import { parseDriveLink, isDriveUrl } from '@/lib/drive'
import type { Resource } from '@/lib/types'

const TYPE_ICONS: Record<string, React.ElementType> = {
  chapter_notes: FileText,
  short_notes: FileText,
  summary: FileText,
  important_qa: FileText,
  formula_sheet: FileText,
  revision_pdf: FileText,
  project_guide: FileText,
  worked_examples: FileText,
  lab_guide: FlaskConical,
  lab_video: Film,
}

const TYPE_LABELS: Record<string, string> = {
  chapter_notes: 'Chapter Notes',
  short_notes: 'Short Notes',
  summary: 'Summary',
  important_qa: 'Important Q&A',
  formula_sheet: 'Formula Sheet',
  revision_pdf: 'Revision PDF',
  project_guide: 'Project Guide',
  worked_examples: 'Worked Examples',
  lab_guide: 'Lab Guide',
  lab_video: 'Lab Video',
}

const TYPE_COLORS: Record<string, string> = {
  chapter_notes: 'bg-blue-50 text-blue-700 border-blue-200',
  short_notes: 'bg-purple-50 text-purple-700 border-purple-200',
  summary: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  important_qa: 'bg-amber-50 text-amber-700 border-amber-200',
  formula_sheet: 'bg-pink-50 text-pink-700 border-pink-200',
  revision_pdf: 'bg-red-50 text-red-700 border-red-200',
  project_guide: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  worked_examples: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  lab_guide: 'bg-green-50 text-green-700 border-green-200',
  lab_video: 'bg-orange-50 text-orange-700 border-orange-200',
}

interface Props {
  resource: Resource & {
    subjects?: { name: string; slug: string }
    chapters?: { title: string; number: number }
  }
  isLoggedIn?: boolean
  showSubject?: boolean
}

export function ResourceCard({ resource, isLoggedIn = false, showSubject = false }: Props) {
  const Icon = TYPE_ICONS[resource.type] ?? FileText
  const label = TYPE_LABELS[resource.type] ?? resource.type
  const colorClass = TYPE_COLORS[resource.type] ?? 'bg-slate-50 text-slate-700 border-slate-200'

  const driveLink = resource.external_url ? parseDriveLink(resource.external_url) : null
  const isVideo = resource.type === 'lab_video'

  return (
    <div className="calling-card group flex flex-col gap-3 hover:border-primary transition-all hover:-translate-y-0.5 duration-200">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 border ${colorClass}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          {/* Type badge */}
          <span className={`inline-block text-xs px-2 py-0.5 rounded-full border mb-1 ${colorClass}`}>
            {label}
          </span>
          <h3 className="font-semibold text-heading text-sm leading-snug group-hover:text-primary transition-colors">
            {resource.title}
          </h3>
          {showSubject && resource.subjects && (
            <p className="text-xs text-muted mt-0.5">{resource.subjects.name}</p>
          )}
          {resource.chapters && (
            <p className="text-xs text-muted mt-0.5">Ch {resource.chapters.number} · {resource.chapters.title}</p>
          )}
        </div>
      </div>

      {/* Description */}
      {resource.description && (
        <p className="text-xs text-muted line-clamp-2">{resource.description}</p>
      )}

      {/* Meta row */}
      <div className="flex items-center gap-3 text-xs text-muted">
        <span className="uppercase font-medium">{resource.medium === 'en' ? 'English' : 'Kannada'}</span>
        {resource.views > 0 && <span>{resource.views.toLocaleString()} views</span>}
        {resource.verified_at && (
          <span className="flex items-center gap-0.5 text-emerald-600">
            <CheckCircle2 className="w-3 h-3" /> Verified
          </span>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2 pt-2 border-t border-border mt-auto">
        {/* View / Preview */}
        {resource.allow_view && resource.external_url && (
          <>
            {isVideo ? (
              <a
                href={resource.external_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1"
              >
                <Film className="w-3 h-3" /> Watch
              </a>
            ) : driveLink ? (
              <Link
                href={`/resources/${resource.slug}`}
                className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1"
              >
                <Eye className="w-3 h-3" /> Preview
              </Link>
            ) : (
              <a
                href={resource.external_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1"
              >
                <ExternalLink className="w-3 h-3" /> Open
              </a>
            )}
          </>
        )}

        {/* Download gate */}
        {resource.allow_download && driveLink && (
          isLoggedIn ? (
            <a
              href={driveLink.downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1"
            >
              <Download className="w-3 h-3" /> Download
            </a>
          ) : (
            <Link
              href={`/login?next=/resources/${resource.slug}`}
              className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1"
              title="Sign in to download"
            >
              <Download className="w-3 h-3" /> Download
            </Link>
          )
        )}

        {/* Bookmark (client-side action) */}
        {isLoggedIn && (
          <button
            className="ml-auto text-muted hover:text-amber-500 transition-colors p-1"
            title="Bookmark"
            aria-label={`Bookmark ${resource.title}`}
            onClick={() => {
              fetch('/api/bookmarks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ resource_id: resource.id }),
              })
            }}
          >
            <Bookmark className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}

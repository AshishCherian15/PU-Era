'use client'
import { useState } from 'react'
import { ExternalLink, Download, Eye, EyeOff, FileText, BookOpen } from 'lucide-react'
import { parseDriveLink } from '@/lib/drive'

interface Props {
  url: string
  title: string
  allowDownload?: boolean
  requiresLogin?: boolean
}

/**
 * GoogleDriveViewer
 * Shows an inline Google Drive preview iframe + View/Download action buttons.
 * For unauthenticated users, shows a blurred preview + login CTA instead of full iframe.
 */
export function GoogleDriveViewer({ url, title, allowDownload = true, requiresLogin = false }: Props) {
  const [showPreview, setShowPreview] = useState(true)
  const [iframeLoaded, setIframeLoaded] = useState(false)
  const drive = parseDriveLink(url)

  if (!drive) {
    // Not a Drive link — show plain external link
    return (
      <div className="calling-card flex items-center gap-3">
        <FileText className="w-5 h-5 text-primary flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="font-medium text-heading text-sm">{title}</p>
          <p className="text-xs text-muted">External resource</p>
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary text-xs px-3 py-1.5"
        >
          Open <ExternalLink className="w-3 h-3 ml-1" />
        </a>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Action bar */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setShowPreview(v => !v)}
          className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1.5"
          aria-expanded={showPreview}
        >
          {showPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          {showPreview ? 'Hide preview' : 'Show preview'}
        </button>

        <a
          href={drive.viewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1.5"
        >
          <BookOpen className="w-3.5 h-3.5" />
          Open in Drive
        </a>

        {allowDownload && (
          <a
            href={drive.downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Download PDF
          </a>
        )}
      </div>

      {/* Preview iframe */}
      {showPreview && (
        <div className="relative rounded-xl overflow-hidden border border-border bg-surface-alt" style={{ aspectRatio: '4/5.5' }}>
          {/* Loading skeleton */}
          {!iframeLoaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-surface-alt z-10">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center animate-pulse">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <p className="text-sm text-muted">Loading preview…</p>
            </div>
          )}

          {requiresLogin ? (
            /* Blurred preview for unauthenticated users */
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-white/80 backdrop-blur-sm">
              <div className="text-center p-6 max-w-xs">
                <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
                <h3 className="font-bold text-heading mb-2">Sign in to view &amp; download</h3>
                <p className="text-sm text-muted mb-4">
                  Free to register. Takes 30 seconds.
                </p>
                <a href="/register" className="btn-primary w-full block text-center mb-2">
                  Create free account
                </a>
                <a href="/login" className="btn-secondary w-full block text-center text-sm">
                  Sign in
                </a>
              </div>
            </div>
          ) : null}

          <iframe
            src={drive.previewUrl}
            title={`Preview: ${title}`}
            className="w-full h-full border-0"
            allow="autoplay"
            onLoad={() => setIframeLoaded(true)}
            style={{ filter: requiresLogin ? 'blur(4px)' : 'none' }}
          />
        </div>
      )}

      {/* Drive attribution */}
      <p className="text-xs text-muted text-center">
        Hosted on Google Drive · Opens in your Google account
      </p>
    </div>
  )
}

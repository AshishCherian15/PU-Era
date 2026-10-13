/**
 * Google Drive utilities
 * Parses any Google Drive share URL and returns the file ID + derived URLs.
 *
 * Supported input formats:
 *   https://drive.google.com/file/d/{ID}/view?usp=sharing
 *   https://drive.google.com/open?id={ID}
 *   https://drive.google.com/uc?id={ID}
 *   https://docs.google.com/document/d/{ID}/edit
 *   https://docs.google.com/spreadsheets/d/{ID}/edit
 *   https://docs.google.com/presentation/d/{ID}/edit
 */

export function extractDriveId(url: string): string | null {
  if (!url) return null
  try {
    // /file/d/{ID}/ or /document/d/{ID}/ or /spreadsheets/d/{ID}/
    const pathMatch = url.match(/\/d\/([a-zA-Z0-9_-]{10,})/i)
    if (pathMatch) return pathMatch[1]!

    // ?id={ID} or &id={ID}
    const parsed = new URL(url)
    const id = parsed.searchParams.get('id')
    if (id && id.length >= 10) return id

    return null
  } catch {
    return null
  }
}

export interface DriveUrls {
  fileId: string
  previewUrl: string   // Embeddable iframe preview
  viewUrl: string      // Open in Drive (browser)
  downloadUrl: string  // Direct download link
}

export function buildDriveUrls(fileId: string): DriveUrls {
  return {
    fileId,
    previewUrl: `https://drive.google.com/file/d/${fileId}/preview`,
    viewUrl: `https://drive.google.com/file/d/${fileId}/view`,
    downloadUrl: `https://drive.google.com/uc?export=download&id=${fileId}`,
  }
}

/**
 * Full pipeline: parse any Google Drive link into all needed URLs.
 * Returns null if the link is not a recognisable Google Drive URL.
 */
export function parseDriveLink(url: string): DriveUrls | null {
  const fileId = extractDriveId(url)
  if (!fileId) return null
  return buildDriveUrls(fileId)
}

/**
 * Check if a URL is a Google Drive / Google Docs URL
 */
export function isDriveUrl(url: string): boolean {
  return /drive\.google\.com|docs\.google\.com|sheets\.google\.com|slides\.google\.com/.test(url)
}

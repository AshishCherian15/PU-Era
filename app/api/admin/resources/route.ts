import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { z } from 'zod'
import { parseDriveLink } from '@/lib/drive'

const schema = z.object({
  title: z.string().min(1).max(300),
  description: z.string().max(400).optional().nullable(),
  type: z.enum(['chapter_notes','short_notes','summary','important_qa','formula_sheet','revision_pdf','project_guide','worked_examples','lab_guide','lab_video']),
  subject_id: z.string().uuid(),
  chapter_id: z.string().uuid().optional().nullable(),
  medium: z.enum(['en','kn']),
  source_type: z.enum(['own','external_link','permissioned']),
  licence: z.enum(['own','ncert_econtent','written_permission','ktbs_permission','cc_by','govt']),
  permission_ref: z.string().optional().nullable(),
  external_url: z.string().url().optional().nullable(),
  allow_view: z.boolean(),
  allow_download: z.boolean(),
  status: z.enum(['draft','published','scheduled','archived']),
  academic_year: z.string().max(10).optional().nullable(),
})

export async function POST(request: NextRequest) {
  const supabase = createAdminClient()
  const body = await request.json()
  const result = schema.safeParse(body)

  if (!result.success) {
    return NextResponse.json(
      { ok: false, error: { code: 'VALIDATION', message: 'Invalid input', fields: result.error.flatten().fieldErrors } },
      { status: 422 }
    )
  }

  const data = result.data

  // Provenance check — own content must be source_type=own
  if (data.source_type === 'permissioned' && !data.permission_ref) {
    return NextResponse.json(
      { ok: false, error: { code: 'VALIDATION', message: 'Permission reference is required for permissioned content.' } },
      { status: 422 }
    )
  }

  // Cannot mark external links as allow_download
  if (data.source_type === 'external_link' && data.allow_download) {
    return NextResponse.json(
      { ok: false, error: { code: 'VALIDATION', message: 'Cannot enable download for external links. Students will download directly from the source.' } },
      { status: 422 }
    )
  }

  // Generate slug from title
  const slugBase = data.title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80)

  const timestamp = Date.now().toString(36)
  const slug = `${slugBase}-${timestamp}`

  // Extract file_path from Drive link if provided
  const driveInfo = data.external_url ? parseDriveLink(data.external_url) : null

  const { data: resource, error } = await supabase.from('resources').insert({
    slug,
    title: data.title,
    description: data.description ?? null,
    type: data.type,
    subject_id: data.subject_id,
    chapter_id: data.chapter_id ?? null,
    medium: data.medium,
    source_type: data.source_type,
    licence: data.licence,
    permission_ref: data.permission_ref ?? null,
    external_url: data.external_url ?? null,
    file_path: driveInfo?.fileId ? `drive:${driveInfo.fileId}` : null,
    allow_view: data.allow_view,
    allow_download: data.allow_download,
    status: data.status,
    academic_year: data.academic_year ?? null,
    published_at: data.status === 'published' ? new Date().toISOString() : null,
  }).select('id, slug').single()

  if (error) {
    console.error('[POST /api/admin/resources]', error)
    return NextResponse.json(
      { ok: false, error: { code: 'SERVER', message: error.message } },
      { status: 500 }
    )
  }

  return NextResponse.json({ ok: true, data: resource }, { status: 201 })
}

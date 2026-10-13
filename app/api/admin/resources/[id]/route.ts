import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { parseDriveLink } from '@/lib/drive'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = createAdminClient()

  const { data: resource, error } = await supabase
    .from('resources')
    .select('*, subjects(name, class_level), chapters(title, number)')
    .eq('id', id)
    .single()

  if (error || !resource) {
    return NextResponse.json({ ok: false, error: { code: 'NOT_FOUND', message: 'Resource not found' } }, { status: 404 })
  }

  return NextResponse.json({ ok: true, data: resource })
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = createAdminClient()
  const body = await request.json()

  // If external_url changed and is a Google Drive link, extract fileId
  let filePath = body.file_path
  if (body.external_url) {
    const driveInfo = parseDriveLink(body.external_url)
    if (driveInfo?.fileId) {
      filePath = `drive:${driveInfo.fileId}`
    }
  }

  const updates: Record<string, any> = {
    ...body,
    ...(filePath ? { file_path: filePath } : {}),
  }

  // Handle verify action
  if (body.verify) {
    updates.verified_at = new Date().toISOString()
  }

  const { data, error } = await supabase
    .from('resources')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ ok: false, error: { code: 'DB_ERROR', message: error.message } }, { status: 500 })
  }

  return NextResponse.json({ ok: true, data })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = createAdminClient()

  const { error } = await supabase
    .from('resources')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)

  if (error) {
    return NextResponse.json({ ok: false, error: { code: 'DB_ERROR', message: error.message } }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}

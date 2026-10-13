import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { z } from 'zod'

const schema = z.object({
  subject_id: z.string().uuid().optional().nullable(),
  chapter_id: z.string().uuid().optional().nullable(),
  resource_type: z.enum([
    'chapter_notes', 'short_notes', 'summary', 'important_qa',
    'formula_sheet', 'revision_pdf', 'project_guide', 'worked_examples',
    'lab_guide', 'lab_video'
  ]).optional().nullable(),
  description: z.string().min(20, 'Description must be at least 20 characters').max(500, 'Description cannot exceed 500 characters'),
})

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ ok: false, error: { code: 'AUTH_REQUIRED', message: 'Sign in to submit a request' } }, { status: 401 })
  }

  const body = await request.json()
  const result = schema.safeParse(body)
  if (!result.success) {
    return NextResponse.json(
      { ok: false, error: { code: 'VALIDATION', message: result.error.issues[0]?.message ?? 'Invalid input' } },
      { status: 422 }
    )
  }

  const admin = createAdminClient()
  const { data, error } = await admin.from('requests').insert({
    user_id: user.id,
    subject_id: result.data.subject_id || null,
    chapter_id: result.data.chapter_id || null,
    resource_type: result.data.resource_type || null,
    description: result.data.description,
    status: 'submitted',
  }).select().single()

  if (error) {
    return NextResponse.json({ ok: false, error: { code: 'DB_ERROR', message: error.message } }, { status: 500 })
  }

  return NextResponse.json({ ok: true, data }, { status: 201 })
}

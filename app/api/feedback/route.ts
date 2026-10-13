import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { z } from 'zod'

const schema = z.object({
  type: z.enum(['general', 'broken_link', 'wrong_chapter', 'content_error', 'suggestion']),
  rating: z.number().int().min(1).max(5).optional().nullable(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000, 'Message cannot exceed 1000 characters'),
  page_url: z.string().optional().nullable(),
})

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const json = await request.json()
  const result = schema.safeParse(json)
  if (!result.success) {
    return NextResponse.json(
      { ok: false, error: { code: 'VALIDATION', message: result.error.issues[0]?.message ?? 'Invalid input' } },
      { status: 422 }
    )
  }

  const admin = createAdminClient()
  const { data, error } = await admin.from('feedback').insert({
    user_id: user?.id ?? null,
    type: result.data.type,
    rating: result.data.rating ?? null,
    message: result.data.message,
    page_url: result.data.page_url ?? null,
    status: 'new',
  }).select().single()

  if (error) {
    return NextResponse.json({ ok: false, error: { code: 'DB_ERROR', message: error.message } }, { status: 500 })
  }

  return NextResponse.json({ ok: true, data }, { status: 201 })
}

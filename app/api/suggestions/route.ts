import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { z } from 'zod'

const schema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(150),
  body: z.string().min(20, 'Details must be at least 20 characters').max(1000),
  category: z.string().max(50).optional().nullable(),
})

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ ok: false, error: { code: 'AUTH_REQUIRED', message: 'Sign in to submit a suggestion' } }, { status: 401 })
  }

  const json = await request.json()
  const result = schema.safeParse(json)
  if (!result.success) {
    return NextResponse.json(
      { ok: false, error: { code: 'VALIDATION', message: result.error.issues[0]?.message ?? 'Invalid input' } },
      { status: 422 }
    )
  }

  const admin = createAdminClient()
  const { data, error } = await admin.from('suggestions').insert({
    user_id: user.id,
    title: result.data.title,
    body: result.data.body,
    category: result.data.category || 'Platform Feature',
    status: 'new',
  }).select().single()

  if (error) {
    return NextResponse.json({ ok: false, error: { code: 'DB_ERROR', message: error.message } }, { status: 500 })
  }

  return NextResponse.json({ ok: true, data }, { status: 201 })
}

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { z } from 'zod'

const schema = z.object({ chapter_id: z.string().uuid() })

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ ok: false, error: { code: 'AUTH_REQUIRED' } }, { status: 401 })

  const body = await request.json()
  const result = schema.safeParse(body)
  if (!result.success) return NextResponse.json({ ok: false, error: { code: 'VALIDATION' } }, { status: 422 })

  const admin = createAdminClient()
  const { error } = await admin.from('progress').upsert({
    user_id: user.id,
    chapter_id: result.data.chapter_id,
    done_at: new Date().toISOString(),
  }, { onConflict: 'user_id,chapter_id' })

  if (error) return NextResponse.json({ ok: false, error: { code: 'SERVER' } }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ ok: false, error: { code: 'AUTH_REQUIRED' } }, { status: 401 })

  const body = await request.json()
  const result = schema.safeParse(body)
  if (!result.success) return NextResponse.json({ ok: false, error: { code: 'VALIDATION' } }, { status: 422 })

  const admin = createAdminClient()
  await admin.from('progress')
    .delete()
    .eq('user_id', user.id)
    .eq('chapter_id', result.data.chapter_id)

  return NextResponse.json({ ok: true })
}

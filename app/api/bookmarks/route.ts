import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { z } from 'zod'

const schema = z.object({
  resource_id: z.string().uuid(),
  folder: z.string().max(50).optional(),
})

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ ok: false, error: { code: 'AUTH_REQUIRED' } }, { status: 401 })

  const body = await request.json()
  const result = schema.safeParse(body)
  if (!result.success) return NextResponse.json({ ok: false, error: { code: 'VALIDATION' } }, { status: 422 })

  const admin = createAdminClient()
  const { error } = await admin.from('bookmarks').upsert({
    user_id: user.id,
    resource_id: result.data.resource_id,
    folder: result.data.folder ?? null,
  }, { onConflict: 'user_id,resource_id' })

  if (error) return NextResponse.json({ ok: false, error: { code: 'SERVER' } }, { status: 500 })
  return NextResponse.json({ ok: true, data: { message: 'Bookmarked' } })
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ ok: false, error: { code: 'AUTH_REQUIRED' } }, { status: 401 })

  const body = await request.json()
  const result = schema.safeParse(body)
  if (!result.success) return NextResponse.json({ ok: false, error: { code: 'VALIDATION' } }, { status: 422 })

  const admin = createAdminClient()
  await admin.from('bookmarks')
    .delete()
    .eq('user_id', user.id)
    .eq('resource_id', result.data.resource_id)

  return NextResponse.json({ ok: true })
}

import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { z } from 'zod'

const schema = z.object({
  title: z.string().min(2).max(200),
  body: z.string().min(5).max(2000),
  display_style: z.enum(['popup', 'banner', 'both', 'page_only']).default('banner'),
  priority: z.enum(['normal', 'important', 'urgent']).default('normal'),
  popup_policy: z.enum(['once', 'every_visit', 'never']).default('once'),
  action_label: z.string().optional().nullable(),
  action_url: z.string().url().optional().nullable(),
  status: z.enum(['draft', 'scheduled', 'active', 'expired', 'archived']).default('active'),
})

export async function POST(request: NextRequest) {
  const supabase = createAdminClient()
  const body = await request.json()
  const result = schema.safeParse(body)

  if (!result.success) {
    return NextResponse.json(
      { ok: false, error: { code: 'VALIDATION', message: result.error.issues[0]?.message ?? 'Invalid input' } },
      { status: 422 }
    )
  }

  const { data, error } = await supabase
    .from('announcements')
    .insert(result.data)
    .select()
    .single()

  if (error) {
    return NextResponse.json(
      { ok: false, error: { code: 'DB_ERROR', message: error.message } },
      { status: 500 }
    )
  }

  return NextResponse.json({ ok: true, data }, { status: 201 })
}

export async function PATCH(request: NextRequest) {
  const supabase = createAdminClient()
  const { id, status } = await request.json()
  if (!id || !status) return NextResponse.json({ ok: false }, { status: 422 })

  const { error } = await supabase.from('announcements').update({ status }).eq('id', id)
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}

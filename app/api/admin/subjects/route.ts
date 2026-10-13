import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(2).max(100),
  name_kn: z.string().optional().nullable(),
  slug: z.string().min(2).max(100),
  class_level: z.enum(['puc1', 'puc2', 'ncert11', 'ncert12']),
  stream: z.enum(['science', 'commerce', 'arts', 'common']),
  board: z.enum(['ktbs', 'ncert']),
  has_lab: z.boolean().default(false),
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
    .from('subjects')
    .insert({
      ...result.data,
      active: true,
    })
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

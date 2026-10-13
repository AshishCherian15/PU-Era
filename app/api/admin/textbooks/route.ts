import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { z } from 'zod'

const schema = z.object({
  board: z.enum(['ktbs', 'ncert']),
  class_level: z.enum(['puc1', 'puc2', 'ncert11', 'ncert12']),
  subject_name: z.string().min(2).max(100),
  medium: z.enum(['en', 'kn']),
  official_url: z.string().url('Must be a valid URL pointing directly to KTBS or NCERT official domain'),
  source_label: z.string().default('Official Portal'),
  notes: z.string().optional().nullable(),
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
    .from('textbooks')
    .insert({
      ...result.data,
      is_active: true,
      last_checked: new Date().toISOString(),
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

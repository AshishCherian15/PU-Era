import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { z } from 'zod'

const schema = z.object({
  action: z.enum(['warn', 'suspend', 'lift_suspension']),
  reason: z.string().min(5).max(500),
})

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = createAdminClient()
  const body = await request.json()
  const result = schema.safeParse(body)

  if (!result.success) {
    return NextResponse.json(
      { ok: false, error: { code: 'VALIDATION', message: 'Reason must be at least 5 characters.' } },
      { status: 422 }
    )
  }

  const { action, reason } = result.data

  if (action === 'warn') {
    // 1. Insert warning
    await supabase.from('warnings').insert({
      user_id: id,
      reason,
    })
    // 2. Update profile status to warned
    await supabase.from('profiles').update({ status: 'warned' }).eq('id', id)
    // 3. Add notification to user
    await supabase.from('notifications').insert({
      user_id: id,
      type: 'warning',
      title: 'Official Community Warning',
      body: reason,
    })
  } else if (action === 'suspend') {
    // 1. Insert suspension
    await supabase.from('suspensions').insert({
      user_id: id,
      reason,
      starts_at: new Date().toISOString(),
    })
    // 2. Update profile status to suspended
    await supabase.from('profiles').update({ status: 'suspended' }).eq('id', id)
  } else if (action === 'lift_suspension') {
    await supabase.from('profiles').update({ status: 'active' }).eq('id', id)
  }

  return NextResponse.json({ ok: true })
}

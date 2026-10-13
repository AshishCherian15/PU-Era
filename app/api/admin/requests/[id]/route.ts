import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { z } from 'zod'

const schema = z.object({
  status: z.enum(['submitted', 'in_review', 'approved', 'in_progress', 'completed', 'declined']).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional().nullable(),
  admin_reply: z.string().optional().nullable(),
  internal_note: z.string().optional().nullable(),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = createAdminClient()
  const body = await request.json()
  const result = schema.safeParse(body)

  if (!result.success) {
    return NextResponse.json(
      { ok: false, error: { code: 'VALIDATION', message: 'Invalid payload' } },
      { status: 422 }
    )
  }

  const { data, error } = await supabase
    .from('requests')
    .update({
      ...result.data,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return NextResponse.json(
      { ok: false, error: { code: 'DB_ERROR', message: error.message } },
      { status: 500 }
    )
  }

  // If status is completed or admin replied, create a notification for the student
  if (data && (result.data.status === 'completed' || result.data.admin_reply)) {
    await supabase.from('notifications').insert({
      user_id: data.user_id,
      type: 'request_update',
      title: result.data.status === 'completed' ? 'Your requested material is ready!' : 'Update on your material request',
      body: result.data.admin_reply || 'Your request status has been updated.',
      link: '/student/requests',
    })
  }

  return NextResponse.json({ ok: true, data })
}

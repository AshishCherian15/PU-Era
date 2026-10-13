import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { z } from 'zod'

const updateSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  class_level: z.enum(['puc1', 'puc2', 'ncert11', 'ncert12']).optional().nullable(),
  stream: z.enum(['science', 'commerce', 'arts', 'common']).optional().nullable(),
  medium: z.enum(['en', 'kn']).optional().nullable(),
  board_focus: z.enum(['ktbs', 'ncert']).optional().nullable(),
  college_name: z.string().max(200).optional().nullable(),
  guardian_email: z.string().email().optional().nullable(),
})

export async function PATCH(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ ok: false, error: { code: 'AUTH_REQUIRED' } }, { status: 401 })
  }

  const json = await request.json()
  const result = updateSchema.safeParse(json)
  if (!result.success) {
    return NextResponse.json(
      { ok: false, error: { code: 'VALIDATION', message: result.error.issues[0]?.message ?? 'Invalid input' } },
      { status: 422 }
    )
  }

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('profiles')
    .update({
      full_name: result.data.full_name,
      class_level: result.data.class_level || null,
      stream: result.data.stream || null,
      medium: result.data.medium || 'en',
      board_focus: result.data.board_focus || null,
      college_name: result.data.college_name || null,
      guardian_email: result.data.guardian_email || null,
    })
    .eq('id', user.id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ ok: false, error: { code: 'DB_ERROR', message: error.message } }, { status: 500 })
  }

  return NextResponse.json({ ok: true, data })
}

export async function DELETE() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ ok: false, error: { code: 'AUTH_REQUIRED' } }, { status: 401 })
  }

  const admin = createAdminClient()
  const userId = user.id

  // Delete user-related data in order (due to foreign key constraints)
  // 1. Delete bookmarks
  await admin.from('bookmarks').delete().eq('user_id', userId)

  // 2. Delete progress
  await admin.from('progress').delete().eq('user_id', userId)

  // 3. Delete resource download logs
  await admin.from('resource_downloads').delete().eq('user_id', userId)

  // 4. Delete notification dismissals
  await admin.from('announcement_dismissals').delete().eq('user_id', userId)

  // 5. Delete consent records
  await admin.from('consents').delete().eq('user_id', userId)

  // 6. Delete guardian consent tokens
  await admin.from('guardian_consents').delete().eq('user_id', userId)

  // 7. Delete the profile
  const { error: profileError } = await admin
    .from('profiles')
    .delete()
    .eq('id', userId)

  if (profileError) {
    return NextResponse.json({ ok: false, error: { code: 'DB_ERROR', message: profileError.message } }, { status: 500 })
  }

  // 8. Delete the auth user (this will cascade)
  const { error: authError } = await admin.auth.admin.deleteUser(userId)

  if (authError) {
    return NextResponse.json({ ok: false, error: { code: 'AUTH_ERROR', message: authError.message } }, { status: 500 })
  }

  // Sign out the user
  await supabase.auth.signOut()

  return NextResponse.json({ ok: true, data: { message: 'Account permanently deleted' } })
}

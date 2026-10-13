import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export async function POST(request: NextRequest) {
  const body = await request.json()
  const result = schema.safeParse(body)

  if (!result.success) {
    return NextResponse.json(
      { ok: false, error: { code: 'VALIDATION', message: 'Invalid credentials.' } },
      { status: 422 }
    )
  }

  const { email, password } = result.data

  // 1. Authenticate using anon client (signInWithPassword requires anon key)
  const anonClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data: authData, error: authError } = await anonClient.auth.signInWithPassword({
    email,
    password,
  })

  if (authError || !authData.user) {
    return NextResponse.json(
      { ok: false, error: { code: 'AUTH_REQUIRED', message: 'Invalid email or password.' } },
      { status: 401 }
    )
  }

  // 2. Check admin_users using service role client (bypasses RLS)
  const adminClient = createAdminClient()
  const { data: adminUser } = await adminClient
    .from('admin_users')
    .select('role, status')
    .eq('user_id', authData.user.id)
    .single()

  if (!adminUser || adminUser.status !== 'active') {
    return NextResponse.json(
      { ok: false, error: { code: 'FORBIDDEN', message: 'This is not an admin account.' } },
      { status: 403 }
    )
  }

  // 3. Update last_login
  await adminClient
    .from('admin_users')
    .update({ last_login_at: new Date().toISOString() })
    .eq('user_id', authData.user.id)

  // 4. Set admin session cookie
  const response = NextResponse.json({
    ok: true,
    data: { role: adminUser.role, redirectTo: '/admin/dashboard' },
  })

  response.cookies.set('admin-session', authData.session!.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 12,
  })

  return response
}

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  // 1. Verify session
  const supabase = await createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    return NextResponse.json(
      { ok: false, error: { code: 'AUTH_REQUIRED', message: 'Sign in to download resources' } },
      { status: 401 }
    )
  }

  // 2. Get the user profile for entitlement checks
  const { data: profile } = await supabase
    .from('profiles')
    .select('status, email_verified, is_minor')
    .eq('id', user.id)
    .single()

  if (!profile) {
    return NextResponse.json(
      { ok: false, error: { code: 'AUTH_REQUIRED', message: 'Profile not found' } },
      { status: 401 }
    )
  }

  if (profile.status === 'banned' || profile.status === 'suspended') {
    return NextResponse.json(
      { ok: false, error: { code: 'FORBIDDEN', message: 'Your account is currently restricted.' } },
      { status: 403 }
    )
  }

  if (!profile.email_verified) {
    return NextResponse.json(
      { ok: false, error: { code: 'FORBIDDEN', message: 'Please verify your email before downloading.' } },
      { status: 403 }
    )
  }

  // 3. Get the resource (admin client to bypass RLS for full resource data)
  const admin = createAdminClient()
  const { data: resource } = await admin
    .from('resources')
    .select('id, title, file_path, external_url, source_type, allow_download, allow_view, status, deleted_at')
    .eq('id', id)
    .single()

  if (!resource || resource.status !== 'published' || resource.deleted_at) {
    return NextResponse.json(
      { ok: false, error: { code: 'NOT_FOUND', message: 'Resource not found or no longer available.' } },
      { status: 404 }
    )
  }

  if (!resource.allow_download && !resource.allow_view) {
    return NextResponse.json(
      { ok: false, error: { code: 'FORBIDDEN', message: 'This resource is not available for download.' } },
      { status: 403 }
    )
  }

  // 4. If minor, check guardian consent
  if (profile.is_minor) {
    const { data: consent } = await admin
      .from('guardian_consents')
      .select('verified_at')
      .eq('student_id', user.id)
      .not('verified_at', 'is', null)
      .single()

    if (!consent) {
      return NextResponse.json(
        { ok: false, error: { code: 'FORBIDDEN', message: 'Guardian consent is required. Please check your inbox.' } },
        { status: 403 }
      )
    }
  }

  // 5. Rate limit check — max 40 downloads per day
  const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  const { count } = await admin
    .from('resource_downloads')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .gte('at', dayAgo)

  if ((count ?? 0) >= 40) {
    return NextResponse.json(
      { ok: false, error: { code: 'RATE_LIMITED', message: 'Daily download limit reached. Try again tomorrow.' } },
      { status: 429 }
    )
  }

  // 6. Log the download
  await admin.from('resource_downloads').insert({
    user_id: user.id,
    resource_id: id,
    ip_hash: request.headers.get('x-forwarded-for') ?? 'unknown',
  })

  // 7. Serve external link or generate signed URL
  if (resource.external_url) {
    return NextResponse.redirect(resource.external_url)
  }

  if (resource.file_path) {
    const { data: signedUrl } = await admin.storage
      .from('notes-private')
      .createSignedUrl(resource.file_path, 120) // 120 second TTL

    if (!signedUrl?.signedUrl) {
      return NextResponse.json(
        { ok: false, error: { code: 'SERVER', message: 'Could not generate download link.' } },
        { status: 500 }
      )
    }

    return NextResponse.redirect(signedUrl.signedUrl)
  }

  return NextResponse.json(
    { ok: false, error: { code: 'NOT_FOUND', message: 'No file found for this resource.' } },
    { status: 404 }
  )
}

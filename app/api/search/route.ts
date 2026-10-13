import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q')?.trim() ?? ''
  const type = request.nextUrl.searchParams.get('type') ?? ''
  const classLevel = request.nextUrl.searchParams.get('class') ?? ''
  const medium = request.nextUrl.searchParams.get('medium') ?? ''
  const page = parseInt(request.nextUrl.searchParams.get('page') ?? '1')
  const limit = 20
  const offset = (page - 1) * limit

  if (!q || q.length < 2) {
    return NextResponse.json({ ok: true, data: { results: [], total: 0, query: q } })
  }

  const supabase = await createClient()

  // Log the search (anonymously)
  const { data: { user } } = await supabase.auth.getUser()
  const admin = createAdminClient()

  let query = admin
    .from('resources')
    .select(`
      id, slug, title, description, type, medium, allow_download, allow_view, views,
      subjects!inner(id, name, slug, class_level, stream),
      chapters(id, title, number)
    `, { count: 'exact' })
    .eq('status', 'published')
    .is('deleted_at', null)

  // Full-text search OR title ilike
  if (q.length >= 3) {
    query = query.textSearch('search', q, { type: 'websearch', config: 'simple' })
  } else {
    query = query.ilike('title', `%${q}%`)
  }

  if (type) query = query.eq('type', type)
  if (medium) query = query.eq('medium', medium)
  if (classLevel) query = query.eq('subjects.class_level', classLevel)

  query = query
    .order('views', { ascending: false })
    .range(offset, offset + limit - 1)

  const { data: results, count } = await query

  // Log search — ignore errors
  admin.from('search_logs').insert({
    user_id: user?.id ?? null,
    query: q,
    results_count: count ?? 0,
  }).then(() => {})

  return NextResponse.json({
    ok: true,
    data: {
      results: results ?? [],
      total: count ?? 0,
      page,
      limit,
      query: q,
    },
  })
}

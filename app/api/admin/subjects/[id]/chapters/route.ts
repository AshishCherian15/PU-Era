import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  if (!id) {
    return NextResponse.json(
      { ok: false, error: { code: 'BAD_REQUEST', message: 'Subject ID is required' } },
      { status: 400 }
    )
  }

  const supabase = createAdminClient()
  const { data: chapters, error } = await supabase
    .from('chapters')
    .select('id, number, title, slug, description, total_resources')
    .eq('subject_id', id)
    .order('number', { ascending: true })

  if (error) {
    return NextResponse.json(
      { ok: false, error: { code: 'DB_ERROR', message: error.message } },
      { status: 500 }
    )
  }

  return NextResponse.json({ ok: true, data: chapters ?? [] })
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = createAdminClient()

  try {
    const body = await request.json()
    const { number, title, slug, description } = body

    if (!title || !number) {
      return NextResponse.json(
        { ok: false, error: { code: 'VALIDATION', message: 'Title and chapter number are required' } },
        { status: 422 }
      )
    }

    const chapterSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    const { data, error } = await supabase
      .from('chapters')
      .insert({
        subject_id: id,
        number: Number(number),
        title,
        slug: chapterSlug,
        description: description || null,
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
  } catch {
    return NextResponse.json(
      { ok: false, error: { code: 'BAD_REQUEST', message: 'Invalid payload' } },
      { status: 400 }
    )
  }
}

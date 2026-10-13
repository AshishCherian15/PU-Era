import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  subject: z.string().min(1).max(200),
  message: z.string().min(20).max(1000),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = schema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { ok: false, error: { code: 'VALIDATION', message: 'Invalid input', fields: result.error.flatten().fieldErrors } },
        { status: 422 }
      )
    }

    const supabase = createAdminClient()
    const { error } = await supabase.from('contact_messages').insert({
      name: result.data.name,
      email: result.data.email,
      subject: result.data.subject,
      message: result.data.message,
    })

    if (error) throw error

    return NextResponse.json({ ok: true, data: { message: 'Message received. We will reply within 48 hours.' } })
  } catch (err) {
    console.error('[/api/contact]', err)
    return NextResponse.json(
      { ok: false, error: { code: 'SERVER', message: 'Failed to send message' } },
      { status: 500 }
    )
  }
}

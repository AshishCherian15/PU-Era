import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { KARNATAKA_PUC_COLLEGES } from '@/lib/colleges'

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.toLowerCase().trim() ?? ''

  const admin = createAdminClient()
  const { data } = await admin
    .from('profiles')
    .select('college_name')
    .not('college_name', 'is', null)
    .neq('college_name', '')

  const staticNames = new Set(KARNATAKA_PUC_COLLEGES.map(c => c.name.toLowerCase()))

  const userColleges = [...new Set((data ?? []).map(r => r.college_name as string))]
    .filter(name => name && !staticNames.has(name.toLowerCase()))
    .map(name => ({ id: `user-${name}`, name, city: '', district: '', source: 'user' as const }))

  const all = [...KARNATAKA_PUC_COLLEGES, ...userColleges]

  const filtered = q
    ? all.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q) ||
        c.district.toLowerCase().includes(q)
      )
    : all.slice(0, 30)

  return NextResponse.json(filtered.slice(0, 40))
}

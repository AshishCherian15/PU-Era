export const instant = false

import type { Metadata } from 'next'
import { createAdminClient } from '@/lib/supabase/admin'
import { BookOpen } from 'lucide-react'
import AdminTextbooksView from './AdminTextbooksView'

export const metadata: Metadata = {
  title: 'Textbooks Directory | Admin PU Era',
  robots: { index: false },
}

export default async function AdminTextbooksPage() {
  const supabase = createAdminClient()

  const { data: textbooks } = await supabase
    .from('textbooks')
    .select('*')
    .order('class_level', { ascending: true })
    .order('subject_name', { ascending: true })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-emerald-400" />
          Official Textbooks Directory
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Direct canonical links to KTBS and NCERT portals. (Never self-host official textbooks).
        </p>
      </div>

      <AdminTextbooksView initialTextbooks={textbooks ?? []} />
    </div>
  )
}

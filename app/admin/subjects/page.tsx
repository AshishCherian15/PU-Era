export const instant = false

import type { Metadata } from 'next'
import { createAdminClient } from '@/lib/supabase/admin'
import { BookOpen } from 'lucide-react'
import SubjectsManager from './SubjectsManager'

export const metadata: Metadata = {
  title: 'Subjects & Chapters | Admin PU Era',
  robots: { index: false },
}

export default async function AdminSubjectsPage() {
  const supabase = createAdminClient()

  const { data: subjects } = await supabase
    .from('subjects')
    .select(`
      id, slug, name, name_kn, class_level, stream, board, has_lab, active, sort_order,
      chapters (
        id, number, title, title_kn, slug, status
      )
    `)
    .order('class_level', { ascending: true })
    .order('sort_order', { ascending: true })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-emerald-400" />
          Subjects &amp; Chapters Management
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Configure Karnataka PUC and NCERT subjects, syllabi, and chapter outlines.
        </p>
      </div>

      <SubjectsManager initialSubjects={subjects ?? []} />
    </div>
  )
}

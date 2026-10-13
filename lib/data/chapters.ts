import { createClient } from '@/lib/supabase/server'
import { getSubjectByKey } from '@/lib/data/subjects'
import { isUuid } from '@/lib/subject-keys'
import type { Chapter } from '@/lib/types'

export async function getPublishedChapters(subjectKey: string) {
  const subject = await getSubjectByKey(subjectKey)
  if (!subject) return []

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('chapters')
    .select('*')
    .eq('subject_id', subject.id)
    .eq('status', 'active')
    .order('number', { ascending: true })

  if (error) {
    console.error('Error fetching chapters:', error)
    return []
  }

  return data as Chapter[]
}

export async function getChapterInSubject(subjectKey: string, chapterKey: string) {
  const subject = await getSubjectByKey(subjectKey)
  if (!subject) return null

  const supabase = await createClient()

  if (isUuid(chapterKey)) {
    const { data, error } = await supabase
      .from('chapters')
      .select('*')
      .eq('id', chapterKey)
      .eq('subject_id', subject.id)
      .eq('status', 'active')
      .maybeSingle()

    if (!error && data) return data as Chapter
  }

  const { data, error } = await supabase
    .from('chapters')
    .select('*')
    .eq('subject_id', subject.id)
    .eq('slug', chapterKey)
    .eq('status', 'active')
    .maybeSingle()

  if (error) {
    console.error('Error fetching chapter:', error)
    return null
  }

  return (data as Chapter | null) ?? null
}

export async function getChapterWithResources(subjectKey: string, chapterKey: string) {
  const chapter = await getChapterInSubject(subjectKey, chapterKey)
  if (!chapter) return null

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('chapters')
    .select(`
      *,
      subject:subjects(id, slug, name, name_kn, class_level, stream, board, has_lab),
      resources(
        id,
        slug,
        title,
        description,
        type,
        external_url,
        allow_view,
        allow_download,
        status,
        deleted_at,
        views,
        downloads
      )
    `)
    .eq('id', chapter.id)
    .eq('status', 'active')
    .single()

  if (error) {
    console.error('Error fetching chapter with resources:', error)
    return null
  }

  const row = data as typeof data & {
    resources?: Array<{ status: string; deleted_at?: string | null }>
  }

  if (row.resources) {
    row.resources = row.resources.filter(
      (r: { status: string; deleted_at?: string | null }) =>
        r.status === 'published' && !r.deleted_at
    )
  }

  return row
}

/** @deprecated Use getChapterInSubject */
export async function getChapterById(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('chapters')
    .select('*')
    .eq('id', id)
    .eq('status', 'active')
    .maybeSingle()

  if (error) {
    console.error('Error fetching chapter:', error)
    return null
  }

  return (data as Chapter | null) ?? null
}

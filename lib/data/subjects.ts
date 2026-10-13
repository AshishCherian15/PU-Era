import { createClient } from '@/lib/supabase/server'
import { isUuid, resolveSubjectSlug } from '@/lib/subject-keys'
import type { Subject } from '@/lib/types'

export async function getPublishedSubjects() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('subjects')
    .select('*')
    .eq('active', true)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching subjects:', error)
    return []
  }

  return data as Subject[]
}

export async function getSubjectsByClass(classLevel: string) {
  const supabase = await createClient()
  const normalized = classLevel.toLowerCase()

  const { data, error } = await supabase
    .from('subjects')
    .select('*')
    .eq('active', true)
    .eq('class_level', normalized)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching subjects by class:', error)
    return []
  }

  return data as Subject[]
}

/** Look up by URL key: taxonomy id, DB slug, or UUID. */
export async function getSubjectByKey(key: string): Promise<Subject | null> {
  const supabase = await createClient()
  const slug = resolveSubjectSlug(key)

  if (isUuid(key)) {
    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .eq('id', key)
      .eq('active', true)
      .maybeSingle()

    if (!error && data) return data as Subject
  }

  const { data, error } = await supabase
    .from('subjects')
    .select('*')
    .eq('slug', slug)
    .eq('active', true)
    .maybeSingle()

  if (error) {
    console.error('Error fetching subject:', error)
    return null
  }

  return (data as Subject | null) ?? null
}

/** @deprecated Use getSubjectByKey — accepts slug or UUID. */
export async function getSubjectById(id: string) {
  return getSubjectByKey(id)
}

export async function getSubjectWithChapters(key: string) {
  const subject = await getSubjectByKey(key)
  if (!subject) return null

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('chapters')
    .select('*')
    .eq('subject_id', subject.id)
    .eq('status', 'active')
    .order('number', { ascending: true })

  if (error) {
    console.error('Error fetching subject with chapters:', error)
    return { ...subject, chapters: [] }
  }

  return { ...subject, chapters: data ?? [] }
}

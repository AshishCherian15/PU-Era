import { createClient } from '@/lib/supabase/server'
import type { Resource } from '@/lib/types'

export async function getPublishedResources(chapterId?: string, subjectId?: string) {
  const supabase = await createClient()

  let query = supabase
    .from('resources')
    .select('*')
    .eq('status', 'published')
    .is('deleted_at', null)

  if (chapterId) {
    query = query.eq('chapter_id', chapterId)
  }

  if (subjectId) {
    query = query.eq('subject_id', subjectId)
  }

  const { data, error } = await query.order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching resources:', error)
    return []
  }

  return data as Resource[]
}

export async function getResourceById(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .eq('id', id)
    .eq('status', 'published')
    .is('deleted_at', null)
    .maybeSingle()

  if (error) {
    console.error('Error fetching resource:', error)
    return null
  }

  return (data as Resource | null) ?? null
}

export async function incrementResourceViewCount(id: string) {
  const supabase = await createClient()

  const { data: current } = await supabase
    .from('resources')
    .select('views')
    .eq('id', id)
    .single()

  const { error } = await supabase
    .from('resources')
    .update({ views: (current?.views || 0) + 1 })
    .eq('id', id)

  if (error) {
    console.error('Error incrementing view count:', error)
  }
}

export async function incrementResourceDownloadCount(id: string) {
  const supabase = await createClient()

  const { data: current } = await supabase
    .from('resources')
    .select('downloads')
    .eq('id', id)
    .single()

  const { error } = await supabase
    .from('resources')
    .update({ downloads: (current?.downloads || 0) + 1 })
    .eq('id', id)

  if (error) {
    console.error('Error incrementing download count:', error)
  }
}
